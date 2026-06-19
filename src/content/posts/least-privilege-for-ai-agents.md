---
layout: post
title: Least privilege for AI agents
date: 2026-06-14
tags: [security, design, ai]
desc: Human judgement has been an uncredited access control, trimming over-granted access, and agents don't have it.
---

In November 2025, Anthropic reported that attackers had run most of a real
espionage campaign through its own model. Convinced it was a security firm
running an authorised test, Claude Code mapped networks, wrote exploits, and
tried to break into around thirty organisations, succeeding at a handful, and
did most of it on its own.[^anthropic] Looking past the novelty, it's a story
about cost. Serious offensive capability has gotten cheap, fast, and whatever
stood between it and real-world damage turned out to be far thinner than
assumed.

Most systems hand out _far_ more access than anyone uses,[^overprovision] and
people unintentionally end up as the last line of defence. Both these factors
have held up, in part, because abusing them is slow, skilled, and unreliable
work, which means security has run on the cost of attack as much as on any
control. Least privilege has assumed for decades that the human will
eventually be fooled, and what kept all that spare access from being abused
was how expensive fooling them was, and the thing doing that work was never
a control anyone intentionally designed.

AI's taking that expense away from both directions. On the attacker side,
commoditised models write the convincing lure and the working exploit for
pennies, and national cyber agencies expect this to raise both the volume and
impact of future attacks.[^ncsc] On the target side, agents are the perfect
mark. Prompt injection, a term
[Simon Willison coined in 2022](https://simonwillison.net/2022/Sep/12/prompt-injection/),
is just text an agent reads and interprets as a trusted instruction. It's
analogous to social engineering, except an AI agent brings none of the
resistance a person would; no colleague to ask, no second channel to check
the story, no fear of consequence, and no stake in getting things right.

The Anthropic case is where both forces meet. The attackers got their
capability cheap, then steered it with a convincing story, the same move
prompt injection makes, the only difference being direction. There, the operators
owned the model and aimed it outward; injection aims your own agent back at
you, the attacker supplying nothing but the text it reads.

Once both kinds of friction are gone, the only thing between a hostile input
and real harm is the access the actor is holding, and for an agent that access
is its whole blast radius. Narrowing the credential bounds how far an injected
agent can reach; it will still misuse whatever it holds, so the size of the
grant is what decides the size of the damage. A grant for "this host" is a much
heavier liability than one for "this host, as this login, for this task."

With a person, you could afford to be (more) loose, because their judgement was
doing work the access system didn't. They didn't use every login the roles they
held allowed, they hesitated at the strange request, they narrowed a broad
grant in practice without anyone writing it down. None of that ran on the
attacker's input. A phishing email doesn't get to rewrite the person reading
it, and fooling them was slow and uncertain even when it ultimately worked. The
judgement was an uncredited access control.

An agent has something that resembles judgement, the reasoning it runs before
it acts, but that reasoning runs on the very context an attacker steers.
Whoever can plant the instruction can plant the rationale for following it. The
narrowing can no longer come from the actor at all, and an agent narrows
nothing on its own. A 2025 paper, _Design Patterns for Securing LLM Agents
against Prompt Injections_, puts the requirement directly:

> Once an LLM agent has ingested untrusted input, it must be constrained so
> that it is impossible for that input to trigger any consequential
> actions.[^designpatterns]

This is an old problem with an old name: a prompt-injected agent is a _confused
deputy_, a program talked into misusing authority it legitimately holds.[^deputy]
The solution is just as old: you settle what the actor may do before it meets
untrusted input, and you put that decision where the input can't reach it.
For authority that means binding each permission to the specific thing it acts
on, so there's no broad grant laying around for a sentence to redirect.

---

Binding authority to the resource is the line I have spent several months
drawing at [Teleport](https://goteleport.com/), on
[resource-scoped constraints](/thoughts/scoping-access-requests-below-the-resource-level)
in access requests. The original goal was entirely human: when you ask for
elevated access, the request can name the exact principals you want per
resource, rather than inheriting every one the satisfying role grants. A
reviewer approves that specific set, it's frozen into the issued certificate
alongside the resource, and at connection time the access checks allow only
those principals even where the role would otherwise permit more. Cleaner least
privilege-wise, and a clearer audit trail, which, at the time, read as a UX
win.

Reflecting on it since ideation, agents have made it a necessity. These
constraints bind to the resource rather than to whoever holds the credential,
so the same mechanism allowing a person ask for less can cap an agent at the
task in front of it, with the decision fixed before the agent runs.

An obvious worry is that real agents need broad latitude, and you can't
always predict what a task will require. The answer's to ask late: an agent
that requests what the next step needs, when it needs it, carries a far smaller
standing ceiling than one provisioned once for the whole run. That trades a
permanent grant, or an overly broad role-only-based grant, for a per-step one,
although, doesn't make the grant decision any easier. Deciding what an actor
legitimately needs, quickly enough not to stall it yet tightly enough to not
wave it through, is its own hard problem; it's the over-provisioning problem
from earlier in new clothes, and not one I'll settle here. What the loop _does_
settle is narrower, and still worth something; it forces the decision to exist,
as a discrete event, somewhere the agent's prompt can't reach. Whoever makes
the call, and however well they make it, it's no longer the agent's to talk
itself into.

The "asking" is a win of its own, too. A request that has to name "these
principals, on these resources" turns over-permissioning from more opaque
standing access into a reviewable, deniable event, logged whether or not
anyone's watching. An agent reaching far past its task shows up more obviously
as a request you can catch, where same access requested solely via roles may
have gone unnoticed. The narrowing buys containment, the request buys
detection, and I expect the second to matter more as agents take on real
infrastructure work.

When attacks were more expensive, loose grants were a more reasonable bet.
The price of exploiting them did the work access systems didn't, and so did the
judgement of whoever held them. Least privilege has relied on human judgement
that is no longer always in the loop. The ceiling on what each actor can reach
has to be set before the work starts, because nothing downstream will set it
for you. To be clear, none of this stops a compromised agent from causing harm;
it decides how much. Least privilege doesn't defuse the agent, it sizes the
worst case, and with an actor that narrows nothing on its own, the size of that
worst case is the only number you actually get to set.

[^anthropic]: Anthropic, [Disrupting the first reported AI-orchestrated cyber espionage campaign](https://www.anthropic.com/news/disrupting-AI-espionage) (November 2025). The operators decomposed the attack into innocuous-looking subtasks and told the model it was a legitimate security firm doing defensive testing.

[^overprovision]: Microsoft's [2024 State of Multicloud Security Report](https://www.microsoft.com/en-us/security/blog/2024/05/29/6-insights-from-microsofts-2024-state-of-multicloud-risk-report-to-evolve-your-security-strategy/) found that under 2% of granted permissions are ever used, and that more than half of all identities hold access to nearly everything.

[^ncsc]: UK NCSC, [The near-term impact of AI on the cyber threat](https://www.ncsc.gov.uk/report/impact-of-ai-on-cyber-threat), which assesses that AI will "almost certainly" increase the volume and impact of attacks and that commoditisation will widen access to capability.

[^designpatterns]: Beurer-Kellner et al., [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/abs/2506.08837) (2025), a catalogue of agent designs built around a single rule, that an agent must not be able to take consequential actions on the strength of untrusted input. Simon Willison later [walked through this paper](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/) on his blog.

[^deputy]: The [confused deputy problem](https://cwe.mitre.org/data/definitions/441.html) was named by Norm Hardy in 1988. The standard remedy, capability-based security, ties each permission to the specific object it grants, so there is no ambient authority left to redirect.
