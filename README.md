# Mamunur Rashid — Portfolio (Full-Stack)

A production portfolio with an admin-controlled CMS, visitor analytics, a lead
pipeline, and Calendly meeting sync.

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind + Framer Motion → deployed on **Vercel**
- **Backend:** FastAPI + SQLModel → deployed on **Render**
- **Database:** PostgreSQL on **Supabase**

Every piece of public content (hero, about, stats, services, projects, skills,
experience, case studies, social links, Calendly URL) is editable from the admin
dashboard and persisted in the database.

---

## Repository layout

```
backend/    FastAPI app (app/), seed_data.py, create_admin.py, requirements.txt
frontend/   Next.js app (app/, components/, lib/, hooks/)
```

---

## Local development

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                  # then fill in real values
python seed_data.py                                   # optional: seed starter content (non-destructive)
uvicorn app.main:app --reload                         # http://127.0.0.1:8000  (docs at /docs)
```

The admin account is created/refreshed automatically on startup from
`ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env`. You can also run
`python create_admin.py` (or `python create_admin.py <user> <pass>`).

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local                      # set NEXT_PUBLIC_API_URL
npm run dev                                            # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin` (log in with the env credentials).

---

## Environment variables

Secrets live only in `backend/.env` and `frontend/.env.local`, which are
**git-ignored**. See `backend/.env.example` and `frontend/.env.local.example`
for the full list. The same variables must **also** be set in the hosting
dashboards — Render does not read `backend/.env`, and Vercel does not read
`frontend/.env.local`:

- **Render (backend):** `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`,
  `ACCESS_TOKEN_EXPIRE_MINUTES`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
  `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`, `NOTIFICATION_EMAIL`,
  `CORS_ORIGINS`, `CALENDLY_SIGNING_KEY` (optional).
- **Vercel (frontend):** `NEXT_PUBLIC_API_URL` (your Render backend URL).

> In `DATABASE_URL`, URL-encode special characters in the password
> (e.g. `@` → `%40`).

---

## One-time database migration

The `contactmessage` table gained two columns for the lead pipeline. Run this
once in the **Supabase SQL editor** (safe / idempotent):

```sql
ALTER TABLE contactmessage ADD COLUMN IF NOT EXISTS status VARCHAR NOT NULL DEFAULT 'new';
ALTER TABLE contactmessage ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL;
```

All other new tables (services, casestudy, visit, sitesetting, meeting) are
created automatically on backend startup — the app only ever **creates missing
tables** and never drops data.

Then seed starter content once (optional, non-destructive):

```bash
cd backend && python seed_data.py
```

---

## Calendly setup (optional)

1. In the admin dashboard → **Portfolio CMS**, set **Calendly URL** to your
   scheduling link (e.g. `https://calendly.com/your-name/intro`). The public
   Contact section then shows an inline booking embed.
2. To record bookings under **Meetings Panel**, create a Calendly webhook
   pointing at `https://<your-backend>/api/calendly/webhook` subscribed to
   `invitee.created` and `invitee.canceled`, and set `CALENDLY_SIGNING_KEY`
   in the backend env to verify signatures.

---

## Deploy

Both apps auto-deploy on push:

- **Vercel** builds `frontend/` on every push.
- **Render** builds `backend/` on every push.
- **Supabase** is the shared managed Postgres.

Make sure the env vars above are set in each dashboard before the first deploy.
