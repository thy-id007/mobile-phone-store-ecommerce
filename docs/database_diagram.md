# Mobile Phone Store — Entity Relationship (ER) Diagram

This document presents the complete relational database architecture for the Mobile Phone Store E-Commerce system.

## 1. Visual ER Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ ADDRESSES : "has many"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ CART_ITEMS : "adds to"

    BRANDS ||--o{ PRODUCTS : "produces"
    CATEGORIES ||--o{ PRODUCTS : "classifies"

    PRODUCTS ||--|{ PRODUCT_VARIANTS : "has variants (color/storage)"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "has gallery"
    PRODUCTS ||--o{ PRODUCT_SPECS : "has specs"
    PRODUCTS ||--o{ REVIEWS : "receives"

    PRODUCT_VARIANTS ||--o{ CART_ITEMS : "referenced by"
    PRODUCT_VARIANTS ||--o{ ORDER_ITEMS : "ordered as"

    ORDERS ||--|{ ORDER_ITEMS : "contains"
    
    DISCOUNTS ||--o{ ORDERS : "applied to"

    USERS {
        uuid id PK
        string full_name
        string email UK
        string password_hash
        string phone
        string role "customer | admin"
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    ADDRESSES {
        uuid id PK
        uuid user_id FK
        string recipient_name
        string phone
        text street_address
        string city
        string state_province
        string postal_code
        string country
        boolean is_default
    }

    BRANDS {
        uuid id PK
        string name
        string slug UK
        string logo_url
        text description
    }

    CATEGORIES {
        uuid id PK
        string name
        string slug UK
        text description
        string image_url
    }

    PRODUCTS {
        uuid id PK
        uuid brand_id FK
        uuid category_id FK
        string name
        string slug UK
        string model
        text description
        decimal base_price
        decimal discount_percentage
        string display_spec
        string processor_spec
        string camera_spec
        string battery_spec
        string os_spec
        boolean is_featured
        string status "active | draft | archived"
        timestamp created_at
    }

    PRODUCT_VARIANTS {
        uuid id PK
        uuid product_id FK
        string color_name
        string color_hex
        string ram
        string storage
        string sku UK
        decimal price
        int stock_quantity
        string variant_image
        boolean is_default
    }

    PRODUCT_SPECS {
        uuid id PK
        uuid product_id FK
        string spec_group
        string spec_name
        text spec_value
        int display_order
    }

    CART_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid variant_id FK
        int quantity
        timestamp updated_at
    }

    ORDERS {
        uuid id PK
        string order_number UK
        uuid user_id FK
        jsonb shipping_address
        string payment_method
        string payment_status
        string order_status
        decimal subtotal
        decimal discount_amount
        decimal shipping_fee
        decimal total_amount
        string tracking_number
        text notes
        timestamp created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid variant_id FK
        string product_name
        string variant_details
        decimal unit_price
        int quantity
        decimal total_price
    }

    REVIEWS {
        uuid id PK
        uuid product_id FK
        uuid user_id FK
        int rating
        string title
        text comment
        timestamp created_at
    }

    DISCOUNTS {
        uuid id PK
        string code UK
        string description
        string discount_type "percentage | fixed"
        decimal value
        decimal min_spend
        timestamp valid_from
        timestamp valid_to
        boolean is_active
    }
```

## 2. Table Summary & Normalization Rationale

- **3rd Normal Form (3NF)**: Transitive dependencies removed. Brand and category attributes are separated into dedicated lookup entities.
- **Variant Independence**: Physical phone stock, color choices, RAM, and storage tiers are separated into `product_variants`. This prevents duplicate product records and enables accurate inventory accounting per SKU.
- **Relational Integrity**: Foreign key constraints with `ON DELETE CASCADE` on dependent children (e.g., variants, images, specs) and `ON DELETE RESTRICT` on historical purchase records (orders) to prevent accidental data loss.
- **Auditability**: Order addresses and item snapshots (`product_name`, `variant_details`, `unit_price`) are frozen at time of purchase so historical receipts remain accurate even if phone catalog prices change in the future.
