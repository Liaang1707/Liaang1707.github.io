// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const searchResultsList = document.getElementById('searchResultsList');
const closeSearchBtn = document.getElementById('closeSearch');
const backToTopBtn = document.getElementById('backToTop');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const addToCartBtns = document.querySelectorAll('.btn-add-cart');

// Cart state
let cart = [];

// Search functionality
const searchableContent = [
    {
        title: 'Nguyễn Văn A',
        content: 'Xin chào, tôi là Nguyễn Văn A. Lập trình viên đam mê tạo ra những sản phẩm công nghệ sáng tạo',
        section: 'hero'
    },
    {
        title: 'Dự Án Của Tôi',
        content: 'Những dự án mà tôi đã thực hiện. Website âm nhạc, game phiêu lưu',
        section: 'products'
    },
    {
        title: 'Website Âm Nhạc',
        content: 'Trang web nghe nhạc online với tính năng phát nhạc, tạo playlist và khám phá âm nhạc mới',
        section: 'products'
    },
    {
        title: 'Game Phiêu Lưu',
        content: 'Game được tạo từ source code mua về và tùy chỉnh theo ý tưởng cá nhân. Đã hoàn thành',
        section: 'products'
    },

    {
        title: 'Về Tôi',
        content: 'Thông tin cá nhân và kỹ năng. Giới thiệu bản thân, lập trình web, phát triển game',
        section: 'services'
    },
    {
        title: 'Giới Thiệu Bản Thân',
        content: 'Tìm hiểu thêm về tôi, thông tin cá nhân và những điều thú vị về cuộc sống của tôi. Xem chi tiết',
        section: 'services'
    },
    {
        title: 'Lập Trình Web',
        content: 'Chuyên về phát triển website và ứng dụng web với các công nghệ hiện đại',
        section: 'services'
    },
    {
        title: 'Phát Triển Game',
        content: 'Tạo ra các trò chơi thú vị và có tính giải trí cao cho nhiều nền tảng',
        section: 'services'
    },
    {
        title: 'Liên Hệ',
        content: 'Thông tin liên hệ. Địa chỉ 123 Đường ABC, Quận XYZ, Hà Nội. Điện thoại 0123 456 789. Email example@email.com',
        section: 'contact'
    },
    {
        title: 'Kết Nối Với Tôi',
        content: 'Facebook Zalo Instagram YouTube kết nối với tôi',
        section: 'contact'
    }
];

// Search function
function performSearch(query) {
    const results = [];
    const searchTerm = query.toLowerCase().trim();

    if (searchTerm.length === 0) {
        return results;
    }

    searchableContent.forEach(item => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const contentMatch = item.content.toLowerCase().includes(searchTerm);

        if (titleMatch || contentMatch) {
            // Calculate relevance score
            let score = 0;
            if (titleMatch) score += 2;
            if (contentMatch) score += 1;

            // Highlight matching text
            const highlightedContent = highlightText(item.content, searchTerm);

            results.push({
                ...item,
                score: score,
                highlightedContent: highlightedContent
            });
        }
    });

    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);

    return results;
}

// Highlight matching text
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Display search results
function displaySearchResults(results) {
    searchResultsList.innerHTML = '';

    if (results.length === 0) {
        searchResultsList.innerHTML = '<div class="no-results">Không tìm thấy kết quả nào</div>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-content">${result.highlightedContent}</div>
        `;

        resultItem.addEventListener('click', () => {
            scrollToSection(result.section);
            closeSearchResults();
        });

        searchResultsList.appendChild(resultItem);
    });
}

// Scroll to section
function scrollToSection(sectionId) {
    let element;

    if (sectionId === 'hero') {
        element = document.querySelector('.hero');
    } else {
        element = document.getElementById(sectionId);
    }

    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Show search results
function showSearchResults() {
    searchResults.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close search results
function closeSearchResults() {
    searchResults.classList.add('hidden');
    document.body.style.overflow = 'auto';
    searchInput.value = '';
}

// Search event listeners
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            const results = performSearch(query);
            displaySearchResults(results);
            showSearchResults();
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const results = performSearch(query);
                displaySearchResults(results);
                showSearchResults();
            }
        }
    });

    // Real-time search suggestions
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
            const results = performSearch(query);
            if (results.length > 0) {
                // Could implement dropdown suggestions here
            }
        }
    }, 300));
}

// Close search results
if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearchResults);
}

// Close search results when clicking outside
if (searchResults) {
    searchResults.addEventListener('click', (e) => {
        if (e.target === searchResults) {
            closeSearchResults();
        }
    });
}

// Close search results with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchResults && !searchResults.classList.contains('hidden')) {
        closeSearchResults();
    }
});

// Bookmark functionality
function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartCount();
    showNotification(`${productName} đã được thêm vào danh sách yêu thích!`);
}

function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add to cart event listeners
addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;

        addToCart(productName, productPrice);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .service-card, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-results {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
        font-style: italic;
    }
    
    mark {
        background-color: #ffeb3b;
        padding: 0.1rem 0.2rem;
        border-radius: 3px;
    }
`;
document.head.appendChild(style);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loaded');

    // Initialize cart count
    updateCartCount();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
}

// Track user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-add-cart')) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard ? productCard.querySelector('.product-title').textContent : 'Unknown';
        trackEvent('add_to_cart', { product: productName });
    }

    if (e.target.matches('.social-link')) {
        trackEvent('social_link_click', { platform: e.target.textContent });
    }
});

// Sakura falling effect
const canvas = document.getElementById('sakura-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

class Sakura {
    constructor() {
        this.x = randomBetween(0, width);
        this.y = randomBetween(-height, 0);
        this.size = randomBetween(12, 24);
        this.speedY = randomBetween(1, 2.5);
        this.speedX = randomBetween(-0.5, 0.5);
        this.angle = randomBetween(0, 2 * Math.PI);
        this.angleSpeed = randomBetween(-0.02, 0.02);
        this.opacity = randomBetween(0.7, 1);
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // Petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            this.size / 2, -this.size / 2,
            this.size, this.size / 3,
            0, this.size
        );
        ctx.bezierCurveTo(
            -this.size, this.size / 3,
            -this.size / 2, -this.size / 2,
            0, 0
        );
        ctx.fillStyle = 'pink';
        ctx.shadowColor = '#ffb6d5';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.angleSpeed;
        if (this.y > height + 20 || this.x < -40 || this.x > width + 40) {
            this.x = randomBetween(0, width);
            this.y = randomBetween(-40, 0);
            this.size = randomBetween(12, 24);
            this.speedY = randomBetween(1, 2.5);
            this.speedX = randomBetween(-0.5, 0.5);
            this.angle = randomBetween(0, 2 * Math.PI);
            this.opacity = randomBetween(0.7, 1);
        }
    }
}

const sakuraCount = 40;
const sakuras = [];
for (let i = 0; i < sakuraCount; i++) {
    sakuras.push(new Sakura());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const s of sakuras) {
        s.update();
        s.draw(ctx);
    }
    requestAnimationFrame(animate);
}
animate();

// Fade-in effect
document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });
    fadeEls.forEach(el => observer.observe(el));
});

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }
});
backToTop.onclick = () => window.scrollTo({top:0,behavior:'smooth'});