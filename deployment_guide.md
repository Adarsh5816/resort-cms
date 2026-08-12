# Step-by-Step Production Deployment Guide (100% FREE)

This guide shows how to deploy **Lexur Green Serviced Villa** (`www.lexurbooking.in`) for **₹0 (100% FREE)** using GitHub, Supabase, Render, Vercel, and your GoDaddy domain.

---

## 🛠️ Free Tech Stack Overview

| Layer | Recommended Provider | Cost | Why This Provider? |
|---|---|---|---|
| **Database** | **Supabase (PostgreSQL)** | **₹0 Free** | 500MB PostgreSQL database, SSL connection pooling, instant SQL runner. |
| **Backend API** | **Render.com** | **₹0 Free** | Free Node.js/Express web service tier, free SSL certificates. |
| **Frontend Web App** | **Vercel** or **Netlify** | **₹0 Free** | Free global CDN, automatic Vite deployment, free SSL for GoDaddy custom domains. |
| **Custom Domain** | **GoDaddy (`www.lexurbooking.in`)** | *Already Owned* | Map DNS records to Vercel/Render in 2 minutes. |

---

## STEP 1: Set Up Supabase Database (5 Minutes)

1. Go to [https://supabase.com](https://supabase.com) and sign up for a **Free Account**.
2. Click **New Project** and name it `lexur-green-db`. Set a strong database password.
3. Once the database is ready, click **SQL Editor** on the left menu.
4. Open the generated file [`supabase_migration.sql`](file:///c:/Users/jyoth/Downloads/Resort%20website/supabase_migration.sql) in your workspace, copy its contents, paste into the Supabase SQL Editor, and click **Run**.
   *This creates all 18 PostgreSQL tables and seeds Lexur Green Villa + Akash Valluvady admin credentials.*
5. Go to **Project Settings** $\rightarrow$ **Database** $\rightarrow$ Copy the **Connection String (URI)**.
   - Example: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`

---

## STEP 2: Push Your Code to GitHub

1. Create a free repository on [GitHub.com](https://github.com) named `lexur-green-resort-cms`.
2. Push your project code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Lexur Green Serviced Villa CMS"
   git remote add origin https://github.com/YOUR_USERNAME/lexur-green-resort-cms.git
   git push -u origin main
   ```

---

## STEP 3: Deploy Backend API to Render (Free)

1. Go to [https://render.com](https://render.com) and sign up for a **Free Account**.
2. Click **New +** $\rightarrow$ **Web Service** $\rightarrow$ Connect your `lexur-green-resort-cms` GitHub repository.
3. Settings:
   - **Name**: `lexur-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `DATABASE_URL`: *(Paste your Supabase Connection String from Step 1)*
   - `JWT_SECRET`: `lexur-green-super-secret-key-2026`
   - `NODE_ENV`: `production`
5. Click **Create Web Service**. Render will deploy your Express backend and provide a free URL, e.g.:
   `https://lexur-api.onrender.com`

---

## STEP 4: Deploy Frontend & Connect GoDaddy Domain on Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** $\rightarrow$ **Project** $\rightarrow$ Import `lexur-green-resort-cms`.
3. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://lexur-api.onrender.com` (Your Render API URL from Step 3)
5. Click **Deploy**. Vercel will build your React website in ~45 seconds.

---

## STEP 5: Map Your GoDaddy Domain (`www.lexurbooking.in`)

1. In your **Vercel Dashboard**, go to **Settings** $\rightarrow$ **Domains** $\rightarrow$ Add `www.lexurbooking.in` and `lexurbooking.in`.
2. Vercel will show the exact DNS records needed for GoDaddy:
   - **CNAME Record**: Name `www` $\rightarrow$ Value `cname.vercel-dns.com`
   - **A Record**: Name `@` $\rightarrow$ Value `76.76.21.21`
3. Log in to your **GoDaddy Account** $\rightarrow$ **My Products** $\rightarrow$ **DNS Management** for `lexurbooking.in`.
4. Add/Update the CNAME and A records matching Vercel.
5. Within 5–10 minutes, Vercel will automatically issue a **Free SSL HTTPS Certificate**!

Your real website for **Lexur Green Serviced Villa** will be live on **https://www.lexurbooking.in** at **₹0 cost**!
