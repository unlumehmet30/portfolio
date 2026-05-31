# Content Management

The MVP uses Prisma seed data from `backend/src/data/content.ts`.
The admin panel at `/admin` edits the same Prisma-backed content through `/api/admin/*`.

For a lightweight JSON/Markdown content workflow, add source files here and adapt the seed script to parse them before writing to Prisma. The API surface can stay unchanged:

- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/posts`
- `GET /api/posts/:slug`

This keeps the frontend decoupled from the content storage mechanism and leaves room for a future admin panel.
