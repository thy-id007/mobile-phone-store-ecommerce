# NEXUS PHONES — Mobile Phone Store E-Commerce System

An academic-grade, responsive, full-stack E-Commerce web platform dedicated to mobile phones, designed for university final capstone project submission.

---

## 📱 Technology Stack

- **Frontend**: React (SPA with Vite), React Router v6, Lucide Icons, Context API (Auth, Cart, Compare), Modular Vanilla CSS Design System.
- **Backend**: Node.js, Express.js REST API (3-tier layered architecture: Routes $\to$ Controllers $\to$ Models/Services $\to$ DB), JWT Authentication & Role-Based Authorization (RBAC).
- **Database**: PostgreSQL (Normalized 3NF relational schema with base phones, dynamic color/storage variants, hardware specifications, transactional cart, and order placement).

```
React Frontend (Port 5173)
        │
        ▼ HTTPS / JSON (REST API)
Node.js Express Backend (Port 5000)
        │
        ▼ SQL Queries (pg pool)
PostgreSQL Database (Port 5432)
```

---

## 🌟 Key Features

### Customer Portal
1. **Homepage**: Hero flagship spotlight, official brand showcase (Apple, Samsung, Google, Xiaomi, OnePlus), trending phones, and decision engine banner.
2. **Product Catalog**: Multi-criteria filtering by brand, category (Flagship, Foldable, Gaming, Mid-Range), RAM, storage tiers, price slider, and sorting.
3. **Product Details & Specs**: Color swatches, storage selectors, dynamic price and stock updating, technical specifications sheet, and customer reviews.
4. **Side-by-Side Phone Comparison**: Compare 2 to 4 smartphones simultaneously on screen PPI, chipset, camera sensors, battery, fast charging, and OS.
5. **Shopping Cart**: Real-time stock check, quantity modification, and item removal.
6. **Checkout & Order Placement**: Multi-payment methods (COD, Bank Transfer, Card, E-Wallet), discount coupon activation (`WELCOME10`), and PostgreSQL transactional inventory hold.
7. **Order Tracking**: Detailed invoice receipts, status history (Pending $\to$ Processing $\to$ Shipped $\to$ Delivered), and courier tracking numbers.
8. **User Profile**: Account details management and order history shortcuts.

### Admin Portal
1. **Executive Dashboard**: Key metrics (Gross Revenue, Orders Processed, Active Models, Low Stock Warnings) and recent orders stream.
2. **Product & Inventory Management**: Add new phones with detailed specs and initial stock variants; delete existing listings.
3. **Order Fulfillment**: Update order states (`Pending` $\to$ `Processing` $\to$ `Shipped` $\to$ `Delivered` $\to$ `Cancelled`) and assign shipment tracking numbers.
4. **Customer Accounts**: View customer roster, order counts, and lifetime expenditures.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0+ (Installed)
- **Git**: (Installed)
- **PostgreSQL**: (Local PostgreSQL 14+ service OR any free cloud connection string such as Neon or Supabase)

### 2. Installation
```bash
# Clone or navigate to the repository
cd d:/Project_Y4/E-Commerce

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Database Configuration
Edit `backend/.env` with your PostgreSQL credentials:

```ini
# Option 1: Standard Local PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=mobilestore_db

# Option 2: Remote Cloud PostgreSQL (Neon / Supabase)
# DATABASE_URL=postgresql://user:pass@ep-host.neon.tech/neondb?sslmode=require
```

To initialize the schema and populate sample smartphones (iPhone 15 Pro Max, Galaxy S24 Ultra, Pixel 8 Pro, etc.):
```bash
npm run db:init
```

> **Note**: If PostgreSQL is not active yet, the backend automatically switches to an in-memory database fallback so you can demo and test the entire system without interruption!

### 4. Running the Application

In terminal 1 (Backend API):
```bash
npm run dev:backend
# Starts Express REST API at http://localhost:5000
```

In terminal 2 (Frontend Client):
```bash
npm run dev:frontend
# Starts React Vite client at http://localhost:5173
```

### 5. Automated API Test Suite
Run the automated test runner to verify health, authentication, phone catalog, comparison, cart, and transactional checkout:
```bash
npm run test:backend
```

---

## 🔑 Demo Preset Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@mobilestore.com` | `admin123` | Full Admin Dashboard & Storefront |
| **Customer Shopper** | `customer@example.com` | `password123` | Catalog, Cart, Checkout, Orders |

---

## 📚 Academic Submission Deliverables

- **Project Plan**: [docs/project_plan.md](file:///d:/Project_Y4/E-Commerce/docs/project_plan.md)
- **Database ER Diagram & Normalization Rationale**: [docs/database_diagram.md](file:///d:/Project_Y4/E-Commerce/docs/database_diagram.md)
- **REST API Specification**: [docs/api_documentation.md](file:///d:/Project_Y4/E-Commerce/docs/api_documentation.md)
- **Backend Automated Tests**: [backend/test/api_test.js](file:///d:/Project_Y4/E-Commerce/backend/test/api_test.js)
- **DDL Schema**: [backend/database/schema.sql](file:///d:/Project_Y4/E-Commerce/backend/database/schema.sql)
- **Seed Data**: [backend/database/seeds.sql](file:///d:/Project_Y4/E-Commerce/backend/database/seeds.sql)

---

## 📄 License
Academic Capstone Project. Open source under the ISC License.
