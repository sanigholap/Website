document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navButtons.classList.toggle('active');
        });
    }
    
    // Initialize Slider
    initSlider();
    
    // Add animation classes when elements come into view
    observeElements();
});

// Slider functionality
function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!slider || !slides.length) return;
    
    let currentIndex = 0;
    const slidesPerView = getSlidesPerView();
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - slidesPerView);
    
    // Create dots
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
    
    // Set up automatic sliding
    let autoSlideInterval = setInterval(() => {
        goToSlide((currentIndex + 1) > maxIndex ? 0 : currentIndex + 1);
    }, 5000);
    
    // Pause auto-slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            goToSlide((currentIndex + 1) > maxIndex ? 0 : currentIndex + 1);
        }, 5000);
    });
    
    // Add touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swiped left, go to next slide
            goToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right, go to previous slide
            goToSlide(currentIndex - 1);
        }
    }
    
    // Navigate to a specific slide
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        
        currentIndex = index;
        
        // Implement parallax effect by using different speeds for elements
        const cardWidth = slides[0].offsetWidth;
        const translateX = -currentIndex * cardWidth;
        
        slider.style.transform = `translateX(${translateX}px)`;
        
        // Apply parallax effect to each slide
        slides.forEach((slide, i) => {
            const distance = i - currentIndex;
            const absDistance = Math.abs(distance);
            
            // Apply different translations based on position relative to current slide
            if (distance !== 0) {
                const scale = 0.9 - (absDistance * 0.05);
                const opacity = 1 - (absDistance * 0.3);
                const zIndex = 10 - absDistance;
                
                slide.style.transform = `scale(${scale})`;
                slide.style.opacity = opacity;
                slide.style.zIndex = zIndex;
            } else {
                slide.style.transform = 'scale(1)';
                slide.style.opacity = 1;
                slide.style.zIndex = 10;
            }
        });
        
        // Update active dot
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Reset slider when window is resized
    window.addEventListener('resize', () => {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            location.reload(); // Simple way to handle responsive changes
        }
    });
    
    // Initialize first slide with correct styles
    goToSlide(0);
}

// Determine how many slides to show based on viewport width
function getSlidesPerView() {
    if (window.innerWidth < 768) {
        return 1;
    } else if (window.innerWidth < 992) {
        return 2;
    } else {
        return 3;
    }
}

// Intersection Observer for animations when scrolling
function observeElements() {
    const elements = document.querySelectorAll('.section-header, .feature-card, .service-item, .stat-card');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        elements.forEach(el => {
            el.classList.add('fade-in');
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('service-item')) {
                    entry.target.classList.add('slide-up');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        observer.observe(el);
    });
}