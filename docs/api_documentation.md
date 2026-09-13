# Mobile Phone Store — REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT |
| `GET` | `/api/auth/me` | Customer / Admin | Get authenticated user profile & addresses |
| `PUT` | `/api/auth/profile` | Customer / Admin | Update profile name, phone, avatar |

## Product Catalog Endpoints (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products with pagination, search, filters & sort |
| `GET` | `/api/products/:identifier` | Public | Get product details by slug or UUID with variants & specs |
| `GET` | `/api/products/compare?ids=1,2` | Public | Compare 2–4 phones side-by-side |
| `GET` | `/api/products/brands` | Public | List all brands with active product counts |
| `GET` | `/api/products/categories` | Public | List all product categories |

### Query Parameters for `/api/products`
- `search`: Case-insensitive search on title, model, or brand
- `brand`: Filter by brand slug (e.g., `apple`, `samsung`)
- `category`: Filter by category slug (e.g., `flagship`, `foldables`)
- `minPrice` / `maxPrice`: Filter by base price range
- `ram`: Filter by RAM option (e.g., `8GB`, `12GB`)
- `storage`: Filter by storage tier (e.g., `256GB`, `512GB`)
- `sort`: `newest` (default), `price_asc`, `price_desc`, `name_asc`, `rating`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

## Cart Endpoints (`/api/cart`)

*All cart endpoints require Bearer JWT token in Authorization header.*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Customer | Fetch current cart with live pricing and stock |
| `POST` | `/api/cart/add` | Customer | Add variant to cart `{ variant_id, quantity }` |
| `PUT` | `/api/cart/item/:id` | Customer | Update item quantity `{ quantity }` |
| `DELETE` | `/api/cart/item/:id` | Customer | Remove item from cart |
| `DELETE` | `/api/cart/clear` | Customer | Empty the shopping cart |

## Order & Checkout Endpoints (`/api/orders`)

*All order endpoints require Bearer JWT token in Authorization header.*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders/checkout` | Customer | Place order with transactional inventory deduction |
| `GET` | `/api/orders` | Customer | View customer order history |
| `GET` | `/api/orders/:identifier` | Customer / Admin | View order invoice & tracking details |

## Admin Endpoints (`/api/admin`)

*All admin endpoints require Bearer JWT token with role = 'admin'.*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Overall revenue, orders count, low stock warnings |
| `GET` | `/api/admin/orders` | Admin | List all system orders with filter by status |
| `PUT` | `/api/admin/orders/:id/status` | Admin | Update order status, payment status, tracking number |
| `POST` | `/api/admin/products` | Admin | Create new mobile phone with variants & specs |
| `DELETE` | `/api/admin/products/:id` | Admin | Delete a phone product |
| `GET` | `/api/admin/customers` | Admin | View customer roster and total expenditures |
| `POST` | `/api/admin/upload` | Admin | Upload product images (multipart/form-data) |
