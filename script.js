/**
 * YURI ZESH - JavaScript
 * Form handling, animations, and interactions
 */

// ============================================
// Configuration
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('monFormulaire'); // ou le sélecteur approprié
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('https://hook.eu1.make.com/v23zadasky27c9obr4vwwtwjjdxu4ou3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Succès
            } else {
                // Erreur
            }
        } catch (error) {
            // Erreur réseau
        }
    });
});

const PDF_URL = 'public/guide-7-pieges.pdf';

// ============================================
// DOM Elements
// ============================================
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');
const guideForm = document.getElementById('guideForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

// ============================================
// Mobile Menu
// ============================================
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
nav?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// ============================================
// Header Scroll Effect
// ============================================
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header?.classList.add('header-scrolled');
    } else {
        header?.classList.remove('header-scrolled');
    }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = header?.offsetHeight || 72;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Form Submission
// ============================================


function downloadPDF() {
    const link = document.createElement('a');
    link.href = PDF_URL;
    link.download = 'guide-7-pieges-concessionnaires.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function setLoading(loading) {
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    if (loading) {
        submitBtn?.setAttribute('disabled', 'true');
        if (btnText) btnText.hidden = true;
        if (btnLoader) btnLoader.hidden = false;
    } else {
        submitBtn?.removeAttribute('disabled');
        if (btnText) btnText.hidden = false;
        if (btnLoader) btnLoader.hidden = true;
    }
}

function showSuccessModal() {
    if (successModal) {
        successModal.hidden = false;
        document.body.style.overflow = 'hidden';
    }
}

function hideSuccessModal() {
    if (successModal) {
        successModal.hidden = true;
        document.body.style.overflow = '';
    }
}

guideForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const prenomInput = document.getElementById('prenom');
    const emailInput = document.getElementById('email');
    
    const prenom = prenomInput?.value.trim();
    const email = emailInput?.value.trim();
    
    // Validation
    if (!prenom || !email) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }
    
    setLoading(true);
    
    // Télécharger le PDF
    downloadPDF();
    
    // Afficher le modal de succès
    showSuccessModal();
    
    // Reset form
    guideForm.reset();
    
    setLoading(false);
});

closeModal?.addEventListener('click', hideSuccessModal);

// Close modal on overlay click
successModal?.querySelector('.modal-overlay')?.addEventListener('click', hideSuccessModal);

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal && !successModal.hidden) {
        hideSuccessModal();
    }
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.step-card, .avantage-card, .testimonial-card').forEach(el => {
    el.classList.add('fade-in');
    fadeInObserver.observe(el);
});

// ============================================
// Parallax Effect for Hero
// ============================================
let ticking = false;

function updateParallax() {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero && scrollY < window.innerHeight) {
        const parallaxElements = hero.querySelectorAll('.hero-content, .hero-visual');
        parallaxElements.forEach(el => {
            el.style.transform = `translateY(${scrollY * 0.1}px)`;
        });
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// ============================================
// Stats Counter Animation
// ============================================
function animateCounter(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const numMatch = text.match(/[\d.]+/);
                if (numMatch) {
                    const num = parseFloat(numMatch[0]);
                    const suffix = text.replace(/[\d.]+/, '');
                    animateCounter(stat, num, suffix);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// Button Ripple Effect
// ============================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ============================================
// Active Navigation Link
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

function updateActiveNavLink() {
    const scrollY = window.scrollY;
    const headerHeight = header?.offsetHeight || 72;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
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

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// ============================================
// Prefers Reduced Motion
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable parallax and complex animations
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
        fadeInObserver.unobserve(el);
    });
}

// ============================================
// Console Message
// ============================================
console.log('%c Yuri Zesh ', 'background: #C0A062; color: #0A0A0A; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%cLe revendeur direct qui élimine les marges des concessionnaires', 'color: #C0A062; font-size: 14px;');
