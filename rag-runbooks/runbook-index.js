/**
 * rag-runbooks/runbook-index.js — Lightweight RAG / Runbook Layer
 *
 * This file is intentionally separated from index.html so the demo has a
 * visible, inspectable knowledge layer. Each runbook also exists as a Markdown
 * source file in this same /rag-runbooks folder. The browser uses this index for
 * fast local retrieval in Demo Mode and Live API Mode.
 */
window.RUNBOOK_LIBRARY = [
  {
    id: 'RB-FIBER-002',
    file: 'rag-runbooks/RB-FIBER-002.md',
    domain: 'fiber transport optical dwdm backbone los latency customer vpn field dispatch',
    title: 'Optical Loss / Fiber Cut Correlation',
    guidance: 'Correlate optical LOS, BGP flap, latency and customer VPN alarms under one transport root cause.',
    classifierHint: 'Physical repair incidents should escalate even when correlation confidence is high.',
    governanceHint: 'Do not auto-close physical-layer repair; require field validation and dispatch ticket.',
    ticketingHint: 'Assign physical repair to Transport Field Ops with ETA, SLA and next-shift action.',
    learningHint: 'Add field dispatch trigger when optical LOS and BGP flap occur within five minutes.',
    tags: ['transport', 'fiber', 'DWDM', 'BGP', 'field-dispatch']
  },
  {
    id: 'RB-BGP-007',
    file: 'rag-runbooks/RB-BGP-007.md',
    domain: 'bgp route-map config drift prefix withdrawal rollout rollback vrf finance healthcare change',
    title: 'BGP Drift and Route-Map Rollback',
    guidance: 'If BGP flaps align with a recent rollout, prioritize rollback validation over device restart.',
    classifierHint: 'Treat regulated or customer VRF changes as escalation candidates.',
    governanceHint: 'Rollback requires change-control validation for finance or healthcare VRFs.',
    ticketingHint: 'Create change approval ticket if rollback affects regulated VRFs.',
    learningHint: 'Propose canary checks for route-map changes before broad rollout.',
    tags: ['BGP', 'config-drift', 'route-map', 'change-control']
  },
  {
    id: 'RB-DDOS-011',
    file: 'rag-runbooks/RB-DDOS-011.md',
    domain: 'ddos edge traffic spike scrubbing firewall api gateway cdn botnet partner asn soc',
    title: 'DDoS Edge Mitigation',
    guidance: 'Correlate ingress spikes, API rate limits, firewall exhaustion and CDN origin saturation.',
    classifierHint: 'Auto-mitigation is acceptable for bounded scrubbing and rate-limit actions.',
    governanceHint: 'Block partner ASN filtering until SOC validates business impact.',
    ticketingHint: 'Assign unresolved attack vectors to Security Operations.',
    learningHint: 'Update DDoS signatures and partner allowlist validation steps.',
    tags: ['DDoS', 'security-ops', 'scrubbing', 'edge']
  },
  {
    id: 'RB-DNS-004',
    file: 'rag-runbooks/RB-DNS-004.md',
    domain: 'dns recursive resolver anycast servfail dnssec cache policy outage cloud ops',
    title: 'Recursive DNS Resolver Failure',
    guidance: 'SERVFAIL spikes plus anycast failures indicate resolver pool or policy update issues.',
    classifierHint: 'DNSSEC or partner-zone overrides require DNS engineering review.',
    governanceHint: 'Withhold broad DNS policy changes without validation and rollback.',
    ticketingHint: 'Assign DNS policy ambiguity to Cloud Ops or DNS Engineering.',
    learningHint: 'Add validation for resolver policy updates and cache flush sequence.',
    tags: ['DNS', 'resolver', 'anycast', 'DNSSEC']
  },
  {
    id: 'RB-RAN-PTP-003',
    file: 'rag-runbooks/RB-RAN-PTP-003.md',
    domain: 'ran 5g fronthaul ptp timing grandmaster du gnb jitter emergency coverage antenna',
    title: '5G RAN PTP Timing Drift',
    guidance: 'PTP sync loss, fronthaul jitter, and throughput degradation indicate timing instability.',
    classifierHint: 'Emergency-services coverage and physical antenna faults require human escalation.',
    governanceHint: 'Timing source switch can proceed only with bounded blast radius and rollback.',
    ticketingHint: 'Assign physical timing validation to RAN Engineering or Transport NOC.',
    learningHint: 'Add rule correlating PTP sync loss and packet delay variation by DU cluster.',
    tags: ['5G', 'RAN', 'PTP', 'fronthaul', 'timing']
  },
  {
    id: 'RB-SASE-006',
    file: 'rag-runbooks/RB-SASE-006.md',
    domain: 'sase sd-wan tunnel storm ztna casb policy sync pop branch failover regional',
    title: 'SASE / SD-WAN Tunnel Storm',
    guidance: 'Tunnel flaps, ZTNA loss, policy sync lag and CASB latency usually indicate POP instability.',
    classifierHint: 'Policy sync forcing should require change-control review.',
    governanceHint: 'Branch failover can be approved if blast radius is regional and rollback exists.',
    ticketingHint: 'Route unresolved tunnel or policy items to SASE Operations.',
    learningHint: 'Add POP health threshold and policy-sync escalation trigger.',
    tags: ['SASE', 'SD-WAN', 'ZTNA', 'CASB']
  },
  {
    id: 'RB-ITSM-001',
    file: 'rag-runbooks/RB-ITSM-001.md',
    domain: 'servicenow remedy ticket handoff shift turnover sla owner next action itsm incident',
    title: 'ITSM Ticketing and Shift Handoff Standard',
    guidance: 'All unresolved, reviewed, blocked or physical-dispatch items require an ITSM record with owner, SLA and next action.',
    classifierHint: 'Classifiers should not suppress incidents that require accountable ownership.',
    governanceHint: 'Human review items must be ticketed before shift handoff.',
    ticketingHint: 'Tickets must include source incident, priority, assignment group, SLA and next-shift action.',
    learningHint: 'Post-incident learner should propose handoff template improvements when context is missing.',
    tags: ['ITSM', 'ServiceNow', 'Remedy', 'handoff', 'SLA']
  }
];

/**
 * Lightweight retrieval: scores each runbook by keyword overlap against the
 * selected scenario. This is a transparent portfolio-friendly RAG simulation:
 * no external vector DB, but the pipeline behaves like a retrieval-augmented
 * workflow and cites the selected runbooks in the agent context and UI.
 */
function retrieveRunbooks(scenario) {
  const text = [
    scenario.key,
    scenario.name,
    scenario.rootCause,
    (scenario.groups || []).join(' '),
    scenario.impact?.service,
    scenario.impact?.owner,
    scenario.impact?.region
  ].join(' ').toLowerCase();

  const scored = window.RUNBOOK_LIBRARY.map(rb => {
    const terms = rb.domain.split(/\s+/).filter(Boolean);
    const tagTerms = (rb.tags || []).join(' ').toLowerCase().split(/\s+/).filter(Boolean);
    const score = [...terms, ...tagTerms].reduce((n, t) => n + (text.includes(t) ? 1 : 0), 0)
      + (rb.id === 'RB-ITSM-001' ? 0.5 : 0);
    return { rb, score };
  })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.rb);

  return scored.length ? scored : [window.RUNBOOK_LIBRARY[0], window.RUNBOOK_LIBRARY[6]];
}

function runbookCitationHTML(runbooks) {
  return (runbooks || []).map(r =>
    '<a class="runbook-chip" href="' + r.file + '" target="_blank" title="Open runbook source"><b>' +
    r.id + '</b> ' + r.title + '</a>'
  ).join('');
}
