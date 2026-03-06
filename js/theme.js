// ===================================
// УПРАВЛЕНИЕ ТЕМОЙ
// ===================================

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupListeners();
    }

    applyTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light-theme');
            this.updateIcon('moon');
        } else {
            document.body.classList.remove('light-theme');
            this.updateIcon('sun');
        }
    }

    updateIcon(icon) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const iconElement = themeToggle.querySelector('i');
            if (iconElement) {
                iconElement.className = icon === 'moon' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        
        // Анимация перехода
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    setupListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
}

// Инициализация при загрузке
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});
