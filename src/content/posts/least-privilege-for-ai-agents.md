---
layout: post
title: Least privilege for AI agents
date: 2026-06-14
tags: [security, design, ai]
desc:
  Human judgement has been an uncredited access control, and agents don't have
  it.
---

Nearly all access to digital infrastructure is held and unused. When Microsoft
[audited identities](https://www.microsoft.com/en-us/security/blog/2024/05/29/6-insights-from-microsofts-2024-state-of-multicloud-risk-report-to-evolve-your-security-strategy/)
across its customers' cloud environments, under 2% of granted permissions had
ever been exercised, and more than half of all identities could reach nearly
everything. Everything past that 2% exists mostly as risk, abusable in two ways:
steal the credential, or manipulate the person holding it. The last decade of
identity work went into the first. MFA, hardware keys, short-lived certificates,
and just-in-time access all aim at hardening the credential itself.

The second way gets less attention, in part because it usually collapses into
the first. The
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
direction in natural language,[^macros] but without analogous judgement. There
is no separate thread for reasoning. A model continues one document, and its
system prompt, the operator's task, tool outputs, and an attacker's input are
all pieces of it. The context window is where reasoning happens, making attacker
text part of the judgement rather than petitioning it from outside.

Human separation is leaky too; the difference is that successful deception has
asymmetric outcomes. Deceiving a person buys limited actions, while deceiving an
agent buys the agent: a machine's thoroughness, valid credentials, sessions that
look like normal work. In November 2025, Anthropic
[reported](https://www.anthropic.com/news/disrupting-AI-espionage) attackers
using its model to run most of a real espionage campaign; told it was doing
authorised testing for a security firm, it mapped networks, wrote exploits, and
reached roughly thirty organisations largely on its own.[^anthropic]

A common rebuttal is that this is temporary, that better models will stop being
fooled, that workflows with sceptical validator steps will alleviate the risk. I
don't buy that, for architectural reasons. Everything a model reads arrives in
one channel, and the markings separating instructions from data are learned
behaviour rather than inherent structure. Willison
[named prompt injection](https://simonwillison.net/2022/Sep/12/prompt-injection/)
after SQL injection because it's the same flaw, but SQL injection had a complete
fix; parameterised statements hand the database the query and the data
separately. There's nothing equivalent to hand a model. The separation is a
tendency, and a tendency has an error rate.
[Schneier is more blunt](https://www.schneier.com/blog/archives/2025/08/we-are-still-unable-to-secure-llms-from-malicious-inputs.html):

> We have zero agentic AI systems that are secure against these attacks...It’s
> an existential problem that, near as I can tell, most people developing [them]
> are just pretending isn’t there.

Every defence within models inherits that error rate, and this has been
measured. In October 2025, researchers from OpenAI, Anthropic, and Google
DeepMind tested twelve published defences against adaptive attackers and
bypassed most of them more than nine times out of ten, including many that had
reported near-zero attack success. Their title states the principle,
[_The Attacker Moves Second_](https://arxiv.org/abs/2510.09023). A control that
fails one time in a thousand, against an adversary who chooses how many attempts
to make, isn't functioning as a control. Capability gains only raise what a
compromised model is worth. Agents won't become secure just by getting smarter.

None of this is a new class of failure. A program talked into misusing authority
it legitimately holds is a _confused deputy_, a problem
[described by Norm Hardy](http://cap-lore.com/CapTheory/ConfusedDeputy.html) in
1988, and the remedy that grew out of it isn't new either. Capability-based
security ties each permission to the specific object it covers, so that no
authority exists beyond what the task requires. Prompt injection is a failure of
authority, rather than a failure of reasoning, which is why more reasoning
inside the same trust boundary was never going to be a solution. A 2025 paper,
_Design Patterns for Securing LLM Agents against Prompt Injections_, states the
modern version plainly:

> Once an LLM agent has ingested untrusted input, it must be constrained so that
> it is impossible for that input to trigger any consequential
> actions.[^designpatterns]

The paper's plan-then-execute pattern describes fixing a plan from the trusted
request alone, so an injection during execution can corrupt data but can't
change what the program does next. Google DeepMind's
[CaMeL](https://arxiv.org/abs/2503.18813) is a close parallel here. It builds
the same idea into an interpreter that derives its structure from the trusted
query, then enforces capability policies on everything flowing through it.

---

The infrastructure equivalent is binding each permission to the specific
resource it acts on, and it's one area I've spent the past few months on at
[Teleport](https://goteleport.com/), as
[resource-scoped constraints](/thoughts/scoping-access-requests-below-the-resource-level)
in access requests.[^views] Access requests already eliminate standing privilege
with per-task grants, bounded approval windows, and short-lived certificates,
and they can already name specific resources; but the grant is still everything
the approved roles allow there. Constraints add the missing dimension of _what_,
per-resource. Each constraint pairs a resource in the request with the specific
permissions (e.g., SSH logins, database users, Kube groups, AWS roles) wanted on
it, and on approval those pairs are encoded into the certificate the requester
assumes. That certificate is the enforcement artifact. Access checks read the
set the reviewer approved, and there is no step between filing and connection
where it can change.

The first win is who authors the specificity. Least privilege was always
expressible with roles alone, but only by authoring and maintaining
hyper-specific roles per-task, which in practice is not sustainable. Constraints
move that work from role authors to request authors. The requester describes
exactly what the task needs and the reviewer rules on exactly that, the only
requirement being that a role at least as broad as the task exists. This makes
per-task provisioning workable; agents can ask late and request only what the
next step needs. The request is still an untrusted proposal; no matter how the
asking is arranged, the requester sits on the untrusted side of the boundary and
may already be compromised. Review is where trust enters; it's what fixes the
plan outside the agent, before execution.

The second win, and what I see (no pun intended) as the bigger one, is
visibility. Review at volume is the unsolved problem; a person judging every
request eventually stops reading, and the industry's answer is standing
auto-approval policy, which is only as good as the information in the request it
evaluates. A role-satisfied request hides the actual grant inside role
definitions; a constrained request carries the whole grant on its face. The
reviewer sees precisely what they're approving, the audit log records precisely
what was grantable, and policy can match on the constraints themselves rather
than role names.

---

The fair objection is that none of this is really new advice. Least privilege
dates to
[Saltzer and Schroeder in 1975](https://web.mit.edu/Saltzer/www/publications/protection/),
and the audit this post opened with is what half a century of recommending it
produced. Their paper names the reason in another of its principles,
"psychological acceptability"; people route around controls they find painful.
Asking is the painful part. Every request is a ticket to file and an approval to
wait on while work sits blocked, so people request broadly, hoard what they're
granted, and organisations settle on over-provisioning as the price of nobody
being interrupted. People know the principle; the unused 98% is insurance
against the cost of asking again.

That failure was a fact about the requester, and the requester is the part
that's changed. An agent doesn't need the insurance. It can name the exact
resources and permissions its next step requires, because it just finished
planning that step, and filing one more request takes milliseconds. What stays
expensive is the other seat, review, which is why the legibility of the request
matters more than any property of the requester.

---

So, sorry if a partial answer disappoints; as framed by Schneier, partial is the
only kind on offer as long as LLMs are operating on potentially adversarial
input. An agent stays steerable by what it reads and no grant design changes
that. What _can_ change is what the agent is holding when it happens, and how
legible the arrangement is. The loop underneath, request/review/assume, holds no
matter what fills each seat. Half a century on, there's finally a requester that
doesn't mind asking. What's taking the place of people's judgement in the
requester's seat has to be explicit: a decision over the agent's reach that is
recorded, made outside the agent, and enforced by software its context can't
reach.

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
