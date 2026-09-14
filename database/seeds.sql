-- Seeds data for Mobile Phone Store E-Commerce
-- Deterministic UUIDs used for relational consistency

-- 1. USERS
-- Admin: admin@mobilestore.com / admin123
-- Customer: customer@example.com / password123
INSERT INTO users (id, full_name, email, password_hash, phone, role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Store Administrator', 'admin@mobilestore.com', '$2b$10$dvB2VtfeBhY8zrNNL336lOWVdmDolShYJ/iFvm4ZwNOcWpEpMfPiy', '+1234567890', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'Alex Johnson', 'customer@example.com', '$2b$10$TJ8oIhjmfynuxbptFMa.5.EjOIi7l8c.AH4oi94vTaDSlYyCNth/e', '+1987654321', 'customer')
ON CONFLICT (id) DO NOTHING;

-- 2. USER ADDRESS
INSERT INTO addresses (id, user_id, recipient_name, phone, street_address, city, state_province, postal_code, country, is_default)
VALUES
    ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Alex Johnson', '+1987654321', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States', true)
ON CONFLICT (id) DO NOTHING;

-- 3. BRANDS
INSERT INTO brands (id, name, slug, logo_url, description)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Apple', 'apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&auto=format&fit=crop&q=80', 'Pioneering technology and iconic iOS smartphones.'),
    ('b1000000-0000-0000-0000-000000000002', 'Samsung', 'samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&auto=format&fit=crop&q=80', 'Leading Android innovation with Galaxy display and camera tech.'),
    ('b1000000-0000-0000-0000-000000000003', 'Google', 'google', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120&auto=format&fit=crop&q=80', 'Pure Android experience powered by Google Tensor and computational photography.'),
    ('b1000000-0000-0000-0000-000000000004', 'Xiaomi', 'xiaomi', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&auto=format&fit=crop&q=80', 'High performance hardware with flagship Leica optics.'),
    ('b1000000-0000-0000-0000-000000000005', 'OnePlus', 'oneplus', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=120&auto=format&fit=crop&q=80', 'Never Settle: Smooth performance, fast charging, Hasselblad cameras.')
ON CONFLICT (id) DO NOTHING;

-- 4. CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Flagship Phones', 'flagship', 'Top tier mobile devices with the latest processors and titanium builds.', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80'),
    ('c1000000-0000-0000-0000-000000000002', 'Foldable Phones', 'foldables', 'Next-generation folding and flip screens for multitasking.', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80'),
    ('c1000000-0000-0000-0000-000000000003', 'Gaming Phones', 'gaming', 'High refresh rates, dedicated cooling, and maximum endurance.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80'),
    ('c1000000-0000-0000-0000-000000000004', 'Mid-Range Value', 'mid-range', 'Balanced performance, great battery life, and high value for money.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCTS
INSERT INTO products (id, brand_id, category_id, name, slug, model, description, base_price, discount_percentage, display_spec, processor_spec, camera_spec, battery_spec, os_spec, is_featured, status)
VALUES
    (
        'a1000000-0000-0000-0000-000000000001',
        'b1000000-0000-0000-0000-000000000001',
        'c1000000-0000-0000-0000-000000000001',
        'Apple iPhone 15 Pro Max',
        'apple-iphone-15-pro-max',
        'iPhone 15 Pro Max',
        'Forged in aerospace-grade titanium, featuring the groundbreaking A17 Pro chip, customizable Action button, and the longest optical zoom ever in an iPhone.',
        1199.00,
        5.00,
        '6.7-inch Super Retina XDR OLED, 120Hz ProMotion',
        'Apple A17 Pro (3nm)',
        '48MP Main + 12MP 5x Telephoto + 12MP Ultra Wide',
        '4422 mAh, 50% in 30 min (USB-C 3.0)',
        'iOS 17 (Upgradable)',
        true,
        'active'
    ),
    (
        'a1000000-0000-0000-0000-000000000002',
        'b1000000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000001',
        'Samsung Galaxy S24 Ultra',
        'samsung-galaxy-s24-ultra',
        'Galaxy S24 Ultra',
        'Unleash Galaxy AI with Circle to Search, Live Translate, and Note Assist. Built with titanium shield, flat 2600-nit Dynamic AMOLED 2X, and built-in S Pen.',
        1299.00,
        8.00,
        '6.8-inch Dynamic AMOLED 2X, 120Hz, 2600 nits',
        'Snapdragon 8 Gen 3 for Galaxy (4nm)',
        '200MP Main + 50MP 5x Periscope + 10MP 3x Tele + 12MP UW',
        '5000 mAh, 45W wired, 15W wireless',
        'Android 14, One UI 6.1 (7 Years OS Updates)',
        true,
        'active'
    ),
    (
        'a1000000-0000-0000-0000-000000000003',
        'b1000000-0000-0000-0000-000000000003',
        'c1000000-0000-0000-0000-000000000001',
        'Google Pixel 8 Pro',
        'google-pixel-8-pro',
        'Pixel 8 Pro',
        'The all-pro phone engineered by Google. Super Actua display, Google Tensor G3, Best Take, Magic Editor, and state-of-the-art camera systems.',
        999.00,
        10.00,
        '6.7-inch LTPO OLED, 120Hz, 2400 nits',
        'Google Tensor G3 (4nm)',
        '50MP Main + 48MP 5x Telephoto + 48MP Ultra Wide',
        '5050 mAh, 30W wired, 23W wireless',
        'Android 14 (7 Years OS Updates)',
        true,
        'active'
    ),
    (
        'a1000000-0000-0000-0000-000000000004',
        'b1000000-0000-0000-0000-000000000005',
        'c1000000-0000-0000-0000-000000000001',
        'OnePlus 12',
        'oneplus-12',
        'OnePlus 12',
        'Smooth Beyond Belief. Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, 5400 mAh high-density battery with 100W SUPERVOOC charging.',
        799.00,
        0.00,
        '6.82-inch 2K ProXDR Display, 120Hz, 4500 nits peak',
        'Snapdragon 8 Gen 3 (4nm)',
        '50MP Sony LYT-808 + 64MP 3x Periscope + 48MP UW',
        '5400 mAh, 100W SUPERVOOC, 50W AIRVOOC',
        'OxygenOS 14 based on Android 14',
        true,
        'active'
    ),
    (
        'a1000000-0000-0000-0000-000000000005',
        'b1000000-0000-0000-0000-000000000004',
        'c1000000-0000-0000-0000-000000000001',
        'Xiaomi 14 Ultra',
        'xiaomi-14-ultra',
        'Xiaomi 14 Ultra',
        'A pinnacle of mobile imaging with Quad 50MP Leica lenses, 1-inch Sony LYT-900 sensor with stepless variable aperture, and Snapdragon 8 Gen 3.',
        1199.00,
        5.00,
        '6.73-inch LTPO AMOLED, 120Hz, Dolby Vision',
        'Snapdragon 8 Gen 3 (4nm)',
        '50MP 1-inch LYT-900 + 50MP 3.2x Tele + 50MP 5x Peri + 50MP UW',
        '5000 mAh, 90W HyperCharge, 80W wireless',
        'Xiaomi HyperOS (Android 14)',
        false,
        'active'
    ),
    (
        'a1000000-0000-0000-0000-000000000006',
        'b1000000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000002',
        'Samsung Galaxy Z Fold5',
        'samsung-galaxy-z-fold-5',
        'Galaxy Z Fold5',
        'The ultimate 7.6-inch main screen that folds into your pocket. Flex Hinge design, massive multi-window productivity, and S Pen support.',
        1799.00,
        12.00,
        '7.6-inch Foldable Dynamic AMOLED 2X + 6.2-inch Cover',
        'Snapdragon 8 Gen 2 for Galaxy',
        '50MP Main + 10MP 3x Telephoto + 12MP Ultra Wide',
        '4400 mAh, 25W wired, 15W wireless',
        'Android 13, One UI 5.1.1 (Upgradable)',
        false,
        'active'
    )
ON CONFLICT (id) DO NOTHING;

-- 6. PRODUCT VARIANTS (Color, RAM, Storage, Stock, SKU, Price)
INSERT INTO product_variants (id, product_id, color_name, color_hex, ram, storage, sku, price, stock_quantity, variant_image, is_default)
VALUES
    -- iPhone 15 Pro Max
    ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Natural Titanium', '#9E9891', '8GB', '256GB', 'IPHONE-15PM-NAT-256', 1199.00, 35, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80', true),
    ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Blue Titanium', '#3B444B', '8GB', '512GB', 'IPHONE-15PM-BLU-512', 1399.00, 20, 'https://images.unsplash.com/photo-1695048065053-5339c0f99478?w=600&auto=format&fit=crop&q=80', false),
    ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Black Titanium', '#1C1C1E', '8GB', '1TB', 'IPHONE-15PM-BLK-1TB', 1599.00, 10, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80', false),

    -- Galaxy S24 Ultra
    ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Titanium Gray', '#828282', '12GB', '256GB', 'SAM-S24U-GRY-256', 1299.00, 40, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', true),
    ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Titanium Black', '#242424', '12GB', '512GB', 'SAM-S24U-BLK-512', 1419.00, 25, 'https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=600&auto=format&fit=crop&q=80', false),
    ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Titanium Violet', '#5D536B', '12GB', '1TB', 'SAM-S24U-VIO-1TB', 1659.00, 15, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', false),

    -- Google Pixel 8 Pro
    ('c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'Bay Blue', '#6BA4B8', '12GB', '128GB', 'PIXEL-8P-BLU-128', 999.00, 30, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', true),
    ('c1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'Obsidian Black', '#2F2F2F', '12GB', '256GB', 'PIXEL-8P-BLK-256', 1059.00, 22, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', false),

    -- OnePlus 12
    ('c1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004', 'Flowy Emerald', '#2E5A44', '12GB', '256GB', 'OP-12-GRN-256', 799.00, 45, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', true),
    ('c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000004', 'Silky Black', '#1B1B1B', '16GB', '512GB', 'OP-12-BLK-512', 899.00, 20, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', false),

    -- Xiaomi 14 Ultra
    ('c1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000005', 'Black Vegan Leather', '#1C1C1C', '16GB', '512GB', 'MI-14U-BLK-512', 1199.00, 18, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', true),

    -- Galaxy Z Fold 5
    ('c1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000006', 'Phantom Black', '#1A1A1A', '12GB', '512GB', 'SAM-FOLD5-BLK-512', 1799.00, 12, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 7. PRODUCT IMAGES
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', true, 1),
    ('b0000001-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1695048065053-5339c0f99478?w=800&auto=format&fit=crop&q=80', false, 2),
    ('b0000002-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', true, 1),
    ('b0000003-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80', true, 1),
    ('b0000004-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80', true, 1),
    ('b0000005-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', true, 1),
    ('b0000006-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80', true, 1)
ON CONFLICT (id) DO NOTHING;

-- 8. DETAILED SPECIFICATIONS (FOR DEEP COMPARISON)
INSERT INTO product_specifications (product_id, spec_group, spec_name, spec_value, display_order)
VALUES
    -- iPhone 15 Pro Max Specs
    ('a1000000-0000-0000-0000-000000000001', 'Display', 'Panel Type', 'Super Retina XDR OLED with ProMotion', 1),
    ('a1000000-0000-0000-0000-000000000001', 'Display', 'Resolution', '2796 x 1290 pixels (~460 ppi)', 2),
    ('a1000000-0000-0000-0000-000000000001', 'Display', 'Refresh Rate', '120Hz Adaptive', 3),
    ('a1000000-0000-0000-0000-000000000001', 'Performance', 'Chipset', 'Apple A17 Pro (3nm TSMC)', 4),
    ('a1000000-0000-0000-0000-000000000001', 'Performance', 'GPU', 'Apple 6-core GPU (Hardware Ray Tracing)', 5),
    ('a1000000-0000-0000-0000-000000000001', 'Camera', 'Main Camera', '48 MP, f/1.8, 24mm, sensor-shift OIS', 6),
    ('a1000000-0000-0000-0000-000000000001', 'Camera', 'Telephoto', '12 MP, f/2.8, 120mm (5x optical zoom)', 7),
    ('a1000000-0000-0000-0000-000000000001', 'Battery', 'Capacity', '4,422 mAh', 8),
    ('a1000000-0000-0000-0000-000000000001', 'Build', 'Frame Material', 'Grade 5 Titanium with Ceramic Shield', 9),
    ('a1000000-0000-0000-0000-000000000001', 'Build', 'Water Resistance', 'IP68 (6m up to 30 mins)', 10),

    -- Galaxy S24 Ultra Specs
    ('a1000000-0000-0000-0000-000000000002', 'Display', 'Panel Type', 'Dynamic AMOLED 2X, Corning Gorilla Armor', 1),
    ('a1000000-0000-0000-0000-000000000002', 'Display', 'Resolution', '3120 x 1440 pixels (QHD+ ~505 ppi)', 2),
    ('a1000000-0000-0000-0000-000000000002', 'Display', 'Refresh Rate', '1-120Hz LTPO', 3),
    ('a1000000-0000-0000-0000-000000000002', 'Performance', 'Chipset', 'Qualcomm Snapdragon 8 Gen 3 for Galaxy', 4),
    ('a1000000-0000-0000-0000-000000000002', 'Performance', 'GPU', 'Adreno 750 (1 GHz)', 5),
    ('a1000000-0000-0000-0000-000000000002', 'Camera', 'Main Camera', '200 MP, f/1.7, 24mm, multi-directional PDAF, OIS', 6),
    ('a1000000-0000-0000-0000-000000000002', 'Camera', 'Telephoto', '50 MP 5x periscope + 10 MP 3x optical', 7),
    ('a1000000-0000-0000-0000-000000000002', 'Battery', 'Capacity', '5,000 mAh (45W Fast Charging)', 8),
    ('a1000000-0000-0000-0000-000000000002', 'Build', 'Frame Material', 'Titanium Frame + Anti-reflective glass', 9),
    ('a1000000-0000-0000-0000-000000000002', 'Build', 'Special Feature', 'Integrated S Pen with Bluetooth Remote', 10)
ON CONFLICT (id) DO NOTHING;

-- 9. REVIEWS
INSERT INTO reviews (id, product_id, user_id, rating, title, comment)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 5, 'Phenomenal build and 5x camera!', 'The titanium feels so much lighter in hand than the 14 Pro Max. The 5x zoom lens captures crystal clear concert photos.'),
    ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 5, 'Best anti-glare screen on the market', 'Gorilla Armor completely changes outdoor readability. Galaxy AI summary and S-pen makes it the ultimate productivity powerhouse.')
ON CONFLICT (id) DO NOTHING;

-- 10. COUPONS
INSERT INTO discounts (id, code, description, discount_type, value, min_spend, valid_from, is_active)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'WELCOME10', '10% discount on your first phone order', 'percentage', 10.00, 200.00, CURRENT_TIMESTAMP, true),
    ('d1000000-0000-0000-0000-000000000002', 'SAVE50', '$50 off on flagship orders over $1000', 'fixed', 50.00, 1000.00, CURRENT_TIMESTAMP, true)
ON CONFLICT (id) DO NOTHING;
