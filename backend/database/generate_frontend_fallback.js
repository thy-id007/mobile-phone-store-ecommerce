const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function dumpData() {
  console.log('📦 Exporting full catalog data for frontend static fallback...');

  const brandsRes = await pool.query('SELECT * FROM brands ORDER BY name ASC');
  const categoriesRes = await pool.query('SELECT * FROM categories ORDER BY name ASC');

  // Query all products with brand and category names
  const productsRes = await pool.query(`
    SELECT 
      p.*,
      b.name as brand_name,
      b.slug as brand_slug,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        (SELECT variant_image FROM product_variants WHERE product_id = p.id AND is_default = true LIMIT 1),
        (SELECT variant_image FROM product_variants WHERE product_id = p.id LIMIT 1),
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80'
      ) as primary_image
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'active'
    ORDER BY p.is_featured DESC, p.created_at DESC
  `);

  // Query variants for each product
  const variantsRes = await pool.query('SELECT * FROM product_variants ORDER BY price ASC');

  const productsWithDetails = productsRes.rows.map(prod => {
    const variants = variantsRes.rows.filter(v => v.product_id === prod.id);
    return {
      ...prod,
      variants,
      specs: [
        { spec_group: 'Display', spec_name: 'Screen Details', spec_value: prod.display_spec },
        { spec_group: 'Performance', spec_name: 'Processor & GPU', spec_value: prod.processor_spec },
        { spec_group: 'Camera', spec_name: 'Camera System', spec_value: prod.camera_spec },
        { spec_group: 'Battery', spec_name: 'Battery & Charging', spec_value: prod.battery_spec },
        { spec_group: 'System', spec_name: 'Operating System', spec_value: prod.os_spec }
      ].filter(s => !!s.spec_value)
    };
  });

  const exportPayload = {
    brands: brandsRes.rows,
    categories: categoriesRes.rows,
    products: productsWithDetails
  };

  const targetPath = path.join(__dirname, '../../frontend/src/services/fallbackData.json');
  fs.writeFileSync(targetPath, JSON.stringify(exportPayload, null, 2), 'utf8');
  console.log(`✅ Successfully generated fallbackData.json (${productsWithDetails.length} products) at ${targetPath}`);
  process.exit(0);
}

dumpData().catch(err => {
  console.error('Error dumping data:', err);
  process.exit(1);
});
