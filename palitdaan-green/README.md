# 🌿 PalitDaan Green

> **Eco-Friendly Campus Canteen Online Pre-Ordering System**  
> CIT-U University — Software Project Development | AY 2026–2027

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Supabase Ready](https://img.shields.io/badge/Supabase-Ready-3ECF8E?logo=supabase)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Problem Statement

Long canteen queues during peak hours waste students' limited break time. PalitDaan Green solves this by letting students and faculty **pre-order meals online**, reducing wait time and enabling the canteen admin to prepare orders in advance.

---

## 👥 Target Users

| User | Role |
|------|------|
| **Students / Faculty** | Browse menu, pre-order meals, track order status, manage profile |
| **Canteen Admin** | Tag order statuses, manage inventory, toggle sold-out items |

---

## ✨ Features

### Student / Faculty Portal
- 🔐 **Registration & Login** — Secure account creation with ID number and institutional email
- 🍽️ **Menu Browsing** — Browse food items with categories, prices, and availability
- 🛒 **Cart & Special Instructions** — Add items, specify allergens and custom notes per dish
- 📋 **Pending Orders** — Track live order status (Pending → Being Prepared → Ready → Completed)
- 📜 **Order History** — View past completed orders
- 👤 **Profile Settings** — Edit personal info; shows enrollment status and registration date

### Admin Portal (`/admin`)
- 🏷️ **Order Status Tagging** — Tag orders as: Paid, Being Prepared, Ready for Pickup, Completed, Cancelled
- 📦 **Inventory Management** — Adjust stock levels (+/−) per menu item
- ⛔ **Sold-Out Control** — Toggle items as Sold Out; reflected immediately on student menu
- ☁️ **Supabase Integration Panel** — Setup guide for connecting to live cloud database

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Routing | React Router DOM v6 |
| Styling | Custom CSS (green theme, mobile-first) |
| Storage | localStorage (offline) + Supabase REST API (cloud) |
| Backend (future) | Supabase (PostgreSQL + Auth + Storage) |
| Build | Vite (Termux/Android compatible) |

---

## 👨‍💻 Team

| Name | Role |
|------|------|
| _(your name)_ | Project Lead / Frontend |
| _(member 2)_ | UI/UX / Components |
| _(member 3)_ | Database Layer / Supabase |
| _(member 4)_ | Admin Dashboard / Testing |

> See [`docs/team-roles.md`](docs/team-roles.md) for detailed responsibilities.

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js 18+ (or Termux with Node)
- npm / pnpm

### 1. Clone the repository
```bash
git clone https://github.com/<your-team>/palitdaan-green.git
cd palitdaan-green
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment (optional — for Supabase)
```bash
cp .env.example .env
# Edit .env with your Supabase project URL and anon key
```

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
npm run preview
```

### Running on Termux (Android)
See [`TERMUX_GUIDE.md`](TERMUX_GUIDE.md) for the full Termux setup guide.

---

## 🔐 Default Accounts (Demo / Dev)

| Role | ID / Email | Password |
|------|-----------|---------|
| Student | `21-1234-567` | `password123` |
| Admin | `admin@cit.edu.ph` | `admin123` |

> ⚠️ Change these before any public deployment.

---

## ☁️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run [`SUPABASE_SETUP.sql`](SUPABASE_SETUP.sql) in the SQL Editor
3. Add your keys to `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. The app auto-switches from localStorage to Supabase when keys are set.

---

## 📂 Project Structure

```
palitdaan-green/
├── docs/                   # Project documentation
│   ├── requirements.md     # Epics, features, user stories
│   ├── architecture.md     # System design & data flow
│   └── team-roles.md       # Member roles & responsibilities
├── src/
│   ├── components/         # Reusable UI components (Navbar, Sidebar, FoodCard)
│   ├── css/                # Per-page CSS stylesheets
│   ├── data/               # Static menu data (foods.js)
│   ├── layouts/            # App shell (PalitDaan.jsx, MainContent.jsx)
│   ├── pages/              # Route-level page components
│   └── services/           # db.js (data layer) + supabaseClient.js
├── tests/                  # Unit and integration tests (planned)
├── .env.example            # Environment variable template
├── CONTRIBUTING.md         # Branching and commit conventions
├── SUPABASE_SETUP.sql      # DB schema for Supabase
└── TERMUX_GUIDE.md         # Termux/Android setup guide
```

---

## 🔗 Project Board

> [Trello Board](#) · [GitHub Issues](#) · [Sprint Plan](#)  
> _(Replace # with your actual links)_

---

## 📄 License

MIT © 2026 PalitDaan Green Team — CIT-U
