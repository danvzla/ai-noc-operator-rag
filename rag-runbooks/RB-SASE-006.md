# RB-SASE-006 — SASE / SD-WAN Tunnel Storm

## Domain
SASE, SD-WAN, ZTNA, CASB, IPsec, policy sync, regional POP instability.

## Trigger pattern
Use this runbook when IPsec tunnel flaps, ZTNA connector packet loss, firewall policy sync lag, CASB latency, or regional SASE POP health alarms appear together.

## Correlation guidance
- Correlate tunnel flaps, ZTNA loss, CASB latency, and policy sync lag by branch cluster and POP region.
- Treat policy sync lag separately from transport tunnel instability.

## Classification guidance
Branch failover can be automated when limited to a known region and reversible. Forcing policy sync requires change-control review.

## Governance rule
Approve regional branch failover only when rollback exists. Review or block forced policy sync until change-control confirms intent.

## Ticketing guidance
Route unresolved tunnel or policy items to SASE Operations with affected branches and POP health evidence.

## Learning update
Add POP health threshold and policy-sync escalation triggers.
