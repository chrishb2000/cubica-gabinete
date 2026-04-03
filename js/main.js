/**
 * Cubica Gabinete LLC - Main JavaScript
 * Handles: Carousel, Language Switcher, Modal, Navigation, Scroll Effects
 * Author: Christian Herencia
 */

(function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const langButtons = document.querySelectorAll('.lang-btn');
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolioModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const scrollTopBtn = document.getElementById('scrollTop');
    const translatableElements = document.querySelectorAll('[data-en]');

    // ===================================
    // Language Switcher
    // ===================================
    let currentLang = localStorage.getItem('preferredLanguage') || 'en';

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        // Update all translatable elements
        translatableElements.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update active state on language buttons
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update meta tags
        updateMetaTags(lang);
    }

    function updateMetaTags(lang) {
        const titleTag = document.querySelector('title');
        if (titleTag && titleTag.getAttribute(`data-${lang}`)) {
            titleTag.textContent = titleTag.getAttribute(`data-${lang}`);
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && metaDescription.getAttribute(`data-${lang}`)) {
            metaDescription.setAttribute('content', metaDescription.getAttribute(`data-${lang}`));
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && metaKeywords.getAttribute(`data-${lang}`)) {
            metaKeywords.setAttribute('content', metaKeywords.getAttribute(`data-${lang}`));
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && ogTitle.getAttribute(`data-${lang}`)) {
            ogTitle.setAttribute('content', ogTitle.getAttribute(`data-${lang}`));
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && ogDescription.getAttribute(`data-${lang}`)) {
            ogDescription.setAttribute('content', ogDescription.getAttribute(`data-${lang}`));
        }
    }

    // Event listeners for language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateLanguage(btn.dataset.lang);
        });
    });

    // Initialize language
    updateLanguage(currentLang);

    // ===================================
    // Mobile Navigation
    // ===================================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===================================
    // Active Navigation Link
    // ===================================
    const sections = document.querySelectorAll('section[id]');

    function setActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // ===================================
    // Hero Carousel
    // ===================================
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    function startCarousel() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopCarousel() {
        clearInterval(slideInterval);
    }

    // Event listeners for carousel buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopCarousel();
        startCarousel();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopCarousel();
        startCarousel();
    });

    // Pause carousel on hover
    carouselTrack.addEventListener('mouseenter', stopCarousel);
    carouselTrack.addEventListener('mouseleave', startCarousel);

    // Touch support for carousel
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
            stopCarousel();
            startCarousel();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
            stopCarousel();
            startCarousel();
        }
    }

    // Start carousel
    startCarousel();

    // ===================================
    // Portfolio Modal
    // ===================================
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageSrc = item.dataset.image;
            modalImage.src = imageSrc;
            modalImage.alt = item.querySelector('img').alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalImage.src = '';
        }, 300);
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ===================================
    // Scroll to Top Button
    // ===================================
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Scroll Animations (Intersection Observer)
    // ===================================
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .feature, .contact-item');

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ===================================
    // Update Copyright Year
    // ===================================
    const yearElement = document.getElementById('currentYear');
    yearElement.textContent = new Date().getFullYear();

    // ===================================
    // Performance: Debounce Function
    // ===================================
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

    // ===================================
    // Lazy Loading Images (Native Support)
    // ===================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // Keyboard Navigation for Carousel
    // ===================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopCarousel();
            startCarousel();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopCarousel();
            startCarousel();
        }
    });

    // ===================================
    // Preload Hero Images
    // ===================================
    function preloadImages() {
        const images = document.querySelectorAll('.carousel-slide');
        images.forEach(slide => {
            const bgImage = slide.style.backgroundImage;
            if (bgImage) {
                const imageUrl = bgImage.replace(/url\(['"]?([^'"]+)['"]?\)/i, '$1');
                const img = new Image();
                img.src = imageUrl;
            }
        });
    }

    preloadImages();

    // ===================================
    // Console Welcome Message
    // ===================================
    console.log('%c Cubica Gabinete LLC ', 'background: #8B5A2B; color: #fff; font-size: 20px; padding: 10px; border-radius: 5px;');
    console.log('%c Custom Woodwork & Cabinetry in Miami, FL ', 'color: #666; font-size: 14px;');
    console.log('%c Developed by Christian Herencia - https://christian-freelance.us/ ', 'color: #999; font-size: 12px;');

})();
