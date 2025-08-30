# Product Requirements Document — MERN Note-taking App (Auth: Email+OTP & Google)

---

## 1 — Overview

**Goal:** Build a mobile-first note-taking web app matching the provided design assets. Users sign up via Email+OTP or Google OAuth, then create/delete notes. JWT protects note APIs. Deliverables include repo with commits per feature, README, automated CI, and cloud-deployed app.

**Target users:** Personal users wanting quick notes on phone/desktop.

**Tech stack**

* Frontend: React (TypeScript), Vite, TailwindCSS, react-router, react-hook-form, zod
* Backend: Node.js (TypeScript), Express
* DB: MongoDB (Atlas)
* Auth: JWT (HS256), Google OAuth 2.0, Email OTP via Nodemailer (dev fallback: console)
* Version control & automation: Git + GitHub (Issues, Actions), deployment to Vercel (frontend) + Render / Railway (backend) or both on Vercel/Render

---

## 2 — Core Features (scope)

1. Signup with email + OTP flow (send code, verify, create account).
2. Signup / Login with Google OAuth.
3. Input validation & friendly error messages.
4. Welcome page showing user info (name, email, picture).
5. Create and delete notes (each note: title, body).
6. JWT authorizes create/delete; tokens used in `Authorization: Bearer <token>` header.
7. Mobile-first responsive UI replicating provided design assets.
8. Commit after each feature; README with build & deploy instructions.

---

## 3 — User stories & acceptance criteria

### US-1 Sign up - Email + OTP

* **As a** user, **I want** to sign up with my email and an OTP so I can create an account without a password.
* **Acceptance**

  * User enters email and requests OTP. Backend sends OTP (6-digit) with expiry (5–10 min).
  * On valid OTP, user account created (if not exists), JWT returned and persisted in localStorage.
  * On invalid/expired OTP, meaningful error shown.

### US-2 Sign up / Login - Google

* **As a** user, **I want** to sign up/login with Google.
* **Acceptance**

  * Clicking Google Sign-In triggers proper OAuth flow and returns a JWT from backend.
  * If Google user not in DB, create user with provider = `GOOGLE` and store `sub` from Google for future logins.

### US-3 Create Note

* **As a** user, **I want** to create a note (title + body).
* **Acceptance**

  * POST `/api/notes` requires valid JWT; on success returns note object with `id`, `createdAt`.
  * UI updates and shows the note.

### US-4 Delete Note

* **As a** user, **I want** to delete my note.
* **Acceptance**

  * DELETE `/api/notes/:id` requires valid JWT and ownership check; returns 204 on success.
  * UI deletes locally and shows empty-state illustration if no notes.

### US-5 Validation & Error Display

* **Acceptance**

  * All client inputs validated (email format, non-empty title).
  * API errors shown in a user-friendly banner/snackbar.

### US-6 Mobile-first design & assets

* **Acceptance**

  * UI matches design assets (use provided images).
  * Components responsive down to 360px width.

---

## 4 — Data model (MongoDB)

**Collections**

### users

```json
{
  "_id": ObjectId,
  "email": string,
  "name": string | null,
  "picture": string | null,
  "provider": "EMAIL" | "GOOGLE",
  "googleSub": string | null,
  "createdAt": Date
}
```

### otps

```json
{
  "_id": ObjectId,
  "email": string,
  "code": string,           // hashed or plain for dev
  "purpose": "signup" | "login",
  "expiresAt": Date,
  "consumed": boolean
}
```

### notes

```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "title": string,
  "body": string,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 5 — API Spec (Express)

Base: `POST /api/auth/*`, `GET/POST /api/notes/*`

### Auth

* `POST /api/auth/otp/request`

  * Body: `{ "email": "user@example.com", "purpose": "signup"|"login" }`
  * Resp: `200 { message: "otp_sent" }`
* `POST /api/auth/otp/verify`

  * Body: `{ "email": "...", "code": "123456", "purpose": "signup"|"login", "name"?: string }`
  * Resp success: `200 { token: "<jwt>", user: { id, email, name, picture } }`
* `POST /api/auth/google`

  * Body: `{ "idToken": "<google-id-token>" }`
  * Flow: verify idToken server-side with Google, create/find user, return JWT.
  * Resp: `200 { token, user }`

### Notes

* `GET /api/notes` — headers: `Authorization: Bearer <token>` -> list notes
* `POST /api/notes` — body: `{ title, body }` -> create note (returns full note)
* `DELETE /api/notes/:id` — requires JWT, confirms ownership -> 204

### Errors

* Always return consistent shape:

```json
{ "error": true, "message": "Human readable message", "code": "OTP_EXPIRED" }
```

---

## 6 — Security & Auth behavior

* JWT signed with `JWT_SECRET` (HS256). Expiry: 7d for main token, refresh optional.
* OTP: 6 digits, expires in 5 minutes, `consumed` flag.
* Rate limit OTP requests per IP/email (e.g. 5 per hour).
* On Google login, store `googleSub` field (unique). Restrict `login with google` behavior to matching user when required.

---

## 7 — Frontend routes & components

### Routes

* `/` — Landing / Login screen with Email OTP form & Google sign-in button.
* `/verify-otp` — OTP entry
* `/welcome` — After auth; shows user info and notes list
* `/notes/new` — Create note form (could be a modal)
* 404 page

### Key components

* `Auth/EmailOtpForm`
* `Auth/OtpVerifyForm`
* `Auth/GoogleSignInButton`
* `Layout/Header` (shows user avatar + logout)
* `Notes/NotesList` (empty state uses provided illustration)
* `Notes/NoteCard`
* `Notes/NewNoteModal`
* `Toasts/ErrorBanner`

### Client-side state

* Use React context `AuthContext` storing `{ user, token, setUser, logout }`.
* Persist JWT in `localStorage` or secure cookie (for simplicity use localStorage with https in prod).

---

## 8 — Validation rules

* Email: standard email regex; zod schema on front & backend.
* OTP: 6 digits numeric.
* Note title: required, max 120 chars.
* Note body: optional, max 2000 chars.

---

## 9 — Developer workflow & GitHub AutoAgent mode

### Branching & commits

* `main` — production
* `develop` — integration
* Feature branches: `feat/<short-desc>`, bugfix `fix/<desc>`
* Commit messages: Conventional Commits

  * `feat(auth): add email otp request endpoint`
  * `fix(notes): ownership check for delete`
* Each feature must have at least one commit and link to the corresponding issue.

### Issues & PRs

* Create issues for each user story (US-1, US-2...). Use labels: `feature`, `bug`, `chore`, `qa`.
* PR Template (place in `.github/PULL_REQUEST_TEMPLATE.md`) — include testing steps and acceptance checklist.

### GitHub Actions (CI)

Create workflows:

* `ci.yml` — run on PR to `develop`/`main`

  * Steps: checkout, node setup, install, lint, build (frontend & backend), run tests, report
* `deploy-frontend.yml` — on merge to `main` build & deploy to Vercel (or run `vercel` CLI)
* `deploy-backend.yml` — on merge to `main` build docker image & deploy to Render/Railway (or push to DockerHub)

Add branch protection requiring:

* Passing `ci.yml` checks
* PR reviews (1 approval)
* Signed commits optional

### AutoAgent usage guidance

If you want a GitHub automation (AutoAgent / bot) to complete tasks automatically, prepare:

1. **Issue Templates**: each issue should include:

   * `title`, `type` (`feature`), `acceptance_criteria`, `design_refs` (link to images), `priority`, `branch_name_suggestion`.
2. **GitHub Action to respond to `auto/*` label**

   * Workflow listens to `issues` with label `auto/assign` and uses `actions/github-script` or a custom bot to:

     * Create feature branch `feat/<issue-number>-<slug>`
     * Create stub file/skeleton for feature (example scaffold code or TODO)
     * Open PR from branch to `develop` with body containing the issue and checklist
   * Example: add `.github/workflows/autoagent.yml` that runs when `issue_label` `auto/assign` is added (see template below).
3. **Provide a small CLI script or GitHub Action** that can run unit tests and create commits — this is what an AutoAgent triggers.
4. **Secrets**: set `GITHUB_TOKEN` (provided automatically), plus any PAT if needed.

> Note: GitHub's product names/AutoAgent capabilities evolve — treat the above as an automation pattern that any AutoAgent can use: "issue → create branch → create PR → run CI". If you use a specific AutoAgent (e.g., GitHub Copilot for PR generation or other bots), plug the same webhooks / labels into its required format.

---

## 10 — Repo files to include (skeleton)

```
/frontend
  /src
    /components
    /pages
    /lib/api.ts
    /lib/auth.ts
    main.tsx
  vite.config.ts
  package.json
/backend
  /src
    /controllers
    /routes
    /models
    /middleware/auth.ts
    server.ts
  package.json
/docker-compose.yml (optional)
README.md
/docs/PRD.md (this file)
.github/workflows/ci.yml
.github/workflows/deploy-frontend.yml
.github/pull_request_template.md
.github/ISSUE_TEMPLATE/feature.md
```

---

## 11 — Environment variables (sample `.env.example`)

**Backend**

```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/notesapp?retryWrites=true&w=majority
JWT_SECRET=some_long_random_secret
JWT_EXPIRY=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=https://your-frontend.example.com
```

**Frontend (env)**

```
VITE_API_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=...
```

---

## 12 — README skeleton (what to include)

* Project overview
* Local setup (install, env variables)
* Run backend: `cd backend && npm install && npm run dev`
* Run frontend: `cd frontend && npm install && npm run dev`
* How to test OTP (dev console)
* How to set Google OAuth (redirect URI)
* Deploy instructions (Vercel/Render)
* Contributor / commit conventions

---

## 13 — Acceptance tests / QA checklist

* [ ] Signup via email OTP works, receives code, verify creates account & signs in
* [ ] Login via Google creates/returns user
* [ ] Create note API enforces JWT and creates note
* [ ] Delete note API requires ownership & returns 204
* [ ] Form validation shows errors for bad input
* [ ] Mobile layout matches mockups (pixel checks)
* [ ] JWT expiry behaves as expected
* [ ] Rate limiting applied for OTP route

---

## 14 — GitHub Actions templates (examples)

### `.github/workflows/ci.yml` (short)

```yaml
name: CI
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [frontend, backend]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install & Test ${{ matrix.service }}
        run: |
          if [ "${{ matrix.service }}" = "frontend" ]; then
            cd frontend
            npm ci
            npm run lint
            npm run build --if-present
            npm test --if-present
          else
            cd backend
            npm ci
            npm run lint
            npm test --if-present
          fi
```

### `.github/workflows/autoagent.yml` (trigger idea)

```yaml
name: AutoAgent Bootstrap
on:
  issues:
    types: [labeled]
jobs:
  bootstrap:
    if: contains(github.event.issue.labels.*.name, 'auto/assign')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create branch & PR
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "chore: start work on issue #${{ github.event.issue.number }}"
          branch: "feat/issue-${{ github.event.issue.number }}"
          title: "WIP: Issue #${{ github.event.issue.number }} - ${{ github.event.issue.title }}"
          body: |
            Automated PR scaffold created for issue #${{ github.event.issue.number }}.
```

---

## 15 — Deployment notes

* **Frontend**: deploy to Vercel (set env vars VITE_API_URL, VITE_GOOGLE_CLIENT_ID). Vercel can connect to GitHub and auto-deploy on `main`.
* **Backend**: deploy to Render or Railway (connect to GitHub repo). Provide env vars in service settings. Use persistent MongoDB Atlas.
* **Domain / SSL**: use provider-managed certs (Vercel/Render include this).

---

## 16 — Testing & monitoring

* Unit tests for backend controllers and middleware (Jest + supertest).
* Frontend component tests (Vitest / React Testing Library).
* Basic uptime monitoring (UptimeRobot), and Sentry for errors (optional).

---

## 17 — Checklist to hand over to GitHub AutoAgent

Include these files/entries before enabling heavy automation:

1. `/docs/PRD.md` (this doc)
2. `.github/ISSUE_TEMPLATE/feature.md` — with required fields (design links, priority)
3. `.github/labels.yml` — labels `feature`, `bug`, `auto/assign`, `help wanted`
4. `.github/workflows/ci.yml` and `.github/workflows/autoagent.yml`
5. `README.md` with local dev steps
6. Ensure `GITHUB_TOKEN` available to workflows. Add any service tokens as GitHub secrets.

**Suggested AutoAgent prompt for automated feature scaffolding** (put in the workflow or the external agent system):

> "When an issue is labeled `auto/assign`, create a branch named `feat/issue-<number>-<slug>`. Add a placeholder component file and route for the feature in frontend and a skeleton controller and route in backend. Create a WIP PR linking the issue and include an acceptance checklist from the issue into the PR body."

---

## 18 — Timeline / Milestones (for automation to schedule)

* Day 0: Repo scaffold, CI, issue templates, PR templates.
* Day 1: Implement auth backend (OTP endpoints + JWT) + unit tests; commit.
* Day 2: Implement Google OAuth + frontend auth screens + OTP UI; commit.
* Day 3: Notes CRUD endpoints + frontend notes UI; mobile polish + deploy.

(You asked for 3 days in original brief — this schedule aligns with that. If using AutoAgent, it can provision and open PRs for each milestone; human review recommended.)

---

## 19 — Example issue checklist (use in issue body)

```
- [ ] API: OTP request endpoint implemented
- [ ] API: OTP verify + sign up implemented
- [ ] Frontend: Email form + request OTP
- [ ] Frontend: Verify OTP screen
- [ ] End-to-end manual test
- [ ] Unit tests (backend)
- [ ] Commit(s) with message: feat(auth): otp request/verify
```

---

## 20 — Final notes & delivery

* Add this PRD to `/docs/PRD.md` in repo root.
* Use provided asset zip link to populate `frontend/public/images` and `frontend/src/assets`. (You already gave the link — download and commit images early.)
* Enable branch protection and set CI checks required so AutoAgent PRs are validated before merging.
* When ready, give me the repo link and I can produce the exact issue templates, PR template, and the ready-to-paste GitHub Actions YAMLs or a checklist of commands to run — or, if you want, I can output the exact files you should add to the repo now (code + YAML + templates). Tell me which files you want generated next and I’ll output them.

---

If you want, I can now:

* generate the exact `.github/` templates + `ci.yml` + `autoagent.yml`, **and** ready-to-paste skeleton code files (backend `server.ts`, auth controllers, frontend `Auth` pages) — or
* produce a one-click list of commands to scaffold the repo locally with `npm` commands and `git` steps.
