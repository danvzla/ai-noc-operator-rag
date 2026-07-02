# RB-DNS-004 — Recursive DNS Resolver Failure

## Domain
DNS, recursive resolver, SERVFAIL, anycast, DNSSEC, cache, policy update.

## Trigger pattern
Use this runbook when SERVFAIL spikes, anycast health failures, resolver pool errors, DNSSEC validation failures, or app timeouts cluster in the same region.

## Correlation guidance
- Correlate resolver errors, anycast health, customer app timeout, cache behavior, and recent policy updates.
- Validate whether a resolver pool or policy update caused regional impact.

## Classification guidance
Cache flush and traffic failover can be automated if rollback is clear. DNSSEC or partner-zone overrides require DNS engineering review.

## Governance rule
Withhold broad DNS policy changes without validation, rollback, and owner approval.

## Ticketing guidance
Assign DNS policy ambiguity to Cloud Ops or DNS Engineering and include zone, resolver pool, and validation evidence.

## Learning update
Add resolver policy update validation and cache flush sequence to standard DNS outage handling.
