# University Final Project Report / Capstone Book
# Mobile Phone Store Online Business — Full-Stack E-Commerce System

---

## Academic Project Metadata
- **Project Title**: Mobile Phone Store Online Business — Full-Stack E-Commerce System
- **Degree**: Bachelor of Science in Computer Science / Software Engineering
- **Academic Year**: Year 4 / Final Year Capstone Project (Week 14 Final Submission)
- **Technology Stack**: React 19, Node.js, Express.js, PostgreSQL, CSS3 Design System
- **Repository & Live Deployment**:
  - GitHub Repository: `https://github.com/thy-id007/mobile-phone-store-ecommerce`
  - Live Demonstration: `https://thy-id007.github.io/mobile-phone-store-ecommerce/`

---

## Executive Summary & Abstract
With the rapid acceleration of digital commerce and smartphone penetration in Southeast Asia, online consumer electronics retail demands heightened reliability, localized transaction workflows, and structured technical data presentation. Traditional generic e-commerce applications often fall short when presenting smartphones: hardware specifications are presented inconsistently, product color and storage variants are fragmented into disjointed listings, and payment methods lack native adaptation to local digital banking infrastructures such as the National Bank of Cambodia's Bakong and KHQR frameworks.

This capstone project presents the design, architectural development, and deployment of the **Mobile Phone Store Online Business E-Commerce System** — an enterprise-grade full-stack web application designed specifically for mobile device retail. The system features a responsive three-tier architecture comprising a modern React 19 single-page client, a RESTful Node.js/Express application programming interface, and a relational PostgreSQL database management system. Key functional innovations include an interactive multi-device hardware specification comparison engine, atomic transactional inventory deductions, bilingual Khmer-English localization, localized Phnom Penh street pricing with dual USD/KHR currency calculation, and a simulated ABA KHQR mobile banking payment verification gateway with animated timer safeguards. 

Automated testing achieved a 100% pass rate across 17 comprehensive integration and smoke test suites, and cross-device testing validated responsive performance across screen viewports ranging from 320px mobile devices to 2560px ultra-wide displays.

---

## Table of Contents
1. [Chapter 1: Introduction](#chapter-1-introduction)
   - 1.1 Project Background
   - 1.2 Problem Statement
   - 1.3 Project Objectives
   - 1.4 Scope and Limitations
2. [Chapter 2: System Requirements & Feasibility](#chapter-2-system-requirements--feasibility)
   - 2.1 Stakeholder & User Persona Analysis
   - 2.2 Functional Requirements
   - 2.3 Non-Functional Requirements
   - 2.4 Technology Stack Justification
3. [Chapter 3: System Design & Architecture](#chapter-3-system-design--architecture)
   - 3.1 Architectural Overview (3-Tier Model)
   - 3.2 Relational Database Design & Entity Relationship Diagram (ERD)
   - 3.3 RESTful API Design & Contract Specification
   - 3.4 UI/UX Design System & Cyber Titanium Aesthetic
4. [Chapter 4: System Implementation & Security](#chapter-4-system-implementation--security)
   - 4.1 Frontend Component Architecture
   - 4.2 Backend Business Logic & Controllers
   - 4.3 Cambodian Local Commerce & KHQR Gateway Integration
   - 4.4 Security Controls & Role-Based Access Control (RBAC)
5. [Chapter 5: Testing, Quality Assurance & Verification](#chapter-5-testing-quality-assurance--verification)
   - 5.1 Automated API & Integration Testing
   - 5.2 Responsive Viewport Verification Matrix
   - 5.3 Offline Fallback Resilience Testing
6. [Chapter 6: Conclusion & Future Scope](#chapter-6-conclusion--future-scope)
   - 6.1 Project Summary & Achievements
   - 6.2 Limitations & Lessons Learned
   - 6.3 Future Work & Commercial Roadmap
7. [Appendices](#appendices)
   - Appendix A: Database Schema DDL (`schema.sql`)
   - Appendix B: API Endpoints Directory
   - Appendix C: Deployment & Local Setup Manual

---

## Chapter 1: Introduction

### 1.1 Project Background
Smartphones represent high-value, highly technical consumer electronics purchases. Modern buyers evaluate multiple technical dimensions—including central processing units (CPU), neural processing units (NPU), display panel technologies, optical lens arrangements, charging speeds, and official warranty coverages—before deciding on a purchase. In developing markets like Cambodia, where smartphone adoption is among the fastest growing in Southeast Asia, digital retail adoption has surged alongside cashless mobile banking.

### 1.2 Problem Statement
Existing online retail platforms frequently encounter four fundamental deficiencies:
1. **Unstructured Specifications**: Technical hardware parameters are often dumped as unsearchable raw text blobs, preventing buyers from filtering or comparing devices accurately.
2. **Variant Fragmentation**: Each storage tier (e.g., 128GB, 256GB, 512GB) and colorway is often listed as a standalone product, cluttering catalog search results.
3. **Payment Disconnect**: Lack of native support for QR-based bank payments, which are standard in Cambodian commerce (KHQR / ABA Bank / Bakong).
4. **Network Fragility**: Traditional single-page web applications fail completely and show blank screens when back-end servers face network latency or hosting limits.

### 1.3 Project Objectives
The primary objectives of this project are:
- To design a relational database model capable of organizing smartphones into unified base models with dynamically managed variant SKUs (storage, color, price adjustments, and stock levels).
- To develop an interactive side-by-side device comparison tool highlighting hardware specifications.
- To implement dual-currency display (USD and Cambodian Riel at 4,100 KHR/USD) and an ABA KHQR payment interface with countdown timers.
- To engineer zero-downtime offline fallback capabilities, ensuring evaluator and visitor exploration even without an active back-end database instance.
- To produce a responsive web application verified across mobile, tablet, and desktop viewports.

### 1.4 Scope and Limitations
The scope encompasses catalog browsing, device comparison, guest cart creation, transactional checkout, order tracking, customer review ratings, and an administrative control portal. The scope is limited to web technologies (React, Node.js, PostgreSQL). Payment verification simulates financial institution webhooks through front-end cryptographic QR generation and receipt simulation.

---

## Chapter 2: System Requirements & Feasibility

### 2.1 Stakeholder Analysis
- **Guest Visitor**: Explores smartphones, filters by price/brand, compares specs, and adds items to cart without mandatory login.
- **Registered Customer**: Places orders, chooses shipping (Phnom Penh express delivery or nationwide courier), submits product reviews, and tracks order histories.
- **Store Administrator**: Manages catalog inventory, adjusts pricing, moderates reviews, and updates order fulfillment statuses.

### 2.2 Functional Requirements
- **FR-01 (Authentication)**: Register and log in using email and password, secured with salted cryptographic hashing and stateless JWTs.
- **FR-02 (Catalog Browsing)**: Filter devices by brand, price range, RAM, and internal storage, with real-time text search.
- **FR-03 (Variant Selection)**: Choose color and storage configurations on product pages, updating live price calculations and inventory indicators.
- **FR-04 (Comparison Engine)**: Compare up to 4 devices simultaneously across CPU, camera, battery, and operating system metrics.
- **FR-05 (Shopping Cart)**: Add, modify quantities, and remove variant items; support local storage persistence for unauthenticated guests.
- **FR-06 (Transactional Checkout)**: Input delivery details, select payment method (KHQR, Cash on Delivery, Credit Card), apply discount coupons, and generate orders.
- **FR-07 (Local Payment Verification)**: Display dynamic KHQR bank transfer QR code with a 15-minute countdown clock and transaction verification.
- **FR-08 (Order Management)**: Track order lifecycle state machine (`Pending` → `Processing` → `Shipped` → `Delivered` / `Cancelled`).
- **FR-09 (Review System)**: Submit 1-to-5 star ratings with verified customer comments; administrative moderation dashboard.
- **FR-10 (Admin Operations)**: Real-time dashboard showing gross revenue, total orders, low-stock warnings, and inventory editors.

### 2.3 Non-Functional Requirements
- **NFR-01 (Performance)**: Client bundle compile time < 500ms; initial render time < 1.5 seconds.
- **NFR-02 (Security)**: Password encryption with `bcrypt` (10 rounds); parameterized SQL queries to prevent injection.
- **NFR-03 (Responsiveness)**: Fluid layout support across 320px, 375px, 390px, 600px, 768px, 1024px, 1440px, and 1920px.
- **NFR-04 (Reliability)**: Automatic offline fallback bundled with local dataset to ensure 100% catalog availability during demonstrations.
- **NFR-05 (Localization)**: Bilingual Khmer and English support with persistent client preference.

---

## Chapter 3: System Design & Architecture

### 3.1 Architectural Overview
The system employs a layered Three-Tier Architecture:
1. **Client Tier**: React 19 SPA running in browser, utilizing Context API for global state (`AuthContext`, `CartContext`, `CompareContext`, `LanguageContext`), communicating over HTTPS via RESTful JSON.
2. **Server Tier**: Node.js and Express.js REST API with modular controllers, request validation middleware, and JWT authentication filters.
3. **Data Tier**: PostgreSQL relational database managed through a connection pool (`pg.Pool`).

### 3.2 Relational Database Schema & ERD
The persistence model comprises 12 normalized relational tables:
- `users (id, full_name, email, password_hash, phone, role, created_at)`
- `categories (id, name, slug, description, image_url)`
- `products (id, category_id, brand, name, slug, description, base_price, discount_percentage, is_featured, is_active)`
- `product_variants (id, product_id, sku, color_name, color_hex, storage_capacity, ram, price_adjustment, stock_quantity)`
- `product_images (id, product_id, variant_id, image_url, is_primary, display_order)`
- `specifications (id, product_id, spec_group, spec_name, spec_value)`
- `cart_items (id, user_id, variant_id, quantity)`
- `orders (id, user_id, order_number, total_amount, discount_amount, final_amount, status, payment_status, shipping_address, shipping_city, phone, notes)`
- `order_items (id, order_id, variant_id, product_name, variant_details, quantity, unit_price, total_price)`
- `payments (id, order_id, payment_method, transaction_id, amount, status, qr_data)`
- `reviews (id, product_id, user_id, rating, title, comment, status)`
- `coupons (id, code, discount_type, discount_value, min_order_amount, is_active)`
- `audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values)`

### 3.3 UI/UX Design System
The visual presentation follows a **Cyber Dark-Titanium** aesthetic:
- **Palette**: Deep titanium backgrounds (`#0b0f19`, `#162032`), vibrant cyan/blue accents (`#3b82f6`, `#06b6d4`), and crisp white typography (`#f8fafc`).
- **Micro-Interactions**: Smooth 0.2s hover elevations, glowing cyan/blue focus rings on form inputs, and animated mobile drawer transitions.
- **Glassmorphism**: Translucent cards (`backdrop-filter: blur(16px)`) with subtle white borders (`rgba(255, 255, 255, 0.12)`).

---

## Chapter 4: System Implementation & Security

### 4.1 Frontend Component Hierarchy
- `App.jsx`: Root provider configuring context providers, navigation header, and responsive router routes.
- `Header.jsx`: Responsive navigation bar containing Phnom Penh top-bar, search bar, language switcher, cart badge, and mobile drawer.
- `CatalogPage.jsx`: Filterable product grid with responsive slide-over drawer on mobile/tablet viewports.
- `ProductDetailPage.jsx`: Multi-angle gallery, interactive color/storage selectors, categorized hardware specifications sheet, and verified reviews.
- `CompareFloatingBar.jsx` & `ComparePage.jsx`: Persistent bottom bar tracking selected phones and side-by-side specifications matrix.
- `PaymentQrModal.jsx`: Modal rendering ABA KHQR bank transfer code, currency calculations, countdown timer, and simulated confirmation.
- `AdminDashboardPage.jsx`, `AdminProductsPage.jsx`, `AdminOrdersPage.jsx`: Full-featured administration management suite.

### 4.2 Cambodian Market Customization
- **Currency Calculation**: All prices display dual USD and Cambodian Riel (`$X ≈ ៛Y KHR`), calculated dynamically with `toLocaleString('km-KH')`.
- **Payment Modes**: Native support for **Bank Transfer (KHQR Code)** alongside Cash on Delivery and Credit Cards.
- **Express Logistics**: Direct dispatch options for Phnom Penh (1–2 Hour delivery via Grab Express / Nham24) and provincial delivery across all 24 provinces.

### 4.3 Security Implementation
- **Cryptographic Hashing**: User passwords are encrypted with `bcrypt` (10 salt rounds) before persistence.
- **Stateless Tokens**: JWTs with configurable expiry signed with secret keys, verified on all protected API routes.
- **Input Sanitization**: Database interactions use parameterized queries (`$1, $2`), preventing SQL injection attacks.
- **Role-Based Access Control**: Middleware verifies `req.user.role === 'admin'` before allowing access to administrative dashboards and order state modifications.

---

## Chapter 5: Testing, Quality Assurance & Verification

### 5.1 Automated API & Integration Testing
An automated test suite (`backend/test/api_test.js`) executes 17 end-to-end integration tests validating authentication, catalog operations, comparison calculations, transactional order placement, review submissions, and administrative metrics.

**Automated Test Results Summary**:
| # | Test Case Description | Target Endpoint | Result |
| :- | :--- | :--- | :--- |
| 1 | System Health & Online Status | `GET /api/health` | **PASSED** (200 OK) |
| 2 | Administrator Authentication | `POST /api/auth/login` | **PASSED** (JWT Issued) |
| 3 | Customer Authentication | `POST /api/auth/login` | **PASSED** (JWT Issued) |
| 4 | Product Catalog Retrieval | `GET /api/products` | **PASSED** (12 Phones Active) |
| 5 | Catalog Search Functionality | `GET /api/products?search=titanium` | **PASSED** |
| 6 | Brand Categorization Filter | `GET /api/products?brand=apple` | **PASSED** |
| 7 | Variant & Specification Lookup | `GET /api/products/:slug` | **PASSED** (Variants Parsed) |
| 8 | Side-by-side Hardware Comparison | `GET /api/products/compare` | **PASSED** |
| 9 | Add Variant to User Cart | `POST /api/cart/add` | **PASSED** |
| 10 | Retrieve Shopping Cart & Subtotals | `GET /api/cart` | **PASSED** |
| 11 | Transactional Order Placement | `POST /api/orders/checkout` | **PASSED** (Order # Generated) |
| 12 | Customer Wishlist Addition | `POST /api/wishlist/:id` | **PASSED** |
| 13 | Wishlist Item Retrieval | `GET /api/wishlist` | **PASSED** |
| 14 | Customer Review Submission | `POST /api/reviews/product/:id` | **PASSED** |
| 15 | Public Product Reviews Fetch | `GET /api/reviews/product/:id` | **PASSED** |
| 16 | Admin Review Moderation Queue | `GET /api/reviews/admin/all` | **PASSED** |
| 17 | Store Operational Analytics | `GET /api/admin/dashboard` | **PASSED** |

**Overall Result: 17/17 Passed (100% Pass Rate)**.

### 5.2 Responsive Viewport Verification
Visual regression and interaction testing confirmed zero horizontal overflow and proper touch-target compliance across:
- **Mobile Phones** (`320px`, `360px`, `375px`, `390px`, `414px`, `430px`): Single column product grid, off-canvas filter drawer, full auth actions in navigation drawer.
- **Tablets** (`600px`, `768px`, `820px`, `1024px`): Two-column catalog layout, stacked hero elements, off-canvas admin sidebar.
- **Laptops & Desktops** (`1280px`, `1440px`, `1920px`, `2560px`): Four-column catalog grid, sticky comparison bar, full horizontal comparison matrix.

---

## Chapter 6: Conclusion & Future Scope

### 6.1 Project Summary & Achievements
The Mobile Phone Store E-Commerce System successfully satisfies all requirements established for the senior capstone project. The project demonstrates:
- Clean modular full-stack architecture adhering to separation of concerns.
- Reliable data normalization supporting complex smartphone variant relationships.
- Thoughtful localization reflecting modern Cambodian retail norms (KHQR, bilingual support, dual currency).
- Resilient client design maintaining full interactive functionality across all deployment scenarios.

### 6.2 Future Enhancements
Recommended post-academic developments include:
1. Direct integration with the National Bank of Cambodia's official Bakong Open API for real-time bank transaction webhook verification.
2. Progressive Web App (PWA) offline caching with service workers and push notifications for delivery status alerts.
3. Automated courier integration with local delivery API partners (Grab Express, Nham24, J&T Express Cambodia).

---

## Appendices

### Appendix A: Database Schema Summary
The database was provisioned using PostgreSQL 15+, structured via `database/schema.sql`, and seeded with realistic smartphone data via `database/seeds.sql`.

### Appendix B: Evaluator Demo Credentials
- **Customer Evaluation Account**:
  - Email: `customer@example.com`
  - Password: `password123`
- **Store Administrator Account**:
  - Email: `admin@mobilestore.com`
  - Password: `admin123`

### Appendix C: Live Deployment Link
- **Production URL**: `https://thy-id007.github.io/mobile-phone-store-ecommerce/`
