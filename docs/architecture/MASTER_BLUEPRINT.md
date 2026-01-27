# 🤝 Phase 5: Parallel Execution Manifest (Master Blueprint)

This document is the **FINAL ORDER** for the implementation phase.
All agents must strictly adhere to their assigned roles and the "Contract" defined in Phase 3/4.

## 📁 System Context

- **Project**: C0KPIT (High-Fidelity Project Dashboard)
- **Stack**: Next.js (App Router), Convex, Clerk, Aceternity/Cult/Magic UI, n8n.
- **Aesthetic**: "Futuristic Elegance" (Aurora Background, Glassmorphism 2.0, Neon Logic).

## 🧑‍💻 Agent Assignments

### 1. Frontend Agent (`@frontend`)

- **Mission**: Build the "Stage" and "Cockpit" that wows the user.
- **Inputs**:
  - `docs/architecture/2_UI_UX_Rules.md` (Design System)
  - `docs/architecture/3_Sitemap_Wireframes.md` (Screens)
  - `docs/architecture/API_CONTRACT.md` (Data Binding)
- **Critical Directives**:
  - **NO MOCKING**: Use `convex` generated types from the start. Trust the Contract.
  - **Hybrid Strategy**: Use **Aceternity/Cult UI** for "Hero" locations (defined in docs). Use **Custom Glassmorphism** for everything else.
  - **Motion**: Every interaction must have feedback. Use `framer-motion`.
- **Immediate Tasks**:
  1.  Setup Next.js with Tailwind, Shadcn, and Framer Motion.
  2.  Implement `AuroraBackground` (Aceternity) and Global Layout.
  3.  Build `ClientDashboard` with "5-Step Progress Bar" and "Floating Dock".

### 2. Backend Agent (`@backend`)

- **Mission**: Build the "Brain" and "Nerve System".
- **Inputs**:
  - `docs/architecture/4_Database_Schema.md` (Schema)
  - `docs/architecture/API_CONTRACT.md` (Auth/Actions)
  - `backend/n8n/workouts.json` (Automation)
  - `mcp_config.json`
- **Critical Directives**:
  - **Schema First**: Apply `schema.ts` immediately using the defined Convex Schema.
  - **MCP Usage**: You have permission to use `convex` MCP to inspect/manage the DB.
  - **n8n Setup**: Do NOT write email sending logic in Convex. Send a Webhook to n8n.
- **Immediate Tasks**:
  1.  Initialize Convex project (`npx convex dev`).
  2.  Implement `schema.ts` and `auth.config.ts` (Clerk integration).
  3.  Implement Actions/Mutations defined in `API_CONTRACT.md`.

### 3. Integration Agent (`@integration`)

- **Mission**: Verify the "Promise" and ensure Quality.
- **Inputs**: all architecture docs.
- **Critical Directives**:
  - **E2E Testing**: Verify the critical path: `Admin Create Project` -> `Email Sent` -> `Client Login` -> `Payment Button Appears`.
  - **Visual Audit**: Check if "Aurora" is visible and animations are smooth (60fps).
- **Immediate Tasks**:
  - Wait for FE/BE initial deployment, then run E2E scenarios.

## 🚀 Execution Sequence

1.  **Orchestrator (Me)**: Handoff this Blueprint.
2.  **User**: Activates `Backend Agent` to setup DB & Auth.
3.  **User**: Activates `Frontend Agent` to build UI in parallel.
4.  **User**: Activates `Integration Agent` for final check.

---

**Signed by Orchestrator**
_Protocol v5.0 compliant_
