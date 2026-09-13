const { query } = require('../config/db');

// GET /api/products
// Supports: search, brand, category, minPrice, maxPrice, ram, storage, sort, page, limit
const getProducts = async (req, res, next) => {
    try {
        const {
            search,
            brand,
            category,
            minPrice,
            maxPrice,
            ram,
            storage,
            is_featured,
            sort = 'newest',
            page = 1,
            limit = 12
        } = req.query;

        const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
        const params = [];
        let whereClauses = ["p.status = 'active'"];

        if (search) {
            params.push(`%${search.trim().toLowerCase()}%`);
            whereClauses.push(`(LOWER(p.name) LIKE $${params.length} OR LOWER(p.model) LIKE $${params.length} OR LOWER(b.name) LIKE $${params.length})`);
        }

        if (brand) {
            params.push(brand.toLowerCase());
            whereClauses.push(`LOWER(b.slug) = $${params.length}`);
        }

        if (category) {
            params.push(category.toLowerCase());
            whereClauses.push(`LOWER(c.slug) = $${params.length}`);
        }

        if (minPrice) {
            params.push(parseFloat(minPrice));
            whereClauses.push(`p.base_price >= $${params.length}`);
        }

        if (maxPrice) {
            params.push(parseFloat(maxPrice));
            whereClauses.push(`p.base_price <= $${params.length}`);
        }

        if (is_featured === 'true') {
            whereClauses.push('p.is_featured = true');
        }

        // Subquery filters for RAM and Storage matching any variant
        if (ram) {
            params.push(ram);
            whereClauses.push(`EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.ram = $${params.length})`);
        }

        if (storage) {
            params.push(storage);
            whereClauses.push(`EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.storage = $${params.length})`);
        }

        // Sorting
        let orderBy = 'p.created_at DESC';
        switch (sort) {
            case 'price_asc':
                orderBy = 'p.base_price ASC';
                break;
            case 'price_desc':
                orderBy = 'p.base_price DESC';
                break;
            case 'name_asc':
                orderBy = 'p.name ASC';
                break;
            case 'rating':
                orderBy = 'avg_rating DESC NULLS LAST';
                break;
            default:
                orderBy = 'p.created_at DESC';
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Count total matching items
        const countQuery = `
            SELECT COUNT(DISTINCT p.id) 
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            ${whereSql}
        `;
        const countResult = await query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count, 10);

        // Fetch products with aggregated variants, brand, category, primary image, and rating
        params.push(parseInt(limit, 10));
        const limitParam = `$${params.length}`;
        params.push(offset);
        const offsetParam = `$${params.length}`;

        // Fetch base products with brand and category
        const dataQuery = `
            SELECT 
                p.id,
                p.name,
                p.slug,
                p.model,
                p.description,
                p.base_price,
                p.discount_percentage,
                p.display_spec,
                p.processor_spec,
                p.camera_spec,
                p.battery_spec,
                p.os_spec,
                p.is_featured,
                p.status,
                p.created_at,
                b.name AS brand_name,
                b.slug AS brand_slug,
                c.name AS category_name,
                c.slug AS category_slug
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            ${whereSql}
            ORDER BY ${orderBy}
            LIMIT ${limitParam} OFFSET ${offsetParam}
        `;

        const { rows } = await query(dataQuery, params);

        // If products found, batch fetch variants, images, and reviews
        if (rows.length > 0) {
            const productIds = rows.map(r => r.id);
            const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',');

            const [variantsRes, imagesRes, reviewsRes] = await Promise.all([
                query(
                    `SELECT id, product_id, color_name, color_hex, ram, storage, sku, price, stock_quantity, variant_image, is_default
                     FROM product_variants
                     WHERE product_id IN (${placeholders})
                     ORDER BY price ASC`,
                    productIds
                ),
                query(
                    `SELECT id, product_id, image_url, is_primary, display_order
                     FROM product_images
                     WHERE product_id IN (${placeholders})
                     ORDER BY is_primary DESC, display_order ASC`,
                    productIds
                ),
                query(
                    `SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
                     FROM reviews
                     WHERE product_id IN (${placeholders})
                     GROUP BY product_id`,
                    productIds
                )
            ]);

            const variantsByProduct = {};
            for (const v of variantsRes.rows) {
                if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
                variantsByProduct[v.product_id].push(v);
            }

            const imagesByProduct = {};
            for (const img of imagesRes.rows) {
                if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
                imagesByProduct[img.product_id].push(img);
            }

            const reviewsByProduct = {};
            for (const r of reviewsRes.rows) {
                reviewsByProduct[r.product_id] = {
                    avg_rating: Math.round(parseFloat(r.avg_rating || 0) * 10) / 10,
                    review_count: parseInt(r.review_count, 10) || 0
                };
            }

            for (const p of rows) {
                p.variants = variantsByProduct[p.id] || [];
                const imgs = imagesByProduct[p.id] || [];
                p.primary_image = (imgs[0] && imgs[0].image_url) || (p.variants[0] && p.variants[0].variant_image) || null;
                p.avg_rating = (reviewsByProduct[p.id] && reviewsByProduct[p.id].avg_rating) || 0;
                p.review_count = (reviewsByProduct[p.id] && reviewsByProduct[p.id].review_count) || 0;
            }
        }

        res.json({
            success: true,
            pagination: {
                totalItems,
                currentPage: parseInt(page, 10),
                totalPages: Math.ceil(totalItems / parseInt(limit, 10)),
                limit: parseInt(limit, 10)
            },
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/products/:identifier (slug or UUID)
const getProductByIdentifier = async (req, res, next) => {
    try {
        const { identifier } = req.params;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
        const condition = isUuid ? 'p.id = $1' : 'p.slug = $1';

        const productQuery = `
            SELECT 
                p.id,
                p.name,
                p.slug,
                p.model,
                p.description,
                p.base_price,
                p.discount_percentage,
                p.display_spec,
                p.processor_spec,
                p.camera_spec,
                p.battery_spec,
                p.os_spec,
                p.is_featured,
                p.status,
                p.created_at,
                b.id AS brand_id,
                b.name AS brand_name,
                b.slug AS brand_slug,
                b.logo_url AS brand_logo,
                c.id AS category_id,
                c.name AS category_name,
                c.slug AS category_slug
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            WHERE ${condition}
        `;

        const productResult = await query(productQuery, [identifier]);

        if (productResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        const product = productResult.rows[0];

        // Fetch Variants
        const variantsResult = await query(
            `SELECT id, color_name, color_hex, ram, storage, sku, price, stock_quantity, variant_image, is_default
             FROM product_variants
             WHERE product_id = $1
             ORDER BY price ASC`,
            [product.id]
        );

        // Fetch Images Gallery
        const imagesResult = await query(
            `SELECT id, image_url, is_primary, display_order
             FROM product_images
             WHERE product_id = $1
             ORDER BY is_primary DESC, display_order ASC`,
            [product.id]
        );

        // Fetch Specifications grouped
        const specsResult = await query(
            `SELECT spec_group, spec_name, spec_value, display_order
             FROM product_specifications
             WHERE product_id = $1
             ORDER BY spec_group, display_order ASC`,
            [product.id]
        );

        // Fetch Reviews
        const reviewsResult = await query(
            `SELECT r.id, r.rating, r.title, r.comment, r.created_at, u.full_name AS author_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = $1
             ORDER BY r.created_at DESC`,
            [product.id]
        );

        product.variants = variantsResult.rows;
        product.images = imagesResult.rows;
        product.specifications = specsResult.rows;
        product.reviews = reviewsResult.rows;
        product.review_count = product.reviews.length;
        product.avg_rating = product.reviews.length > 0 
            ? Number((product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1))
            : 0;

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/products/compare?ids=id1,id2,id3
const compareProducts = async (req, res, next) => {
    try {
        const { ids } = req.query;

        if (!ids) {
            return res.status(400).json({
                success: false,
                message: 'Please provide comma-separated product ids to compare.'
            });
        }

        const idList = ids.split(',').map(id => id.trim()).filter(Boolean);

        if (idList.length < 2 || idList.length > 4) {
            return res.status(400).json({
                success: false,
                message: 'You can compare between 2 and 4 mobile phones at a time.'
            });
        }

        const placeholders = idList.map((_, i) => `$${i + 1}`).join(',');

        const productsResult = await query(
            `SELECT 
                p.id, p.name, p.slug, p.model, p.base_price, p.discount_percentage,
                p.display_spec, p.processor_spec, p.camera_spec, p.battery_spec, p.os_spec,
                b.name AS brand_name
             FROM products p
             JOIN brands b ON p.brand_id = b.id
             WHERE p.id IN (${placeholders})`,
            idList
        );

        const products = productsResult.rows;
        if (products.length > 0) {
            const [variantsRes, imagesRes, specsRes] = await Promise.all([
                query(
                    `SELECT product_id, ram, storage, price
                     FROM product_variants
                     WHERE product_id IN (${placeholders})
                     ORDER BY price ASC`,
                    idList
                ),
                query(
                    `SELECT product_id, image_url
                     FROM product_images
                     WHERE product_id IN (${placeholders})
                     ORDER BY is_primary DESC`,
                    idList
                ),
                query(
                    `SELECT product_id, spec_group, spec_name, spec_value
                     FROM product_specifications
                     WHERE product_id IN (${placeholders})
                     ORDER BY spec_group, display_order ASC`,
                    idList
                )
            ]);

            const variantsByProduct = {};
            for (const v of variantsRes.rows) {
                if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
                variantsByProduct[v.product_id].push(v);
            }

            const imagesByProduct = {};
            for (const img of imagesRes.rows) {
                if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
                imagesByProduct[img.product_id].push(img);
            }

            const specsByProduct = {};
            for (const s of specsRes.rows) {
                if (!specsByProduct[s.product_id]) specsByProduct[s.product_id] = [];
                specsByProduct[s.product_id].push(s);
            }

            for (const p of products) {
                p.variants = variantsByProduct[p.id] || [];
                const imgs = imagesByProduct[p.id] || [];
                p.primary_image = (imgs[0] && imgs[0].image_url) || null;
                p.specs = specsByProduct[p.id] || [];
            }
        }

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/brands
const getBrands = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT b.id, b.name, b.slug, b.logo_url, b.description,
                    COUNT(p.id) AS product_count
             FROM brands b
             LEFT JOIN products p ON b.id = p.brand_id AND p.status = 'active'
             GROUP BY b.id
             ORDER BY product_count DESC, b.name ASC`
        );
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/categories
const getCategories = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT c.id, c.name, c.slug, c.description, c.image_url,
                    COUNT(p.id) AS product_count
             FROM categories c
             LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
             GROUP BY c.id
             ORDER BY c.name ASC`
        );
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductByIdentifier,
    compareProducts,
    getBrands,
    getCategories
};
