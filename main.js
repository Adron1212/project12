// ===================================
// ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ
// ===================================

class App {
    constructor() {
        this.isLoading = true;
        this.init();
    }

    init() {
        // Показываем экран загрузки
        this.showLoadingScreen();

        // Инициализация всех компонентов после загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        console.log('🚀 LitAnalytics загружается...');

        // Небольшая задержка для плавного перехода
        setTimeout(() => {
            this.hideLoadingScreen();
            this.initializeApp();
        }, 1500);
    }

    initializeApp() {
        console.log('✅ Приложение инициализировано');
        
        // Все модули уже инициализированы в своих файлах
        // Здесь мы можем добавить дополнительную логику

        // Установка начальной активной секции
        this.setActiveSection();

        // Обработка хэшей URL
        this.handleUrlHash();

        // Глобальные обработчики
        this.setupGlobalHandlers();

        // Проверка поддержки браузера
        this.checkBrowserSupport();
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                duration: 0.5,
                opacity: 0,
                ease: 'power2.inOut',
                onComplete: () => {
                    loadingScreen.classList.add('hidden');
                    loadingScreen.style.display = 'none';
                    this.isLoading = false;
                }
            });
        }
    }

    setActiveSection() {
        // Устанавливаем первую секцию как активную
        const firstNavLink = document.querySelector('.nav-link');
        if (firstNavLink) {
            firstNavLink.classList.add('active');
        }
    }

    handleUrlHash() {
        // Обработка хэша в URL (например, #genres)
        const hash = window.location.hash;
        if (hash) {
            const section = document.querySelector(hash);
            if (section) {
                setTimeout(() => {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: section.offsetTop - 80 },
                        ease: 'power2.inOut'
                    });
                }, 500);
            }
        }

        // Обновление хэша при прокрутке
        window.addEventListener('hashchange', () => {
            this.handleUrlHash();
        });
    }

    setupGlobalHandlers() {
        // Обработка ошибок
        window.addEventListener('error', (e) => {
            console.error('Ошибка:', e.error);
        });

        // Обработка необработанных промисов
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необработанное отклонение промиса:', e.reason);
        });

        // Предотвращение случайного ухода со страницы (опционально)
        // window.addEventListener('beforeunload', (e) => {
        //     e.preventDefault();
        //     e.returnValue = '';
        // });
    }

    checkBrowserSupport() {
        // Проверка поддержки необходимых функций
        const features = {
            'LocalStorage': typeof(Storage) !== 'undefined',
            'ES6': typeof Symbol !== 'undefined',
            'Fetch API': typeof fetch !== 'undefined',
            'CSS Grid': CSS.supports('display', 'grid'),
            'CSS Variables': CSS.supports('--fake-var', 0)
        };

        let allSupported = true;
        for (const [feature, supported] of Object.entries(features)) {
            if (!supported) {
                console.warn(`⚠️ ${feature} не поддерживается`);
                allSupported = false;
            }
        }

        if (allSupported) {
            console.log('✅ Все необходимые функции поддерживаются');
        } else {
            this.showBrowserWarning();
        }
    }

    showBrowserWarning() {
        // Показываем предупреждение о устаревшем браузере
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #fb923c 0%, #ef4444 100%);
            color: white;
            padding: 12px 20px;
            text-align: center;
            z-index: 10001;
            font-size: 14px;
        `;
        warning.innerHTML = `
            <strong>⚠️ Внимание:</strong> Ваш браузер может не поддерживать все функции сайта. 
            Пожалуйста, обновите браузер для лучшего опыта.
        `;
        document.body.insertBefore(warning, document.body.firstChild);
    }

    // Утилиты
    static scrollTo(elementOrSelector, offset = 80) {
        const element = typeof elementOrSelector === 'string' 
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (!element) return;

        gsap.to(window, {
            duration: 1,
            scrollTo: { y: element.offsetTop - offset },
            ease: 'power2.inOut'
        });
    }

    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static formatNumber(num) {
        return new Intl.NumberFormat('ru-RU').format(num);
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
}

// Глобальные утилиты
window.LitAnalytics = {
    scrollTo: App.scrollTo,
    debounce: App.debounce,
    throttle: App.throttle,
    formatNumber: App.formatNumber,
    formatDate: App.formatDate
};

// Запуск приложения
const app = new App();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App };
}

// Вывод информации о версии
console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         📚 LitAnalytics - Анализ жанров v1.0         ║
║                                                       ║
║   Интерактивная платформа для анализа литературных    ║
║   жанров, трендов и статистики по годам              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

Разработано с использованием:
- HTML5, CSS3, JavaScript ES6+
- GSAP для анимаций
- Chart.js для графиков
- Three.js для 3D визуализации
- D3.js для графов связей

© 2026 LitAnalytics. Все права защищены.
`);