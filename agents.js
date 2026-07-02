/**
 * agents.js — AI NOC Operator
 * All 4 agent definitions + the agent registry, in one file.
 *
 * Load this BEFORE the main script block in index.html:
 *   <script src="agents.js"></script>
 *   <script src="app.js"></script>   (or inline <script>...</script>)
 *
 * Each agent follows the same interface: { id, name, mission, tokens,
 * buildPrompt(), run() }. To add another agent, copy this pattern and add
 * it to the AGENT_REGISTRY array at the bottom of this file — no other
 * file needs to change.
 *
 * Depends on: window.ApiClient (defined in index.html / app logic),
 * called only inside each agent's run() method — not at load time —
 * so load order between this file and the ApiClient definition does
 * not matter as long as both exist before runOrchestrator() is invoked.
 */

/* ── assets/agents/agent-01-correlator.js ── */
/**
 * assets/agents/agent-01-correlator.js
 * Agent 1 — Alarm Correlator
 *
 * Mission: given a flood of raw, noisy alarms, identify the single most likely
 * root cause and group the alarms into a small number of actionable incidents.
 *
 * In Live Mode, this agent makes a real API call. The "raw alarms" themselves
 * are never actually sent — only the scenario name and count — because this is
 * a portfolio demo, not a tool connected to live infrastructure. The LLM is
 * asked to reason about what a realistic correlation would look like.
 */

window.Agent01Correlator = {
  id: 'correlator',
  name: 'Alarm Correlator',
  mission: 'Groups raw alarm noise into a single root cause and actionable incidents',
  tokens: 800,

  buildPrompt(scenario) {
    return `You are a NOC Alarm Correlation Engine. Given a root cause scenario, produce a realistic correlation summary.

SCENARIO: ${scenario.name}
RAW ALARM COUNT: ${scenario.rawAlarmCount}
RETRIEVED RUNBOOKS: ${(scenario.runbooks || []).map(r => r.id + ' — ' + r.title + ': ' + r.guidance).join(' | ')}

Return ONLY raw JSON, no markdown:
{
  "rootCause": "one sentence specific root cause with technology names",
  "groups": ["group description 1", "group description 2", "group description 3", "group description 4"],
  "actionableCount": <integer, realistic number of correlated incidents from the raw count>
}`;
  },

  /** Live Mode entry point — makes a real API call via ApiClient. */
  async run(apiKey, scenario) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(scenario), this.tokens);
    if (!raw) throw new Error('Agent 1 (Correlator) returned an empty response');
    return window.ApiClient.parseJSON(raw);
  },
};


/* ── assets/agents/agent-02-classifier.js ── */
/**
 * assets/agents/agent-02-classifier.js
 * Agent 2 — Incident Classifier
 *
 * Mission: given the correlated incidents from Agent 1, assign each one a
 * confidence score and a recommended action — auto-remediate, or escalate to
 * a human. This is the credibility-critical agent: it must demonstrably know
 * when NOT to act, not just confidently fix everything.
 *
 * Receives Agent 1's output directly (prior[correlator]) — this is the
 * context-chaining pattern shared with the AI Architecture Advisor tool.
 */

window.Agent02Classifier = {
  id: 'classifier',
  name: 'Incident Classifier',
  mission: 'Scores each incident by confidence and recommends auto-remediate vs. escalate',
  tokens: 1200,

  buildPrompt(scenario, prior) {
    return `You are a NOC Incident Classifier. Given correlated incident groups, classify each with severity, confidence, and recommended action.

ROOT CAUSE: ${prior.correlator.rootCause}
GROUPS: ${JSON.stringify(prior.correlator.groups)}
RETRIEVED RUNBOOKS: ${(scenario.runbooks || []).map(r => r.id + ' — ' + r.title + ': ' + r.classifierHint).join(' | ')}

Return ONLY raw JSON — an array of 5-6 incidents, no markdown:
[
  {"id":"INC-XXXX","cause":"specific technical cause","confidence":<0-100>,"action":"auto"|"escalate","exec":"specific remediation action taken or reason for escalation"}
]

Rules: At least one incident must have confidence below 65 and action "escalate" — to show the system doesn't blindly automate everything. Vary confidence realistically.`;
  },

  /** Live Mode entry point — receives prior[correlator] as context. */
  async run(apiKey, scenario, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(scenario, prior), this.tokens);
    if (!raw) throw new Error('Agent 2 (Classifier) returned an empty response');
    return window.ApiClient.parseJSON(raw);
  },
};


/* ── assets/agents/agent-03-governance.js ── */
/**
 * assets/agents/agent-03-governance.js
 * Agent 3 — Remediation Governance Guardrail
 *
 * Mission: review the classifier's recommended actions before execution.
 * It decides whether each incident can be safely auto-remediated, requires
 * human review, or must be blocked from automation. This demonstrates safe
 * agentic operations: the system separates reasoning, classification, and
 * control-plane governance before any simulated action is shown.
 */

window.Agent03Governance = {
  id: 'governance',
  name: 'Remediation Governance Agent',
  mission: 'Validates blast radius, rollback posture, and change-control risk before execution',
  tokens: 1400,

  buildPrompt(scenario, prior) {
    return `You are an AI NOC Remediation Governance Guardrail. Review the classifier output before execution.

SCENARIO: ${scenario.name}
ROOT CAUSE: ${prior.correlator.rootCause}
INCIDENTS: ${JSON.stringify(prior.classifier)}
RETRIEVED RUNBOOKS: ${(scenario.runbooks || []).map(r => r.id + ' — ' + r.title + ': ' + r.governanceHint).join(' | ')}

Return ONLY raw JSON — an array with one record per incident, no markdown:
[
  {
    "id":"INC-XXXX",
    "decision":"approve"|"review"|"block",
    "guardrail":"short safety check name",
    "blastRadius":"low"|"medium"|"high",
    "rollback":"specific rollback or validation requirement",
    "rationale":"one concise sentence explaining the decision"
  }
]

Rules:
- Approve only actions with high confidence, bounded blast radius, and clear rollback.
- Review confidence < 65, compliance-sensitive changes, physical repairs, or unclear causal linkage.
- Block actions that could worsen a broad outage, affect regulated customer traffic, or lack rollback.
- At least one item should be review or block to demonstrate human-in-the-loop governance.`;
  },

  async run(apiKey, scenario, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(scenario, prior), this.tokens);
    if (!raw) throw new Error('Agent 3 (Governance Guardrail) returned an empty response');
    return window.ApiClient.parseJSON(raw);
  },
};


/* ── assets/agents/agent-04-ticketing.js ── */
/**
 * assets/agents/agent-04-ticketing.js
 * Agent 4 — Ticketing & Shift Workflow Agent
 *
 * Mission: create simulated ServiceNow/Remedy trouble tickets for incidents
 * that require attention after automated remediation and governance review.
 * This demonstrates how agentic NOC workflows hand off unresolved work with
 * structured context instead of leaving the next shift to rediscover the issue.
 */

window.Agent04Ticketing = {
  id: 'ticketing',
  name: 'Ticketing & Shift Workflow Agent',
  mission: 'Creates simulated ServiceNow/Remedy tickets for incidents needing next-shift action',
  tokens: 1600,

  buildPrompt(scenario, prior) {
    return `You are an AI NOC Ticketing and Shift Workflow Agent. Create trouble-ticket records for incidents requiring human follow-up.

SCENARIO: ${scenario.name}
ROOT CAUSE: ${prior.correlator.rootCause}
CLASSIFIED INCIDENTS: ${JSON.stringify(prior.classifier)}
GOVERNANCE DECISIONS: ${JSON.stringify(prior.governance)}
GOVERNED INCIDENTS: ${JSON.stringify(prior.governedIncidents)}
RETRIEVED RUNBOOKS: ${(scenario.runbooks || []).map(r => r.id + ' — ' + r.title + ': ' + r.ticketingHint).join(' | ')}

Return ONLY raw JSON — an array of 2-5 tickets, no markdown:
[
  {
    "ticketId":"SNOW-NOC-12345" | "RMDY-NOC-12345",
    "system":"ServiceNow"|"Remedy",
    "incidentId":"INC-XXXX",
    "priority":"P1"|"P2"|"P3",
    "assignmentGroup":"NOC L2"|"Transport Field Ops"|"Security Operations"|"Cloud Network Engineering"|"RAN Engineering"|"SASE Operations",
    "title":"short ticket title",
    "nextShiftAction":"specific action for the next shift",
    "sla":"15 min"|"30 min"|"1 hr"|"4 hr",
    "status":"New"|"Assigned"|"Pending Change Approval"
  }
]

Rules:
- Create tickets for escalated, reviewed, blocked, or physically-dispatched incidents.
- Do not create tickets for fully auto-resolved incidents unless monitoring is still required.
- Make titles realistic and operational.
- Include enough context that the next shift knows exactly what to do.`;
  },

  async run(apiKey, scenario, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(scenario, prior), this.tokens);
    if (!raw) throw new Error('Agent 4 (Ticketing Workflow) returned an empty response');
    return window.ApiClient.parseJSON(raw);
  },
};


/* ── assets/agents/agent-05-learner.js ── */
/**
 * Agent 5 — Post-Incident Learner
 *
 * Mission: closes the operational learning loop after governance, ticketing,
 * and outcome tracking. It proposes runbook updates, detection-rule changes,
 * and knowledge-base updates so the next similar incident is easier to handle.
 */
window.Agent05Learner = {
  id: 'learner',
  name: 'Post-Incident Learner',
  mission: 'Generates post-mortem, runbook update proposal, detection-rule improvement, and next-shift learning notes',
  tokens: 1600,

  buildPrompt(scenario, prior) {
    return `You are a Post-Incident Learning Agent for an AI-assisted Network Operations Center.
Generate a concise post-incident learning package from the governed incident workflow.

SCENARIO: ${scenario.name}
ROOT CAUSE: ${prior.correlator?.rootCause || scenario.rootCause}
CLASSIFIED INCIDENTS: ${JSON.stringify(prior.classifier || [])}
GOVERNANCE DECISIONS: ${JSON.stringify(prior.governance || [])}
TICKETS: ${JSON.stringify(prior.tickets || [])}
GOVERNED INCIDENTS: ${JSON.stringify(prior.governedIncidents || [])}
RETRIEVED RUNBOOKS: ${(scenario.runbooks || []).map(r => r.id + ' — ' + r.title + ': ' + r.learningHint).join(' | ')}

Return ONLY raw JSON, no markdown:
{
  "postMortemSummary":"2 concise sentences summarizing what happened and why it mattered",
  "whatWorked":["item 1","item 2","item 3"],
  "whatNeedsReview":["item 1","item 2"],
  "runbookUpdateProposal":{
    "runbookId":"RB-XXX-000",
    "title":"short update title",
    "changeType":"Add detection rule | Update rollback gate | Add escalation trigger | Improve handoff template",
    "proposedChange":"specific runbook text to add or update",
    "reason":"why this update reduces future MTTR or risk"
  },
  "newDetectionRule":{
    "ruleName":"short rule name",
    "logic":"IF symptoms A + B + C within time window THEN group as X",
    "severity":"P1|P2|P3",
    "owner":"team responsible"
  },
  "kbArticleDraft":{
    "title":"short KB title",
    "summary":"one-paragraph internal KB summary",
    "tags":["tag1","tag2","tag3"]
  }
}

Rules:
- Cite a retrieved runbook ID in the proposal.
- Do not claim real remediation occurred; this is a simulated portfolio workflow.
- Focus on operational learning, safer automation, and measurable future MTTR reduction.`;
  },

  async run(apiKey, scenario, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(scenario, prior), this.tokens);
    if (!raw) throw new Error('Agent 5 (Post-Incident Learner) returned an empty response');
    return window.ApiClient.parseJSON(raw);
  },
};


/* ── assets/data/agents.js ── */
/**
 * assets/data/agents.js
 * Ordered agent registry — defines pipeline execution order.
 *
 * Maintenance rule: to add a 5th agent, create assets/agents/agent-04-xxx.js
 * following the same { id, name, mission, tokens, buildPrompt(), run() }
 * interface as Agent01Correlator and Agent02Classifier, then add it to this
 * array. No other file needs to change.
 */

window.AGENT_REGISTRY = [
  window.Agent01Correlator,
  window.Agent02Classifier,
  window.Agent03Governance,
  window.Agent04Ticketing,
  window.Agent05Learner,
];


