# RB-BGP-007 — BGP Drift and Route-Map Rollback

## Domain
BGP, route-map change, prefix withdrawal, customer VRF, regulated traffic, rollback.

## Trigger pattern
Use this runbook when BGP flaps, prefix withdrawals, route-map updates, or configuration drift appear after a recent rollout.

## Correlation guidance
- Correlate route flaps and prefix withdrawals by rollout ID, affected VRF, and region.
- Validate whether symptoms started immediately after change deployment.
- Prioritize rollback validation over device restart.

## Classification guidance
Treat finance, healthcare, or regulated customer VRF changes as escalation candidates even when confidence is high.

## Governance rule
Rollback requires change-control validation for regulated VRFs. Do not automate broad routing rollback without owner approval and rollback plan.

## Ticketing guidance
Create a change approval or incident ticket when rollback affects regulated VRFs or multiple enterprise sites.

## Learning update
Propose canary validation for route-map changes before broad rollout.
