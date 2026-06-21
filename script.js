// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');
let lastScrollPos = 0;

window.addEventListener('scroll', () => {
    const currentScrollPos = window.scrollY;
    
    if (currentScrollPos > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    }
    
    lastScrollPos = currentScrollPos;
});

// Button interactions
const btns = document.querySelectorAll('[class*="btn"]');
btns.forEach(btn => {
    btn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('mouseup', function() {
        this.style.transform = '';
    });
});

// Search functionality
const searchBtn = document.querySelector('.btn-search');
const searchInputs = document.querySelectorAll('.search-input');

if (searchBtn) {
    searchBtn.addEventListener('click', function() {
        const service = searchInputs[0].value;
        const location = searchInputs[1].value;
        
        if (service.trim() === '' || location.trim() === '') {
            alert('Please fill in both fields');
            return;
        }
        
        console.log(`Searching for: ${service} in ${location}`);
        // Redirect to search results page
        window.location.href = `/search?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`;
    });
}

// Category cards hover effect
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        const categoryName = this.querySelector('h3').textContent;
        console.log(`Selected category: ${categoryName}`);
        // Redirect to category page
        window.location.href = `/category/${categoryName.toLowerCase()}`;
    });
});

// Professional cards - Get Quote button
const getQuoteButtons = document.querySelectorAll('.btn-secondary');
getQuoteButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const proName = this.closest('.pro-card').querySelector('h3').textContent;
        console.log(`Getting quote from: ${proName}`);
        // Redirect to quote form
        window.location.href = `/quote?professional=${encodeURIComponent(proName)}`;
    });
});

// CTA buttons
const ctaBtn = document.querySelector('.btn-primary-large');
if (ctaBtn) {
    ctaBtn.addEventListener('click', function() {
        console.log('Navigating to project posting page');
        window.location.href = '/post-project';
    });
}

// Pro signup button
const proSignupBtn = document.querySelector('.btn-gold');
if (proSignupBtn) {
    proSignupBtn.addEventListener('click', function() {
        console.log('Navigating to professional signup');
        window.location.href = '/become-pro';
    });
}

// Navigation button interactions
const joinBtn = document.querySelector('.nav-buttons .btn-primary');
const loginBtn = document.querySelector('.nav-buttons .btn-login');

if (joinBtn) {
    joinBtn.addEventListener('click', function() {
        window.location.href = '/become-pro';
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        window.location.href = '/login';
    });
}

// Parallax effect for hero section (optional)
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroSection = document.querySelector('.hero');
        const heroTop = heroSection.offsetTop;
        
        if (scrollPosition < heroTop + heroSection.offsetHeight) {
            const parallaxValue = (scrollPosition - heroTop) * 0.5;
            heroImage.style.transform = `translateY(${parallaxValue}px)`;
        }
    });
}

// Add animation to elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe category cards for animation
categoryCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe professional cards
document.querySelectorAll('.pro-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe step cards
document.querySelectorAll('.step').forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(20px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(step);
});

// Log app initialization
console.log('Eagle Home - App initialized successfully');
console.log('Gold Eagle logo color: #D4AF37');
console.log('All interactive elements are functional');