# CLAUDE.md — Midway Cleaning Co (Level 3)

## Project Identity

- **Slug**: `midway-cleaning`
- **Display Name**: Midway Cleaning Co
- **Client ID**: MDW-002 (legacy: `the-system/clients/config/midway-cleaning.json`)
- **Path**: `~/projects/clients/MidwayCleaning/`
- **GitHub**: `GrayGhostDev/Midway_Cleaning_app`

## Stack

- **Framework**: Next.js 14 (full-stack monolith — pages + API routes)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Auth**: Clerk
- **Payments**: Stripe
- **Deployment**: Vercel

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

# Database
npx prisma migrate dev   # Run migrations (dev)
npx prisma generate      # Regenerate Prisma client
npx prisma studio        # DB browser

# Docker
docker compose up -d     # Start all services
docker compose down      # Stop all services
docker compose logs -f   # Follow logs
```

## Related Resources

- Port registry: `~/Business/config/port-registry.yaml`
- Architecture: `~/Business/docs/ARCHITECTURE_OVERVIEW.md`
- Runbooks: `~/Business/docs/RUNBOOKS.md`
- Legacy config: `~/Business/GGDC-System/the-system/clients/config/midway-cleaning.json`

## Security Notes

- `.env` and `secret.key` were previously committed — now gitignored and removed from tracking
- Never commit credentials; use `.env.local` for local overrides
