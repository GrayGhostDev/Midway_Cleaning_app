# CLAUDE.md — Midway Cleaning Co (Level 3)

## Project Identity

- **Slug**: `midway-cleaning`
- **Display Name**: Midway Cleaning Co
- **Client ID**: MDW-002 (legacy: `the-system/clients/config/midway-cleaning.json`)
- **Path**: `~/projects/clients/MidwayCleaning/`
- **GitHub**: `GrayGhostDev/Midway_Cleaning_app`

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.1.6 | Full-stack monolith (pages + API routes) |
| Language | TypeScript | Strict mode |
| UI | shadcn/ui (Radix + Tailwind) | NOT Mantine |
| Database | Supabase (PostgreSQL 15) | Migrating from Prisma — see migration section |
| Cache | Redis 7 | Session cache, rate limiting |
| Auth | Clerk | `@clerk/nextjs` — canonical auth provider |
| Payments | Stripe | Checkout Sessions, webhook handler |
| Deployment | Vercel | Frontend + API routes |
| Package manager | npm | NOT pnpm |

## Ports (GGDC-assigned)

| Service | Host Port | Container Port | Notes |
|---------|-----------|----------------|-------|
| midway-app | 8003 | 3000 | Next.js dev server |
| midway-frontend | 5183 | 3000 | Dev preview alias |
| midway-postgres | 5438 | 5432 | 127.0.0.1 only |
| midway-redis | 6384 | 6379 | 127.0.0.1 only |

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run lint             # ESLint
npm test                 # Jest tests

# Supabase (target state — replaces Prisma commands)
npx supabase start                          # Start local Supabase
npx supabase migration new <name>           # Create migration
npx supabase db push                        # Apply migrations
npx supabase gen types typescript --local > src/types/supabase.ts  # Generate types

# Docker
docker compose up -d     # Start all services
docker compose down      # Stop all services
docker compose logs -f   # Follow logs
```

## Architecture

### Project structure
```
src/
├── app/                    # App Router pages + API routes
│   ├── api/                # API route handlers (route.ts)
│   ├── dashboard/          # Admin dashboard
│   ├── portal/             # Client portal
│   ├── sign-in/            # Clerk sign-in
│   └── sign-up/            # Clerk sign-up
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific
│   ├── layout/             # Layout components (Header, Sidebar)
│   └── Navigation/         # Navbar, Footer, Sidebar
├── lib/                    # Utilities, services, config
│   ├── services/           # 26 domain service classes (ServiceFactory pattern)
│   ├── prisma.ts           # [LEGACY] Prisma client singleton
│   ├── stripe.ts           # Stripe server client
│   ├── rbac.ts             # RBAC implementation #1
│   └── roles.ts            # RBAC implementation #2 (consolidation needed)
├── middleware.ts            # Clerk auth middleware
└── types/                  # TypeScript interfaces
```

### Service layer
The project uses 26 static service classes accessed via `ServiceFactory`:
- `BookingService`, `ClientService`, `EmployeeService`
- `EquipmentService`, `InventoryService`, `ShiftService`
- `PaymentService`, `QualityService`, `AnalyticsService`
- etc.

### RBAC roles
Four roles: `ADMIN`, `MANAGER`, `EMPLOYEE`, `CLIENT`

**Known debt:** Two RBAC implementations exist:
- `src/lib/rbac.ts` — role checking utilities
- `src/lib/roles.ts` — role constants and permissions

These need consolidation to a single source of truth.

---

## Known Technical Debt

### 1. Auth: Dual Clerk + next-auth

**Status:** Middleware uses Clerk (`clerkMiddleware`), but some API route handlers still import `next-auth`.

**Canonical:** Clerk is the auth provider. All `next-auth` imports are legacy.

**Migration pattern:**
| Replace (next-auth) | With (Clerk) |
|---------------------|-------------|
| `import { getServerSession } from "next-auth"` | `import { auth } from "@clerk/nextjs/server"` |
| `const session = await getServerSession(authOptions)` | `const { userId } = await auth()` |
| `session?.user?.id` | `userId` |
| `session?.user?.role` | `sessionClaims?.metadata?.role` |

**Agent:** Use `fixer` with `clerk-auth-patterns` skill.

### 2. Prisma → Supabase Migration

**Current state:** Prisma 5 ORM with 19 models, `src/lib/prisma.ts` singleton, `prisma/schema.prisma`.

**Target state:** Supabase JS client (`@supabase/supabase-js`) with RLS policies, typed client via `supabase gen types`.

**Migration approach:**
1. Set up Supabase project and generate initial migration from Prisma schema
2. Create `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts`
3. Generate TypeScript types: `npx supabase gen types typescript`
4. Migrate service classes one at a time (Prisma queries → Supabase queries)
5. Add RLS policies for each table
6. Remove Prisma dependencies when complete

**19 Prisma models to migrate:**
User, Booking, Service, ServiceAddon, Payment, Invoice, Employee, Shift, Equipment, MaintenanceRecord, Inventory, InventoryTransaction, Location, Client, Feedback, QualityInspection, Task, Certification, AnalyticsReport

**Agent:** Use `database-architect` with `supabase-migration` + `supabase-client-patterns` skills.

### 3. Duplicate RBAC

Two files implement role-based access: `rbac.ts` and `roles.ts`. Consolidate into a single `src/lib/auth.ts` using Clerk session claims pattern (see `clerk-auth-patterns` skill).

---

## Agent Routing (Midway-Specific)

| Task | Primary Agent | Skill | Notes |
|------|--------------|-------|-------|
| Supabase schema/migrations | `database-architect` | `supabase-migration` + `supabase-client-patterns` | Existing + new skills |
| RLS policies | `database-architect` | `rls-policy-review` | Existing skill |
| Clerk auth integration | `backend-specialist` | `clerk-auth-patterns` | New skill |
| Stripe payment features | `backend-specialist` | `stripe-payment-patterns` | New skill |
| shadcn/ui components | `frontend-specialist` | — | Radix + Tailwind, NOT Mantine |
| Booking/scheduling logic | `coder` | `cleaning-service-domain` | New skill |
| API route implementation | `api-builder` | `nextjs-api-route-patterns` | New skill |
| Auth debt migration | `fixer` | `clerk-auth-patterns` | next-auth → Clerk |
| Prisma→Supabase migration | `database-architect` + `refactor` | `supabase-migration` | Major migration |

---

## Workflows

### Feature development
1. Create feature branch from `main`
2. Implement with appropriate agent (see routing table)
3. Write tests (Jest for unit, Playwright for E2E)
4. Run `npm run lint && npm test && npm run build`
5. Create PR, review, merge

### Database changes (Supabase)
1. `npx supabase migration new <description>`
2. Write SQL migration (see `supabase-migration` skill)
3. Add RLS policies (see `rls-policy-review` skill)
4. `npx supabase db push` to apply locally
5. `npx supabase gen types typescript --local > src/types/supabase.ts`
6. Test migration locally before pushing

### Auth migration (per route)
1. Identify API route with `next-auth` import
2. Replace imports per migration table above
3. Update auth checks to use `auth()` from Clerk
4. Test with Clerk dev mode
5. Remove `next-auth` when all routes migrated

### Prisma→Supabase migration (per service)
1. Create Supabase migration matching Prisma model
2. Add RLS policies
3. Create typed Supabase client helpers
4. Rewrite service class methods (Prisma queries → Supabase queries)
5. Update tests
6. Remove Prisma model when service fully migrated

---

## Testing

| Framework | Purpose | Command |
|-----------|---------|---------|
| Jest | Unit tests | `npm test` |
| Playwright | E2E tests | `npx playwright test` |
| Cypress | Legacy E2E (being replaced by Playwright) | `npx cypress run` |
| k6 | Load testing | `k6 run tests/load/*.js` |

**Coverage target:** 80% (critical paths: auth, payments, booking lifecycle = 100%)

---

## Related Resources

- Port registry: `~/Business/config/port-registry.yaml`
- Architecture: `~/Business/docs/ARCHITECTURE_OVERVIEW.md`
- Runbooks: `~/Business/docs/RUNBOOKS.md`
- Agent routing: `~/Business/docs/AGENT_ROUTING_MATRIX.md`
- Legacy config: `~/Business/GGDC-System/the-system/clients/config/midway-cleaning.json`

## Security Notes

- `.env` and `secret.key` were previously committed — now gitignored and removed from tracking
- Never commit credentials; use `.env.local` for local overrides
- Stripe webhook secret and Clerk keys in environment variables only
- Supabase service role key: server-side only, never in client bundles
