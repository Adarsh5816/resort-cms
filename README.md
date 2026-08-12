# Multi-Tenant Resort Website CMS Platform

A production-ready, multi-tenant Resort Website CMS platform built with **Node.js**, **Express**, **TypeScript**, **React**, **Vite**, and **Tailwind CSS**.

The platform allows platform owners (Super Admins) to create independent resort websites and empowers resort managers (Resort Admins) to manage content, rooms, prices, amenities, photo galleries, experiences, attractions, restaurant items, testimonials, homepage section ordering, visual themes, and guest booking enquiries.

---

## 🌟 Key Features

1. **Multi-Tenant Architecture**: Complete database-level & API-level isolation. Resort A can never read or write Resort B's data.
2. **Dynamic Visual Themes Engine**:
   - **Theme 1 — Luxury Modern Dark**: Full-screen dark hero, Playfair serif typography, gold accents, glassmorphic floating navigation.
   - **Theme 2 — Kerala Nature Warm**: Terracotta and emerald green color palette, warm sand background, traditional arch accents, storytelling layout.
   - **Theme 3 — Modern Clean Hotel**: Bright modern UI, royal blue & slate theme, compact card room grid, sticky search header.
3. **Homepage Section Builder**: Admins can enable, disable, and dynamically reorder sections (`Hero`, `About`, `Rooms`, `Amenities`, `Experiences`, `Gallery`, `Restaurant`, `Testimonials`, `Contact`).
4. **Restaurant Toggle**: Enabling/disabling the restaurant section instantly updates the public site.
5. **WhatsApp CTA Generator**: Automatically generates room-specific pre-filled booking inquiry messages.
6. **SaaS Admin Dashboard**: Modern dark-themed dashboard with live website preview modal, image drop/uploader, room pricing controls, and enquiry inbox.
7. **Instant Local Switcher Bar**: Top floating bar on the public site allowing 1-click switching between Resort A, Resort B, and Resort C.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
Run from the root directory:
```bash
npm --prefix server install
npm --prefix client install
```

### 2. Seed Database & Start Backend Server
In terminal 1:
```bash
cd server
npm run dev
```
The server will initialize the SQLite database (`server/data/resort_cms.sqlite`) and seed 3 full demo resorts automatically.

### 3. Start Frontend App
In terminal 2:
```bash
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Assigned Resort / Scope |
|---|---|---|---|
| **Super Admin** | `admin@platform.com` | `admin123` | Platform Owner (All Resorts) |
| **Resort A Admin** | `admin@grandroyal.com` | `resort123` | Grand Royal Luxury Haven (`luxury-dark`) |
| **Resort B Admin** | `admin@keralaspice.com` | `resort123` | Pepper County Heritage (`kerala-nature`) |
| **Resort C Admin** | `admin@metrostar.com` | `resort123` | MetroStar City & Beach (`modern-hotel`) |

---

## 🧪 Acceptance Verification Tests

1. **TEST 1, 2 & 8**: Open `http://localhost:5173` and click through **Grand Royal**, **Pepper County**, and **MetroStar** on the top demo bar. Observe 3 completely distinct visual themes and layouts.
2. **TEST 3 (Price Sync)**: Log in as Resort A admin (`admin@grandroyal.com`), change Presidential Villa price to `₹15,000`, refresh public site, and verify immediate update.
3. **TEST 4 (Image Upload)**: Upload a room image in Admin, refresh public site, and verify image rendering.
4. **TEST 5 (Tenant Isolation Security)**: Log in as Resort A admin and attempt to mutate Resort B data through API (`HTTP 403 Forbidden` enforced).
5. **TEST 6 (Theme Switching)**: Go to Admin -> Website & Themes -> Swap theme to `modern-hotel`. Refresh public site to see instant structural re-theme without losing content.
6. **TEST 7 (Restaurant Toggle)**: Go to Admin -> Restaurant -> Toggle Restaurant to **DISABLED**. Notice the restaurant section disappears from the public site.

---

## 📁 Directory Structure

```
├── server/                   # Express + TypeScript Backend
│   ├── src/
│   │   ├── db/               # SQLite/Postgres Schema & Seeder
│   │   ├── middleware/       # Auth JWT & Tenant Isolation
│   │   ├── routes/           # RESTful APIs (Public & Admin)
│   │   └── app.ts            # Entrypoint
├── client/                   # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── admin/            # SaaS CMS Admin Dashboard
│   │   ├── public/
│   │   │   ├── themes/       # 3 Visual Themes (Luxury, Kerala, Modern)
│   │   │   ├── components/   # SectionRenderer, WhatsAppCTA, EnquiryModal
│   │   ├── context/          # Auth & Tenant Contexts
│   │   └── App.tsx           # Router
```
