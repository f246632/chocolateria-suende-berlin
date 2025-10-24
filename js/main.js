/**
 * Chocolateria Sünde - Main JavaScript
 * Handles navigation, smooth scrolling, and form interactions
 */

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ===================================
// Navigation Functions
// ===================================

/**
 * Handle navbar scroll effect
 */
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

/**
 * Close mobile menu when clicking outside
 */
function closeMobileMenuOnClickOutside(event) {
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Smooth scroll to section
 */
function smoothScrollToSection(event) {
    event.preventDefault();

    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update active link
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

/**
 * Update active nav link on scroll
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = navbar.offsetHeight;
    const scrollPosition = window.scrollY + navHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===================================
// Form Handling
// ===================================

/**
 * Handle contact form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
        showNotification('Bitte füllen Sie alle erforderlichen Felder aus.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
        return;
    }

    // Here you would normally send the data to a server
    // For this demo, we'll just show a success message
    console.log('Form submitted:', { name, email, subject, message });

    showNotification('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.', 'success');
    contactForm.reset();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1.5rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        zIndex: '10000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out',
        backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
        color: 'white',
        fontFamily: 'var(--font-body)'
    });

    // Add to DOM
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
}

// ===================================
// Animation on Scroll
// ===================================

/**
 * Intersection Observer for scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.feature-item, .menu-item, .gallery-item, .review-card, .info-card'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .notification {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .notification p {
        margin: 0;
        color: white;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    }

    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// ===================================
// Event Listeners
// ===================================

// Scroll events
window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveNavLink();
});

// Mobile menu toggle
navToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu on outside click
document.addEventListener('click', closeMobileMenuOnClickOutside);

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', smoothScrollToSection);
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// ===================================
// Initialize on DOM Load
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial navbar state
    handleNavbarScroll();

    // Initialize scroll animations
    initScrollAnimations();

    // Set first nav link as active
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    console.log('Chocolateria Sünde website loaded successfully! ☕🍫');
});

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function for performance
 */
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

// Export functions for external use
window.ChocolateriaSunde = {
    smoothScrollToSection,
    showNotification,
    toggleMobileMenu
};
