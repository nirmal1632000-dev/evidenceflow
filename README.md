# EvidenceFlow

**Learn systematic reviews and meta-analysis by doing them.**

Live demo: **[https://evidenceflow-iota.vercel.app](https://evidenceflow-iota.vercel.app)**

EvidenceFlow is a guided web app for:

- **Design hub** — produce evidence (case reports live; more designs soon) or synthesise (SR/MA)  
- **Design chooser** + **appraisal red flags** by study type  
- **Design tracks** — case report, cross-sectional, cohort, quasi-experimental, RCT  
- **SR/MA workspace** — full 11-stage pipeline (PICO → PRISMA)  
- **Watch · Do** on every stage — model example, then write your own  
- **Journal-shaped Word** export (CARE / STROBE / CONSORT / PRISMA order)  
- **Thesis roadmap** for residents — protocol → publication  
- Foundations · software modules · calculators

Educational aid only — not a substitute for methods training, supervision, or ethics review.

---

## Quick start (local)

```bash
git clone https://github.com/nirmal1632000-dev/evidenceflow.git
cd evidenceflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Requirements:** Node.js 20+ recommended.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

## Pedagogy

### Foundations
1. [History of SR & MA](/learn/foundations/history)  
2. [Philosophy of evidence synthesis](/learn/foundations/philosophy)

### Stage pipeline
Question → Eligibility → Protocol → Search → Screening → Extraction → RoB → Synthesis → Meta-analysis → GRADE → Reporting

On each stage:

1. **Watch** — model / annotated example  
2. **Do** — your project fields, tools, and exportable Word drafts

### Software modules
Not a bare list: each tool has pros/cons, when/how to use, pitfalls, and references  
→ `/tools` and `/tools/software/[slug]`

---

## Data storage

### Local mode (default)
Browser **localStorage** — solo practice, no account.

### Team / cloud mode
**Supabase** auth + Postgres — multi-device collaboration via invite code.

1. Create a project at [supabase.com](https://supabase.com)  
2. Run `supabase/schema.sql` in the SQL Editor  
3. Optional: `supabase/share-and-presence.sql` for live view-only share links + realtime tables  
4. Copy URL + anon key to `.env.local` (see `.env.local.example`)  
5. Set the same vars in your host (e.g. Vercel → Environment Variables)  
6. Auth URL config (example production site):
   - **Site URL:** `https://evidenceflow-iota.vercel.app`  
   - **Redirect URLs:**  
     - `https://evidenceflow-iota.vercel.app/auth/callback`  
     - `http://localhost:3000/auth/callback`  
7. In-app guide: `/setup`

Then: Sign in → Create team project → Share invite code → collaborators join.

---

## Deploy (Vercel)

### Already linked
This project is deployed at:

**https://evidenceflow-iota.vercel.app**

### Redeploy from CLI

```bash
cd evidenceflow
npx vercel --prod
```

### Deploy from GitHub (recommended long-term)

1. Push this repo to GitHub (see below)  
2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo  
3. Framework: Next.js (auto-detected)  
4. Add env vars if using Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
5. Deploy  

Every push to `master`/`main` can auto-deploy if Git integration is enabled.

---

## Environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | For cloud only | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For cloud only | Supabase anon/public key |

Never commit real `.env.local` or secrets (already in `.gitignore`).

---

## Stack

- **Next.js** (App Router) + TypeScript  
- **Tailwind CSS** v4  
- **Supabase** (optional auth + DB)  
- **Vercel** hosting  

---

## Project layout (high level)

```
src/app/           # Routes (learn, workspace, tools, share, auth…)
src/components/    # UI (stages, calculators, WDT tabs…)
src/lib/           # Stages, pedagogy, software modules, foundations, stats
supabase/          # SQL schema + optional share/presence migration
```

---

## Scope (v1)

- Intervention systematic reviews of **RCTs**  
- Optional pairwise meta-analysis (teaching calculators + external tools)  
- Not: full Covidence replacement, network MA, diagnostic accuracy tracks  

---

## Contributing / teaching use

Use and share freely for learning and teaching.  
When teaching from PRISMA / Cochrane / GRADE materials, cite the original sources (linked inside Learn and Software modules).

## License

Use and share freely for learning and teaching.
