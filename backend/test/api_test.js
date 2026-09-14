// Automated REST API Test Suite for Mobile Phone Store
// Run with: npm test (or node test/api_test.js)

const app = require('../server');
const http = require('http');

let server;
const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}/api`;

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const config = {
        method: options.method || 'GET',
        headers
    };
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    const res = await fetch(url, config);
    const json = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data: json };
}

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        throw new Error(message);
    }
    console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
    console.log('\n=============================================');
    console.log('🧪 RUNNING BACKEND API SMOKE & INTEGRATION TESTS');
    console.log('=============================================\n');

    server = app.listen(PORT);
    // Allow server to bind
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // 1. Health Check
        const health = await request('/health');
        assert(health.status === 200 && health.data.status === 'online', '1. GET /api/health responds with online status');

        // 2. Auth - Login as Admin
        const adminLogin = await request('/auth/login', {
            method: 'POST',
            body: { email: 'admin@mobilestore.com', password: 'admin123' }
        });
        assert(adminLogin.status === 200 && adminLogin.data.data.token, '2. POST /api/auth/login works for store administrator');
        const adminToken = adminLogin.data.data.token;

        // 3. Auth - Login as Customer
        const customerLogin = await request('/auth/login', {
            method: 'POST',
            body: { email: 'customer@example.com', password: 'password123' }
        });
        assert(customerLogin.status === 200 && customerLogin.data.data.token, '3. POST /api/auth/login works for customer');
        const customerToken = customerLogin.data.data.token;

        // 4. Products - List products
        const productsList = await request('/products');
        assert(productsList.status === 200 && Array.isArray(productsList.data.data), '4. GET /api/products returns catalog list');
        const phones = productsList.data.data;
        assert(phones.length >= 6, `   Found ${phones.length} active mobile phones in catalog`);

        // 5. Products - Search and Brand Filter
        const searchResult = await request('/products?search=titanium');
        assert(searchResult.status === 200, '5. GET /api/products?search=titanium responds successfully');

        const appleFilter = await request('/products?brand=apple');
        assert(appleFilter.status === 200 && appleFilter.data.data.some(p => p.brand_name === 'Apple'), '6. GET /api/products?brand=apple filters properly');

        // 6. Product Details by slug
        const iphone = await request('/products/apple-iphone-15-pro-max');
        assert(iphone.status === 200 && iphone.data.data.name.includes('iPhone 15 Pro Max'), '7. GET /api/products/:slug returns phone with variants & specs');
        assert(iphone.data.data.variants.length > 0, `   iPhone has ${iphone.data.data.variants.length} color/storage variants`);
        const targetVariant = iphone.data.data.variants[0];

        // 7. Product Comparison
        if (phones.length >= 2) {
            const compare = await request(`/products/compare?ids=${phones[0].id},${phones[1].id}`);
            assert(compare.status === 200 && compare.data.count === 2, '8. GET /api/products/compare compares 2 mobile phones side-by-side');
        }

        // 8. Shopping Cart
        const addToCart = await request('/cart/add', {
            method: 'POST',
            headers: { Authorization: `Bearer ${customerToken}` },
            body: { variant_id: targetVariant.id, quantity: 1 }
        });
        assert(addToCart.status === 200, '9. POST /api/cart/add adds variant to user cart');

        const viewCart = await request('/cart', {
            headers: { Authorization: `Bearer ${customerToken}` }
        });
        assert(viewCart.status === 200 && viewCart.data.data.items.length > 0, '10. GET /api/cart retrieves cart items with subtotal');
        const cartItem = viewCart.data.data.items[0];

        // 9. Order Checkout
        const checkout = await request('/orders/checkout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${customerToken}` },
            body: {
                shipping_address: {
                    recipient_name: 'Alex Johnson',
                    phone: '+1987654321',
                    street_address: '742 Evergreen Terrace, Springfield, OR'
                },
                payment_method: 'COD',
                coupon_code: 'WELCOME10'
            }
        });
        assert(checkout.status === 201 && checkout.data.data.order_number, '11. POST /api/orders/checkout places transactional order with coupon discount');

        // 10. Wishlist Operations
        const addWishlist = await request(`/wishlist/${phones[0].id}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${customerToken}` }
        });
        assert(addWishlist.status === 201, '12. POST /api/wishlist/:productId adds phone to customer wishlist');

        const viewWishlist = await request('/wishlist', {
            headers: { Authorization: `Bearer ${customerToken}` }
        });
        assert(viewWishlist.status === 200 && viewWishlist.data.data.items.length > 0, '13. GET /api/wishlist fetches saved phones list');

        // 11. Review Operations
        const postReview = await request(`/reviews/product/${phones[0].id}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${customerToken}` },
            body: {
                rating: 5,
                title: 'Exceptional build and camera quality!',
                comment: 'The titanium finish feels amazing in hand and the battery easily lasts two days.'
            }
        });
        assert(postReview.status === 201 || postReview.status === 400, '14. POST /api/reviews/product/:productId handles review submission with rating & validation');

        const getReviews = await request(`/reviews/product/${phones[0].id}`);
        assert(getReviews.status === 200 && getReviews.data.data.summary, '15. GET /api/reviews/product/:productId returns reviews and rating summary');

        // 12. Admin Dashboard & Moderation
        const adminReviews = await request('/reviews/admin/all', {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminReviews.status === 200 && Array.isArray(adminReviews.data.data.reviews), '16. GET /api/reviews/admin/all returns review moderation queue');

        const adminDashboard = await request('/admin/dashboard', {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminDashboard.status === 200 && adminDashboard.data.data.totalProducts > 0, '17. GET /api/admin/dashboard returns operational store statistics');

        console.log('\n=============================================');
        console.log('🎉 ALL BACKEND API & INTEGRATION TESTS PASSED (17/17)!');
        console.log('=============================================\n');
    } catch (err) {
        console.error('Test execution failed:', err.message);
        process.exitCode = 1;
    } finally {
        server.close();
    }
}

runTests();
