# Mobile Phone Store E-Commerce — System Architecture

## 1. Overall System Architecture
The system adopts a modern decoupled **Three-Tier Architecture (SPA + REST API + Relational DB)** designed for high performance, maintainability, and clear separation of concerns.

```
+-------------------------------------------------------------+
|                      Client Layer                           |
|      React 19 SPA (Vite, React Router v7, Vanilla CSS)       |
+-------------------------------------------------------------+
                              |
                              | HTTPS / JSON (REST API)
                              | JWT Bearer Authentication
                              v
+-------------------------------------------------------------+
|                     Application Layer                       |
|         Node.js 20+ Runtime & Express.js REST API           |
|                                                             |
|   +-----------------------------------------------------+   |
|   | Global Middleware (CORS, Helmet, Rate Limiter)     |   |
|   +-----------------------------------------------------+   |
|   | Authentication & Role Guard (JWT Verification)      |   |
|   +-----------------------------------------------------+   |
|   | Routing Layer (Express Router)                      |   |
|   +-----------------------------------------------------+   |
|   | Controller Layer (HTTP parsing & Responses)         |   |
|   +-----------------------------------------------------+   |
|   | Service Layer (Business logic & Transactions)       |   |
|   +-----------------------------------------------------+   |
|   | Data Access Layer (pg Pool Connection / pg-mem)    |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
                              |
                              | SQL Queries (Prepared Statements)
                              | ACID Transactions (BEGIN / COMMIT)
                              v
+-------------------------------------------------------------+
|                       Database Layer                        |
|                  PostgreSQL 16 Engine                       |
|   (Relational Tables, Foreign Keys, B-Tree Indexes, JSONB)   |
+-------------------------------------------------------------+
```

---

## 2. Frontend Architecture (React)
- **Framework & Build**: Vite + React 19 Single Page Application.
- **Styling**: Tailored CSS custom properties (`variables.css` design system with sleek dark mode, glassmorphism, glowing accents).
- **Routing**: Client-side routing via `react-router-dom` with Public, Protected, and Admin Guard routes.
- **State Management**: React Context API with dedicated domains:
  - `AuthContext`: Token storage, active user state, login/logout, role resolution.
  - `CartContext`: Client-side cart sync, server reconciliation, item count, optimistic updates.
  - `CompareContext`: Dual/triple phone comparison drawer across catalog navigation.
- **Network Layer**: Centralized API service using native `fetch` with request/response interceptors, automatic `Authorization: Bearer <token>` injection, and standardized error parsing.

---

## 3. Backend Architecture (Node.js & Express)
- **Layered Architecture**:
  - `Routes`: Map HTTP endpoints to controller methods.
  - `Controllers`: Parse query/body params, call services/queries, return formatted JSON.
  - `Middleware`: JWT verification, Role authorization, validation schemas, global error handler.
  - `Config`: Database connection pooling with resilience fallback (`pg` pool with fallback to `pg-mem` for offline grading).

---

## 4. Database Architecture (PostgreSQL)
- Relational schema normalized to 3NF.
- Foreign key constraints with `ON DELETE CASCADE` or `ON DELETE RESTRICT` to preserve financial audit trails.
- B-Tree indexes on search keys, foreign keys, slugs, and status fields.
- ACID transaction support (`BEGIN`, `COMMIT`, `ROLLBACK`) for checkout and inventory locking.

---

## 5. Twelve Core Technical Flows

### Flow 1: API Communication
1. Client makes an HTTP request via `api.js` helper.
2. Request headers include `Content-Type: application/json` and `Authorization: Bearer <token>` (if logged in).
3. Express matches route, executes middleware chain, passes to controller.
4. Controller returns standard JSON envelope: `{ success: true, data: { ... } }` or `{ success: false, message: "..." }`.

### Flow 2: Authentication Flow (Login & Register)
1. User submits email and password.
2. Controller validates input format.
3. Query database by email.
4. Verify password hash using `bcrypt.compare`.
5. Generate JWT signed with server secret containing `{ id, email, role }` and expiry (7d).
6. Return token and user profile to frontend.
7. Frontend saves token to `localStorage` and updates `AuthContext`.

### Flow 3: Authorization Flow (Admin vs Customer)
1. Request reaches protected endpoint.
2. `verifyToken` middleware decodes token and extracts `req.user`.
3. `requireAdmin` middleware checks if `req.user.role === 'admin'`.
4. If valid, request proceeds (`next()`); if not, responds with HTTP 403 Forbidden.

### Flow 4: Customer Request Flow (Browse Catalog)
1. Customer visits `/catalog` and selects filters (Brand: Apple, Storage: 256GB, Sort: Price Low to High).
2. Frontend sends `GET /api/products?brand=apple&sort=price_asc`.
3. Express controller constructs parameterized SQL query with `WHERE` and `ORDER BY` clauses.
4. Results with variant count and primary image URLs are returned in under 50ms.
5. Catalog grid renders responsive phone cards.

### Flow 5: Admin Request Flow (Manage Inventory)
1. Admin visits `/admin/products`.
2. Frontend verifies admin role in `AuthContext` before rendering dashboard layout.
3. Admin edits price and stock quantity for SKU `IP16PM-256-NT`.
4. Request sends `PUT /api/admin/products/:id/variants/:variantId`.
5. Controller checks admin JWT and runs SQL update.
6. Returns updated variant object and shows success toast.

### Flow 6: Add to Cart & Sync Flow
1. Customer clicks "Add to Cart" on a specific variant.
2. If authenticated: Frontend sends `POST /api/cart` with `{ variantId, quantity: 1 }`. Backend performs upsert (`ON CONFLICT DO UPDATE`).
3. If guest: Cart stored in `localStorage`. Upon subsequent login, guest items are automatically migrated to server database.

### Flow 7: Phone Comparison Flow
1. Customer clicks "Compare" on up to 3 phones.
2. `CompareContext` stores phone IDs in state and opens persistent comparison dock at the bottom of the screen.
3. When customer clicks "Compare Now", navigates to `/compare?ids=id1,id2`.
4. System fetches full specifications and renders a side-by-side spec matrix highlighting differences.

### Flow 8: Order Processing Flow (ACID Transaction)
1. Customer clicks "Place Order" on `/checkout`.
2. Frontend sends `POST /api/orders` with cart items, shipping address, and payment method.
3. Backend starts PostgreSQL transaction: `BEGIN`.
4. Verifies current inventory for all items using `FOR UPDATE` row-level locks.
5. Decrements `stock_quantity` in `product_variants`.
6. Inserts row into `orders` table and corresponding rows into `order_items` (freezing unit prices).
7. Clears customer's `cart_items`.
8. Executes `COMMIT`.
9. Returns generated `order_number` and summary.

### Flow 9: Payment Flow
1. For COD: Order created with status `pending`, payment status `pending`.
2. For Bank Transfer / Mock Gateway: Order created with `payment_status: 'pending'` and simulated QR code/account details displayed.
3. Admin or webhook marks payment as `paid`, triggering status update to `processing`.

### Flow 10: Error Handling Flow
1. Any unhandled rejection or synchronous error in controllers is forwarded via `next(err)`.
2. Centralized Express error handler catches the exception.
3. Logs full stack trace to server console.
4. Returns sanitized client-safe response `{ success: false, message: err.message || "Internal Server Error" }` with appropriate status code (400, 401, 403, 404, 409, 500).

---

## 6. Practical Directory Structure

```
E-Commerce/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL pool connection & fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── productController.js  # Catalog search, filter, detail, specs
│   │   ├── cartController.js     # Cart items management
│   │   ├── orderController.js    # Checkout, order placement, order history
│   │   └── adminController.js    # Admin CRUD for products, orders, users
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role checking
│   │   ├── validate.js           # Request payload sanitization
│   │   └── errorHandler.js       # Centralized error handler
│   ├── database/
│   │   ├── schema.sql            # PostgreSQL DDL
│   │   ├── seeds.sql             # Real-world initial mock data
│   │   └── pgmem_schema.sql      # In-memory test engine schema
│   ├── test/
│   │   └── api_test.js           # Automated integration test suite
│   ├── server.js                 # Express app bootstrap
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, Button, Modal, Toast
│   │   │   ├── product/          # ProductCard, PriceTag, SpecBadge, ImageGallery
│   │   │   ├── cart/             # CartDrawer, CartItemRow, OrderSummary
│   │   │   ├── compare/          # CompareBar, SpecComparisonTable
│   │   │   └── admin/            # AdminSidebar, StatsWidget, DataTable
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & actions
│   │   │   ├── CartContext.jsx   # Cart state & sync
│   │   │   └── CompareContext.jsx# Comparison queue
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx    # Header + Main + Footer for customers
│   │   │   └── AdminLayout.jsx   # Sidebar + Header + Content for admin
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.jsx
│   │   │       ├── AdminProductsPage.jsx
│   │   │       ├── AdminOrdersPage.jsx
│   │   │       └── AdminCustomersPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Centralized API fetcher
│   │   ├── styles/
│   │   │   ├── variables.css     # Design tokens & color system
│   │   │   └── index.css         # Global typography & layout utilities
│   │   ├── App.jsx               # Routes setup
│   │   └── main.jsx              # React DOM entry
│   └── package.json
│
├── docs/
│   ├── project_requirements_and_plan.md
│   ├── system_architecture.md
│   ├── database_design.md
│   └── api_documentation.md
│
├── .gitignore
├── package.json                  # Root runner script
└── README.md
```
