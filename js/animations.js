// ===================================
// АНИМАЦИИ И ИНТЕРАКТИВНОСТЬ
// ===================================

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initGSAP();
        this.initScrollAnimations();
        this.initParticles();
        this.initCounters();
        this.initNavigation();
        this.initMobileMenu();
    }

    // Инициализация GSAP
    initGSAP() {
        gsap.registerPlugin(ScrollTrigger);

        // Анимация Hero секции
        gsap.from('.hero-title .title-line', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.4,
            ease: 'power3.out'
        });

        gsap.from('.hero-buttons', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
        });

        gsap.from('.hero-stats', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.8,
            ease: 'power3.out'
        });
    }

    // Анимации при прокрутке
    initScrollAnimations() {
        // Анимация категорий жанров
        const genreCategories = document.querySelectorAll('.genre-category');
        genreCategories.forEach((category, index) => {
            gsap.from(category, {
                scrollTrigger: {
                    trigger: category,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                delay: index * 0.1
            });
        });

        // Анимация карточек
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                delay: index * 0.05
            });
        });

        // Параллакс эффект для hero
        gsap.to('.hero-background', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 200,
            opacity: 0.5
        });
    }

    // Частицы на фоне Hero
    initParticles() {
        const particlesContainer = document.getElementById('heroParticles');
        if (!particlesContainer) return;

        // Создаем частицы (простая реализация без canvas)
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.backgroundColor = 'rgba(99, 102, 241, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            particlesContainer.appendChild(particle);

            // Анимация частицы
            gsap.to(particle, {
                y: 'random(-100, 100)',
                x: 'random(-100, 100)',
                duration: 'random(3, 8)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to(particle, {
                opacity: 'random(0.2, 0.8)',
                duration: 'random(2, 4)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    // Счетчики статистики
    initCounters() {
        const counters = document.querySelectorAll('.stat-value');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(counter, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 },
                        ease: 'power1.out',
                        onUpdate: function() {
                            counter.innerText = Math.ceil(counter.innerText);
                        }
                    });
                }
            });
        });
    }

    // Навигация
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Скрытие/показ навигации при прокрутке
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

        // Плавная прокрутка к секциям
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: { y: offsetTop, autoKill: false },
                            ease: 'power2.inOut'
                        });

                        // Обновление активной ссылки
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');

                        // Закрытие мобильного меню
                        document.getElementById('navMenu')?.classList.remove('active');
                    }
                }
            });
        });

        // Обновление активной ссылки при прокрутке
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Мобильное меню
    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Закрытие при клике вне меню
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }
    }

    // Анимация появления элемента
    fadeInElement(element, delay = 0) {
        gsap.from(element, {
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: delay,
            ease: 'power3.out'
        });
    }

    // Анимация масштабирования
    scaleInElement(element, delay = 0) {
        gsap.from(element, {
            duration: 0.6,
            scale: 0.9,
            opacity: 0,
            delay: delay,
            ease: 'back.out(1.7)'
        });
    }

    // Анимация слайда
    slideInElement(element, direction = 'left', delay = 0) {
        const x = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
        const y = direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0;

        gsap.from(element, {
            duration: 0.8,
            x: x,
            y: y,
            opacity: 0,
            delay: delay,
            ease: 'power3.out'
        });
    }
}

// Hover эффекты для карточек
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.genre-card, .glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            gsap.to(this, {
                duration: 0.3,
                y: -8,
                scale: 1.02,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function(e) {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                scale: 1,
                ease: 'power2.out'
            });
        });

        // Эффект движения за курсором
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(this, {
                duration: 0.3,
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                rotationX: 0,
                rotationY: 0,
                ease: 'power2.out'
            });
        });
    });
}

// Анимация кнопок
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });

        button.addEventListener('click', function(e) {
            // Ripple эффект
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';

            this.appendChild(ripple);

            gsap.to(ripple, {
                width: size * 2,
                height: size * 2,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
    });
}

// Инициализация
let animationManager;
document.addEventListener('DOMContentLoaded', () => {
    animationManager = new AnimationManager();
    
    // Ждем загрузки GSAP
    setTimeout(() => {
        initCardHoverEffects();
        initButtonAnimations();
    }, 100);
});
