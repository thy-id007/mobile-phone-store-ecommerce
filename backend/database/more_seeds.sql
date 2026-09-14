-- Additional Products Seed Script with strict RFC 4122 hex UUIDs
-- Covers All Categories: Flagship, Foldables, Gaming, Mid-Range, Budget
-- Uses realistic, reasonable market pricing

-- 1. Ensure Categories
INSERT INTO categories (id, name, slug, description, image_url)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Flagship Phones', 'flagship', 'Top tier mobile devices with the latest processors and titanium builds.', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80'),
    ('c1000000-0000-0000-0000-000000000002', 'Foldable Phones', 'foldables', 'Next-generation folding and flip screens for multitasking.', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80'),
    ('c1000000-0000-0000-0000-000000000003', 'Gaming Phones', 'gaming', 'High refresh rates, dedicated cooling, and maximum endurance.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80'),
    ('c1000000-0000-0000-0000-000000000004', 'Mid-Range Value', 'mid-range', 'Balanced performance, great battery life, and high value for money.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80'),
    ('c1000000-0000-0000-0000-000000000005', 'Budget Phones', 'budget', 'Affordable, reliable everyday smartphones with great battery life.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 2. Ensure Brands
INSERT INTO brands (id, name, slug, logo_url, description)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Apple', 'apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&auto=format&fit=crop&q=80', 'Pioneering technology and iconic iOS smartphones.'),
    ('b1000000-0000-0000-0000-000000000002', 'Samsung', 'samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&auto=format&fit=crop&q=80', 'Leading Android innovation with Galaxy display and camera tech.'),
    ('b1000000-0000-0000-0000-000000000003', 'Google', 'google', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120&auto=format&fit=crop&q=80', 'Pure Android experience powered by Google Tensor and computational photography.'),
    ('b1000000-0000-0000-0000-000000000004', 'Xiaomi', 'xiaomi', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&auto=format&fit=crop&q=80', 'High performance hardware with flagship Leica optics.'),
    ('b1000000-0000-0000-0000-000000000005', 'OnePlus', 'oneplus', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=120&auto=format&fit=crop&q=80', 'Never Settle: Smooth performance, fast charging, Hasselblad cameras.'),
    ('b1000000-0000-0000-0000-000000000006', 'ASUS', 'asus', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&auto=format&fit=crop&q=80', 'Republic of Gamers extreme gaming performance and engineering.'),
    ('b1000000-0000-0000-0000-000000000007', 'Realme', 'realme', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&auto=format&fit=crop&q=80', 'Trendy designs, high refresh rate displays, and young accessible tech.')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- 3. PRODUCTS
INSERT INTO products (id, brand_id, category_id, name, slug, model, description, base_price, discount_percentage, display_spec, processor_spec, camera_spec, battery_spec, os_spec, is_featured, status)
VALUES
    -- A. FOLDABLE: Samsung Galaxy Z Fold6 ($1699)
    (
        'a1000000-0000-0000-0000-000000000007',
        'b1000000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000002',
        'Samsung Galaxy Z Fold6',
        'samsung-galaxy-z-fold-6',
        'SM-F956B',
        'Ultra-slim, lighter symmetrical dual-screen foldable with Snapdragon 8 Gen 3 for Galaxy, IP48 water resistance, and Galaxy AI productivity tools.',
        1699.00,
        6.00,
        '7.6" QXGA+ Dynamic AMOLED 2X 120Hz + 6.3" Cover',
        'Snapdragon 8 Gen 3 (4nm)',
        '50MP Main + 10MP 3x Tele + 12MP Ultra-Wide',
        '4400 mAh, 25W Fast Charging',
        'Android 14, One UI 6.1.1',
        true,
        'active'
    ),
    -- B. FOLDABLE: Samsung Galaxy Z Flip6 ($949)
    (
        'a1000000-0000-0000-0000-000000000008',
        'b1000000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000002',
        'Samsung Galaxy Z Flip6',
        'samsung-galaxy-z-flip-6',
        'SM-F741B',
        'Compact pocket foldable with larger 4000mAh battery, upgraded 50MP camera, FlexWindow AI widgets, and Armor Aluminum hinge.',
        949.00,
        5.00,
        '6.7" FHD+ Dynamic AMOLED 2X + 3.4" Super AMOLED FlexWindow',
        'Snapdragon 8 Gen 3 (4nm)',
        '50MP Dual Pixel OIS + 12MP Ultra-Wide',
        '4000 mAh, 25W Fast Charging',
        'Android 14, One UI 6.1.1',
        false,
        'active'
    ),
    -- C. GAMING: ASUS ROG Phone 8 Pro ($899)
    (
        'a1000000-0000-0000-0000-000000000009',
        'b1000000-0000-0000-0000-000000000006',
        'c1000000-0000-0000-0000-000000000003',
        'ASUS ROG Phone 8 Pro',
        'asus-rog-phone-8-pro',
        'AI2401',
        'Elite gaming beast featuring customizable AniMe Vision mini-LED rear display, AirTrigger ultrasonic shoulder controls, 165Hz LTPO AMOLED, and AeroActive cooler support.',
        899.00,
        10.00,
        '6.78" Samsung E6 Flexible AMOLED 165Hz, 2500 nits',
        'Snapdragon 8 Gen 3 + GameCool 8',
        '50MP Gimbal OIS + 32MP 3x Tele + 13MP UW',
        '5500 mAh, 65W HyperCharge, 15W Qi',
        'ROG UI based on Android 14',
        true,
        'active'
    ),
    -- D. GAMING: Xiaomi POCO F6 Pro ($469)
    (
        'a1000000-0000-0000-0000-000000000010',
        'b1000000-0000-0000-0000-000000000004',
        'c1000000-0000-0000-0000-000000000003',
        'Xiaomi POCO F6 Pro',
        'xiaomi-poco-f6-pro',
        '23113RKC6G',
        'Flagship gaming performance on a budget: Snapdragon 8 Gen 2, 120W HyperCharge (0-100% in 19 mins), and 4000 nits WQHD+ AMOLED.',
        469.00,
        8.00,
        '6.67" Flow AMOLED WQHD+ 120Hz, 4000 nits',
        'Snapdragon 8 Gen 2 (4nm)',
        '50MP Light Fusion 800 OIS + 8MP UW + 2MP Macro',
        '5000 mAh, 120W HyperCharge',
        'Xiaomi HyperOS',
        false,
        'active'
    ),
    -- E. MID-RANGE: Samsung Galaxy A55 5G ($379)
    (
        'a1000000-0000-0000-0000-000000000011',
        'b1000000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000004',
        'Samsung Galaxy A55 5G',
        'samsung-galaxy-a55-5g',
        'SM-A556B',
        'Metal frame premium design with Gorilla Glass Victus+, 50MP OIS camera, IP67 water resistance, and Knox Vault security.',
        379.00,
        5.00,
        '6.6" Super AMOLED FHD+ 120Hz, 1000 nits',
        'Exynos 1480 with Xclipse 530 GPU (4nm)',
        '50MP OIS + 12MP Ultra-Wide + 5MP Macro',
        '5000 mAh, 25W Fast Charging',
        'Android 14, One UI 6.1',
        true,
        'active'
    ),
    -- F. MID-RANGE: Xiaomi Redmi Note 13 Pro+ 5G ($349)
    (
        'a1000000-0000-0000-0000-000000000012',
        'b1000000-0000-0000-0000-000000000004',
        'c1000000-0000-0000-0000-000000000004',
        'Xiaomi Redmi Note 13 Pro+ 5G',
        'xiaomi-redmi-note-13-pro-plus-5g',
        '23090RA98G',
        'Curved 1.5K CrystalRes AMOLED with 200MP OIS camera, MediaTek Dimensity 7200-Ultra, IP68 rating, and blazing 120W charging.',
        349.00,
        7.00,
        '6.67" Curved 1.5K AMOLED 120Hz, 1800 nits',
        'MediaTek Dimensity 7200-Ultra (4nm)',
        '200MP ISOCELL HP3 OIS + 8MP UW + 2MP Macro',
        '5000 mAh, 120W HyperCharge',
        'MIUI 14 / HyperOS',
        false,
        'active'
    ),
    -- G. MID-RANGE: Google Pixel 8a ($449)
    (
        'a1000000-0000-0000-0000-000000000013',
        'b1000000-0000-0000-0000-000000000003',
        'c1000000-0000-0000-0000-000000000004',
        'Google Pixel 8a',
        'google-pixel-8a',
        'G8HH4',
        'Google AI features like Best Take, Audio Magic Eraser, and Circle to Search, with flagship Google Tensor G3 and 7 years of OS updates.',
        449.00,
        4.00,
        '6.1" Actua OLED 120Hz, 2000 nits peak',
        'Google Tensor G3 (4nm) + Titan M2',
        '64MP Quad PD with OIS + 13MP Ultra-Wide',
        '4492 mAh, 18W Fast Charging + Qi Wireless',
        'Android 14 (7 Years Support)',
        false,
        'active'
    ),
    -- H. BUDGET: Samsung Galaxy A15 ($149)
    (
        'a1000000-0000-0000-0000-000000000014',
        'b1000000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000005',
        'Samsung Galaxy A15',
        'samsung-galaxy-a15',
        'SM-A155F',
        'Rare Super AMOLED 90Hz screen in budget tier, 50MP triple camera, 5000mAh battery with 25W charging, and 4 guaranteed Android OS upgrades.',
        149.00,
        0.00,
        '6.5" Super AMOLED 90Hz, 800 nits',
        'MediaTek Helio G99 (6nm)',
        '50MP Main + 5MP Ultra-Wide + 2MP Macro',
        '5000 mAh, 25W Fast Charging',
        'Android 14, One UI 6.0',
        true,
        'active'
    ),
    -- I. BUDGET: Xiaomi Redmi 13C ($119)
    (
        'a1000000-0000-0000-0000-000000000015',
        'b1000000-0000-0000-0000-000000000004',
        'c1000000-0000-0000-0000-000000000005',
        'Xiaomi Redmi 13C',
        'xiaomi-redmi-13c',
        '23100RN82L',
        'Sleek 8.09mm thin budget phone with large 6.74" 90Hz display, 50MP AI dual camera, massive 5000mAh battery, and USB-C.',
        119.00,
        0.00,
        '6.74" IPS LCD 90Hz with Gorilla Glass',
        'MediaTek Helio G85 (12nm)',
        '50MP AI Main + 2MP Macro + Aux Lens',
        '5000 mAh, 18W Fast Charging',
        'MIUI 14 based on Android 13',
        false,
        'active'
    ),
    -- J. BUDGET: Realme C67 ($169)
    (
        'a1000000-0000-0000-0000-000000000016',
        'b1000000-0000-0000-0000-000000000007',
        'c1000000-0000-0000-0000-000000000005',
        'Realme C67',
        'realme-c67',
        'RMX3890',
        'Segment champion 108MP 3x in-sensor zoom camera, Snapdragon 685 6nm chipset, 33W SUPERVOOC charging, and ultra-slim 7.59mm body.',
        169.00,
        5.00,
        '6.72" FHD+ 90Hz, 950 nits peak',
        'Snapdragon 685 (6nm)',
        '108MP 3x In-sensor Zoom + 2MP Depth',
        '5000 mAh, 33W SUPERVOOC',
        'Realme UI based on Android 14',
        false,
        'active'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    base_price = EXCLUDED.base_price,
    description = EXCLUDED.description,
    display_spec = EXCLUDED.display_spec,
    processor_spec = EXCLUDED.processor_spec,
    camera_spec = EXCLUDED.camera_spec,
    battery_spec = EXCLUDED.battery_spec,
    status = 'active';

-- 4. PRODUCT VARIANTS (Hex UUIDs)
INSERT INTO product_variants (id, product_id, color_name, color_hex, ram, storage, sku, price, stock_quantity, variant_image, is_default)
VALUES
    -- Fold6 (Silver Shadow & Navy)
    ('d2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'Silver Shadow', '#c5c6c8', '12GB', '256GB', 'SM-ZF6-256-SLV', 1699.00, 14, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000007', 'Navy Blue', '#1b2a4a', '12GB', '512GB', 'SM-ZF6-512-NVY', 1849.00, 8, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80', false),

    -- Flip6 (Mint & Silver)
    ('d2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000008', 'Mint Green', '#a2d5c6', '12GB', '256GB', 'SM-ZP6-256-MNT', 949.00, 20, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000008', 'Silver Shadow', '#c5c6c8', '12GB', '512GB', 'SM-ZP6-512-SLV', 1049.00, 12, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', false),

    -- ROG Phone 8 Pro (Phantom Black)
    ('d2000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000009', 'Phantom Black', '#151515', '16GB', '512GB', 'ROG8P-512-BLK', 899.00, 15, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000009', 'Phantom Black', '#151515', '24GB', '1TB', 'ROG8P-1TB-EDN', 1099.00, 6, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', false),

    -- POCO F6 Pro (Silver & Black)
    ('d2000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000010', 'Moonlight Silver', '#e2e8f0', '12GB', '256GB', 'PCF6P-256-SLV', 469.00, 25, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000010', 'Dark Velvet', '#1e293b', '16GB', '512GB', 'PCF6P-512-BLK', 529.00, 18, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', false),

    -- Galaxy A55 (Awesome Iceblue & Navy)
    ('d2000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000011', 'Awesome Iceblue', '#cce3f0', '8GB', '128GB', 'SMA55-128-BLU', 379.00, 30, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000011', 'Awesome Navy', '#1a233a', '8GB', '256GB', 'SMA55-256-NVY', 419.00, 22, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', false),

    -- Redmi Note 13 Pro+ (Midnight Black & Aurora Purple)
    ('d2000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000012', 'Midnight Black', '#111827', '8GB', '256GB', 'RN13PP-256-BLK', 349.00, 35, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000012', 'Aurora Purple', '#8b5cf6', '12GB', '512GB', 'RN13PP-512-PUR', 399.00, 20, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80', false),

    -- Pixel 8a (Bay Blue & Obsidian)
    ('d2000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000013', 'Bay Blue', '#7cb9e8', '8GB', '128GB', 'PX8A-128-BLU', 449.00, 24, 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000013', 'Obsidian Black', '#1e1e1e', '8GB', '256GB', 'PX8A-256-OBS', 499.00, 14, 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&auto=format&fit=crop&q=80', false),

    -- Galaxy A15 (Blue Black)
    ('d2000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000014', 'Blue Black', '#172554', '6GB', '128GB', 'SMA15-128-BLU', 149.00, 45, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000014', 'Light Blue', '#bfdbfe', '8GB', '256GB', 'SMA15-256-LBL', 179.00, 30, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', false),

    -- Redmi 13C (Clover Green & Midnight Black)
    ('d2000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000015', 'Clover Green', '#4ade80', '6GB', '128GB', 'R13C-128-GRN', 119.00, 50, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000015', 'Midnight Black', '#0f172a', '8GB', '256GB', 'R13C-256-BLK', 139.00, 40, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', false),

    -- Realme C67 (Sunny Oasis & Black Rock)
    ('d2000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000016', 'Sunny Oasis', '#84cc16', '8GB', '128GB', 'RMC67-128-GRN', 169.00, 35, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', true),
    ('d2000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000016', 'Black Rock', '#18181b', '8GB', '256GB', 'RMC67-256-BLK', 199.00, 25, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', false)
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 5. PRODUCT IMAGES (Hex UUIDs)
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order)
VALUES
    ('e2000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', true, 1),
    ('e2000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', true, 1)
ON CONFLICT (id) DO NOTHING;
