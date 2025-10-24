/**
 * Chocolateria Sünde - Gallery & Lightbox
 * Handles image gallery and lightbox functionality
 */

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Gallery state
let currentImageIndex = 0;
let galleryImages = [];

// ===================================
// Gallery Initialization
// ===================================

/**
 * Initialize gallery
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryItems.length) {
        console.warn('No gallery items found');
        return;
    }

    // Store all images
    galleryImages = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt
        };
    });

    // Add click handlers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));

        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image ${index + 1}`);

        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    console.log(`Gallery initialized with ${galleryImages.length} images`);
}

// ===================================
// Lightbox Functions
// ===================================

/**
 * Open lightbox with specific image
 */
function openLightbox(index) {
    if (index < 0 || index >= galleryImages.length) {
        console.error('Invalid image index:', index);
        return;
    }

    currentImageIndex = index;
    const image = galleryImages[index];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Preload adjacent images for smooth navigation
    preloadAdjacentImages(index);
}

/**
 * Close lightbox
 */
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImage.src = '';
}

/**
 * Show next image
 */
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    const image = galleryImages[currentImageIndex];

    // Fade transition
    lightboxImage.style.opacity = '0';

    setTimeout(() => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxImage.style.opacity = '1';

        preloadAdjacentImages(currentImageIndex);
    }, 200);
}

/**
 * Show previous image
 */
function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentImageIndex];

    // Fade transition
    lightboxImage.style.opacity = '0';

    setTimeout(() => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxImage.style.opacity = '1';

        preloadAdjacentImages(currentImageIndex);
    }, 200);
}

/**
 * Preload adjacent images for better performance
 */
function preloadAdjacentImages(index) {
    const nextIndex = (index + 1) % galleryImages.length;
    const prevIndex = (index - 1 + galleryImages.length) % galleryImages.length;

    [nextIndex, prevIndex].forEach(i => {
        const img = new Image();
        img.src = galleryImages[i].src;
    });
}

// ===================================
// Event Handlers
// ===================================

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(e) {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
        case 'ArrowLeft':
            showPreviousImage();
            break;
    }
}

/**
 * Handle touch/swipe gestures
 */
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPreviousImage();
        }
    }
}

/**
 * Close lightbox when clicking on background
 */
function handleLightboxClick(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
}

// ===================================
// Event Listeners
// ===================================

// Lightbox controls
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextImage);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPreviousImage);
}

// Keyboard navigation
document.addEventListener('keydown', handleKeyboardNavigation);

// Touch/swipe gestures
if (lightbox) {
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    lightbox.addEventListener('click', handleLightboxClick);
}

// Add smooth opacity transition to lightbox image
if (lightboxImage) {
    lightboxImage.style.transition = 'opacity 0.2s ease';
}

// ===================================
// Initialize on DOM Load
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    console.log('Gallery module loaded successfully! 📸');
});

// ===================================
// Lazy Loading for Gallery Images
// ===================================

/**
 * Implement lazy loading for gallery images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// Initialize lazy loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// Export functions for external use
window.GalleryModule = {
    openLightbox,
    closeLightbox,
    showNextImage,
    showPreviousImage
};
