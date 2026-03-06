// ===================================
// ТАЙМЛАЙН ИСТОРИИ ЛИТЕРАТУРЫ
// ===================================

class TimelineManager {
    constructor() {
        this.currentEra = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.init();
    }

    init() {
        this.setupControls();
        this.renderHorizontalTimeline();
        this.init3DTimeline();
    }

    // Настройка кнопок эпох
    setupControls() {
        const buttons = document.querySelectorAll('.timeline-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const era = btn.getAttribute('data-era');
                this.selectEra(era);
                
                // Обновление активной кнопки
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // Выбор эпохи
    selectEra(eraId) {
        this.currentEra = literaryEras.find(era => era.id === eraId);
        if (this.currentEra) {
            this.highlightEra(this.currentEra);
            this.showEraInfo(this.currentEra);
        }
    }

    // Горизонтальный таймлайн
    renderHorizontalTimeline() {
        const container = document.getElementById('timelineHorizontal');
        if (!container) return;

        container.innerHTML = '';

        literaryEras.forEach((era, index) => {
            const eraElement = document.createElement('div');
            eraElement.className = 'timeline-era';
            eraElement.style.cssText = `
                position: relative;
                padding: 24px;
                margin: 20px 0;
                background: var(--bg-glass);
                backdrop-filter: blur(20px);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            eraElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div>
                        <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">${era.name}</h3>
                        <p style="color: var(--text-tertiary); font-size: 14px;">${era.period}</p>
                    </div>
                    <div style="padding: 8px 16px; background: var(--accent-gradient); border-radius: 12px; color: white; font-size: 12px; font-weight: 600;">
                        ${era.genres.length} жанров
                    </div>
                </div>
                <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
                    ${era.description}
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${era.genres.map(genre => `
                        <span style="padding: 6px 12px; background: var(--bg-secondary); border-radius: 8px; font-size: 12px;">
                            ${genre}
                        </span>
                    `).join('')}
                </div>
            `;

            eraElement.addEventListener('click', () => {
                this.selectEra(era.id);
            });

            eraElement.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(8px)';
                this.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            });

            eraElement.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
                this.style.borderColor = 'var(--border-color)';
            });

            container.appendChild(eraElement);

            // Анимация появления
            gsap.from(eraElement, {
                scrollTrigger: {
                    trigger: eraElement,
                    start: 'top 85%'
                },
                duration: 0.6,
                x: -50,
                opacity: 0,
                delay: index * 0.1
            });
        });
    }

    // 3D таймлайн (упрощенная версия)
    init3DTimeline() {
        const container = document.getElementById('timeline3D');
        if (!container || typeof THREE === 'undefined') return;

        try {
            // Создаем сцену
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0a0a0f);

            // Камера
            this.camera = new THREE.PerspectiveCamera(
                75,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            this.camera.position.z = 5;

            // Рендерер
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);

            // Освещение
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 10, 10);
            this.scene.add(light);

            const ambientLight = new THREE.AmbientLight(0x404040, 2);
            this.scene.add(ambientLight);

            // Создаем книги вдоль временной линии
            literaryEras.forEach((era, index) => {
                const geometry = new THREE.BoxGeometry(0.3, 0.5, 0.1);
                const material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color(`hsl(${index * 45}, 70%, 60%)`)
                });
                const book = new THREE.Mesh(geometry, material);
                
                book.position.x = (index - literaryEras.length / 2) * 1.2;
                book.position.y = Math.sin(index * 0.5) * 0.5;
                book.userData = { era: era };
                
                this.scene.add(book);
            });

            // Анимация
            this.animate3DTimeline();

            // Адаптивность
            window.addEventListener('resize', () => {
                if (!container) return;
                this.camera.aspect = container.clientWidth / container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.clientWidth, container.clientHeight);
            });

        } catch (error) {
            console.error('Ошибка инициализации 3D таймлайна:', error);
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">3D визуализация временно недоступна</div>';
        }
    }

    animate3DTimeline() {
        if (!this.renderer || !this.scene || !this.camera) return;

        requestAnimationFrame(() => this.animate3DTimeline());

        // Вращение книг
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) {
                child.rotation.y += 0.01;
            }
        });

        // Вращение камеры
        this.camera.position.x = Math.sin(Date.now() * 0.0001) * 5;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    highlightEra(era) {
        // Подсветка выбранной эпохи
        console.log('Selected era:', era.name);
    }

    showEraInfo(era) {
        // Показать информацию об эпохе
        const info = `
            <strong>${era.name}</strong> (${era.period})<br>
            ${era.description}<br>
            Ключевые события: ${era.keyEvents.length}
        `;
        // Можно добавить всплывающее окно или панель с информацией
    }
}

// Инициализация
let timelineManager;
document.addEventListener('DOMContentLoaded', () => {
    timelineManager = new TimelineManager();
});
