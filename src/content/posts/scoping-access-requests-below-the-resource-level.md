---
layout: post
title: Scoping access requests below the resource level
date: 2026-05-02
tags: [security, design]
desc: Closing the gap of resource-based access requests by pushing scope down past the resource gate, into the principal layer.
---

Most "least-privilege" access-request systems run two gates in series.
- The resource gate: after the request is approved, your cert lists the resources you can reach, and the runtime denies anything else.
- The principal gate: the cert also carries a flat list of allowed principals (SSH logins, AWS Role ARNs, database users, IC permission sets, whatever the resource type uses), built from the union of every role the cert ended up with.

The two gates compose cleanly when the principals you need exactly match the principals the role grants on the resources you asked for. They start to fall apart the moment the role grants more principals on a resource than you actually wanted, which in practice is most of the time.

A quick terminology note: I'll use "principal" throughout as an umbrella for the resource-scoped identity a user adopts when connecting to a target (an SSH login, an AWS role ARN, an IC permission set, a database user). This is looser than the strict IAM sense of "the entity making the request"[^principal-note], as no clean industry-standard term covers all four cases.

## The scoped request that isn't really scoped

You request access to one EC2 host. The host is satisfiable by a role that grants three SSH logins on hosts of that label, including the one you wanted. The request gets approved, the cert is issued, the resource gate restricts you to that one host. So far so good.

Inside the host, all three logins are available to you, because the principal gate on the cert is global to the identity. It doesn't know which host you're connecting to, and the role-derived principal list it inherited at approval names every login the role permitted. You wanted `deploy`, but the cert lets you in as `deploy`, `admin`, or `root`, and the only thing between you and `root` is your own discipline. Arguably, this is bad design on the role side in this example, with the role being too broad in the first place, though making each role narrow enough to match every legitimate access pattern multiplies role definitions faster than anyone wants to maintain.

The same pattern repeats across any resource type where principals are applicable; the resource gate works, but the principal gate is too coarse to.

## Constraints on the request, not on the role

The fix is to pair each requested resource with the specific principals the requester wants on it, carry that pairing through to the cert, and have the runtime consult it per-resource at the principal gate instead of evaluating against a flat identity-wide list.

That's most of the change. The resource gate behaves exactly as before. The principal gate at runtime reads the per-resource principals attached to whichever resource the user is currently accessing, and rejects principals that weren't asked for on that specific resource. Roles don't need to be redefined, and the cert can keep recording the resolved roles for audit.

## Why constraints belong in the request, not in role assumption

AWS solves a version of this at assumption time via [session policies](https://aws.amazon.com/blogs/security/create-fine-grained-session-permissions-using-iam-managed-policies/). When you call [`AssumeRole`](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html), you can pass a JSON policy document, and the resulting session is the intersection of that document and the role's identity policy. This works because the assumer is the one calling `AssumeRole` and gets to author the session policy in that moment.

A brokered access-request system breaks that assumption. The request goes through review and approval before any session exists, the cert is issued after approval, and the connection happens later through a proxy or agent that has no opportunity to ask the user "what session policy do you want." The narrowing has to be settled before the cert gets minted, which puts it in the request rather than in an assumption-time argument.

The placement also strengthens the audit story. The request record contains the principals the requester selected for, the reviewer approves those exact principals on the requested resources, and the cert records the narrowing as a first-class field, so the question "what did this user actually have access to" answers cleanly from the cert with no ambiguity about whether the user might have passed a different session policy at the moment of use.

### Resource Constraints in Teleport

I've been working on this pattern at Teleport recently, where it ships as a feature called [Resource Constraints](https://goteleport.com/docs/identity-governance/access-requests/resource-requests/#resource-constraints)[^rfd]. Teleport's existing [access-request flow](https://goteleport.com/docs/identity-governance/access-requests/) already follows the same two-gate model, with the resource list living on the cert as `AllowedResourceAccessIDs` and the principal union built from role fields like `aws_role_arns`, `logins`, `db_users`, and `aws_account_assignments`.

Resource Constraints extends each request entry to `(resource_id, constraints)`, where the constraints name the specific ARNs, logins, permission sets, or DB users wanted on that resource. Role resolution learns to consider constraints when picking a minimal role set, so the validator rejects roles that don't actually cover the requested principals. The cert carries the constrained pairs in `AllowedResourceAccessIDs` alongside any unconstrained entries in the legacy `AllowedResourceIDs`.

At enforcement, the access checker walks `AllowedResourceAccessIDs` to find a match for the target resource (the resource gate), then reads the constraints off the matched entry and wraps each principal-bearing role matcher in a guard that fails fast on any principal not in the constraint set. If either the role or the constraint set disagrees, the principal is rejected on that resource, even when every other matching role on the cert would have allowed it.

An SSH access request for one host with `logins: [deploy]` ends up landing a cert that gets the user into the host as `deploy`, even when the resolved role would otherwise have granted five other logins on hosts of that label.

## Where this is going

The industry term for this kind of shift is [JEA, just-enough-access](https://learn.microsoft.com/en-us/powershell/scripting/learn/remoting/jea/overview), distinct from JIT (just-in-time) which controls *when* access is granted rather than *how much*. Resource-scoping at request time is a partial JEA story, since it narrows reachable resources without narrowing the principals available on those resources once you're there. Per-principal constraints round out the JEA story by making the *how much* gate live at the same granularity as the *what* gate.

Most of the JIT and brokered-access platforms I've looked at sit in the same partial-JEA position Teleport sat in before this work. [ConductorOne](https://www.conductorone.com/solutions/jit-access/), [Opal](https://www.opal.dev/glossary/just-in-time-access), Sym, and most cloud PAM platforms surface controls at the role level, with their granularity story focused on time and approval flow, and the principals transitively granted by the role staying outside the requestable surface. AWS STS session policies are the closest cloud analog, but only work when the user is the one calling `AssumeRole`. I haven't seen this same request-time-narrowing pattern shipped elsewhere.

The application I'm most curious about is agentic access. AI agents in production are increasingly getting their own identities and approval flows[^agent-identity], which is the right move structurally, but the over-permissioning failure shows up much harder in agent traffic than in human traffic. A human with three logins on a host (usually) has discipline to fall back on, an agent has whatever its prompt context happens to suggest at the moment of action, and the cert grants the same set in both cases. Per-principal scoping changes "the agent can SSH to this host" into "the agent can SSH to this host as `deploy`," which is the granularity at which agent access starts to be reviewable. The reviewer needs the requested action set to be concrete to answer "is this acceptable," and "the role on this host" usually isn't.

Beyond agents, the same `(resource_id, constraints)` shape extends naturally. Multi-tenant deployments can treat the tenant identifier as a per-resource constraint, time-bounded principal scopes can combine the JIT and JEA stories in one request, and audit-driven workflows can mine prior session logs for which principals were actually used on a resource and feed those back as suggested defaults, lowering the cost of asking for the right thing rather than the safest thing.

[^principal-note]: AWS' [IAM Principal documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html) defines a principal as "an entity in AWS that can perform actions and access resources," i.e., the requester rather than the thing being requested.

[^rfd]: The original design proposal is public as [RFD 0228](https://github.com/gravitational/teleport/blob/master/rfd/0228-resource-scoped-constraints-in-access-requests.md) on the Teleport repo.

[^agent-identity]: For more on this direction see OWASP's [AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) and AWS' Well-Architected [GenAI Lens guidance on least-privilege agentic workflows](https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/gensec05-bp01.html).
