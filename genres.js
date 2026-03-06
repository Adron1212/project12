// ===================================
// КАТАЛОГ ЖАНРОВ
// ===================================

class GenresManager {
    constructor() {
        this.modal = null;
        this.currentGenre = null;
        this.init();
    }

    init() {
        this.renderGenres();
        this.setupModal();
        this.setupButtons();
    }

    // Отрисовка карточек жанров
    renderGenres() {
        this.renderCategory('epicGenres', genresData.epic);
        this.renderCategory('lyricGenres', genresData.lyric);
        this.renderCategory('dramaticGenres', genresData.dramatic);
        this.renderCategory('lyroEpicGenres', genresData.lyroEpic);
    }

    renderCategory(containerId, genres) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        genres.forEach((genre, index) => {
            const card = this.createGenreCard(genre);
            container.appendChild(card);

            // Анимация появления с задержкой
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%'
                },
                duration: 0.6,
                opacity: 0,
                y: 30,
                delay: index * 0.05,
                ease: 'power3.out'
            });
        });
    }

    createGenreCard(genre) {
        const card = document.createElement('div');
        card.className = 'genre-card';
        card.setAttribute('data-genre-id', genre.id);

        card.innerHTML = `
            <h4>${genre.name}</h4>
            <p>${genre.description}</p>
            <div style="margin-top: 12px; font-size: 12px; color: var(--text-tertiary);">
                <i class="fas fa-calendar"></i> ${genre.period}
            </div>
        `;

        card.addEventListener('click', () => this.showGenreDetails(genre));

        return card;
    }

    // Показать детали жанра в модальном окне
    showGenreDetails(genre) {
        this.currentGenre = genre;
        const modal = document.getElementById('genreModal');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalBody) return;

        // Создаем содержимое модального окна
        modalBody.innerHTML = `
            <h2>${genre.name}</h2>
            
            <div style="margin: 24px 0;">
                <h3><i class="fas fa-info-circle"></i> Описание</h3>
                <p>${genre.description}</p>
            </div>

            <div style="margin: 24px 0;">
                <h3><i class="fas fa-history"></i> История жанра</h3>
                <p>${genre.history}</p>
            </div>

            <div style="margin: 24px 0;">
                <h3><i class="fas fa-users"></i> Известные авторы</h3>
                <ul>
                    ${genre.authors.map(author => `<li>${author}</li>`).join('')}
                </ul>
            </div>

            <div style="margin: 24px 0;">
                <h3><i class="fas fa-book-open"></i> Известные произведения</h3>
                <ul>
                    ${genre.works.map(work => `<li>${work}</li>`).join('')}
                </ul>
            </div>

            <div style="margin: 24px 0;">
                <h3><i class="fas fa-chart-line"></i> График популярности</h3>
                <canvas id="genrePopularityChart" style="height: 300px;"></canvas>
            </div>

            <div style="margin: 24px 0;">
                <h3><i class="fas fa-clock"></i> Период развития</h3>
                <p>${genre.period}</p>
                <p style="margin-top: 8px;">Пики популярности: ${genre.peakYears.join(', ')}</p>
            </div>
        `;

        // Показываем модальное окно с анимацией
        modal.classList.add('active');
        gsap.from('.modal-content', {
            duration: 0.4,
            scale: 0.9,
            opacity: 0,
            ease: 'back.out(1.7)'
        });

        // Создаем график популярности
        setTimeout(() => this.renderGenrePopularityChart(genre), 100);
    }

    // График популярности конкретного жанра
    renderGenrePopularityChart(genre) {
        const canvas = document.getElementById('genrePopularityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: genre.popularity.map(p => p.year),
                datasets: [{
                    label: 'Популярность (%)',
                    data: genre.popularity.map(p => p.value),
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointHoverBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 15, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#b4b4c8',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return 'Популярность: ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Год'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Популярность (%)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        beginAtZero: true,
                        max: 100
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Настройка модального окна
    setupModal() {
        const modal = document.getElementById('genreModal');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal());
        }

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('genreModal');
        if (!modal) return;

        gsap.to('.modal-content', {
            duration: 0.3,
            scale: 0.9,
            opacity: 0,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('active');
            }
        });

        gsap.to('.modal-overlay', {
            duration: 0.3,
            opacity: 0
        });
    }

    // Настройка кнопок Hero секции
    setupButtons() {
        const startAnalysisBtn = document.getElementById('startAnalysis');
        const exploreGenresBtn = document.getElementById('exploreGenres');

        if (startAnalysisBtn) {
            startAnalysisBtn.addEventListener('click', () => {
                this.scrollToSection('analysis');
            });
        }

        if (exploreGenresBtn) {
            exploreGenresBtn.addEventListener('click', () => {
                this.scrollToSection('genres');
            });
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const offsetTop = section.offsetTop - 80;
        
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: offsetTop, autoKill: false },
            ease: 'power2.inOut'
        });
    }

    // Поиск жанра по ID
    findGenreById(id) {
        const allGenres = [
            ...genresData.epic,
            ...genresData.lyric,
            ...genresData.dramatic,
            ...genresData.lyroEpic
        ];

        return allGenres.find(genre => genre.id === id);
    }

    // Получить все жанры
    getAllGenres() {
        return [
            ...genresData.epic,
            ...genresData.lyric,
            ...genresData.dramatic,
            ...genresData.lyroEpic
        ];
    }

    // Фильтрация жанров
    filterGenres(query) {
        const allGenres = this.getAllGenres();
        query = query.toLowerCase();

        return allGenres.filter(genre => {
            return genre.name.toLowerCase().includes(query) ||
                   genre.description.toLowerCase().includes(query) ||
                   genre.authors.some(author => author.toLowerCase().includes(query)) ||
                   genre.works.some(work => work.toLowerCase().includes(query));
        });
    }
}

// Инициализация
let genresManager;
document.addEventListener('DOMContentLoaded', () => {
    genresManager = new GenresManager();
});