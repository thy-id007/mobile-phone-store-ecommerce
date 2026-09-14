# Mobile Phone Store Online Business — Full-Stack E-Commerce Platform

[![React 19](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![Node.js 20+](https://img.shields.io/badge/Backend-Node.js%20Express-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL 16+](https://img.shields.io/badge/Database-PostgreSQL%2016-336791.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests Passing](https://img.shields.io/badge/Integration%20Tests-17%2F17%20Passed-10b981.svg)](./backend/test/api_test.js)

A modern, responsive, full-stack E-Commerce platform engineered specifically for smartphone retail. Features a high-performance **Customer Storefront** (search, multi-facet filtering, 3-device side-by-side spec comparison, persistent cart, and atomic checkout) alongside a comprehensive **Admin Command Center** (revenue KPIs, variant-level stock management, and order fulfillment).

---

## 1. System Architecture

The platform follows a decoupled **Three-Tier Architecture (SPA + REST API + Relational DB)**:

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|             React 19 (Vite) Single Page Application                     |
|         (Custom Dark-Titanium Design System, React Router v7)           |
+-------------------------------------------------------------------------+
                                    │
                                    │ HTTPS / JSON REST API
                                    │ Authorization: Bearer <JWT>
                                    ▼
+-------------------------------------------------------------------------+
|                          APPLICATION TIER                               |
|                  Node.js 20+ Runtime & Express.js                       |
|                                                                         |
|   ┌─────────────────────────────────────────────────────────────────┐   |
|   │ Global Middleware (CORS, Request Parser, Centralized Error)     │   |
|   └─────────────────────────────────────────────────────────────────┘   |
|   ┌─────────────────────────────────────────────────────────────────┐   |
|   │ Auth Guard & RBAC Middleware (verifyToken, requireAdmin)        │   |
|   └─────────────────────────────────────────────────────────────────┘   |
|   ┌─────────────────────────────────────────────────────────────────┐   |
|   │ Routing Layer (/auth, /products, /cart, /wishlist, /orders)     │   |
|   └─────────────────────────────────────────────────────────────────┘   |
|   ┌─────────────────────────────────────────────────────────────────┐   |
|   │ Controller Layer (Validation, Response Envelopes)               │   |
|   └─────────────────────────────────────────────────────────────────┘   |
|   ┌─────────────────────────────────────────────────────────────────┐   |
|   │ PostgreSQL Connection Pool (pg.Pool + ACID Transactions)        │   |
|   └─────────────────────────────────────────────────────────────────┘   |
+-------------------------------------------------------------------------+
                                    │
                                    │ Parameterized SQL Queries ($1, $2)
                                    │ Row-Level Locks (SELECT ... FOR UPDATE)
                                    ▼
+-------------------------------------------------------------------------+
|                              DATA TIER                                  |
|                         PostgreSQL 16 / 18                              |
|           14 Normalized Tables, UUIDs, Foreign Keys, JSONB              |
+-------------------------------------------------------------------------+
```

---

## 2. Technology Stack

- **Frontend**:
  - React 19 (Hooks, Functional Components, Context API)
  - Vite (Ultra-fast build & HMR)
  - React Router v7 (Client-side routing with Public, Protected, and Admin Guards)
  - Lucide React (Clean vector iconography)
  - Pure Vanilla CSS (`variables.css` design system with brushed dark titanium aesthetics)
- **Backend**:
  - Node.js (v20+ / v24+) & Express.js
  - JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` (10-round salted password hashing)
  - PostgreSQL Native Driver (`pg`) with connection pooling
  - `cors` & `dotenv`
- **Database**:
  - PostgreSQL 16/18 Relational Engine
  - UUIDv4 Primary Keys (`uuid-ossp`)
  - 3NF Normalized relational schema with B-Tree indexes
  - JSONB for delivery address snapshots

---

## 3. Key Features

### A. Customer Storefront
- **Catalog & Search**: Real-time search by phone name, model, or brand with instant query highlights.
- **Parametric Filtering**: Filter simultaneously by Brand (Apple, Samsung, Xiaomi, Google), Storage (128GB, 256GB, 512GB, 1TB), RAM (8GB, 12GB, 16GB), and price sliders.
- **Dynamic Variant Switcher**: Selecting colors or storage tiers instantly updates device pricing, SKU codes, and live inventory availability.
- **3-Phone Comparison Engine**: Pin up to 3 smartphones to a persistent comparison dock; navigate to `/compare` for an aligned spec-by-spec comparison matrix (Display, SoC, Camera, Battery, OS).
- **Persistent Cart & Wishlist**: Server-synchronized cart with quantity steppers and stock limit protections.
- **Atomic Checkout**: Checkout executes within a PostgreSQL transaction (`BEGIN` / `COMMIT`), locking inventory rows (`FOR UPDATE`) to prevent overselling.
- **Order Tracking**: Visual 4-step delivery progress timeline (`Placed` $\to$ `Processing` $\to$ `Shipped` $\to$ `Delivered`).
- **Product Reviews & Ratings**: 1 to 5 star rating submission with automatic recalculation of device average ratings.

### B. Admin Management Portal
- **Executive Dashboard**: Live sales revenue, completed orders count, low-stock notifications ($\le 5$ units), and recent order activity.
- **Product Catalog Management**: Create, edit, and delete phone models, gallery images, and full technical specification sheets.
- **Variant & Inventory Matrix**: Real-time SKU stock stepper controls and price overrides.
- **Order Fulfillment Pipeline**: Audit customer delivery snapshots, line items, and advance fulfillment statuses (`pending` $\to$ `shipped` with tracking numbers).
- **Review Moderation**: Audit customer feedback and remove inappropriate content.
- **Customer Directory**: View customer registrations, lifetime spend, and order history.

---

## 4. Repository Structure

```
mobile-phone-store/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL pool connection & resilience fallback
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   ├── productController.js  # Catalog search, filter, detail, specs
│   │   ├── cartController.js     # Server cart items management
│   │   ├── wishlistController.js # Wishlist management
│   │   ├── orderController.js    # ACID transactional checkout & history
│   │   ├── reviewController.js   # Customer reviews & admin moderation
│   │   └── adminController.js    # Executive analytics & store CRUD
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # verifyToken & requireAdmin guards
│   │   └── errorMiddleware.js    # Centralized 404 & 500 handlers
│   ├── database/
│   │   ├── schema.sql            # PostgreSQL DDL
│   │   └── seeds.sql             # Real-world flagship phones & accounts
│   ├── test/
│   │   └── api_test.js           # Automated integration test suite (17 tests)
│   ├── server.js                 # Express application bootstrap
│   ├── package.json
│   └── .env.example              # Safe environment variable template
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # AuthContext, CartContext, CompareContext
│   │   ├── layouts/              # MainLayout (Customer), AdminLayout (Admin)
│   │   ├── pages/                # Customer and Admin page views
│   │   ├── services/             # Centralized api.js client layer
│   │   ├── styles/               # variables.css (OLED Dark tokens)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database/
│   ├── schema.sql                # Complete normalized database DDL
│   ├── seeds.sql                 # Flagship device seed data
│   └── README.md                 # Database setup guide
│
├── docs/
│   ├── project_requirements_and_plan.md
│   ├── system_architecture.md
│   ├── database_design.md
│   ├── ui_ux_specification.md
│   └── api_documentation.md
│
├── screenshots/
│   └── README.md                 # UI screenshots and presentation walkthrough
│
├── .gitignore                    # Strictly excludes .env, node_modules, dist
├── package.json                  # Root monorepo script runner
└── README.md
```

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js**: v18+ (v20+ or v24+ recommended)
- **PostgreSQL**: v14+ (v16 or v18 recommended)
- **Git**: Installed on your system

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/mobile-phone-store.git
cd mobile-phone-store
```

---

### Step 2: Configure Environment Variables
Copy the template configuration in `backend/`:
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update with your PostgreSQL credentials:
```env
NODE_ENV=development
PORT=5000

# PostgreSQL Settings
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD="your_postgres_password"
PGDATABASE=mobilestore_db

# Security
JWT_SECRET=super_secret_jwt_key_university_mobile_store_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> [!IMPORTANT]
> Never commit `backend/.env` to Git. It is already safely ignored in `.gitignore`.

---

### Step 3: Initialize the PostgreSQL Database
Open PowerShell or your terminal and run:

```bash
# 1. Create the database
psql -U postgres -c "CREATE DATABASE mobilestore_db;"

# 2. Run the schema (DDL)
psql -U postgres -d mobilestore_db -f "database/schema.sql"

# 3. Seed initial products & demo accounts
psql -U postgres -d mobilestore_db -f "database/seeds.sql"
```

---

### Step 4: Install Dependencies
Install dependencies for both backend and frontend:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

---

### Step 5: Start the Development Servers

#### Terminal 1 — Backend API:
```bash
npm run dev:backend
```
*API will start listening at: `http://localhost:5000`*  
*Health check endpoint: `http://localhost:5000/api/health`*

#### Terminal 2 — Frontend Storefront:
```bash
npm run dev:frontend
```
*Vite will serve the customer storefront at: `http://localhost:5173`*

---

## 6. Default Demo User Accounts

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@phonestore.com` | `password123` | Full Admin Dashboard (`/admin`), stock audits, order fulfillment |
| **Customer** | `customer@gmail.com` | `password123` | Customer Storefront, shopping cart, checkout, order history |

---

## 7. Running Automated Tests

The project includes an automated end-to-end integration test suite verifying authentication, search, filtering, comparison, cart operations, transactional checkout, wishlist, reviews, and admin APIs:

```bash
npm run test:backend
# or from the backend directory:
cd backend && npm test
```

Expected Output:
```
=============================================
🧪 RUNNING BACKEND API SMOKE & INTEGRATION TESTS
=============================================
✅ PASSED: 1. GET /api/health responds with online status
✅ PASSED: 2. POST /api/auth/login works for store administrator
✅ PASSED: 3. POST /api/auth/login works for customer
✅ PASSED: 4. GET /api/products returns catalog list (6 active devices)
✅ PASSED: 5. GET /api/products?search=titanium responds successfully
✅ PASSED: 6. GET /api/products?brand=apple filters properly
✅ PASSED: 7. GET /api/products/:slug returns phone with variants & specs
✅ PASSED: 8. GET /api/products/compare compares 2 mobile phones side-by-side
✅ PASSED: 9. POST /api/cart/add adds variant to user cart
✅ PASSED: 10. GET /api/cart retrieves cart items with subtotal
✅ PASSED: 11. POST /api/orders/checkout places transactional order with coupon discount
✅ PASSED: 12. POST /api/wishlist/:productId adds phone to customer wishlist
✅ PASSED: 13. GET /api/wishlist fetches saved phones list
✅ PASSED: 14. POST /api/reviews/product/:productId handles review submission with rating & validation
✅ PASSED: 15. GET /api/reviews/product/:productId returns reviews and rating summary
✅ PASSED: 16. GET /api/reviews/admin/all returns review moderation queue
✅ PASSED: 17. GET /api/admin/dashboard returns operational store statistics
=============================================
🎉 ALL BACKEND API & INTEGRATION TESTS PASSED (17/17)!
=============================================
```

---

## 8. REST API Documentation Summary

| Domain | Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register new customer account |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate user & receive Bearer JWT |
| **Auth** | `GET` | `/api/auth/me` | Customer/Admin | Fetch current authenticated profile |
| **Products** | `GET` | `/api/products` | Public | Search, filter, and paginate smartphone catalog |
| **Products** | `GET` | `/api/products/:slug` | Public | View phone details, image gallery, specs, variants |
| **Products** | `GET` | `/api/products/compare`| Public | Compare up to 3 phones side-by-side |
| **Cart** | `GET` | `/api/cart` | Customer | Fetch current cart items and calculated subtotal |
| **Cart** | `POST` | `/api/cart/add` | Customer | Add variant to cart with stock validation |
| **Cart** | `PUT` | `/api/cart/item/:id` | Customer | Update item quantity |
| **Cart** | `DELETE`| `/api/cart/item/:id` | Customer | Remove item from cart |
| **Wishlist** | `GET` | `/api/wishlist` | Customer | Fetch saved phones list |
| **Wishlist** | `POST` | `/api/wishlist/:id` | Customer | Add phone to wishlist |
| **Orders** | `POST` | `/api/orders/checkout`| Customer | Atomic order placement with stock deduction |
| **Orders** | `GET` | `/api/orders` | Customer | View customer order history & timeline |
| **Reviews** | `GET` | `/api/reviews/product/:id`| Public | Fetch customer reviews & rating distribution |
| **Reviews** | `POST` | `/api/reviews/product/:id`| Customer | Post a product review & rating (1-5) |
| **Admin** | `GET` | `/api/admin/dashboard` | Admin Only | Executive KPIs, revenue stats, stock alerts |
| **Admin** | `GET` | `/api/admin/orders` | Admin Only | View and filter all store orders |
| **Admin** | `PUT` | `/api/admin/orders/:id/status`| Admin Only | Update order status and tracking number |

*For complete payload and schema specifications, refer to [docs/api_documentation.md](./docs/api_documentation.md).*

---

## 9. Future Enhancements

- [ ] Real-time payment gateway integration (Stripe & PayPal Webhooks)
- [ ] Automated email/SMS order dispatch notifications (SendGrid / Twilio)
- [ ] Automated phone trade-in valuation estimator
- [ ] Multi-currency and multilingual localization (USD / VND / EUR)

---

## 10. License

This project was developed for a University Final Capstone Project. Educational use only.
