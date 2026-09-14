# Mobile Phone Store E-Commerce — UI/UX & Figma Design System Specification

## 1. Design System & Style Tokens

### 1.1 Color Palette
- **Background Deep**: `#0b0f17` (Deep Titanium Black)
- **Surface Elevation 1**: `#121824` (Card & sidebar background)
- **Surface Elevation 2**: `#1a2234` (Modal, input field, and dropdown background)
- **Border / Outline**: `#232f48` (Subtle boundary dividers)
- **Accent Primary**: `#00f2fe` (Electric Cyan / Glow accents)
- **Accent Gradient**: `linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)`
- **Text Primary**: `#f8fafc` (High contrast headings & values)
- **Text Secondary**: `#94a3b8` (Muted labels & captions)
- **Text Tertiary**: `#64748b` (Placeholders and metadata)
- **Semantic Success**: `#10b981` (In stock, Delivered, Payment Paid)
- **Semantic Warning**: `#f59e0b` (Low stock < 5, Processing)
- **Semantic Danger**: `#ef4444` (Out of stock, Cancelled, Failed)

### 1.2 Typography System
- **Display Font**: `Inter` / `Outfit`, sans-serif
- **H1 (Hero / Page Titles)**: 36px / 44px, Bold (700), tracking -0.02em
- **H2 (Section Titles)**: 28px / 36px, Semi-Bold (600)
- **H3 (Card Titles / Subheadings)**: 20px / 28px, Semi-Bold (600)
- **Body Regular**: 15px / 24px, Regular (400)
- **Body Medium / Actions**: 14px / 20px, Medium (500)
- **Small / Tags**: 12px / 16px, Medium (500), tracking +0.02em

### 1.3 Spacing & Layout Grid
- Base unit: `4px` (4, 8, 12, 16, 24, 32, 48, 64)
- Container max-width: `1320px` with 24px horizontal padding
- Grid: 12-column desktop (gutter 24px), 4-column mobile (gutter 16px)

### 1.4 UI Components Architecture
- **Buttons**:
  - Primary: Cyan gradient background, white text, subtle glow hover effect.
  - Secondary: Surface 2 background, `#232f48` border, text hover `#00f2fe`.
  - Danger: `#ef4444` background or outline for destructive actions.
  - Size variants: `sm` (32px), `md` (42px), `lg` (50px).
- **Product Cards**:
  - Image container with aspect ratio 1:1, sleek hover zoom (`scale(1.05)`).
  - Badges: Top-left ("Save 12%", "Featured", "Out of Stock").
  - Quick Spec Pill: Chips for RAM/Storage (e.g. `8GB / 256GB`).
  - Action row: Dynamic Price, "Add to Cart" button, and "Compare" icon toggle.
- **Form Controls**:
  - Dark inputs (`#1a2234`) with `#232f48` borders. On focus, glow border `#00f2fe` with 3px cyan shadow.
- **Comparison Drawer**:
  - Persistent bottom sticky bar (height 72px) showing up to 3 selected phone thumbnails with "Compare Now" button.

---

## 2. Customer Screens Breakdown (23 Screens)

1. **Home**: Hero banner with flagship showcase (iPhone 16 Pro Max / Galaxy S24 Ultra), Brand ticker (Apple, Samsung, Xiaomi, Google), Featured phones carousel, promotional discount banners, and trust badges (Fast delivery, 100% Genuine, 1-year warranty).
2. **Product Listing / Catalog**: Left sidebar with facet filters (Brand, Storage, RAM, Price slider, 5G support); right content grid with sort dropdown (Price low-high, Popularity, Newest), product card matrix, and pagination controls.
3. **Search Results**: Real-time query indicator ("Showing 8 results for 'Titanium'"), search highlight tags, empty state with recommended alternatives.
4. **Category Screen**: Banner header for category (e.g., "Flagship Powerhouses"), curated devices matching category slug, spec filters.
5. **Brand Screen**: Official brand logo, manufacturer description, tabs for latest release vs. budget options.
6. **Product Details**: Two-column layout: Left sticky multi-angle gallery with thumbnail switcher; Right configuration panel (Color swatches, Storage pills, Price calculator, Stock indicator, Add to Cart, Buy Now, Spec highlights).
7. **Product Comparison**: Side-by-side sticky column matrix for up to 3 devices, highlighting differences in Display, Processor, Camera, Battery, OS, and Price.
8. **Wishlist**: Responsive card grid of saved phones with direct "Move to Cart" button and quick deletion.
9. **Cart**: Table of selected variants with item thumbnails, SKU details, quantity incrementor (`- 1 +`), line totals, discount coupon input box, and sticky "Order Summary" card.
10. **Checkout**: 2-step accordion: Step 1 Shipping address selection / entry; Step 2 Delivery method selection; Order cost breakdown.
11. **Shipping Address**: Modal or saved address selector with address cards and "+ Add New Address" form with validation.
12. **Payment Screen**: Radio selection for Payment Options (Cash on Delivery, Bank Transfer QR Code, Credit Card mockup), payment notes.
13. **Order Confirmation**: High-contrast checkmark animation, Order Number display (`ORD-XXXXX`), delivery estimate, and order summary invoice receipt.
14. **Login**: Centered glassmorphic card, email & password fields, "Remember Me", "Forgot Password?" link, demo credentials button.
15. **Register**: Clean registration form (Full Name, Email, Password, Phone), password strength meter, Terms checkbox.
16. **Forgot Password**: Minimal email recovery input with instant mock reset link confirmation alert.
17. **Profile**: User avatar upload, personal information edit form, default address preview, security password change form.
18. **Order History**: Chronological list of orders with Order Number, Date, Total Amount, Status badge, and "View Details" action.
19. **Order Details**: Full invoice breakdown, line items with variant details, delivery destination, payment status, tracking number.
20. **Order Tracking**: Visual step progress bar (`Order Placed` $\to$ `Processing` $\to$ `Shipped` $\to$ `Delivered`) with timestamp timeline.
21. **Reviews Screen**: Community star ratings breakdown (1 to 5 stars), average rating meter, user review testimonials with verified purchase tags.
22. **About Us**: Store mission statement, genuine warranty guarantees, customer support hours, physical store address.
23. **Contact**: Interactive contact form (Name, Email, Message), Google Maps embed placeholder, customer hotline.

---

## 3. Admin Screens Breakdown (18 Screens)

1. **Admin Login**: Shielded admin portal entry with security badge and administrator credentials prompt.
2. **Dashboard**: Executive KPI summary cards (Total Revenue, Orders Count, Active Products, Low-Stock Warnings), recent order list table, quick status toggles.
3. **Products**: Searchable, paginated data table showing thumbnail, model name, brand, base price, variant count, status, and action buttons (Edit, Delete).
4. **Add Product**: Multi-tab form: Tab 1 General Information (Name, Brand, Category, Base Price, Specs); Tab 2 Variants (Color, Hex, RAM, Storage, SKU, Stock, Price); Tab 3 Image URLs.
5. **Edit Product**: Pre-populated product form with inline variant stock adjustments and image management.
6. **Categories**: Table of device categories with inline "+ Add Category" modal and slug generation.
7. **Brands**: Table of manufacturers (Apple, Samsung, etc.) with logo URL manager and active device counts.
8. **Product Variants**: Dedicated SKU-level matrix view displaying each individual SKU stock, price, and color swatch.
9. **Inventory Management**: Fast-edit table of stock levels with "+/-" batch quantity adjusters and low-stock filter (< 5 units).
10. **Customers**: User roster displaying customer full name, email, phone number, joined date, total lifetime orders, and account status.
11. **Orders**: Full order management table with status filter tabs (`All`, `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
12. **Order Details**: Administrative invoice inspection showing customer delivery address snapshot, line items, and fulfillment dropdown to update status.
13. **Payments**: Transaction log showing payment method (COD, Bank Transfer), transaction status (`pending`, `paid`, `refunded`), and manual verification button.
14. **Reviews**: Content moderation queue to inspect customer reviews, star ratings, and toggle visibility.
15. **Discounts (Coupons)**: Table of promotional vouchers with voucher code, discount type (`percentage` vs `fixed`), value, expiry date, and status toggle.
16. **Admin Users**: Roster of administrative staff with role designations and permission levels.
17. **Reports**: Basic tabular reports showing sales by brand (e.g. Apple vs Samsung revenue share) and monthly revenue aggregates.
18. **Settings**: General store metadata configuration (Store name, hotline, currency symbol, default shipping fee).
