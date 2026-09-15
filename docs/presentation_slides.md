# Final Capstone Project Presentation Deck
## Mobile Phone Store Online Business — Full-Stack E-Commerce Platform

---

### Slide 1: Title & University Project Defense
- **Project Title**: Mobile Phone Store Online Business E-Commerce Platform
- **Course**: Final Year Capstone Project (Week 14 Final Defense)
- **Technology Stack**: React 19 • Node.js / Express.js • PostgreSQL • CSS Design System
- **Key Focus**: Purpose-built smartphone retail system with side-by-side hardware comparison, dual-currency pricing (USD & KHR), offline resilience, and ABA KHQR bank transfers.
- **Presenter / Candidate**: University Software Engineering Team
- **Live Deployment**: https://thy-id007.github.io/mobile-phone-store-ecommerce/

---

### Slide 2: Problem Statement & Motivation
- **The Challenge in Online Smartphone Shopping**:
  1. **Unstructured Specifications**: Consumers struggle to differentiate chipsets, camera sensors, and battery capacities across fragmented listings.
  2. **Variant Fragmentation**: Different storage and color SKUs are often listed as separate, confusing products.
  3. **Payment Friction in Cambodia**: High demand for cashless mobile banking (Bakong / ABA KHQR) alongside cash on delivery.
  4. **Network & Offline Fragility**: Traditional SPAs break completely when backend APIs experience network latency or high traffic.
- **Our Solution**:
  - A responsive dark-titanium cyber e-commerce experience designed specifically for flagship and mid-range smartphones with localized Phnom Penh market pricing, instant guest exploration, interactive comparison, and automated fallback resilience.

---

### Slide 3: System Architecture Overview
- **Three-Tier Architectural Model**:
  1. **Presentation Layer (Frontend)**:
     - React 19 with Vite bundler.
     - React Router v7 with Hash routing for seamless GitHub Pages static hosting.
     - Client Contexts: `AuthContext`, `CartContext`, `CompareContext`, `LanguageContext`.
     - Zero-downtime offline fallback mechanism (`fallbackData.json`).
  2. **Application Layer (Backend REST API)**:
     - Express.js HTTP Server on Node.js.
     - Layered MVC design pattern (Routes → Controllers → Middleware → Database Pool).
     - Stateless JWT (JSON Web Token) authentication with role-based access control (Customer vs. Admin).
  3. **Persistence Layer (Database)**:
     - Relational PostgreSQL database.
     - Normalized schema with foreign key cascades and transactional consistency.

---

### Slide 4: Database Design & Relational Model
- **12 Relational Entities**:
  - `users`: Customer accounts and store administrators with hashed passwords.
  - `categories`: Brand and device taxonomy (Flagships, Foldables, Budget, Tablets).
  - `products`: Base phone models holding global attributes, brand, and specifications.
  - `product_variants`: Color, storage options (e.g. 256GB / 512GB), pricing adjustments, and inventory tracking.
  - `product_images`: Multi-angle gallery images per device.
  - `specifications`: Grouped hardware metrics (Processor, Optics, Battery, Display).
  - `cart_items`: User shopping baskets with live stock verification.
  - `orders` & `order_items`: Transactional order snapshots preserving historical item pricing.
  - `payments`: Transaction records (KHQR Bank Transfer, Cash on Delivery, Card).
  - `reviews`: Star ratings and verified buyer feedback.
  - `coupons`: Promotional discount management.
  - `audit_logs`: Admin security and inventory action audit trails.

---

### Slide 5: Key Technical Innovations & Features
1. **Interactive Hardware Comparison Engine**:
   - Compares 2 to 4 smartphones simultaneously on an interactive matrix.
   - Highlights distinct advantages in CPU fabrication (nm), camera megapixels, and battery capacity.
2. **Instant Guest Cart & Local Resilience**:
   - Zero login friction for adding products to cart; state persists via `localStorage`.
   - Automatic fallback to bundled local JSON if backend server is offline or throttling.
3. **ABA KHQR & Cambodian Market Adaptation**:
   - Real-time exchange rate calculation (1 USD = 4,100 KHR).
   - Dynamic KHQR modal featuring animated 15-minute countdown, scannable QR code, and payment verification.
   - Local shipping options (Grab / Nham24 express 1-2H Phnom Penh delivery).
4. **Bilingual Localization**:
   - Instant toggle between English and Khmer (ភាសាខ្មែរ) with persistent language state.

---

### Slide 6: Security & Data Integrity
- **Password Security**: Cryptographic password hashing using `bcryptjs` (salt rounds: 10).
- **Stateless Authorization**: JWT stored in client memory/header, verified by `authMiddleware.js`.
- **Injection Defense**: All PostgreSQL queries use parameterized queries (`$1, $2, ...`), completely neutralizing SQL injection attacks.
- **Role-Based Access Control (RBAC)**: Protected admin routes (`/api/admin/*`, `/api/reviews/admin/*`) restricted to authorized store managers.
- **Inventory Atomicity**: PostgreSQL transactional queries (`BEGIN ... COMMIT / ROLLBACK`) ensure stock cannot be double-sold.

---

### Slide 7: UI/UX & Responsive Design System
- **Cyber Dark-Titanium Aesthetic**:
  - Custom CSS Design System built on curated tokens (`variables.css`).
  - Sleek dark theme (`#0b0f19` / `#162032`), vibrant cyan/blue gradients, and glassmorphism.
- **Device Support Matrix Tested**:
  - Mobile Phones: `320px`, `360px`, `375px`, `390px`, `414px`, `430px`.
  - Tablets: `600px`, `768px`, `820px`, `1024px`.
  - Laptops & Desktops: `1280px`, `1440px`, `1920px`, `2560px`.
- **Adaptive Components**:
  - Off-canvas slide-over catalog filter drawer on tablets and smartphones.
  - Off-canvas mobile navigation drawer with authentication controls.
  - Touch-friendly tap targets (`min-height: 44px`).

---

### Slide 8: Store Administration & Operational Workflow
- **Centralized Admin Dashboard**:
  - Real-time operational metrics: Total Revenue, Total Orders, Active Catalog Count, Low Stock Warnings.
- **Product & Variant Management**:
  - Add new devices, configure multiple storage/color variants, and adjust pricing.
- **Order Lifecycle Management**:
  - State machine: `Pending` → `Processing` → `Shipped` → `Delivered` / `Cancelled`.
- **Review Moderation**:
  - Approve or moderate customer product reviews to maintain catalog credibility.

---

### Slide 9: Testing, Quality Assurance & Verification
- **Automated Integration Test Suite (`api_test.js`)**:
  - **17/17 Integration Tests Passed (100% Pass Rate)**:
    1. Health check verification (`GET /api/health`).
    2. Admin authentication (`POST /api/auth/login`).
    3. Customer authentication (`POST /api/auth/login`).
    4. Catalog listing (`GET /api/products`).
    5. Search filtering (`GET /api/products?search=titanium`).
    6. Brand filtering (`GET /api/products?brand=apple`).
    7. Product variant detail (`GET /api/products/:slug`).
    8. Hardware comparison (`GET /api/products/compare`).
    9. Add to cart (`POST /api/cart/add`).
    10. Cart calculation (`GET /api/cart`).
    11. Transactional checkout (`POST /api/orders/checkout`).
    12. Wishlist addition (`POST /api/wishlist/:productId`).
    13. Wishlist retrieval (`GET /api/wishlist`).
    14. Review submission (`POST /api/reviews/product/:productId`).
    15. Public reviews retrieval (`GET /api/reviews/product/:productId`).
    16. Admin review moderation (`GET /api/reviews/admin/all`).
    17. Admin operational metrics (`GET /api/admin/dashboard`).
- **Visual Regression Testing**:
  - Headless browser verification across mobile, tablet, and desktop viewports.

---

### Slide 10: Conclusion & Future Scope
- **Key Project Accomplishments**:
  - Completed all university final requirements on schedule.
  - Developed a full-stack, enterprise-grade e-commerce application tailored to smartphone consumers.
  - Successfully deployed frontend to GitHub Pages with live interactive functionality.
- **Future Enhancements**:
  - Direct webhook integration with National Bank of Cambodia (NBC) Bakong Open API.
  - AI-powered personalized phone recommendation assistant.
  - Progressive Web App (PWA) offline installation with push notifications for order delivery updates.

---

### Slide 11: Demonstration & Q&A
- **Live URL**: https://thy-id007.github.io/mobile-phone-store-ecommerce/
- **Demo Accounts for Evaluators**:
  - **Customer Account**: `customer@example.com` / `password123`
  - **Admin Portal**: `admin@mobilestore.com` / `admin123`
- **Thank you! We invite questions and feedback from the examination committee.**
