# RB-RAN-PTP-003 — 5G RAN PTP Timing Drift

## Domain
5G RAN, fronthaul, PTP, grandmaster, DU cluster, gNB, jitter, coverage risk.

## Trigger pattern
Use this runbook when PTP sync loss, fronthaul jitter, packet delay variation, RAN throughput degradation, and customer complaint clusters appear together.

## Correlation guidance
- Group timing, fronthaul, DU cluster, gNB, and transport symptoms by market and DU cluster.
- Treat throughput degradation as downstream evidence of timing instability.

## Classification guidance
Emergency-services coverage areas and physical antenna faults require human escalation.

## Governance rule
Timing source switch can proceed only when the blast radius is bounded and rollback to primary grandmaster is validated.

## Ticketing guidance
Assign physical timing validation to RAN Engineering or Transport NOC with affected sectors, DU cluster, and field diagnostic requirements.

## Learning update
Add a rule correlating PTP sync loss and packet delay variation by DU cluster.
