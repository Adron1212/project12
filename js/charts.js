// ===================================
// ГРАФИКИ И ВИЗУАЛИЗАЦИЯ ДАННЫХ
// ===================================

class ChartsManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: 'rgba(99, 102, 241, 1)',
            secondary: 'rgba(139, 92, 246, 1)',
            success: 'rgba(34, 197, 94, 1)',
            warning: 'rgba(251, 146, 60, 1)',
            danger: 'rgba(239, 68, 68, 1)',
            info: 'rgba(59, 130, 246, 1)'
        };
        this.gradients = {};
        this.init();
    }

    init() {
        // Настройка Chart.js
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-secondary').trim();

        this.initTrendsChart();
        this.initAnalyticsCharts();
        this.setupFilters();
    }

    // Создание градиентов
    createGradient(ctx, color1, color2) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    // График трендов популярности жанров
    initTrendsChart() {
        const canvas = document.getElementById('trendsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Получаем данные для нескольких жанров
        const genres = [
            genresData.epic[0], // Роман
            genresData.epic[1], // Повесть
            genresData.lyric[0], // Лирическое стихотворение
            genresData.dramatic[0] // Трагедия
        ];

        const datasets = genres.map((genre, index) => {
            const colors = [
                'rgba(99, 102, 241, 1)',
                'rgba(139, 92, 246, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(251, 146, 60, 1)'
            ];

            return {
                label: genre.name,
                data: genre.popularity.map(p => ({ x: p.year, y: p.value })),
                borderColor: colors[index],
                backgroundColor: colors[index].replace('1)', '0.1)'),
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: colors[index],
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            };
        });

        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Популярность жанров по годам',
                        font: { size: 18, weight: '600' },
                        padding: 20
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            padding: 15,
                            font: { size: 13 },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 15, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#b4b4c8',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Год',
                            font: { size: 14, weight: '500' }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Популярность (%)',
                            font: { size: 14, weight: '500' }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        beginAtZero: true,
                        max: 100
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Аналитические графики
    initAnalyticsCharts() {
        this.initGenreDistribution();
        this.initDecadeTrends();
        this.initPopularityChange();
        this.initEraComparison();
    }

    // Распределение жанров (круговая диаграмма)
    initGenreDistribution() {
        const canvas = document.getElementById('genreDistributionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const data = {
            labels: ['Эпические', 'Лирические', 'Драматические', 'Лиро-эпические'],
            datasets: [{
                data: [9, 7, 6, 3],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 146, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 146, 60, 1)'
                ],
                borderWidth: 2
            }]
        };

        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 15, 0.95)',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000
                }
            }
        });
    }

    // Тренды по десятилетиям
    initDecadeTrends() {
        const canvas = document.getElementById('decadeTrendsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const decades = ['1800', '1850', '1900', '1950', '2000'];
        const data = {
            labels: decades,
            datasets: [
                {
                    label: 'Роман',
                    data: [45, 65, 80, 75, 70],
                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Поэзия',
                    data: [70, 60, 50, 40, 35],
                    backgroundColor: 'rgba(139, 92, 246, 0.6)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Драма',
                    data: [55, 50, 60, 55, 45],
                    backgroundColor: 'rgba(34, 197, 94, 0.6)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2
                }
            ]
        };

        this.charts.decades = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1500
                }
            }
        });
    }

    // Изменение популярности
    initPopularityChange() {
        const canvas = document.getElementById('popularityChangeChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const data = {
            labels: ['Роман', 'Повесть', 'Рассказ', 'Поэзия', 'Трагедия', 'Комедия'],
            datasets: [{
                label: 'Изменение популярности за 50 лет (%)',
                data: [15, 10, 25, -20, -15, 5],
                backgroundColor: function(context) {
                    const value = context.parsed.y;
                    return value >= 0 ? 
                        'rgba(34, 197, 94, 0.6)' : 
                        'rgba(239, 68, 68, 0.6)';
                },
                borderColor: function(context) {
                    const value = context.parsed.y;
                    return value >= 0 ? 
                        'rgba(34, 197, 94, 1)' : 
                        'rgba(239, 68, 68, 1)';
                },
                borderWidth: 2
            }]
        };

        this.charts.popularityChange = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 15, 0.95)',
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                return (value > 0 ? '+' : '') + value + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1500
                }
            }
        });
    }

    // Сравнение эпох
    initEraComparison() {
        const canvas = document.getElementById('eraComparisonChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const data = {
            labels: ['Просвещение', 'Романтизм', 'Реализм', 'Модернизм', 'Современность'],
            datasets: [
                {
                    label: 'Проза',
                    data: [60, 55, 85, 70, 75],
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Поэзия',
                    data: [50, 85, 60, 75, 45],
                    borderColor: 'rgba(139, 92, 246, 1)',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Драматургия',
                    data: [70, 50, 55, 65, 50],
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        this.charts.eraComparison = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000
                }
            }
        });
    }

    // Настройка фильтров
    setupFilters() {
        const genreFilter = document.getElementById('genreFilter');
        const updateBtn = document.getElementById('updateAnalysis');

        if (genreFilter) {
            // Заполняем список жанров
            const allGenres = [
                ...genresData.epic,
                ...genresData.lyric,
                ...genresData.dramatic,
                ...genresData.lyroEpic
            ];

            allGenres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
        }

        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.updateCharts());
        }
    }

    // Обновление графиков
    updateCharts() {
        const yearStart = parseInt(document.getElementById('yearStart')?.value || 1800);
        const yearEnd = parseInt(document.getElementById('yearEnd')?.value || 2025);
        const selectedGenres = Array.from(document.getElementById('genreFilter')?.selectedOptions || [])
            .map(opt => opt.value);

        // Анимация обновления
        if (this.charts.trends) {
            gsap.to(this.charts.trends.canvas, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    // Обновление данных графика
                    // В реальном проекте здесь была бы логика фильтрации
                    this.charts.trends.update();
                    gsap.to(this.charts.trends.canvas, {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });
        }
    }

    // Уничтожение графика
    destroyChart(chartName) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
            delete this.charts[chartName];
        }
    }

    // Уничтожение всех графиков
    destroyAll() {
        Object.keys(this.charts).forEach(key => {
            this.destroyChart(key);
        });
    }
}

// Инициализация
let chartsManager;
document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки Chart.js
    if (typeof Chart !== 'undefined') {
        chartsManager = new ChartsManager();
    }
});
