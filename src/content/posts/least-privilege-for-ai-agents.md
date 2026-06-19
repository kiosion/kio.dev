---
layout: post
title: Least privilege for AI agents
date: 2026-06-14
tags: [security, design, ai]
desc:
  Human judgement has been an uncredited access control, trimming over-granted
  access, and agents don't have it.
---

In November 2025, Anthropic reported that attackers had run most of a real
espionage campaign through its own model. Convinced it was a security firm
running an authorised test, Claude Code mapped networks, wrote exploits, and
tried to break into around thirty orgs, succeeding at a handful, and did most of
it on its own.[^anthropic] Looking past the novelty, it's a story about cost.
Serious offensive capability has gotten cheap, fast, and whatever stood between
it and real-world damage turned out to be far thinner than assumed.

Most systems hand out _far_ more access than anyone uses,[^overprovision] and
people unintentionally end up as the last line of defence. Both these factors
have held up, in part, because abusing them is slow, skilled, and unreliable
work, which means security has run on the cost of attack as much as on any
control. Least privilege has assumed for decades that the human will eventually
be fooled, and what kept all that spare access from being abused was how
expensive fooling them was.

AI's taking that expense away from both directions. On the attacker side,
commoditised models write convincing lure and working exploits for pennies;
national cyber agencies expect this to raise both the volume and the impact of
future attacks.[^ncsc] On the target side, agents are the perfect mark. Prompt
injection, a term
[Simon Willison coined in 2022](https://simonwillison.net/2022/Sep/12/prompt-injection/),
is just text an agent reads and interprets as a trusted instruction. It's
analogous to social engineering, except an AI agent brings none of the
resistance a person would; no colleague to ask, no second channel to check the
story, no fear of consequence, and no stake in getting things right.

In the Anthropic case, the attackers got their capability cheap, then steered it
with a convincing story, the same move prompt injection makes with the only
difference being direction. There, the operators owned the model and aimed it
outward; injection aims your own agent back at you, the attacker supplying
nothing but the text it reads.

Once both kinds of friction are gone, the access an agent holds is also its
whole blast radius. Narrowing the credential bounds how far an injected agent
can reach. It'll still misuse whatever it does hold, but the size of the grant
is what decides the size of the damage. A grant for "this host" is a much
heavier liability than one for "this host, as this login, for this task." With a
person, you could afford to be (more) loose, because their judgement was doing
work the access system didn't. They didn't use every login the roles they held
allowed, they hesitated at strange requests, they narrowed a broad grant in
practice without anyone writing it down. None of that ran on the attacker's
input. A phishing email doesn't get to rewrite the person reading it, and
fooling them was slow and uncertain even when it ultimately worked. Their
judgement was an uncredited access control.

An agent has something that resembles judgement, the reasoning it runs before it
acts, but that runs on the very context an attacker steers. Whoever can plant
the instruction can plant rationale for following it. The narrowing can no
longer come from the actor at all, and an agent narrows nothing on its own. In
the 2025 paper _Design Patterns for Securing LLM Agents against Prompt
Injections_, its authors put the requirement directly:

> Once an LLM agent has ingested untrusted input, it must be constrained so that
> it is impossible for that input to trigger any consequential
> actions.[^designpatterns]

This is an old problem with an old name: a prompt-injected agent is a _confused
deputy_, a program talked into misusing authority it legitimately
holds.[^deputy] The solution is just as old: you settle what the actor may do
before it meets untrusted input, and you put that decision where the input can't
reach it. For authority that means binding each permission to the specific thing
it acts on, so there's no broad grant laying around for a sentence to redirect.

---

Binding authority to the resource is a line I've spent several months drawing at
[Teleport](https://goteleport.com/), on
[resource-scoped constraints](/thoughts/scoping-access-requests-below-the-resource-level)
in access requests. The original goal was very human: when requesting elevated
access, the request can name specific principals wanted per resource, rather
than inheriting all principals the satisfying role grants. A reviewer approves
that specific set, it's frozen into the issued certificate alongside its
resource, and at connection time the access checks allow only those principals
even where the role would otherwise permit more. Cleaner least privilege-wise,
and a clearer audit trail, which, at the time, read as simply a UX win.

Reflecting more since its ideation, agents have made this a necessity. These
constraints bind to the resource rather than to whoever holds the credential, so
the same mechanism allowing a person ask for less can cap an agent at the task
in front of it, with the decision fixed before the agent runs.

An obvious worry is that real agents need broad latitude, and you can't always
predict what a task will require. I think the answer's to ask late: an agent
that requests what the next step needs, only once it needs it, carries far less
risk than one provisioned once for the whole run. Trading an overly broad
role-based grant for a narrower per-step one doesn't make the approval decision
any easier, though. Deciding what an actor legitimately needs, quickly enough to
not stall it, yet tightly enough to not just wave it through, is its own hard
problem; it's the over-provisioning problem from earlier in new clothes, and not
one I'll settle here. What the request-review-assume loop with constrained
resources and constrained principals per-resource _does_ settle is narrower, and
still worth something. It forces the decision to exist, as a discrete event,
somewhere the agent's prompt can't reach. Whoever makes the call, and however
well they make it, it's no longer the agent's to talk itself into.

Narrowing at the "requesting" step is a win of its own, too. A request that has
to name "these principals, on these resources" turns over-permissioning from a
rather opaque event into a far more reviewable one, and improves the audit story
as well. An agent reaching far past its task shows up more obviously, where
otherwise the same access requested solely via roles may have gone unnoticed.
The narrowing buys containment, the extra info surfaced in the request buys
detection, and I expect the second to matter more as agents take on real
infrastructure work.

When attacks were more expensive, looser grants were a reasonable bet. The price
of exploiting them did work access systems didn't; least privilege has relied on
human judgement that is no longer always in the loop. The ceiling on what each
actor can reach has to be set before the work starts, because nothing downstream
will set it for you. To be clear, none of this stops a compromised agent from
causing harm; it decides how much. Least privilege doesn't defuse the agent, it
sizes the worst case, and with an actor that narrows nothing on its own, the
size of that worst case is the only number you actually get to set.

[^anthropic]:
    Anthropic,
    [Disrupting the first reported AI-orchestrated cyber espionage campaign](https://www.anthropic.com/news/disrupting-AI-espionage)
    (November 2025). The operators decomposed the attack into innocuous-looking
    subtasks and told the model it was a legitimate security firm doing
    defensive testing.

[^overprovision]:
    Microsoft's
    [2024 State of Multicloud Security Report](https://www.microsoft.com/en-us/security/blog/2024/05/29/6-insights-from-microsofts-2024-state-of-multicloud-risk-report-to-evolve-your-security-strategy/)
    found that under 2% of granted permissions are ever used, and that more than
    half of all identities hold access to nearly everything.

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
