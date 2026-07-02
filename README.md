# RAG-Assisted AI NOC Operator

**Live demo / test website:**  
GitHub:
https://danvzla.github.io/ai-noc-operator-rag/
Netlify:
https://ai-noc-operator-rag.netlify.app/

**GitHub repository:**  
https://github.com/danvzla/ai-noc-operator-rag

## Overview

**RAG-Assisted AI NOC Operator** is a runbook-grounded, multi-agent network operations workflow that turns noisy NOC alarms into correlated incidents, governed remediation decisions, ITSM tickets, post-incident learning, and next-shift handoff.

The tool demonstrates how Retrieval-Augmented Generation (RAG), agent orchestration, remediation governance, and ITSM workflow automation can be combined into a practical AI-assisted NOC operating model.

## What the demo shows

The workflow runs through eight operational stages:

| Stage | Name | Purpose |
|---:|---|---|
| 0 | Event ingestion & suppression | Normalizes raw events, suppresses duplicates/flapping alarms, checks change context, and builds service-impact context. |
| 1 | Runbook-grounded correlation | Retrieves relevant runbooks and correlates noisy alarms into probable root cause and actionable incident groups. |
| 2 | Incident classification | Scores incidents by confidence, severity, and impact; recommends auto-remediation or escalation. |
| 3 | Remediation governance | Applies safety guardrails, rollback requirements, blast-radius checks, and change-control policy before execution. |
| 4 | ITSM ticketing | Creates ServiceNow/Remedy-style tickets with owner, priority, SLA, and next-shift action. |
| 5 | Outcome tracking | Tracks approved actions, failed post-checks, escalations, blocked changes, and ticket updates after governance review. |
| 6 | Post-incident learning | Converts incident outcomes into runbook update proposals, detection rules, and KB article drafts. |
| 7 | Shift turnover | Produces the next-shift handoff with root cause, open items, ticket queue, owners, SLA risk, and next actions. |

## Project structure

```text
ai-noc-operator-rag/
├── index.html
├── agents.js
├── styles.css
├── README.md
└── rag-runbooks/
    ├── runbook-index.js
    ├── RB-FIBER-002.md
    ├── RB-BGP-007.md
    ├── RB-DDOS-011.md
    ├── RB-DNS-004.md
    ├── RB-RAN-PTP-003.md
    ├── RB-SASE-006.md
    └── RB-ITSM-001.md
```

## RAG / runbook layer

The `rag-runbooks/` folder acts as the lightweight retrieval corpus.

- `runbook-index.js` contains the runbook metadata, retrieval keywords, and guidance fields used by the agents.
- The Markdown files are human-readable operational runbooks.
- When a scenario is selected, the app retrieves the most relevant runbooks and injects the retrieved guidance into the agent workflow.
- Runbook citations are displayed in the UI and link to the corresponding Markdown files.

This is intentionally lightweight and transparent for a portfolio demo. In a production architecture, this layer could be replaced by embeddings, a vector database, metadata filtering, RBAC-aware retrieval, and source-grounded citations.

## Agents

The workflow uses five agents:

| Agent | Role |
|---:|---|
| Agent 1 | Runbook-Grounded Correlation Agent |
| Agent 2 | Incident Classification Agent |
| Agent 3 | Remediation Governance Agent |
| Agent 4 | ITSM Ticketing & Shift Workflow Agent |
| Agent 5 | Post-Incident Learning Agent |

## Execution modes

| Mode | Description |
|---|---|
| Demo Mode | Runs without an API key using scripted scenarios and deterministic workflow logic. Best for recruiters, LinkedIn, and interviews. |
| Claude API | Runs the live agent chain through Claude using your own API key. |
| OpenAI API | Runs the live agent chain through OpenAI using your own API key. |

## Test instructions

Open the live demo:

https://danvzla.github.io/ai-noc-operator-rag/

Then test the following:

1. Select **Demo** mode.
2. Select the **Fiber cut — Dallas–Atlanta backbone** scenario.
3. Click **Start NOC Workflow**.
4. Confirm the workflow progresses through stages 0–7.
5. Confirm RAG/runbook citation chips appear.
6. Click a runbook citation and verify it opens a Markdown runbook under `/rag-runbooks/`.

Direct file tests:

- https://danvzla.github.io/ai-noc-operator-rag/index.html
- https://danvzla.github.io/ai-noc-operator-rag/styles.css
- https://danvzla.github.io/ai-noc-operator-rag/agents.js
- https://danvzla.github.io/ai-noc-operator-rag/rag-runbooks/runbook-index.js
- https://danvzla.github.io/ai-noc-operator-rag/rag-runbooks/RB-FIBER-002.md

If the main URL does not load, verify GitHub Pages deployment status under **Actions** and **Settings → Pages**.

## GitHub Pages deployment

Recommended GitHub Pages source:

```text
Settings → Pages → Source: GitHub Actions
```

Recommended workflow file:

```text
.github/workflows/static.yml
```

The live site should publish to:

```text
https://danvzla.github.io/ai-noc-operator-rag/
```

## Resume bullet

Built a RAG-assisted AI NOC Operator using a 5-agent workflow for alarm correlation, incident classification, remediation governance, ITSM ticketing, and post-incident learning, with runbook-grounded decisions, human-in-the-loop safety gates, and shift-turnover handoff.

## LinkedIn positioning

RAG-Assisted AI NOC Operator — a runbook-grounded 5-agent workflow that turns noisy network alarms into correlated incidents, governed remediation decisions, ITSM tickets, post-incident learning, and next-shift handoff.
