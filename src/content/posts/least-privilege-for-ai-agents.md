---
layout: post
title: Least privilege for AI agents
date: 2026-06-14
tags: [security, design, ai]
desc:
  Human judgement has been an uncredited access control, trimming over-granted
  access, and agents don't have it.
---

Most systems hand out _far_ more access than anyone uses. Microsoft's multicloud
audit puts the share of granted permissions ever exercised at under 2%, with
more than half of all identities able to reach almost
everything.[^overprovision] What kept that unused surplus from being abused was
rarely the access-control layer. It was the person standing behind the
credential.

That person held the access in check in ways the system never recorded. They
left most of what their roles allowed untouched, they hesitated at the request
that didn't sit right, and the grant that was broad on paper stayed narrow in
their hands. None of that restraint lived in the system; it lived in the person,
which is the same reason an attacker had no good handle on it. A phishing email
doesn't get to rewrite the person reading it, and fooling them was slow and
uncertain even when it eventually worked. Their judgement was, in effect, an
uncredited access control.

AI undercuts that protection from two sides at once. The first is the cost of
mounting an attack. Commoditised models now write the convincing lure and the
working exploit for pennies, and national cyber agencies expect this to raise
both the volume and the impact of attacks.[^ncsc] In November 2025, Anthropic
reported attackers running most of a real espionage campaign through its own
model. Having been told it was a security firm running an authorised test, it
mapped networks, wrote exploits, and reached into roughly thirty organisations
largely on its own.[^anthropic] The second is the target. An agent has something
that resembles judgement, the reasoning it runs before it acts, but that
reasoning runs on the very context an attacker steers, so whoever plants the
instruction also plants the rationale for following it.

Prompt injection, the term
[Simon Willison coined in 2022](https://simonwillison.net/2022/Sep/12/prompt-injection/),
is no more than text an agent reads as a trusted instruction, social engineering
against something with no colleague to ask, no second channel to check the story,
and no stake in getting it right. Newer designs try to restore the missing check
with a second model, a verifier pass, or one agent reviewing another, but each of
these reads the same untrusted context and can be turned by the same input.

This is an old problem with an old name: a prompt-injected agent is a _confused
deputy_, a program talked into misusing authority it legitimately
holds.[^deputy] As a failure of authority rather than reasoning, adding more
reasoning inside the same trust boundary does not address it. The robust answer
is just as old, but a 2025 paper, _Design Patterns for Securing LLM Agents
against Prompt Injections_, states it simply in this context:

> Once an LLM agent has ingested untrusted input, it must be constrained so that
> it is impossible for that input to trigger any consequential
> actions.[^designpatterns]

You settle what the actor may do before it meets untrusted input, and you put
that decision where the input can't reach it. For authority, that means binding
each permission to the specific thing it acts on, so there's no broad grant
lying around for a sentence to redirect.

---

Binding authority to the resource is a line I've spent several months drawing at
[Teleport](https://goteleport.com/), on
[resource-scoped constraints](/thoughts/scoping-access-requests-below-the-resource-level)
in access requests. A request can name the exact principals the user wants on
each resource rather than inheriting every one the satisfying role grants, the
reviewer approves that specific set, it is frozen into the issued certificate,
and at connection time the access checks admit only those principals even where
the role would otherwise permit more. The goal at the outset was entirely human,
and read at the time as a refinement of the request flow. Agents make it a
requirement, since the constraint binds to the resource rather than to whoever
holds the credential, so the same mechanism that lets a person ask for less can
hold an agent to the task in front of it, with the decision fixed before the
agent runs.

An obvious worry is that real agents need broad latitude, and you can't always
predict what a task will require. I think the answer is to ask late. An agent
that requests what the next step needs, only once it needs it, carries far less
risk than one provisioned once for the whole run. Trading an overly broad
role-based grant for a narrower per-step one doesn't make the approval decision
any easier, though. Deciding what an actor legitimately needs, quickly enough
not to stall it, yet tightly enough not to just wave it through, is its own hard
problem; it's the over-provisioning problem from earlier in new clothes, and not
one I'll settle here. What the request-review-assume loop _does_ settle is
narrower, and still worth something. It forces the decision to exist, as a
discrete event, somewhere the agent's prompt can't reach. Whoever makes the
call, and however well they make it, it's no longer solely the agent's to talk
itself into.

Narrowing at the request step is a win of its own, too. A request that has to
name specific principals on specific resources turns over-permissioning from an
opaque event into a far more reviewable one, and improves the audit story. An
agent reaching far past its task shows up more obviously, where the same access
requested solely via roles might have gone unnoticed. The narrowing buys
containment, the detail the request surfaces buys detection, and I expect the
second to matter more as agents take on real infrastructure work.

Loose grants were a somewhat defensible bet while attacks were expensive to
mount and a person's judgement stood behind every credential. Neither condition
holds for an agent. Least privilege has been relying on judgement that is no
longer always in the loop, and the ceiling on what an actor can reach now has to
be set before the work starts, because nothing downstream will set it for you.

[^overprovision]:
    Microsoft's
    [2024 State of Multicloud Security Report](https://www.microsoft.com/en-us/security/blog/2024/05/29/6-insights-from-microsofts-2024-state-of-multicloud-risk-report-to-evolve-your-security-strategy/)
    found that under 2% of granted permissions are ever used, and that more than
    half of all identities hold access to nearly everything.

[^anthropic]:
    Anthropic,
    [Disrupting the first reported AI-orchestrated cyber espionage campaign](https://www.anthropic.com/news/disrupting-AI-espionage)
    (November 2025). The operators decomposed the attack into innocuous-looking
    subtasks and told the model it was a legitimate security firm doing
    defensive testing.

[^ncsc]:
    UK NCSC,
    [The near-term impact of AI on the cyber threat](https://www.ncsc.gov.uk/report/impact-of-ai-on-cyber-threat),
    which assesses that AI will "almost certainly" increase the volume and
    impact of attacks and that commoditisation will widen access to capability.

[^designpatterns]:
    Beurer-Kellner et al.,
    [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/abs/2506.08837)
    (2025), a catalogue of agent designs built around a single rule, that an
    agent must not be able to take consequential actions on the strength of
    untrusted input. Simon Willison later
    [walked through this paper](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
    on his blog.

[^deputy]:
    The
    [confused deputy problem](https://cwe.mitre.org/data/definitions/441.html)
    was named by Norm Hardy in 1988. The standard remedy, capability-based
    security, ties each permission to the specific object it grants, so there is
    no ambient authority left to redirect.
