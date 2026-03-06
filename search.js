// ===================================
// ПОИСК И ФИЛЬТРАЦИЯ
// ===================================

class SearchManager {
    constructor() {
        this.currentFilter = 'all';
        this.searchResults = [];
        this.init();
    }

    init() {
        this.setupSearchBar();
        this.setupFilters();
    }

    // Настройка строки поиска
    setupSearchBar() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }
    }

    // Настройка фильтров
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.setFilter(filter);
                
                // Обновление активной кнопки
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Повторный поиск с новым фильтром
                const searchInput = document.getElementById('searchInput');
                if (searchInput && searchInput.value) {
                    this.performSearch(searchInput.value);
                }
            });
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
    }

    // Выполнение поиска
    performSearch(query) {
        if (!query || query.length < 2) {
            this.clearResults();
            return;
        }

        this.searchResults = [];

        // Поиск по жанрам
        if (this.currentFilter === 'all' || this.currentFilter === 'genres') {
            const genreResults = this.searchGenres(query);
            this.searchResults.push(...genreResults);
        }

        // Поиск по авторам
        if (this.currentFilter === 'all' || this.currentFilter === 'authors') {
            const authorResults = this.searchAuthors(query);
            this.searchResults.push(...authorResults);
        }

        // Поиск по книгам
        if (this.currentFilter === 'all' || this.currentFilter === 'books') {
            const bookResults = this.searchBooks(query);
            this.searchResults.push(...bookResults);
        }

        // Поиск по годам/эпохам
        if (this.currentFilter === 'all' || this.currentFilter === 'years') {
            const eraResults = this.searchEras(query);
            this.searchResults.push(...eraResults);
        }

        this.displayResults();
    }

    // Поиск жанров
    searchGenres(query) {
        const allGenres = [
            ...genresData.epic,
            ...genresData.lyric,
            ...genresData.dramatic,
            ...genresData.lyroEpic
        ];

        query = query.toLowerCase();

        return allGenres
            .filter(genre => {
                return genre.name.toLowerCase().includes(query) ||
                       genre.description.toLowerCase().includes(query);
            })
            .map(genre => ({
                type: 'genre',
                title: genre.name,
                description: genre.description,
                data: genre
            }));
    }

    // Поиск авторов
    searchAuthors(query) {
        query = query.toLowerCase();

        const allGenres = [
            ...genresData.epic,
            ...genresData.lyric,
            ...genresData.dramatic,
            ...genresData.lyroEpic
        ];

        const results = [];
        const foundAuthors = new Set();

        allGenres.forEach(genre => {
            genre.authors.forEach(author => {
                if (author.toLowerCase().includes(query) && !foundAuthors.has(author)) {
                    foundAuthors.add(author);
                    results.push({
                        type: 'author',
                        title: author,
                        description: `Автор известен в жанре: ${genre.name}`,
                        data: { author, genre: genre.name }
                    });
                }
            });
        });

        return results;
    }

    // Поиск книг
    searchBooks(query) {
        query = query.toLowerCase();

        const allGenres = [
            ...genresData.epic,
            ...genresData.lyric,
            ...genresData.dramatic,
            ...genresData.lyroEpic
        ];

        const results = [];
        const foundBooks = new Set();

        allGenres.forEach(genre => {
            genre.works.forEach(work => {
                if (work.toLowerCase().includes(query) && !foundBooks.has(work)) {
                    foundBooks.add(work);
                    results.push({
                        type: 'book',
                        title: work,
                        description: `Жанр: ${genre.name}`,
                        data: { work, genre: genre.name }
                    });
                }
            });
        });

        return results;
    }

    // Поиск эпох
    searchEras(query) {
        query = query.toLowerCase();

        return literaryEras
            .filter(era => {
                return era.name.toLowerCase().includes(query) ||
                       era.description.toLowerCase().includes(query) ||
                       era.period.toLowerCase().includes(query);
            })
            .map(era => ({
                type: 'era',
                title: era.name,
                description: `${era.period} - ${era.description}`,
                data: era
            }));
    }

    // Отображение результатов
    displayResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        if (this.searchResults.length === 0) {
            resultsContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                    <p>Ничего не найдено</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = '';

        this.searchResults.forEach((result, index) => {
            const card = this.createResultCard(result);
            resultsContainer.appendChild(card);

            // Анимация появления
            gsap.from(card, {
                duration: 0.4,
                opacity: 0,
                y: 20,
                delay: index * 0.05,
                ease: 'power2.out'
            });
        });
    }

    createResultCard(result) {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.cursor = 'pointer';
        card.style.padding = '20px';

        const icons = {
            genre: 'fa-book',
            author: 'fa-user',
            book: 'fa-bookmark',
            era: 'fa-clock'
        };

        const icon = icons[result.type] || 'fa-search';

        card.innerHTML = `
            <div style="display: flex; align-items: start; gap: 16px;">
                <div style="flex-shrink: 0; width: 40px; height: 40px; background: var(--accent-gradient); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="fas ${icon}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${result.title}</h4>
                    <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${result.description}</p>
                    <div style="margin-top: 8px;">
                        <span style="display: inline-block; padding: 4px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 12px; color: var(--text-tertiary);">
                            ${this.getTypeLabel(result.type)}
                        </span>
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => this.handleResultClick(result));

        return card;
    }

    getTypeLabel(type) {
        const labels = {
            genre: 'Жанр',
            author: 'Автор',
            book: 'Произведение',
            era: 'Эпоха'
        };
        return labels[type] || type;
    }

    handleResultClick(result) {
        switch (result.type) {
            case 'genre':
                if (genresManager) {
                    genresManager.showGenreDetails(result.data);
                }
                break;
            case 'era':
                if (timelineManager) {
                    timelineManager.selectEra(result.data.id);
                    const section = document.getElementById('timeline');
                    if (section) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: { y: section.offsetTop - 80 },
                            ease: 'power2.inOut'
                        });
                    }
                }
                break;
            case 'author':
            case 'book':
                // Показать информацию об авторе или книге
                this.showInfo(result);
                break;
        }
    }

    showInfo(result) {
        // Простое уведомление (можно заменить на модальное окно)
        console.log('Info:', result);
    }

    clearResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-tertiary);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                    <p>Введите запрос для поиска</p>
                </div>
            `;
        }
    }
}

// Инициализация
let searchManager;
document.addEventListener('DOMContentLoaded', () => {
    searchManager = new SearchManager();
});