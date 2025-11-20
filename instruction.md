Instruction: Build a CRM Product (Frontend + Backend with Next.js)

Purpose
-------
This document describes a practical, step-by-step instruction set for building a production-ready CRM product using Next.js for frontend and backend (fullstack). It is written for engineers and AI agents executing tasks and assumes a Git repository root similar to this workspace.

Scope
-----
- Frontend + backend using Next.js (App Router)
- Relational database (Postgres recommended; SQL Server also supported)
- Authentication & RBAC
- API design, data model, and integrations
- CI / CD and deployment (Vercel or Azure)
- Testing, monitoring, and security

High-level Goals
----------------
- Deliver a modular, maintainable CRM: Customer management, Sales pipeline, Reporting, Communication hub, Marketing automation hooks
- Use Next.js for server-side functionality (App Router, API routes / server actions, Edge functions as needed)
- Developer DX: automated tests, linting, codegen where appropriate

Tech Stack Recommendations
--------------------------
- Framework: Next.js (App Router), TypeScript
- UI: Tailwind CSS + shadcn/ui (or your design system)
- State: React Query / TanStack Query or Zustand for local UI state
- ORM: Prisma (Postgres primary) or TypeORM / EF if you prefer SQL Server (.NET)
- DB: PostgreSQL (production) — Azure SQL or SQL Server if required by enterprise
- Auth: NextAuth.js or Clerk or custom JWT with cookie-based sessions
- Real-time: Socket.IO or SignalR via a small Node.js server or using Supabase Realtime / Postgres logical replication for events
- Background jobs: BullMQ, Azure Functions, or serverless workers
- Testing: Vitest + React Testing Library; Playwright for E2E
- CI: GitHub Actions; CD: Vercel (frontend) + Azure (if you need backend services)
- Observability: Sentry (errors), Prometheus/App Insights for metrics, Log aggregation

Repository Layout (single Next.js app)
-------------------------------------
- /app                      - Next.js App Router pages
  - /api                    - API routes (server functions) where needed
  - /(auth)                 - auth-related pages (login, register)
  - /dashboard              - main CRM UI (protected)
  - /services/crm           - marketing landing (existing)
- /src
  - /lib                    - helpers, clients, utils
  - /db                     - Prisma schema & migrations
  - /components             - shared UI components
  - /hooks                  - custom React hooks
  - /services               - domain services (API wrappers)
  - /styles                 - Tailwind config or global css
- prisma/schema.prisma      - Prisma data model
- package.json
- next.config.mjs

Core Domain Model (minimal)
---------------------------
- User (id, name, email, role)
- Organization / Account (id, name, metadata)
- Contact (id, accountId, name, email, phone, customFields)
- Lead (id, contactId, source, status, score)
- Deal / Opportunity (id, accountId, amount, stage, assignedTo, closeProbability)
- Activity (id, type:email/call/meeting, relatedTo:lead|deal|contact, timestamp, notes)
- Role / Permission (rbac table)

Step-by-step Implementation Plan
--------------------------------
(Each step can be broken into smaller tasks and tracked as issues)

Phase 0 — Project Setup (Day 0-2)
- Initialize repository (if not already)
  - `npx create-next-app@latest --ts --eslint --tailwind` or adapt your existing project
- Install core deps:
  - `npm i prisma @prisma/client` (plus `pg` for Postgres)
  - `npm i next-auth` or `npm i @clerk/clerk-react` (if using Clerk)
  - `npm i react-query` or `@tanstack/react-query`
  - `npm i tailwindcss postcss autoprefixer`
  - `npm i vitest @testing-library/react playwright` (dev deps)
- Set up Prisma: `npx prisma init`
  - Configure `DATABASE_URL` in `.env`
  - Create schema and run `npx prisma migrate dev --name init`
- Add TypeScript types and ESLint rules (follow repo conventions)

Phase 1 — Auth, DB & Core Models (Week 1)
- Implement authentication (NextAuth with Email/Provider) or Clerk
- Add roles and RBAC table
- Add Prisma models for User, Account, Contact, Lead, Deal, Activity
- Seed sample data script for local development
- Protect routes via middleware (app router middleware) using session

Phase 2 — Customer CRUD & UI Kit (Week 2)
- Build Customers/Contacts CRUD: list, detail, create, update, delete
- Implement server-side APIs in `/app/api` or server actions
- Implement shared components (Table, Modal, Form, Input, Select)
- Add client-side validation (Zod) and server-side validation

Phase 3 — Sales Pipeline & Activities (Week 3)
- Add Deals/Opportunities CRUD
- Add pipeline Kanban view (drag & drop)
- Track Activities (email, call logs)
- Implement scheduling & reminders integration (e.g., Google Calendar OAuth)

Phase 4 — Reporting & Analytics (Week 4)
- Create KPI dashboard: MRR, new leads, conversion rate, pipeline value
- Use server-side aggregation queries (materialized views or optimized queries)
- Add CSV export for reports

Phase 5 — Integrations & Automation (Weeks 5-6)
- Webhooks & external connectors (Zapier, Make, custom webhooks)
- Marketing automation: basic workflow designer or prebuilt workflows
- Email templates and mass-mail features (via transactional email provider)

Phase 6 — Hardening & Production Readiness (Weeks 7-8)
- Add tests (unit, integration, E2E), reach target coverage
- Add monitoring: Sentry & App Insights
- Secure endpoints, auditing, and logging
- Performance testing, DB indexes, and caching

Developer Setup & Local Commands
-------------------------------
1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:

```powershell
npm install
```

3. Run migrations & seed (local):

```powershell
npx prisma migrate dev --name init
npm run seed
```

4. Start dev server:

```powershell
npm run dev
```

5. Run tests:

```powershell
npm run test  # unit
npm run e2e   # e2e with Playwright
```

API Design Guidelines
---------------------
- Use REST-like endpoints under `/api` (or consider GraphQL if complex relationships exist).
- Use consistent URL patterns: `/api/v1/customers`, `/api/v1/deals`, `/api/v1/activities`.
- Use proper HTTP status codes and descriptive error messages.
- Use typed request/response via Zod + TypeScript.

Authentication & Authorization
------------------------------
- Use NextAuth (or Clerk) for session management.
- Store roles in DB. Check roles in API handlers and middleware.
- Use `middleware.ts` in Next.js App Router to protect `/(dashboard)` routes.

Testing Strategy
----------------
- Unit tests: Vitest + React Testing Library for components
- Integration tests: Node-based test for API endpoints using a test DB
- E2E: Playwright for full flows (login, create lead, convert to deal)
- Use CI to run tests on PRs

CI / CD & Deployment
--------------------
- CI: GitHub Actions
  - Steps: lint → build → test → deploy-preview
- CD: Vercel for the Next.js frontend and serverless functions OR
  - Use Azure App Service + Azure SQL if you prefer Azure.
  - For Vercel: set environment variables in project settings (DATABASE_URL, NEXTAUTH_URL, AUTH_SECRET)

Example GitHub Action (simplified)
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run test
```

Monitoring & Operations
-----------------------
- Add Sentry for errors
- Use Application Insights / Prometheus for metrics
- Set up uptime checks and alerts (PagerDuty or Slack integration)
- Schedule DB backups and test restoration

Security & Compliance
---------------------
- TLS everywhere (HTTPS)
- Encrypt sensitive fields at rest (column-level encryption for PII)
- Use RBAC and least privilege for tokens
- Audit logging for critical actions
- Data retention policies and GDPR compliance steps

Performance & Scaling
---------------------
- Use pagination for lists, limit page sizes
- Use DB indexes for searchable fields
- Use caching (Redis) for heavy aggregate endpoints
- Consider read-replicas for analytics dashboards

Roadmap & Milestones (high-level)
---------------------------------
- M0: Project scaffolding & infra
- M1: Auth + Core Models
- M2: Customer CRUD + pipeline
- M3: Analytics + exports
- M4: Integrations + automation
- M5: Production hardening & launch

Deliverables
------------
- Fully functional Next.js CRM app with above features
- API docs (Swagger / OpenAPI or API.md)
- Terraform/ARM templates (optional) for infra
- Tests, monitoring, and deploy scripts
- README with dev setup and debugging tips

Checklist Before Launch
-----------------------
- [ ] All critical flows covered with tests
- [ ] Security review complete
- [ ] Monitoring configured and alerts tested
- [ ] Backups scheduled and tested
- [ ] Performance tests passed

Notes for AI Agent Execution
---------------------------
- Work incrementally: implement smallest vertical slice that includes frontend, backend, DB, and tests.
- Run migrations and seeds in CI pipeline to enable integration tests.
- Keep commit history tidy; each PR should be focused and include tests.
- Use feature flags for risky features and dark launches.

---

If you'd like, I can:
- Create this file in the repo now (`/instruction.md`).
- Create a matching `README` task list or GitHub Issues based on the phases.
- Generate an initial Prisma schema and sample migrations.

Tell me which of these you want me to do next.