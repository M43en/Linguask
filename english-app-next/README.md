# English App (Next.js + Prisma) – MVP

## Quick Start
1. **Install**: `npm install`
2. **Env**: `cp .env.example .env.local` and set `NEXTAUTH_SECRET`
3. **Prisma**: `npx prisma generate && npx prisma migrate dev --name init`
4. **Seed** (open Prisma Studio): `npx prisma studio`
   - Create a **User** with `email`, `name`, `passwordHash` (use bcrypt), `role` (STUDENT or MODERATOR).
   - Optional: create a few **Task** rows and one or two **Gift** rows.
5. **Run**: `npm run dev`, open http://localhost:3000

### Test Flow
- Sign in with your seeded user.
- Go to **Tasks**, choose a task → it creates an **Assignment**.
- Go to **Submissions**, paste text payload → **Submission** created (PENDING).
- As a **MODERATOR** (sign in with a moderator account), `POST /api/review` (use e.g. REST client) with json:
  ```json
  { "submissionId": "<id>", "status": "APPROVED", "reviewNotes": "Nice work" }
  ```
- Approval grants **points** and updates the **streak**.
- Go to **Gifts** and redeem if you have enough points.

### Notes
- Database is SQLite for speed; switch `DATABASE_URL` to Postgres for production.
- Files and audio uploads are not included in MVP (use text/link payloads).
- Streak timezone is set to Dubai in schema; DST not applied.

## Roadmap
- Add moderator UI for reviewing submissions (now via API).
- Add file/audio upload, richer task rubric, notifications.
- Harden auth flows and add rate limits.
