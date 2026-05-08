/* ==========================================
   OSCAR STORE - JavaScript Functionality
   Handles Navigation, Products, Forms, and Cart
   ========================================== */

// ==========================================
// STATE MANAGEMENT
// ==========================================

// Products Database
const products = [
    // Shirts
    { id: 1, name: 'قميص كلاسيكي أبيض', category: 'shirts', price: 299, description: 'قميص كلاسيكي من القطن النقي' },
    { id: 2, name: 'قميص أسود فاخر', category: 'shirts', price: 349, description: 'قميص أسود بتصميم عصري فاخر' },
    { id: 3, name: 'قميص رمادي عملي', category: 'shirts', price: 279, description: 'قميص رمادي مثالي للاستخدام اليومي' },
    { id: 4, name: 'قميص أزرق ملكي', category: 'shirts', price: 329, description: 'قميص أزرق بتصميم أنيق وفاخر' },
    
    // Pants
    { id: 5, name: 'بنطال أسود كلاسيكي', category: 'pants', price: 449, description: 'بنطال أسود كلاسيكي للعمل والمناسبات' },
    { id: 6, name: 'بنطال بيج عملي', category: 'pants', price: 399, description: 'بنطال بيج مريح وأنيق' },
    { id: 7, name: 'بنطال رمادي مظهري', category: 'pants', price: 429, description: 'بنطال رمادي بتصميم حديث' },
    { id: 8, name: 'بنطال أزرق داكن', category: 'pants', price: 459, description: 'بنطال أزرق داكن عالي الجودة' },
    
    // Jackets
    { id: 9, name: 'جاكيت أسود جلدي', category: 'jackets', price: 799, description: 'جاكيت جلدي أسود فاخر' },
    { id: 10, name: 'جاكيت كاكي عسكري', category: 'jackets', price: 649, description: 'جاكيت كاكي بتصميم عسكري عصري' },
    { id: 11, name: 'جاكيت رمادي رياضي', category: 'jackets', price: 549, description: 'جاكيت رمادي رياضي مريح' },
    { id: 12, name: 'جاكيت بني جلدي سويدي', category: 'jackets', price: 899, description: 'جاكيت بني من الجلد السويدي الفاخر' },
    
    // Accessories
    { id: 13, name: 'ربطة عنق حريرية', category: 'accessories', price: 149, description: 'ربطة عنق حريرية بألوان فاخرة' },
    { id: 14, name: 'حزام جلدي أسود', category: 'accessories', price: 199, description: 'حزام جلدي أسود أصلي عالي الجودة' },
    { id: 15, name: 'ساعة أنيقة ذهبية', category: 'accessories', price: 349, description: 'ساعة ذهبية بتصميم أنيق وبسيط' },
    { id: 16, name: 'محفظة جلدية فاخرة', category: 'accessories', price: 249, description: 'محفظة جلدية سوداء فاخرة' }
];

// Shopping Cart
let cart = [];

// ==========================================
// DOM ELEMENTS REFERENCES
// ==========================================

const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const productsGrid = document.getElementById('productsGrid');
const categoryButtons = document.querySelectorAll('.filter-btn');
const ctaBtn = document.querySelector('.cta-btn');
const contactForm = document.getElementById('contactForm');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDropdown = document.getElementById('cartDropdown');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');

// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================

/**
 * Toggle hamburger menu on mobile
 */
function toggleHamburgerMenu() {
    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    const isExpanded = hamburgerMenu.classList.contains('active');
    hamburgerMenu.setAttribute('aria-expanded', isExpanded);
}

/**
 * Close menu when a link is clicked
 */
function closeMenu() {
    hamburgerMenu.classList.remove('active');
    navMenu.classList.remove('active');
    hamburgerMenu.setAttribute('aria-expanded', false);
}

/**
 * Smooth scroll to sections
 */
function setupSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // CTA Button scroll
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

// ==========================================
// PRODUCTS FUNCTIONALITY
// ==========================================

/**
 * Render products grid based on filter
 * @param {string} filter - Category filter (all, shirts, pants, jackets, accessories)
 */
function renderProducts(filter = 'all') {
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">لا توجد منتجات في هذه الفئة</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

/**
 * Create a product card element
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);

    const categoryLabels = {
        'shirts': 'قمصان',
        'pants': 'بناطيل',
        'jackets': 'جاكيتات',
        'accessories': 'إكسسوارات'
    };

    card.innerHTML = `
        <div class="product-image">
            ${getProductEmoji(product.category)}
        </div>
        <div class="product-info">
            <span class="product-category">${categoryLabels[product.category]}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${product.price} ج.م</span>
                <button class="add-to-cart-btn" data-product-id="${product.id}" aria-label="إضافة ${product.name} إلى السلة">
                    🛒 أضف
                </button>
            </div>
        </div>
    `;

    // Add to cart button
    const addBtn = card.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => addToCart(product));

    return card;
}

/**
 * Get emoji based on product category
 * @param {string} category - Product category
 * @returns {string} Emoji character
 */
function getProductEmoji(category) {
    const emojis = {
        'shirts': '👔',
        'pants': '👖',
        'jackets': '🧥',
        'accessories': '⌚'
    };
    return emojis[category] || '👕';
}

/**
 * Setup category filter buttons
 */
function setupCategoryFilter() {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter products
            const filter = button.getAttribute('data-filter');
            renderProducts(filter);
        });
    });
}

// ==========================================
// SHOPPING CART FUNCTIONALITY
// ==========================================

/**
 * Add product to cart
 * @param {Object} product - Product object to add
 */
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Update UI
    updateCartUI();
    showAddToCartAnimation(product.id);
}

/**
 * Remove product from cart
 * @param {number} productId - Product ID to remove
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

/**
 * Update cart count and dropdown
 */
function updateCartUI() {
    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart list
    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align: center; color: #999;">السلة فارغة</p>';
        cartTotal.textContent = '0 ج.م';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span style="color: #999; font-size: 0.85rem;">x${item.quantity}</span>
                <span class="cart-item-price">${itemTotal} ج.م</span>
                <button style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem;" 
                        aria-label="إزالة ${item.name}" data-product-id="${item.id}">
                    ×
                </button>
            </div>
        `;

        // Remove item button
        const removeBtn = cartItem.querySelector('[data-product-id]');
        removeBtn.addEventListener('click', () => removeFromCart(item.id));

        cartList.appendChild(cartItem);
    });

    cartTotal.textContent = `${total.toLocaleString('ar-EG')} ج.م`;
}

/**
 * Show animation when product is added to cart
 * @param {number} productId - Product ID
 */
function showAddToCartAnimation(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (!productCard) return;

    const addBtn = productCard.querySelector('.add-to-cart-btn');
    const originalText = addBtn.innerHTML;
    
    // Change button appearance
    addBtn.classList.add('added');
    addBtn.innerHTML = '✓ تم الإضافة';
    
    // Reset after 2 seconds
    setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = originalText;
    }, 2000);
}

/**
 * Toggle cart dropdown visibility
 */
function toggleCartDropdown() {
    const isHidden = cartDropdown.hasAttribute('hidden');
    if (isHidden) {
        cartDropdown.removeAttribute('hidden');
    } else {
        cartDropdown.setAttribute('hidden', '');
    }
}

/**
 * Close cart dropdown when clicking outside
 */
function setupCartClickOutside() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cart-preview')) {
            cartDropdown.setAttribute('hidden', '');
        }
    });
}

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================

/**
 * Validate contact form
 * @returns {boolean} True if form is valid
 */
function validateContactForm() {
    let isValid = true;
    const formMessage = document.getElementById('formMessage');
    
    // Clear previous messages
    formMessage.className = '';
    formMessage.textContent = '';

    // Name validation
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        nameError.textContent = 'الاسم مطلوب';
        isValid = false;
    } else if (nameInput.value.trim().length < 3) {
        nameInput.classList.add('error');
        nameError.textContent = 'الاسم يجب أن يكون 3 أحرف على الأقل';
        isValid = false;
    } else {
        nameInput.classList.remove('error');
        nameError.textContent = '';
    }

    // Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        emailInput.classList.add('error');
        emailError.textContent = 'البريد الإلكتروني مطلوب';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('error');
        emailError.textContent = 'البريد الإلكتروني غير صحيح';
        isValid = false;
    } else {
        emailInput.classList.remove('error');
        emailError.textContent = '';
    }

    // Subject validation
    const subjectInput = document.getElementById('subject');
    const subjectError = document.getElementById('subjectError');
    if (!subjectInput.value.trim()) {
        subjectInput.classList.add('error');
        subjectError.textContent = 'الموضوع مطلوب';
        isValid = false;
    } else if (subjectInput.value.trim().length < 5) {
        subjectInput.classList.add('error');
        subjectError.textContent = 'الموضوع يجب أن يكون 5 أحرف على الأقل';
        isValid = false;
    } else {
        subjectInput.classList.remove('error');
        subjectError.textContent = '';
    }

    // Message validation
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('messageError');
    if (!messageInput.value.trim()) {
        messageInput.classList.add('error');
        messageError.textContent = 'الرسالة مطلوبة';
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        messageError.textContent = 'الرسالة يجب أن تكون 10 أحرف على الأقل';
        isValid = false;
    } else {
        messageInput.classList.remove('error');
        messageError.textContent = '';
    }

    return isValid;
}

/**
 * Handle contact form submission
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formMessage = document.getElementById('formMessage');
    
    // Validate form
    if (!validateContactForm()) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'يرجى تصحيح الأخطاء أعلاه';
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Simulate form submission (in real scenario, send to server)
    console.log('Form submitted:', formData);
    
    // Show success message
    formMessage.className = 'form-message success';
    formMessage.textContent = '✓ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';
    
    // Reset form
    contactForm.reset();
    
    // Clear message after 5 seconds
    setTimeout(() => {
        formMessage.className = '';
        formMessage.textContent = '';
    }, 5000);
}

/**
 * Setup form input real-time validation
 */
function setupFormValidation() {
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            // Remove error state when user starts typing
            input.classList.remove('error');
        });
    });
}

// ==========================================
// ACCESSIBILITY
// ==========================================

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Close menu on Escape
        if (e.key === 'Escape') {
            closeMenu();
            cartDropdown.setAttribute('hidden', '');
        }
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize the application
 */
function init() {
    // Setup navigation
    hamburgerMenu.addEventListener('click', toggleHamburgerMenu);
    setupSmoothScroll();

    // Setup products
    renderProducts('all');
    setupCategoryFilter();

    // Setup cart
    cartBtn.addEventListener('click', toggleCartDropdown);
    setupCartClickOutside();

    // Setup contact form
    contactForm.addEventListener('submit', handleContactFormSubmit);
    setupFormValidation();

    // Setup accessibility
    setupKeyboardNavigation();

    // Log initialization
    console.log('✓ OSCAR STORE initialized successfully');
}

// ==========================================
// EVENT LISTENERS & INITIALIZATION
// ==========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format number as Arabic locale
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
function formatArabicNumber(number) {
    return number.toLocaleString('ar-EG');
}

/**
 * Get current time in formatted string
 * @returns {string} Formatted time
 */
function getCurrentTime() {
    return new Date().toLocaleTimeString('ar-EG');
}

/**
 * Log with timestamp
 * @param {string} message - Message to log
 */
function logWithTimestamp(message) {
    console.log(`[${getCurrentTime()}] ${message}`);
}

// ==========================================
// PERFORMANCE MONITORING
// ==========================================

/**
 * Track page performance
 */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        logWithTimestamp(`Page load time: ${pageLoadTime}ms`);
    });
}
