// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
    initializeSkillAnimations();
    initializeDynamicBackgrounds();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            // Skip elements that should not be animated (About Me section)
            if (entry.target.hasAttribute('data-no-animate') || entry.target.closest('.about')) {
                return;
            }
            
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special handling for specific elements
                
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s`;
                    entry.target.classList.add('animate-in');
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations (completely excluding ALL about section elements)
    const animatedElements = document.querySelectorAll('.project-card, .accomplishment-category, .education-item, .timeline-item');
    
    // Filter out any elements that are inside the about section
    const filteredElements = Array.from(animatedElements).filter(el => {
        return !el.closest('.about') && !el.classList.contains('about-related');
    });
    
    filteredElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Handle stats separately - no hiding, only counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' });

    // Ensure stats are always visible and only animate counters once
    document.querySelectorAll('.stat').forEach(stat => {
        // Ensure stats are always visible
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
        stat.style.transition = 'none';
        statsObserver.observe(stat);
    });

    // Ensure ENTIRE About Me section is always visible and never animated
    const aboutElements = document.querySelectorAll('.about, .about *, .about-content, .about-text, .about-stats, .about-highlight, .about p, .about div, .about h2, .about h3');
    aboutElements.forEach(element => {
        element.style.opacity = '1 !important';
        element.style.transform = 'translateY(0) !important';
        element.style.transition = 'none !important';
        element.style.visibility = 'visible !important';
        element.style.filter = 'none !important';
        // Prevent any observer from affecting these elements
        element.setAttribute('data-no-animate', 'true');
    });
}

// Skill tag animation
function animateSkillTags(skillCategory) {
    const skillTags = skillCategory.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, index * 100);
    });
}

// Counter animation for stats
function animateCounter(statElement) {
    const countElement = statElement.querySelector('h3');
    const targetValue = countElement.textContent;
    
    // Check if it contains a number
    const numberMatch = targetValue.match(/\d+/);
    if (numberMatch) {
        const finalNumber = parseInt(numberMatch[0]);
        const hasPlus = targetValue.includes('+');
        const suffix = hasPlus ? '+' : '';
        
        let currentValue = 0;
        const increment = finalNumber / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalNumber) {
                countElement.textContent = finalNumber + suffix;
                clearInterval(timer);
            } else {
                countElement.textContent = Math.floor(currentValue) + suffix;
            }
        }, 30);
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Create mailto link as fallback
                const mailtoLink = `mailto:s.vishakaraj@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoLink;
                
                showNotification('Message sent successfully! Opening your email client...', 'success');
                contactForm.reset();
                
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        zIndex: '9999',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        fontSize: '0.9rem',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Initialize animations
function initializeAnimations() {
    // Hero section animations
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent && heroVisual) {
        // Add entrance animations with delay
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateX(0)';
        }, 600);
    }

    // Neural network animation
    animateNeuralNetwork();
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Neural network animation
function animateNeuralNetwork() {
    const connections = document.querySelectorAll('.connection');
    
    connections.forEach((connection, index) => {
        // Create animated connection lines
        connection.style.position = 'absolute';
        connection.style.height = '2px';
        connection.style.background = 'rgba(255, 255, 255, 0.6)';
        connection.style.transformOrigin = 'left center';
        connection.style.animation = `drawLine 2s ease-in-out infinite`;
        connection.style.animationDelay = `${index * 0.5}s`;
        
        // Position connections between nodes
        if (index === 0) {
            connection.style.top = '30px';
            connection.style.left = '100px';
            connection.style.width = '60px';
            connection.style.transform = 'rotate(45deg)';
        } else if (index === 1) {
            connection.style.top = '100px';
            connection.style.left = '40px';
            connection.style.width = '120px';
        } else if (index === 2) {
            connection.style.top = '140px';
            connection.style.left = '50px';
            connection.style.width = '60px';
            connection.style.transform = 'rotate(-45deg)';
        }
    });
}

// Initialize skill animations
function initializeSkillAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes drawLine {
            0% {
                transform: scaleX(0);
                opacity: 0.3;
            }
            50% {
                transform: scaleX(1);
                opacity: 1;
            }
            100% {
                transform: scaleX(0);
                opacity: 0.3;
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .hero-content {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .hero-visual {
            opacity: 0;
            transform: translateX(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .nav-link.active {
            color: #667eea !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
        
        /* Additional responsive styles */
        @media (max-width: 768px) {
            .notification {
                right: 10px !important;
                left: 10px !important;
                max-width: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Smooth scroll polyfill for older browsers
function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
        document.head.appendChild(script);
        script.onload = function() {
            window.__forceSmoothScrollPolyfill__ = true;
            window.smoothscroll.polyfill();
        };
    }
}

// Initialize smooth scroll polyfill
smoothScrollPolyfill();

// Utility function to debounce scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimized scroll handling
const optimizedScrollHandler = debounce(function() {
    // Additional scroll-based optimizations can go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Performance optimization: Lazy load images if any are added later
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initializeLazyLoading();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Dynamic Background System
function initializeDynamicBackgrounds() {
    const sections = document.querySelectorAll('section[id]');
    const bgLayers = document.querySelectorAll('.bg-layer');
    let currentActiveSection = '';

    function updateBackground() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const scrollCenter = scrollTop + windowHeight / 2;

        let activeSection = '';
        let activeSectionElement = null;

        // Find which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + sectionHeight / 2;

            // Check if section center is within viewport
            if (scrollCenter >= sectionTop && scrollCenter <= sectionTop + sectionHeight) {
                activeSection = section.id;
                activeSectionElement = section;
            }
        });

        // Update background if section changed
        if (activeSection && activeSection !== currentActiveSection) {
            currentActiveSection = activeSection;
            
            // Remove active class from all background layers
            bgLayers.forEach(layer => {
                layer.classList.remove('active');
            });

            // Add active class to current section's background
            const activeBgLayer = document.querySelector(`.bg-${activeSection}`);
            if (activeBgLayer) {
                activeBgLayer.classList.add('active');
            }

            // Update project-specific backgrounds in projects section
            if (activeSection === 'projects') {
                updateProjectBackgrounds();
            }
        }
    }

    function updateProjectBackgrounds() {
        const projectCards = document.querySelectorAll('.project-card[data-bg]');
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const scrollCenter = scrollTop + windowHeight / 2;

        projectCards.forEach(card => {
            const cardTop = card.offsetTop;
            const cardHeight = card.offsetHeight;
            const cardCenter = cardTop + cardHeight / 2;
            const cardBg = card.getAttribute('data-bg');

            // Check if card is prominently in view
            if (Math.abs(scrollCenter - cardCenter) < windowHeight / 3) {
                // Find corresponding background layer
                const projectBgLayer = document.querySelector(`.bg-projects`);
                if (projectBgLayer && cardBg) {
                    // Add project-specific background class
                    projectBgLayer.className = `bg-layer bg-projects active project-${cardBg}-active`;
                }
            }
        });
    }

    // Throttled scroll handler
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateBackground();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Initial call and event listeners
    updateBackground();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateBackground);
}

// Console welcome message
console.log('%c👋 Hello! Thanks for checking out the source code!', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cThis portfolio was built with modern web technologies and best practices.', 'color: #666; font-size: 14px;');
console.log('%cFeel free to reach out if you have any questions!', 'color: #666; font-size: 14px;');
