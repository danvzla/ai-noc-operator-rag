# AI NOC Operator — RAG-Assisted 5-Agent Workflow

AI NOC Operator is a portfolio demo that shows how a Network Operations Center workflow can use agentic AI safely: noisy alarms are normalized, correlated to probable root cause, classified by confidence, reviewed by a governance guardrail, ticketed into ITSM, tracked through outcome, and converted into post-incident learning.

## What changed in this redesigned version

- **Dedicated `/rag-runbooks` folder**: the lightweight RAG / runbook layer is now separated from `index.html` and stored in a visible, inspectable folder.
- **Runbook source files**: each operational runbook is available as a Markdown file, such as `rag-runbooks/RB-FIBER-002.md` and `rag-runbooks/RB-BGP-007.md`.
- **Runbook index / retrieval file**: `rag-runbooks/runbook-index.js` contains the runbook metadata and retrieval function used by the app.
- **Runbook-grounded agent prompts**: Correlator, Classifier, Governance, Ticketing, and Learner agents receive retrieved runbook snippets in Live Mode.
- **Agent 5 — Post-Incident Learner**: generates a post-mortem summary, what worked, what needs review, a proposed runbook update, a new detection rule, and a KB article draft.
- **8-stage operations workflow**: ingestion, RAG-grounded correlation, classification, governance, ticketing, outcome tracking, post-incident learning, and shift turnover.

## File structure

```text
ai-noc-operator/
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

## Runbook library

The app currently includes these runbooks:

| Runbook | Domain |
|---|---|
| `RB-FIBER-002` | Optical loss / fiber cut correlation |
| `RB-BGP-007` | BGP drift and route-map rollback |
| `RB-DDOS-011` | DDoS edge mitigation |
| `RB-DNS-004` | Recursive DNS resolver failure |
| `RB-RAN-PTP-003` | 5G RAN PTP timing drift |
| `RB-SASE-006` | SASE / SD-WAN tunnel storm |
| `RB-ITSM-001` | ITSM ticketing and shift handoff standard |

The runtime retrieval layer lives in:

```text
rag-runbooks/runbook-index.js
```

The human-readable source runbooks live in:

```text
rag-runbooks/*.md
```

## Modes

- **Demo Mode** — no API key required. Runs the full 5-agent workflow with scripted outputs and runbook citations.
- **Claude API Mode** — real chained API calls using your Anthropic key.
- **OpenAI API Mode** — real chained API calls using your OpenAI key.

## Run locally

Open `index.html` directly in a browser for Demo Mode. For best behavior with runbook links and Claude/OpenAI Live Mode, deploy to GitHub Pages or run a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

Upload all files and the `rag-runbooks/` folder to the repo root:

```text
index.html
agents.js
styles.css
README.md
rag-runbooks/
```

Then enable GitHub Pages from the `main` branch.

## Portfolio positioning

**Resume bullet:**

> Built a RAG-assisted AI NOC Operator using a 5-agent workflow for alarm correlation, incident classification, remediation governance, ITSM ticketing, and post-incident learning, with a dedicated runbook library, cited runbook-grounded decisions, human-in-the-loop safety gates, and shift-turnover handoff.

**LinkedIn project description:**

> AI NOC Operator is a RAG-assisted, 5-agent network operations workflow that turns noisy alarm streams into correlated incidents, governance-approved actions, ITSM tickets, and post-incident learning. The demo includes a dedicated runbook library, cited operational guidance, prompt transparency, Claude/OpenAI live modes, and a no-key demo mode.
