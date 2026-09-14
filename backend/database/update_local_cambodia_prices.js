const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

// Local Phnom Penh / Cambodia smartphone shop retail price mapping (USD)
const cambodiaLocalPrices = {
  // Apple
  'apple-iphone-16-pro-max': { base: 1249.00, discount: 0, variants: { '256GB': 1249.00, '512GB': 1449.00, '1TB': 1699.00 } },
  'apple-iphone-16-pro': { base: 1049.00, discount: 0, variants: { '128GB': 1049.00, '256GB': 1149.00, '512GB': 1349.00 } },
  'apple-iphone-16-plus': { base: 899.00, discount: 0, variants: { '128GB': 899.00, '256GB': 999.00 } },
  'apple-iphone-16': { base: 819.00, discount: 0, variants: { '128GB': 819.00, '256GB': 919.00 } },
  'apple-iphone-15-pro-max': { base: 1049.00, discount: 5, variants: { '256GB': 1049.00, '512GB': 1249.00, '1TB': 1449.00 } },
  'apple-iphone-15-pro': { base: 869.00, discount: 5, variants: { '128GB': 869.00, '256GB': 969.00 } },
  'apple-iphone-15': { base: 679.00, discount: 0, variants: { '128GB': 679.00, '256GB': 779.00 } },
  'apple-iphone-14-pro-max': { base: 789.00, discount: 5, variants: { '128GB': 789.00, '256GB': 889.00 } },
  'apple-iphone-14': { base: 569.00, discount: 4, variants: { '128GB': 569.00, '256GB': 669.00 } },
  'apple-iphone-13': { base: 479.00, discount: 0, variants: { '128GB': 479.00, '256GB': 569.00 } },

  // Samsung
  'samsung-galaxy-s24-ultra': { base: 1049.00, discount: 5, variants: { '256GB': 1049.00, '512GB': 1199.00, '1TB': 1399.00 } },
  'samsung-galaxy-s24-plus': { base: 829.00, discount: 0, variants: { '256GB': 829.00, '512GB': 949.00 } },
  'samsung-galaxy-s24': { base: 669.00, discount: 0, variants: { '128GB': 669.00, '256GB': 749.00 } },
  'samsung-galaxy-z-fold-6': { base: 1499.00, discount: 5, variants: { '256GB': 1499.00, '512GB': 1649.00 } },
  'samsung-galaxy-z-fold-5': { base: 1199.00, discount: 8, variants: { '512GB': 1199.00 } },
  'samsung-galaxy-z-flip-6': { base: 829.00, discount: 5, variants: { '256GB': 829.00, '512GB': 949.00 } },
  'samsung-galaxy-s23-fe': { base: 459.00, discount: 7, variants: { '128GB': 459.00, '256GB': 519.00 } },
  'samsung-galaxy-a55-5g': { base: 349.00, discount: 5, variants: { '128GB': 349.00, '256GB': 389.00 } },
  'samsung-galaxy-a35-5g': { base: 269.00, discount: 0, variants: { '128GB': 269.00, '256GB': 299.00 } },
  'samsung-galaxy-a15': { base: 139.00, discount: 0, variants: { '128GB': 139.00, '256GB': 169.00 } },

  // Google
  'google-pixel-9-pro-fold': { base: 1599.00, discount: 0, variants: { '256GB': 1599.00, '512GB': 1749.00 } },
  'google-pixel-fold': { base: 899.00, discount: 6, variants: { '256GB': 899.00 } },
  'google-pixel-9-pro-xl': { base: 969.00, discount: 0, variants: { '128GB': 969.00, '256GB': 1069.00, '512GB': 1219.00 } },
  'google-pixel-9-pro': { base: 869.00, discount: 0, variants: { '128GB': 869.00, '256GB': 969.00 } },
  'google-pixel-9': { base: 699.00, discount: 0, variants: { '128GB': 699.00, '256GB': 789.00 } },
  'google-pixel-8-pro': { base: 629.00, discount: 6, variants: { '128GB': 629.00, '256GB': 699.00 } },
  'google-pixel-8': { base: 479.00, discount: 6, variants: { '128GB': 479.00, '256GB': 549.00 } },
  'google-pixel-8a': { base: 389.00, discount: 0, variants: { '128GB': 389.00, '256GB': 449.00 } },
  'google-pixel-7-pro': { base: 399.00, discount: 8, variants: { '128GB': 399.00, '256GB': 459.00 } },
  'google-pixel-7a': { base: 289.00, discount: 0, variants: { '128GB': 289.00 } },

  // Xiaomi
  'xiaomi-14-ultra': { base: 989.00, discount: 5, variants: { '512GB': 989.00 } },
  'xiaomi-14-pro': { base: 749.00, discount: 0, variants: { '256GB': 749.00, '512GB': 849.00 } },
  'xiaomi-14': { base: 599.00, discount: 0, variants: { '256GB': 599.00, '512GB': 689.00 } },
  'xiaomi-13t-pro': { base: 469.00, discount: 5, variants: { '256GB': 469.00, '512GB': 539.00 } },
  'xiaomi-poco-f6-pro': { base: 399.00, discount: 5, variants: { '256GB': 399.00, '512GB': 459.00 } },
  'xiaomi-redmi-note-13-pro-plus-5g': { base: 319.00, discount: 5, variants: { '256GB': 319.00, '512GB': 369.00 } },
  'xiaomi-poco-x6-pro': { base: 279.00, discount: 0, variants: { '256GB': 279.00, '512GB': 319.00 } },
  'xiaomi-poco-m6-pro': { base: 169.00, discount: 0, variants: { '256GB': 169.00, '512GB': 199.00 } },
  'xiaomi-redmi-note-13': { base: 149.00, discount: 0, variants: { '128GB': 149.00, '256GB': 179.00 } },
  'xiaomi-redmi-13c': { base: 99.00, discount: 0, variants: { '128GB': 99.00, '256GB': 119.00 } },

  // OnePlus
  'oneplus-open': { base: 1249.00, discount: 0, variants: { '512GB': 1249.00 } },
  'oneplus-12': { base: 669.00, discount: 0, variants: { '256GB': 669.00, '512GB': 769.00 } },
  'oneplus-11-5g': { base: 479.00, discount: 6, variants: { '128GB': 479.00, '256GB': 539.00 } },
  'oneplus-12r': { base: 439.00, discount: 0, variants: { '128GB': 439.00, '256GB': 499.00 } },
  'oneplus-10-pro': { base: 369.00, discount: 8, variants: { '128GB': 369.00, '256GB': 419.00 } },
  'oneplus-nord-4': { base: 339.00, discount: 0, variants: { '256GB': 339.00, '512GB': 389.00 } },
  'oneplus-10t': { base: 319.00, discount: 6, variants: { '128GB': 319.00, '256GB': 369.00 } },
  'oneplus-nord-3': { base: 269.00, discount: 0, variants: { '128GB': 269.00, '256GB': 309.00 } },
  'oneplus-nord-ce4': { base: 249.00, discount: 0, variants: { '128GB': 249.00, '256GB': 279.00 } },
  'oneplus-nord-ce4-lite': { base: 189.00, discount: 0, variants: { '128GB': 189.00, '256GB': 219.00 } },

  // Realme
  'realme-gt-6': { base: 459.00, discount: 0, variants: { '256GB': 459.00, '512GB': 519.00 } },
  'realme-gt-6t': { base: 349.00, discount: 0, variants: { '128GB': 349.00, '256GB': 399.00 } },
  'realme-12-pro-plus-5g': { base: 319.00, discount: 0, variants: { '256GB': 319.00, '512GB': 369.00 } },
  'realme-12-pro-5g': { base: 259.00, discount: 0, variants: { '128GB': 259.00, '256GB': 289.00 } },
  'realme-12-plus-5g': { base: 219.00, discount: 0, variants: { '128GB': 219.00, '256GB': 249.00 } },
  'realme-12-5g': { base: 169.00, discount: 0, variants: { '128GB': 169.00, '256GB': 199.00 } },
  'realme-c67': { base: 145.00, discount: 5, variants: { '128GB': 145.00, '256GB': 169.00 } },
  'realme-c65': { base: 125.00, discount: 0, variants: { '128GB': 125.00, '256GB': 149.00 } },
  'realme-c53': { base: 109.00, discount: 0, variants: { '128GB': 109.00, '256GB': 129.00 } },
  'realme-note-50': { base: 79.00, discount: 0, variants: { '64GB': 79.00, '128GB': 95.00 } },

  // ASUS
  'asus-rog-phone-8-pro': { base: 869.00, discount: 5, variants: { '512GB': 869.00, '1TB': 1049.00 } },
  'asus-rog-phone-8-edition-nova': { base: 749.00, discount: 0, variants: { '256GB': 749.00, '512GB': 839.00 } },
  'asus-rog-phone-8': { base: 699.00, discount: 0, variants: { '256GB': 699.00, '512GB': 789.00 } },
  'asus-rog-phone-7-ultimate': { base: 769.00, discount: 0, variants: { '512GB': 769.00 } },
  'asus-rog-phone-7': { base: 569.00, discount: 5, variants: { '256GB': 569.00, '512GB': 639.00 } },
  'asus-rog-phone-6-pro': { base: 479.00, discount: 8, variants: { '512GB': 479.00 } },
  'asus-rog-phone-6': { base: 399.00, discount: 6, variants: { '256GB': 399.00, '512GB': 459.00 } },
  'asus-zenfone-11-ultra': { base: 689.00, discount: 0, variants: { '256GB': 689.00, '512GB': 779.00 } },
  'asus-zenfone-10': { base: 499.00, discount: 0, variants: { '128GB': 499.00, '256GB': 559.00 } },
  'asus-zenfone-9': { base: 369.00, discount: 8, variants: { '128GB': 369.00, '256GB': 419.00 } }
};

async function updatePrices() {
  console.log('🔄 Starting update of all 70 smartphone prices to Phnom Penh / Cambodia local shop market rates...');

  // 1. Update Database
  const products = await pool.query('SELECT id, slug, name FROM products');
  let updatedProductsCount = 0;
  let updatedVariantsCount = 0;

  for (const p of products.rows) {
    const pricing = cambodiaLocalPrices[p.slug];
    if (!pricing) {
      console.warn(`⚠️ No pricing entry for slug: ${p.slug} (${p.name})`);
      continue;
    }

    await pool.query(
      'UPDATE products SET base_price = $1, discount_percentage = $2 WHERE id = $3',
      [pricing.base, pricing.discount, p.id]
    );
    updatedProductsCount++;

    // Update variants
    const variants = await pool.query('SELECT id, storage, sku FROM product_variants WHERE product_id = $1', [p.id]);
    for (const v of variants.rows) {
      const variantPrice = pricing.variants[v.storage] || pricing.base;
      await pool.query('UPDATE product_variants SET price = $1 WHERE id = $2', [variantPrice, v.id]);
      updatedVariantsCount++;
    }
  }

  console.log(`✅ Successfully updated ${updatedProductsCount} products and ${updatedVariantsCount} variants in PostgreSQL database!`);

  // Query all updated variants to get their SKU and price
  const allVariants = await pool.query('SELECT sku, price FROM product_variants');
  const skuPriceMap = {};
  for (const v of allVariants.rows) {
    skuPriceMap[v.sku] = parseFloat(v.price).toFixed(2);
  }

  // 2. Update seeds.sql files
  const seedPaths = [
    path.join(__dirname, 'seeds.sql'),
    path.join(__dirname, '../../database/seeds.sql')
  ];

  for (const sPath of seedPaths) {
    if (!fs.existsSync(sPath)) {
      console.warn(`Seed file not found: ${sPath}`);
      continue;
    }
    let content = fs.readFileSync(sPath, 'utf8');

    // Update product lines by slug
    // Match: 'slug', 'model', 'description', <base_price>, <discount_percentage>,
    for (const [slug, pricing] of Object.entries(cambodiaLocalPrices)) {
      // Find line containing this slug
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`'${slug}'`) && lines[i].includes('INSERT INTO products')) {
          // Replace base_price and discount_percentage:
          // The pattern before base_price ends with description (enclosed in single quotes) followed by comma and space
          // e.g. 'description', 499.00, 0.00, 'display_spec'
          lines[i] = lines[i].replace(
            /(, ')([^']+?)('),\s*([0-9]+\.[0-9]{2}),\s*([0-9]+\.[0-9]{2}),\s*(')/,
            (m, p1, desc, p3, oldBase, oldDisc, p6) => {
              return `${p1}${desc}${p3}, ${pricing.base.toFixed(2)}, ${pricing.discount.toFixed(2)}, ${p6}`;
            }
          );
        }
      }
      content = lines.join('\n');
    }

    // Update product_variants lines by SKU
    for (const [sku, priceStr] of Object.entries(skuPriceMap)) {
      const skuRegex = new RegExp(`('${sku}',\\s*)([0-9]+\\.[0-9]{2})(,)`, 'g');
      content = content.replace(skuRegex, `$1${priceStr}$3`);
    }

    fs.writeFileSync(sPath, content, 'utf8');
    console.log(`✅ Synced seed file: ${sPath}`);
  }

  console.log('🎉 All 70 smartphone models and 132 variants successfully updated to Phnom Penh local shop prices!');
  process.exit(0);
}

updatePrices().catch(err => {
  console.error('Error updating prices:', err);
  process.exit(1);
});

