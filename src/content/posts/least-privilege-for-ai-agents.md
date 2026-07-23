---
layout: post
title: Least privilege for AI agents
date: 2026-06-14
tags: [security, ai-agents, access-control]
desc:
  Human judgement has been an uncredited access control. Agents don't have it.
---

When Microsoft
[audited identities](https://www.microsoft.com/en-us/security/blog/2024/05/29/6-insights-from-microsofts-2024-state-of-multicloud-risk-report-to-evolve-your-security-strategy/)
across its customers' cloud environments, under 2% of granted permissions had
ever been exercised, and more than half of all identities could reach nearly
everything. Everything past that 2% exists mostly as risk, abusable in two ways:
steal the credential, or manipulate the person holding it.

The last decade of identity work has focused on the first; MFA, hardware keys,
short-lived certificates, and just-in-time access all aim at hardening the
credential itself. The second way gets less attention, in part because it
usually collapses into the first. The
[2023 MGM breach](https://specopssoft.com/blog/mgm-resorts-service-desk-hack/)
began as a help-desk call whose goal was an MFA reset; once Scattered Spider
held working credentials, the deception was over. Attackers convert a deceived
person into a stolen credential at the first opportunity because people make
poor instruments. When a person reads an attacker's message, the words arrive as
something they're _looking at_; to become something they _do_, the message must
persuade judgement that runs on state the attacker can't see or edit, and
provenance ("someone sent me this") stays attached. People can be phished at
scale, but they can't be recruited at scale into working through everything
their access allows. Human judgement has been an uncredited access control.

Agents sit right where people did, holding credentials and taking open-ended
direction in natural language,[^macros] but without analogous judgement to fall
back on. There's no separate thread for reasoning. A model continues one
document. The system prompt, the operator's task, tool outputs, and whatever an
attacker managed to slip into a web page or a README all land in the same
context window, and the context window is where the reasoning happens, making
attacker text part of the judgement rather than petitioning it from outside.

Human separation is leaky too; the difference being the asymmetric outcomes of
successful deception. Deceiving a person buys limited actions (each one a fresh
chance for an attacker's pretext to fall apart), whilst deceiving an agent buys
the agent: a machine's thoroughness, valid credentials, sessions that look like
normal work. Capability gains merely raise what a compromised model is worth. In
November 2025, Anthropic
[reported](https://www.anthropic.com/news/disrupting-AI-espionage) attackers
using its model to run most of a real espionage campaign. Told it was performing
authorised testing for a security firm, Claude mapped networks, wrote working
exploits, and reached roughly thirty organisations largely on its
own.[^anthropic]

A common rebuttal is that this is temporary; that better models will stop being
fooled, and sceptical validator steps will catch what slips through. I don't buy
that, for architectural reasons. Everything a model reads arrives in one
channel, and the markings separating instructions from data are learned
behaviour rather than inherent structure. Simon Willison
[coined the term _prompt injection_](https://simonwillison.net/2022/Sep/12/prompt-injection/)
back in 2022, naming it after SQL injection due to a shared root flaw. SQL
injection, though, had a complete fix: parameterised statements hand the
database the query and the untrusted data separately. There's nothing equivalent
to hand a model.

Every defence built inside one's context is a tendency, with an error rate. In
October 2025, researchers from OpenAI, Anthropic, and Google DeepMind measured
that error rate. They ran adaptive attacks against twelve published defences
([_The Attacker Moves Second_](https://arxiv.org/abs/2510.09023)) and bypassed
most of them more than nine times out of ten, including many that had reported
near-zero attack success. Against an adversary who chooses how many attempts to
make, a control that fails one time in a thousand isn't functioning as a
control.
[Schneier is more blunt](https://www.schneier.com/blog/archives/2025/08/we-are-still-unable-to-secure-llms-from-malicious-inputs.html)
with his read:

> We have zero agentic AI systems that are secure against these attacks. ...
> It’s an existential problem that, near as I can tell, most people developing
> [them] are just pretending isn’t there.

He's right, and what's interesting is that none of this is a new class of
failure. A program talked into misusing authority it legitimately holds is a
_confused deputy_, a problem
[Norm Hardy described](http://cap-lore.com/CapTheory/ConfusedDeputy.html)
in 1988. Hardy's deputy was a Fortran compiler on Tymshare's commercial
timesharing service, marked with a licence to write into its home directory so
it could keep a statistics file there. The billing records happened to live in
the same directory. Users could hand the compiler a path for its optional debug
output, and someone handed it the path of the billing file. The compiler wrote
where it was told, as its licence allowed, and the billing records were gone.
The user's request only had to name the file; the authority was already the
compiler's.

The remedy that grew from it, capability-based security, ties each permission to
the specific object it covers, ensuring no authority exists beyond what the task
at hand requires. Looking through that lens, prompt injection is a failure of
authority, not reasoning, and more reasoning inside the same trust boundary will
never be a complete solution. In their 2025 paper _Design Patterns for Securing
LLM Agents against Prompt Injections_, Beurer-Kellner and colleagues frame this
as a core design constraint:

> Once an LLM agent has ingested untrusted input, it must be constrained so that
> it is impossible for that input to trigger any consequential
> actions.[^designpatterns]

The paper's plan-then-execute pattern fixes a plan ahead of execution from the
trusted request alone, allowing injections during execution to corrupt data but
not to influence what the program does next. Google DeepMind's
[CaMeL](https://arxiv.org/abs/2503.18813) is a close parallel here. It builds
the same pattern into an interpreter, deriving its structure from the trusted
query, then enforcing capability policies on everything that passes through it.

---

The equivalent for digital infrastructure is binding each permission to the
resource it acts on, and it's what I've spent the past few months on at
[Teleport](https://goteleport.com/), as
[resource-scoped constraints](/thoughts/scoping-access-requests-below-the-resource-level)
in access requests.[^views] Access requests already eliminate standing privilege
with per-task grants, time-bounded approval windows, and short-lived
certificates. While they can already name specific resources, the resulting
grant is still everything the approved roles allow there. Constraints add the
missing dimension of _what_, per-resource. Each one pairs a resource in the
request with the permissions wanted on it (e.g., SSH logins, database users,
Kube groups, AWS roles). On approval, those pairs are encoded into the
certificate the requester assumes.

An agent that requested one host with `logins: [deploy]` gets a certificate that
opens that host only as `deploy`, no matter what else the underlying roles
satisfying the request would have allowed. There's no step between filing and
connection where the grant can widen.

Least privilege was always expressible with roles alone, but only by authoring
and maintaining hyper-specific ones per-task, which, in practice, isn't
sustainable. Constraints bound to resources move that work from role authors to
request authors. The requester describes exactly what the task needs and the
reviewer rules on that, with the only requirement being that a role at least as
broad as the task exists. This makes per-task provisioning workable; agents can
ask late and request only what the next step needs. The request is still an
untrusted proposal, though. The requester sits on the untrusted side of the
boundary and may already be compromised.

Review is where trust enters; it's what fixes the plan outside the agent, before
execution.

The bigger win, to my eye (no pun intended), is visibility. Review-at-volume is
still an unsolved problem; a person judging every request eventually stops
reading. The industry's answer, standing auto-approval policy, is only as good
as the information available in the request it evaluates. A role-satisfied
request hides the actual grants inside role definitions, while a constrained
request carries all grants on its face. The reviewer sees precisely what they're
approving, the audit log can record precisely what was grantable, and policy can
match on specific constraints themselves rather than role names.

But isn't this just least privilege again? It is; least privilege dates to
[Saltzer and Schroeder in 1975](https://web.mit.edu/Saltzer/www/publications/protection/),
and the audit I opened this post with is what half a century of recommending it
produced. Their paper names the reason in another of its principles,
"psychological acceptability." People route around controls they find painful.
Asking is the painful part.

Every request is something to file and an approval to wait. People know the
principle, yet request broadly and hoard what they're granted. Organisations
settle on over-provisioning as the price of people not being interrupted. That
unused 98% of permissions can be seen as "insurance" against the cost (perceived
or real) of asking. Agents, though, don't need that. They can name the exact
resources and permissions needed for their next step with a far lower time cost
and none of the same pain in asking. What stays expensive is the other seat, the
reviewer, which is why the legibility of the request matters just as much, if
not more, than any property of the requester.

So, sorry if a partial answer here disappoints. As framed by Schneier, partial
is the only kind on offer as long as LLMs are operating on adversarial input. AI
agents are steerable by what they read. No grant design can change that. What
_can_ change is what they're holding when that happens, and how legible the
arrangement is. Several decades later, there's finally a requester that doesn't
mind asking. What's taking the place of people's judgement in that seat has to
be an explicit decision over agents' reach, one that's recorded, that's made
outside the agents, and that's enforced by software their context can't touch.

[^macros]:
    The closest ancestor is probably the macro virus, an Office document
    carrying instructions the application would happily execute. We fixed it by
    having Office
    [refuse to run untrusted macros by default](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked);
    nobody tried to make Word a better judge of intent.

[^anthropic]:
    Anthropic,
    [Disrupting the first reported AI-orchestrated cyber espionage campaign](https://www.anthropic.com/news/disrupting-AI-espionage)
    (November 2025). The operators decomposed the attack into innocuous-looking
    subtasks and told the model it was a legitimate security firm doing
    defensive testing.

[^designpatterns]:
    Beurer-Kellner et al.,
    [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/abs/2506.08837)
    (2025). Simon Willison later
    [walked through the paper](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
    on his blog.

[^views]:
    Resource-scoped constraints are new; at the time of writing, only an initial
    implementation has shipped. This section is my own thinking on their design
    and where it could go, not Teleport's plans or positions.
