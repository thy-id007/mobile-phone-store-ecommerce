import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    // Nav
    home: 'Home',
    all_phones: 'All Phones',
    catalog: 'Catalog',
    compare: 'Compare',
    categories: 'Categories',
    brands: 'Brands',
    wishlist: 'Wishlist',
    cart: 'Cart',
    search_placeholder: 'Search smartphones (e.g. iPhone, Galaxy, 256GB)...',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin_panel: 'Admin Dashboard',
    my_orders: 'My Orders',
    my_profile: 'My Profile',
    switch_language: 'Language',

    // Hero & Home
    hero_badge: '⚡ Official 2026 Smartphone Releases Available Now',
    hero_title: 'Next-Gen Mobile Innovation',
    hero_subtitle: 'Discover, compare, and order the world’s most powerful smartphones with aerospace-grade builds, AI computing, and official warranty.',
    view_catalog: 'Explore Catalog',
    compare_phones: 'Compare Phones',
    featured_phones: 'Featured Smartphones',
    shop_by_brand: 'Shop by Brand',
    explore_categories: 'Explore Categories',

    // Trust Badges
    trust_genuine: '100% Genuine Guaranteed',
    trust_genuine_desc: 'Direct from authorized manufacturers',
    trust_warranty: '1-Year Official Warranty',
    trust_warranty_desc: 'Comprehensive coverage & quick service',
    trust_delivery: 'Fast Nationwide Delivery',
    trust_delivery_desc: 'Free shipping on orders over $500',
    trust_support: '24/7 Expert Support',
    trust_support_desc: 'Dedicated technical assistance',

    // Catalog & Filter
    filters: 'Filters',
    clear_filters: 'Reset Filters',
    price_range: 'Price Range',
    all_brands: 'All Brands',
    all_categories: 'All Categories',
    sort_by: 'Sort By',
    sort_newest: 'Newest Releases',
    sort_price_asc: 'Price: Low to High',
    sort_price_desc: 'Price: High to Low',
    sort_rating: 'Customer Rating',
    results_found: 'smartphones found',

    // Product Card & Detail
    add_to_cart: 'Add to Cart',
    buy_now: 'Buy Now',
    view_details: 'View Details',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    color: 'Color',
    storage: 'Storage',
    ram: 'RAM',
    specs: 'Specifications',
    display: 'Display',
    processor: 'Processor',
    camera: 'Camera',
    battery: 'Battery',
    os: 'Operating System',
    description: 'Description',
    reviews: 'Reviews & Ratings',
    write_review: 'Write a Review',
    rating: 'Rating',
    review_submit: 'Submit Review',

    // Comparison
    comparison_title: 'Smartphone Side-by-Side Comparison',
    compare_up_to: 'Compare up to 3 devices across display, processor, camera, battery, and price.',
    add_more_compare: 'Add more devices from the catalog to compare.',

    // Cart & Checkout
    shopping_cart: 'Shopping Cart',
    cart_empty: 'Your Shopping Cart is Empty',
    cart_empty_desc: 'Explore our latest flagship and budget smartphones with transparent pricing.',
    browse_smartphones: 'Browse All Smartphones',
    clear_cart: 'Clear Cart',
    subtotal: 'Subtotal',
    shipping: 'Shipping Fee',
    free: 'FREE',
    total: 'Total Amount',
    checkout: 'Proceed to Checkout',
    coupon_code: 'Discount Coupon',
    apply_coupon: 'Apply',
    place_order: 'Place Order',
    shipping_address: 'Shipping Address',
    payment_method: 'Payment Method',
    cash_on_delivery: 'Cash on Delivery (COD)',
    bank_transfer: 'Bank Transfer (QR Code)',
    qr_payment_title: 'Bank Transfer (QR Code Payment)',
    qr_scan_instruction: 'Scan QR code with your mobile banking app (ABA, Wing, ACLEDA, Bakong, etc.) to complete payment.',
    qr_merchant_name: 'Merchant Name',
    qr_account_number: 'Account Number',
    qr_amount_due: 'Total Amount Due',
    qr_copied: 'Copied!',
    qr_copy_account: 'Copy',
    qr_done_button: 'I Have Paid / Continue',
    qr_close: 'Close',
    qr_view_button: 'Scan QR Code Now',

    // Orders
    order_history: 'Order History',
    order_number: 'Order Number',
    order_date: 'Date',
    order_status: 'Status',
    status_pending: 'Pending',
    status_processing: 'Processing',
    status_shipped: 'Shipped',
    status_delivered: 'Delivered',
    status_cancelled: 'Cancelled',
  },

  km: {
    // Nav
    home: 'ទំព័រដើម',
    all_phones: 'ទូរស័ព្ទទាំងអស់',
    catalog: 'កាតាឡុក',
    compare: 'ប្រៀបធៀប',
    categories: 'ប្រភេទ',
    brands: 'ម៉ាកទូរស័ព្ទ',
    wishlist: 'បញ្ជីប្រាថ្នា',
    cart: 'កន្ត្រកទំនិញ',
    search_placeholder: 'ស្វែងរកទូរស័ព្ទ (ឧ. iPhone, Galaxy, 256GB)...',
    login: 'ចូលគណនី',
    register: 'ចុះឈ្មោះ',
    logout: 'ចាកចេញ',
    admin_panel: 'ផ្ទាំងគ្រប់គ្រង Admin',
    my_orders: 'ការបញ្ជាទិញរបស់ខ្ញុំ',
    my_profile: 'គណនីរបស់ខ្ញុំ',
    switch_language: 'ភាសា',

    // Hero & Home
    hero_badge: '⚡ ស្មាតហ្វូនស៊េរីថ្មីឆ្នាំ 2026 មានលក់ជាផ្លូវការហើយ',
    hero_title: 'បច្ចេកវិទ្យាស្មាតហ្វូនជំនាន់ក្រោយ',
    hero_subtitle: 'ស្វែងរក ប្រៀបធៀប និងបញ្ជាទិញទូរស័ព្ទឈានមុខគេលើពិភពលោក ជាមួយនឹងតួធ្វើពីទីតានីញ៉ូម បន្ទះឈីប AI និងការធានាផ្លូវការ។',
    view_catalog: 'ទស្សនាកាតាឡុក',
    compare_phones: 'ប្រៀបធៀបទូរស័ព្ទ',
    featured_phones: 'ទូរស័ព្ទពេញនិយមពិសេស',
    shop_by_brand: 'ជ្រើសរើសតាមម៉ាក',
    explore_categories: 'ជ្រើសរើសតាមប្រភេទ',

    // Trust Badges
    trust_genuine: 'ធានាផលិតផលសុទ្ធ 100%',
    trust_genuine_desc: 'នាំចូលផ្ទាល់ពីរោងចក្រផ្លូវការ',
    trust_warranty: 'ធានាផ្លូវការរយៈពេល 1 ឆ្នាំ',
    trust_warranty_desc: 'សេវាជួសជុលរហ័ស និងទំនុកចិត្តខ្ពស់',
    trust_delivery: 'ដឹកជញ្ជូនរហ័សទូទាំងប្រទេស',
    trust_delivery_desc: 'ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការទិញលើសពី $500',
    trust_support: 'សេវាបម្រើអតិថិជន 24/7',
    trust_support_desc: 'ក្រុមការងារជំនាញត្រៀមជួយគ្រប់ពេល',

    // Catalog & Filter
    filters: 'តម្រងស្វែងរក',
    clear_filters: 'កំណត់ឡើងវិញ',
    price_range: 'កម្រិតតម្លៃ',
    all_brands: 'គ្រប់ម៉ាកទាំងអស់',
    all_categories: 'គ្រប់ប្រភេទទាំងអស់',
    sort_by: 'តម្រៀបតាម',
    sort_newest: 'ម៉ូដែលចេញថ្មីបំផុត',
    sort_price_asc: 'តម្លៃ: ពីទាបទៅខ្ពស់',
    sort_price_desc: 'តម្លៃ: ពីខ្ពស់ទៅទាប',
    sort_rating: 'ពិន្ទុវាយតម្លៃខ្ពស់',
    results_found: 'ទូរស័ព្ទត្រូវបានរកឃើញ',

    // Product Card & Detail
    add_to_cart: 'ទិញដាក់កន្ត្រក',
    buy_now: 'ទិញឥឡូវនេះ',
    view_details: 'មើលលម្អិត',
    in_stock: 'មានក្នុងស្តុក',
    out_of_stock: 'អស់ពីស្តុក',
    color: 'ពណ៌',
    storage: 'អង្គផ្ទុកទិន្នន័យ',
    ram: 'រ៉េម (RAM)',
    specs: 'លក្ខណៈបច្ចេកទេស',
    display: 'អេក្រង់',
    processor: 'បន្ទះឈីប',
    camera: 'កាមេរ៉ា',
    battery: 'ថាមពលថ្ម',
    os: 'ប្រព័ន្ធប្រតិបត្តិការ',
    description: 'ការពិពណ៌នា',
    reviews: 'ការវាយតម្លៃ និងពិន្ទុ',
    write_review: 'សរសេរការវាយតម្លៃ',
    rating: 'ពិន្ទុផ្កាយ',
    review_submit: 'ផ្ញើការវាយតម្លៃ',

    // Comparison
    comparison_title: 'ការប្រៀបធៀបស្មាតហ្វូនទន្ទឹមគ្នា',
    compare_up_to: 'ប្រៀបធៀបទូរស័ព្ទរហូតដល់ 3 គ្រឿងលើផ្នែកអេក្រង់ បន្ទះឈីប កាមេរ៉ា ថ្ម និងតម្លៃ។',
    add_more_compare: 'សូមបន្ថែមទូរស័ព្ទពីកាតាឡុកដើម្បីប្រៀបធៀប។',

    // Cart & Checkout
    shopping_cart: 'កន្ត្រកទំនិញ',
    cart_empty: 'កន្ត្រកទំនិញរបស់អ្នកទទេ',
    cart_empty_desc: 'សូមស្វែងរកទូរស័ព្ទកំពូលៗ និងទូរស័ព្ទតម្លៃសមរម្យជាច្រើនម៉ូដែល។',
    browse_smartphones: 'ស្វែងរកទូរស័ព្ទទាំងអស់',
    clear_cart: 'សម្អាតកន្ត្រក',
    subtotal: 'សរុបបណ្តោះអាសន្ន',
    shipping: 'ថ្លៃដឹកជញ្ជូន',
    free: 'ឥតគិតថ្លៃ',
    total: 'ទឹកប្រាក់សរុប',
    checkout: 'បន្តទៅការទូទាត់ប្រាក់',
    coupon_code: 'ប័ណ្ណបញ្ចុះតម្លៃ',
    apply_coupon: 'អនុវត្ត',
    place_order: 'បញ្ជាទិញឥឡូវនេះ',
    shipping_address: 'អាសយដ្ឋានដឹកជញ្ជូន',
    payment_method: 'វិធីសាស្ត្រទូទាត់ប្រាក់',
    cash_on_delivery: 'ទូទាត់ពេលទទួលទំនិញ (COD)',
    bank_transfer: 'ផ្ទេរប្រាក់តាមធនាគារ (QR Code)',
    qr_payment_title: 'ការទូទាត់តាមធនាគារ (KHQR Code)',
    qr_scan_instruction: 'សូមបើកកម្មវិធីធនាគារចល័តរបស់អ្នក (ABA, Wing, ACLEDA, Bakong) រួចស្កេន QR Code ដើម្បីទូទាត់ប្រាក់។',
    qr_merchant_name: 'ឈ្មោះអាជីវកម្ម',
    qr_account_number: 'លេខគណនីធនាគារ',
    qr_amount_due: 'ចំនួនទឹកប្រាក់ត្រូវបង់',
    qr_copied: 'បានចម្លងរួចរាល់!',
    qr_copy_account: 'ចម្លង',
    qr_done_button: 'ខ្ញុំបានទូទាត់រួចរាល់ / បន្ត',
    qr_close: 'បិទ',
    qr_view_button: 'ស្កេន QR Code ឥឡូវនេះ',

    // Orders
    order_history: 'ប្រវត្តិការបញ្ជាទិញ',
    order_number: 'លេខកូដបញ្ជាទិញ',
    order_date: 'កាលបរិច្ឆេទ',
    order_status: 'ស្ថានភាព',
    status_pending: 'រង់ចាំពិនិត្យ',
    status_processing: 'កំពុងរៀបចំ',
    status_shipped: 'កំពុងដឹកជញ្ជូន',
    status_delivered: 'បានដឹកជញ្ជូនដល់',
    status_cancelled: 'បានលុបចោល',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('nexus_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'km') {
      setLanguageState(lang);
      localStorage.setItem('nexus_lang', lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'km' : 'en';
    setLanguage(nextLang);
  };

  const t = (key, fallback = '') => {
    return translations[language]?.[key] || translations['en']?.[key] || fallback || key;
  };

  useEffect(() => {
    // Set html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
