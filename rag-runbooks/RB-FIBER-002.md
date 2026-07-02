# RB-FIBER-002 — Optical Loss / Fiber Cut Correlation

## Domain
Transport, optical, DWDM, backbone routing, customer VPN impact.

## Trigger pattern
Use this runbook when optical loss of signal, BGP flaps, latency spikes, and customer VPN alarms occur in the same timestamp window across an upstream/downstream topology path.

## Correlation guidance
- Group optical LOS, downstream routing instability, path saturation, and customer VPN flaps under one probable transport root cause.
- Treat device CPU or thermal alarms as secondary unless they share the same path and timestamp.
- Preserve the raw alarm count, suppressed count, and actionable incident count for shift handoff.

## Classification guidance
Physical repair incidents should escalate even when correlation confidence is high. Automated route changes may proceed only when bounded and reversible.

## Governance rule
Do not auto-close physical-layer repair. Require field validation, dispatch ownership, and an ITSM ticket with ETA and SLA.

## Ticketing guidance
Assign physical repair to Transport Field Ops. Include affected span, service impact, field ETA, SLA, and related child incidents.

## Learning update
Add a dispatch trigger when optical LOS and BGP flap occur within five minutes on the same transport span.
