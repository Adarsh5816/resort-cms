# Step-by-Step Production Deployment Guide (100% FREE)

This guide shows how to deploy **Lexur Green Serviced Villa** (`www.lexurbooking.in`) for **₹0 (100% FREE)** using GitHub, Supabase, Render, **Cloudflare Pages**, and your GoDaddy domain.

---

## 🛠️ Free Tech Stack Overview

| Layer | Recommended Provider | Cost | Why This Provider? |
|---|---|---|---|
| **Database** | **Supabase (PostgreSQL)** | **₹0 Free** | 500MB PostgreSQL database, SSL connection pooling, instant SQL runner. |
| **Backend API** | **Render.com** | **₹0 Free** | Free Node.js/Express web service tier, free SSL certificates. |
| **Frontend Web App** | **Cloudflare Pages** | **₹0 Free** | **Unlimited Bandwidth**, ultra-fast Global Edge CDN, free SSL HTTPS for custom domains. |
| **Custom Domain** | **GoDaddy (`www.lexurbooking.in`)** | *Already Owned* | Map CNAME to Cloudflare Pages in 2 minutes. |

---

## STEP 1: Set Up Supabase Database (5 Minutes)

1. Go to [https://supabase.com](https://supabase.com) and sign up for a **Free Account**.
2. Click **New Project** and name it `lexur-green-db`. Set a strong database password.
3. Once the database is ready, click **SQL Editor** on the left menu.
4. Open the file [`supabase_migration.sql`](file:///c:/Users/jyoth/Downloads/Resort%20website/supabase_migration.sql), copy its contents, paste into the Supabase SQL Editor, and click **Run**.
   *This creates all 18 PostgreSQL tables and seeds Lexur Green Villa + Akash Valluvady admin credentials.*
5. Go to **Project Settings** $\rightarrow$ **Database** $\rightarrow$ Copy the **Connection String (URI)**.
   - Example: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`

---

## STEP 2: Push Your Code to GitHub

1. Create a free repository on [GitHub.com](https://github.com) named `resort-cms`.
2. Push your project code:
   ```bash
   git remote add origin https://github.com/Adarsh5816/resort-cms.git
   git branch -M main
   git push -u origin main
   ```

---

## STEP 3: Deploy Backend API to Render (Free)

1. Go to [https://render.com](https://render.com) and sign up for a **Free Account**.
2. Click **New +** $\rightarrow$ **Web Service** $\rightarrow$ Connect your `Adarsh5816/resort-cms` GitHub repository.
3. Settings:
   - **Name**: `resort-cms-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `DATABASE_URL`: *(Paste your Supabase Connection String from Step 1)*
   - `JWT_SECRET`: `resort-cms-super-secret-key-2026`
   - `NODE_ENV`: `production`
5. Click **Create Web Service**. Render will deploy your Express backend and provide a free URL, e.g.:
   `https://resort-cms-api.onrender.com`

---

## STEP 4: Deploy Frontend to Cloudflare Pages (100% Free & Unlimited)

1. Log in to [https://dash.cloudflare.com](https://dash.cloudflare.com) (or sign up for a free account).
2. On the left menu, click **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** tab.
3. Click **Connect to Git** and select your GitHub repository: `Adarsh5816/resort-cms`.
4. Configure Build Settings:
   - **Project Name**: `lexur-green-cms`
   - **Production Branch**: `main`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
5. Add **Environment Variable**:
   - `VITE_API_URL`: `https://resort-cms-api.onrender.com` *(Your Render API URL from Step 3)*
6. Click **Save and Deploy**. Cloudflare Pages will build your frontend and assign a free URL, e.g.:
   `lexur-green-cms.pages.dev`

---

## STEP 5: Map Your GoDaddy Domain (`www.lexurbooking.in`) to Cloudflare Pages

1. In the Cloudflare Pages project dashboard for `lexur-green-cms`, click **Custom Domains** tab.
2. Click **Set up a Custom Domain** $\rightarrow$ Enter `www.lexurbooking.in` (and `lexurbooking.in`).
3. Cloudflare will display the DNS CNAME record:
   - **CNAME Record**: Name `www` $\rightarrow$ Target `lexur-green-cms.pages.dev`
4. Log in to your **GoDaddy Account** $\rightarrow$ **My Products** $\rightarrow$ **DNS Management** for `lexurbooking.in`.
5. Add the **CNAME Record**:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value / Target**: `lexur-green-cms.pages.dev`
   - **TTL**: `1 Hour` (or Default)
6. Cloudflare Pages will verify the domain and automatically issue a **Free SSL Certificate (HTTPS)**!

Your website for **Lexur Green Serviced Villa** will now be live on **https://www.lexurbooking.in** with ultra-fast Cloudflare Pages CDN hosting at **₹0 cost**!
