# Personal Website Monorepo

Professional portfolio for Mehmet Ünlü, built as a split frontend/backend monorepo.

## Static Site (current deployment)

The live site at `https://unlumehmet.com` is a fully static Next.js export hosted on
GitHub Pages. The backend, admin panel, and DigitalOcean Droplet are no longer used.

- Content lives in `frontend/content/*.json` (profile, projects, posts, resume).
- Uploaded images and files live in `frontend/public/api/uploads/`, so existing
  `/api/uploads/...` URLs keep working.
- Edit the JSON or add files, then push to `main`; `.github/workflows/deploy-pages.yml`
  builds `frontend/out` and deploys it.
- The contact form opens the visitor's email app via `mailto:` instead of storing messages.
- `frontend/scripts/export-content.mjs` re-snapshots content from a running backend
  (`node frontend/scripts/export-content.mjs https://host`), if the backend is ever revived.

Local preview:

```bash
npm install
npm run build --workspace frontend
npx serve frontend/out
```

The sections below describe the original frontend/backend setup.

## Architecture

```txt
personal-website/
├── frontend/          # Next.js App Router, TypeScript, Tailwind, Framer Motion
├── backend/           # Express REST API, TypeScript, Prisma, SQLite
├── docker-compose.yml
├── package.json
├── README.md
└── .gitignore
```

## Stack

- Frontend: Next.js 15, App Router, TypeScript, Tailwind CSS, Framer Motion, next-themes, Lucide icons
- Backend: Node.js, Express, TypeScript, Prisma ORM
- Database: SQLite for development, Prisma-compatible path to PostgreSQL later
- Content: Prisma seed data with a lightweight JSON/Markdown content-management path in `backend/content`

## Localization (Zero Cost)

- The website supports both English and Turkish routes.
- English pages: `/`, `/about`, `/projects`, `/notes`, `/resume`, `/contact`
- Turkish pages: `/tr`, `/tr/about`, `/tr/projects`, `/tr/notes`, `/tr/resume`, `/tr/contact`
- Language switching is handled in-app with no paid translation API.

## Environment Variables

Create local env files from the examples:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Frontend:

```env
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

Backend:

```env
NODE_ENV="development"
DATABASE_URL="file:./dev.db"
PORT=8080
TRUST_PROXY=false
CORS_ORIGIN="http://localhost:3001"
CONTACT_NOTIFICATION_EMAIL=""
CONTACT_EMAIL_FROM="Mehmet Portfolio <onboarding@resend.dev>"
RESEND_API_KEY=""
CONTACT_RATE_LIMIT_WINDOW_MINUTES=15
CONTACT_RATE_LIMIT_MAX=6
ADMIN_LOGIN_RATE_LIMIT_WINDOW_MINUTES=15
ADMIN_LOGIN_RATE_LIMIT_MAX=6
ADMIN_API_RATE_LIMIT_WINDOW_MINUTES=5
ADMIN_API_RATE_LIMIT_MAX=180
CONTACT_MIN_FILL_SECONDS=2
CONTACT_REMINDER_DAYS=7
CONTACT_REMINDER_INTERVAL_MINUTES=60
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-password"
ADMIN_SESSION_SECRET="change-this-session-secret"
```

## Install

```bash
npm install
```

## Database

Generate Prisma Client and create the SQLite database:

```bash
npm run db:migrate --workspace backend
npm run db:seed --workspace backend
```

For a quick local reset without creating migration files:

```bash
npm run db:push --workspace backend
npm run db:seed --workspace backend
```

## Development

Run the backend:

```bash
npm run dev:backend
```

Run the frontend in another terminal:

```bash
npm run dev:frontend
```

Open:

- Frontend: `http://localhost:3001`
- Backend health: `http://localhost:8080/api/health`
- Admin panel: `http://localhost:3001/admin`

Local admin login uses the values in `backend/.env`. For development you can use:

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="local-dev-only-password"
```

Change these before deploying.

## Production Build

```bash
npm run build
npm run start --workspace backend
npm run start --workspace frontend
```

## Docker

Create the production Compose environment file:

```bash
cp .env.example .env
```

Set the public hostname and secrets in `.env`. A custom domain is optional; for a Droplet
with public IP `165.232.45.167`, `sslip.io` can provide the hostname:

```env
SITE_HOST="165.232.45.167.sslip.io"
CORS_ORIGIN="https://165.232.45.167.sslip.io"
NEXT_PUBLIC_API_URL="https://165.232.45.167.sslip.io/api"
NEXT_PUBLIC_SITE_URL="https://165.232.45.167.sslip.io"
ADMIN_PASSWORD="<strong-random-password>"
ADMIN_SESSION_SECRET="<at-least-32-char-random-secret>"
```

Start the stack:

```bash
docker compose up -d --build
```

Caddy publishes ports `80` and `443`, obtains an HTTPS certificate, and routes `/api` to
the backend while routing all other requests to the frontend. The frontend and backend
ports are only exposed inside the Compose network. The backend container runs
`prisma db push`, seeds only when the database has no core content, and starts the API.
Existing content edited through the admin panel is not overwritten on restart. SQLite
data, uploaded project images, and Caddy certificates are stored in named Docker volumes.
Do not use `docker compose down -v` in production unless you intentionally want to delete
the SQLite database, uploaded images, and Caddy certificate volumes.

`SITE_HOST`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, and
`ADMIN_SESSION_SECRET` are required in Compose to prevent accidental production defaults.

## API Documentation

All responses use a standard envelope.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

Endpoints:

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Service health check |
| GET | `/api/profile` | Profile metadata |
| GET | `/api/projects` | Project list |
| GET | `/api/projects/:slug` | Project case study |
| GET | `/api/posts` | Published notes |
| GET | `/api/posts/:slug` | Note detail |
| GET | `/api/resume` | Resume data |
| POST | `/api/contact` | Validate and store contact form submission, then send an optional email notification |
| POST | `/api/admin/login` | Admin login, returns bearer token |
| GET | `/api/admin/me` | Validate current admin session |
| GET / PUT | `/api/admin/profile` | Read/update profile |
| GET / POST | `/api/admin/projects` | List/create projects |
| PUT / DELETE | `/api/admin/projects/:id` | Update/delete project |
| GET / POST | `/api/admin/posts` | List/create notes |
| PUT / DELETE | `/api/admin/posts/:id` | Update/delete note |
| GET | `/api/admin/contact-messages` | List contact messages |
| PATCH | `/api/admin/contact-messages/:id/handled` | Mark contact message as handled and archive it |
| DELETE | `/api/admin/contact-messages/:id` | Delete contact message |
| GET / PUT | `/api/admin/resume` | Read/update resume JSON |

Contact request body:

```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

Validation:

- `name` is required
- `email` must be valid
- `subject` is required
- `message` must be at least 10 characters

Email notification:

- Contact messages are always stored in the database first.
- Zero-cost mode: leave `CONTACT_NOTIFICATION_EMAIL` and `RESEND_API_KEY` empty to keep everything inside the admin panel without sending external email.
- If `CONTACT_NOTIFICATION_EMAIL` and `RESEND_API_KEY` are configured, the backend sends a notification email through Resend.
- `CONTACT_EMAIL_FROM` must be a Resend-allowed sender. The default `onboarding@resend.dev` is useful for local testing; production should use a verified domain sender.
- If the email provider fails, the contact request still succeeds after the message is saved, and the backend logs the email error.
- Admin users can mark a message as handled from `/admin`; this archives the message and stops reminders.
- Unhandled, unarchived messages trigger reminder emails after `CONTACT_REMINDER_DAYS` days. The backend checks this on `CONTACT_REMINDER_INTERVAL_MINUTES`.
- Contact and admin login endpoints are rate-limited by IP to reduce spam and brute-force attempts.
- Contact form submissions include a hidden honeypot field and minimum fill-time check to filter simple bots.
- Docker reads mail, reminder, and rate-limit env vars from the host environment with local development defaults.

Admin requests, except login, require:

```txt
Authorization: Bearer <token>
```

## Deployment Notes

- Deploy the frontend to Vercel or any Node-compatible Next.js host.
- Deploy the backend to Render, Fly.io, Railway, or a VPS.
- For a DigitalOcean Droplet, use the included Docker Compose and Caddy configuration.
- Open inbound TCP ports `80` and `443`, UDP port `443`, and restrict SSH port `22` to trusted IPs when possible.
- SQLite is fine for the MVP. For production contact data and admin editing, switch Prisma to PostgreSQL.
- Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
- Set `CORS_ORIGIN` to the deployed frontend URL.
- Replace `frontend/public/resume.pdf` with the final CV PDF when available.
