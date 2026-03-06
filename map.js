// ===================================
// КАРТА МИРОВОЙ ЛИТЕРАТУРЫ
// ===================================

class MapManager {
    constructor() {
        this.init();
    }

    init() {
        this.renderMap();
        this.renderMapInfo();
    }

    // Отрисовка карты (упрощенная версия с регионами)
    renderMap() {
        const container = document.getElementById('worldMapViz');
        if (!container) return;

        const regions = [
            { name: 'Европа', genres: ['Роман', 'Трагедия', 'Сонет'], authors: 450, color: '#6366f1' },
            { name: 'Россия', genres: ['Роман', 'Повесть', 'Поэма'], authors: 320, color: '#8b5cf6' },
            { name: 'Азия', genres: ['Поэзия', 'Притча', 'Эпопея'], authors: 280, color: '#22c55e' },
            { name: 'Америка', genres: ['Роман', 'Рассказ', 'Эссе'], authors: 220, color: '#fb923c' },
            { name: 'Африка', genres: ['Сказка', 'Притча', 'Поэзия'], authors: 150, color: '#ef4444' }
        ];

        container.innerHTML = '';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        container.style.gap = '20px';
        container.style.padding = '20px';

        regions.forEach((region, index) => {
            const regionCard = document.createElement('div');
            regionCard.style.cssText = `
                padding: 24px;
                background: var(--bg-glass);
                backdrop-filter: blur(20px);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            regionCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 40px; height: 40px; background: ${region.color}; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div>
                        <h4 style="font-size: 18px; font-weight: 600;">${region.name}</h4>
                        <p style="font-size: 12px; color: var(--text-tertiary);">${region.authors} авторов</p>
                    </div>
                </div>
                <div style="margin-top: 16px;">
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Популярные жанры:</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${region.genres.map(genre => `
                            <span style="padding: 4px 10px; background: var(--bg-secondary); border-radius: 6px; font-size: 11px;">
                                ${genre}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;

            regionCard.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.borderColor = region.color;
                this.style.boxShadow = `0 8px 32px ${region.color}33`;
            });

            regionCard.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.borderColor = 'var(--border-color)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });

            container.appendChild(regionCard);

            gsap.from(regionCard, {
                scrollTrigger: {
                    trigger: regionCard,
                    start: 'top 85%'
                },
                duration: 0.6,
                scale: 0.9,
                opacity: 0,
                delay: index * 0.1
            });
        });
    }

    // Отрисовка информации о карте
    renderMapInfo() {
        const container = document.getElementById('mapInfo');
        if (!container) return;

        const info = [
            { icon: 'fa-users', label: 'Всего авторов', value: '1,420' },
            { icon: 'fa-book', label: 'Произведений', value: '12,500+' },
            { icon: 'fa-globe', label: 'Регионов', value: '5' },
            { icon: 'fa-language', label: 'Языков', value: '50+' }
        ];

        container.innerHTML = '';
        
        info.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.textAlign = 'center';

            card.innerHTML = `
                <div style="width: 60px; height: 60px; margin: 0 auto 16px; background: var(--accent-gradient); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="fas ${item.icon}" style="font-size: 24px;"></i>
                </div>
                <div style="font-size: 32px; font-weight: 700; margin-bottom: 8px; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ${item.value}
                </div>
                <div style="font-size: 14px; color: var(--text-secondary);">
                    ${item.label}
                </div>
            `;

            container.appendChild(card);

            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                delay: index * 0.1
            });
        });
    }
}

// Инициализация
let mapManager;
document.addEventListener('DOMContentLoaded', () => {
    mapManager = new MapManager();
});