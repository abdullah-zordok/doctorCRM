# Vercel Deployment Guide (Frontend & Backend)

This project is fully configured for deployment on Vercel using the monorepo architecture.

---

## 1. Prerequisites (Free Database Setup with Turso)
Because Vercel serverless functions have a read-only ephemeral filesystem, we use **Turso** (Free SQLite in the cloud):
1. Go to [turso.tech](https://turso.tech) and create a free account.
2. Create a new database:
   ```bash
   turso db create doctor-crm
   ```
3. Get the database URL and token:
   ```bash
   turso db show doctor-crm --url
   turso db tokens create doctor-crm
   ```

---

## 2. Deploy Backend on Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository: `abdullah-zordok/doctorCRM`.
3. In **Project Configuration**:
   - **Project Name**: `doctor-crm-api` (or your choice).
   - **Root Directory**: Click "Edit" and select `backend`.
4. In **Environment Variables**, add:
   - `TURSO_DATABASE_URL`: Your `libsql://...` URL from Turso.
   - `TURSO_AUTH_TOKEN`: Your auth token from Turso.
   - `JWT_SECRET`: A secure random secret string (at least 16 characters).
   - `JWT_EXPIRES_IN`: `7d`
5. Click **Deploy**.
6. Once deployed, note your backend URL (e.g. `https://doctor-crm-api.vercel.app`).

---

## 3. Deploy Frontend on Vercel
1. In the Vercel Dashboard, click **Add New...** -> **Project**.
2. Select the same repository: `abdullah-zordok/doctorCRM`.
3. In **Project Configuration**:
   - **Project Name**: `doctor-crm-frontend`.
   - **Root Directory**: Click "Edit" and select `frontend`.
   - Framework preset: **Vite** (auto-detected).
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://doctor-crm-api.vercel.app/api` (your backend URL from step 2).
5. Click **Deploy**.

---

## 4. Automatic CI/CD
A GitHub Action pipeline is configured at `.github/workflows/ci-cd.yml`.
On every `push` to `main` or Pull Request, it automatically runs:
* Backend TypeScript typecheck, ESLint, SQLite schema push, seed validation, and test suite.
* Frontend TypeScript typecheck, ESLint, and production Vite build.
