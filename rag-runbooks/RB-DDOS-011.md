# RB-DDOS-011 — DDoS Edge Mitigation

## Domain
DDoS, edge traffic, scrubbing, firewall exhaustion, API gateway, CDN, SOC validation.

## Trigger pattern
Use this runbook when ingress traffic spikes correlate with API rate-limit triggers, firewall connection exhaustion, CDN origin saturation, or suspicious ASN patterns.

## Correlation guidance
- Correlate bandwidth, firewall, API gateway, CDN, and external threat indicators into one DDoS candidate.
- Separate customer-origin overload from malicious ingress when evidence is ambiguous.

## Classification guidance
Bounded scrubbing and adaptive rate limiting can be auto-remediation candidates. Partner ASN filtering requires SOC validation.

## Governance rule
Block or review partner ASN filtering until SOC validates business impact and false-positive risk.

## Ticketing guidance
Assign unresolved attack vectors or partner-impact concerns to Security Operations with evidence and mitigation status.

## Learning update
Update DDoS signatures, partner allowlist validation, and escalation threshold for suspicious ASN clusters.
