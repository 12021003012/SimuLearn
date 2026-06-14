# Deployment Guide — SimuLearn

## Platform: Vercel (Recommended)

Vercel is the ideal host for this Next.js App Router project — zero-config serverless with edge functions, automatic HTTPS, preview deployments, and native Next.js support.

---

## Step 1: Import Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `https://github.com/12021003012/SimuLearn`
3. Framework Preset: **Next.js** (auto-detected)
4. Build Command: `npm run build`
5. Install Command: `npm ci`
6. Output Directory: (leave default)

---

## Step 2: Environment Variables

Set these in **Vercel → Project Settings → Environment Variables**:

### Required

| Variable | Scope | Description |
|----------|-------|-------------|
| `OPENAI_API_KEY` | Production, Preview | OpenAI API key for AI generation |
| `NEXTAUTH_SECRET` | Production, Preview | Random 32+ char string for session encryption |
| `NEXTAUTH_URL` | Production | Your production URL (e.g., `https://simulearn.app`) |

### Recommended

| Variable | Scope | Description |
|----------|-------|-------------|
| `ANTHROPIC_API_KEY` | Production | Claude API key (better simulation code) |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Supabase admin key (server-only) |
| `UPSTASH_REDIS_REST_URL` | All | Upstash Redis URL for caching |
| `UPSTASH_REDIS_REST_TOKEN` | All | Upstash Redis auth token |

### Optional

| Variable | Scope | Description |
|----------|-------|-------------|
| `OLLAMA_BASE_URL` | Production | Only if you expose Ollama publicly with auth |

> **Security**: Never set `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_` prefix. It must stay server-only.

---

## Step 3: Custom Domain

1. Vercel → Project Settings → Domains
2. Add your domain (e.g., `simulearn.app`)
3. Configure DNS:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Wait for SSL certificate provisioning (automatic)
5. Update `NEXTAUTH_URL` env var to match your domain

---

## Step 4: Post-Deploy Verification

### Go-Live Checklist

- [ ] Homepage loads with interactive simulation demo
- [ ] Search a topic → lesson streams correctly
- [ ] Simulations gallery loads all 16 prebuilt sims
- [ ] Rule-based simulation API works: `/api/simulate-rule?template=pendulum`
- [ ] Sign up / Sign in works
- [ ] Mock test generates questions
- [ ] AI tutor responds in streaming mode
- [ ] Fallback works (Ollama unavailable → OpenAI takes over silently)
- [ ] No console errors in production
- [ ] Lighthouse score > 90 (Performance)

---

## Step 5: Monitoring & Alerts

### Recommended Stack

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Vercel Analytics | Traffic, Web Vitals | Yes |
| Sentry | Error tracking (frontend + API) | 5K events/mo |
| Better Stack / UptimeRobot | Uptime monitoring | Yes |
| Vercel Logs | Real-time server logs | Included |

### Setup Sentry (optional)

```bash
npx @sentry/wizard@latest -i nextjs
```

---

## Step 6: CI/CD Pipeline

The repository includes `.github/workflows/ci.yml` which runs on every push/PR:

1. **Install** — `npm ci` (catches lockfile drift)
2. **Type Check** — `npx tsc --noEmit` (catches type errors)
3. **Build** — `npm run build` (catches runtime issues)
4. **Secret Scan** — Gitleaks (blocks accidental secret commits)

Vercel auto-deploys on merge to `main`. Preview deployments are created for every PR.

---

## Architecture Notes

### AI Fallback Chain

```
Request → Rule-Based Engine (instant, no cost)
       → Ollama Local (free, GPU-accelerated)
       → OpenAI/Anthropic (reliable, paid)
```

On Vercel, Ollama will be unreachable (private IP), so the system automatically uses cloud providers. This is by design.

### Caching Strategy

- AI-generated lessons are cached in Upstash Redis (keyed by query hash)
- Rule-based simulations are served with `Cache-Control: public, max-age=86400`
- Static simulation HTML files are served from `/public/` (CDN-cached by Vercel)

### Rate Limiting

API routes enforce rate limits via Upstash Redis. Configure thresholds in `src/lib/security/ratelimit.ts`.

---

## Scaling Considerations

| Load Level | Recommendation |
|------------|---------------|
| < 1K users/day | Vercel Hobby (free) + OpenAI pay-as-you-go |
| 1K–10K users/day | Vercel Pro + Supabase Pro + Redis Pro |
| 10K+ users/day | Vercel Enterprise + dedicated Ollama cluster + CDN for sims |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm ci` fails on Vercel | Delete `package-lock.json`, run `npm install` locally, commit new lockfile |
| AI responses timeout | Increase `maxDuration` in route files (currently 120s) |
| Simulations don't load | Check `/public/simulations/` files are committed |
| Auth redirect loops | Verify `NEXTAUTH_URL` matches your actual domain |
| Rate limit errors | Check Upstash Redis connection and token validity |
