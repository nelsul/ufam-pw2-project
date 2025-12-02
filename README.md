# Icomp Store - PW2 Project

Full‑stack app for the PW2 course at UFAM, using:
- **Frontend:** Next.js (React)
- **Backend:** Express + TypeScript
- **Database:** MySQL (with Prisma)

The goal is to have a simple shop‑style API + UI.

---

## Setup

You need Docker installed.

1. Copy env defaults:
   ```bash
   cp .env.example .env
   cp ./backend/.env.example ./backend/.env
   ```
2. Make sure `backend/.env` exists and matches what `compose.yml` expects (DB credentials, ports, etc.).

If in doubt, open `compose.yml` and check which variables it references.

---

## Option 1: Dev Containers (VS Code)

Best option if you use VS Code and don’t want to install Node/npm locally.

1. Open this folder in VS Code.
2. When VS Code asks "Reopen in Container", accept it.
   - Or run **Dev Containers: Reopen in Container** from the Command Palette.
3. Wait for the container build (first time is slow, grab coffee).
4. Inside the container, use the integrated terminal to run scripts (backend, frontend, prisma, etc.).

### Inside Dev Container: commands to run

Backend setup + migrations + seed:

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm start dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## Option 2: Docker Compose (local dev)

First, run `npm install` in `/backend` and `/frontend`

then, from the project root:

```bash
docker compose up --build
```

With everything up, open a shell in the backend container to run migrations and seed the database:

```bash
docker compose exec backend-dev npx prisma migrate deploy
docker compose exec backend-dev npx prisma db seed
```

What you get:
- Frontend: `http://localhost:3000` (or whatever `.env` says)
- Backend: `http://localhost:7788`
- Backend Swagger: `http://localhost:7788/api-docs`
- phpMyAdmin: `http://localhost:8282` 

To stop everything:

```bash
docker compose down
```

---

## Option 3: Standalone Docker (prod‑ish)

Build and run the images manually, using the `production` target in each Dockerfile. Useful for testing closer to a real deployment.

### Backend

Build:
```bash
docker build --target production -t ufam-pw2-backend ./backend
```

Run:
```bash
docker run -d \
  -p 7788:7788 \
  --env-file ./backend/.env \
  --name backend-prod \
  ufam-pw2-backend
```

After the container is running, apply migrations and seed:

```bash
docker exec -it backend-prod pnpm prisma migrate deploy
docker exec -it backend-prod pnpm prisma db seed
```

### Frontend

Build:
```bash
docker build --target production -t ufam-pw2-frontend ./frontend
```

Run:
```bash
docker run -d \
  -p 3000:3000 \
  -e BACKEND_URL=http://localhost:7788 \
  --name frontend-prod \
  ufam-pw2-frontend
```

---

## Where to look in the code

- `backend/src/resources/*` – Express routes/controllers (auth, product, purchase, user, etc.).
- `backend/prisma/schema.prisma` – DB schema (products, purchases, users…).
- `frontend/src/app` – Next.js app routes and pages.
- `frontend/src/components` – Reusable UI pieces.