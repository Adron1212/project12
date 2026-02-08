// Глобальные переменные
let allData = [];
let mainChart = null;
let pieChart = null;
let growthChart = null;
let currentChartType = 'line';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadInsights();
    loadSummary();
    setupFilters(); // setupFilters теперь загружает данные внутри себя
});

// Загрузка основных данных
async function loadData() {
    try {
        const response = await fetch('/api/data');
        allData = await response.json();
        
        updateMainChart();
        updateGenreCards();
        updateComparisonCharts();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Загрузка инсайтов
async function loadInsights() {
    try {
        const response = await fetch('/api/insights');
        const insights = await response.json();
        
        const insightsGrid = document.getElementById('insightsGrid');
        insightsGrid.innerHTML = '';
        
        insights.forEach(insight => {
            const card = createInsightCard(insight);
            insightsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки инсайтов:', error);
    }
}

// Загрузка сводки
async function loadSummary() {
    try {
        const response = await fetch('/api/summary');
        const summary = await response.json();
        
        const summaryCards = document.getElementById('summaryCards');
        summaryCards.innerHTML = `
            <div class="summary-card">
                <div class="summary-card-icon">📚</div>
                <div class="summary-card-value">${summary.total_genres}</div>
                <div class="summary-card-label">Жанров</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-icon">📅</div>
                <div class="summary-card-value">${summary.years_analyzed}</div>
                <div class="summary-card-label">Лет анализа</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-icon">🏆</div>
                <div class="summary-card-value">${summary.top_genre}</div>
                <div class="summary-card-label">Топ жанр</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-icon">📈</div>
                <div class="summary-card-value">${summary.avg_popularity}</div>
                <div class="summary-card-label">Средняя популярность</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-icon">🔥</div>
                <div class="summary-card-value">${summary.trending_up}</div>
                <div class="summary-card-label">Растущих трендов</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-icon">📉</div>
                <div class="summary-card-value">${summary.trending_down}</div>
                <div class="summary-card-label">Падающих трендов</div>
            </div>
        `;
    } catch (error) {
        console.error('Ошибка загрузки сводки:', error);
    }
}

// Настройка фильтров
function setupFilters() {
    // Сначала загружаем данные, затем настраиваем фильтры
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            allData = data;
            
            const yearFilter = document.getElementById('yearFilter');
            const genreFilter = document.getElementById('genreFilter');
            const categoryFilter = document.getElementById('categoryFilter');
            
            // Заполнение фильтра годов
            const years = [...new Set(data.map(d => d.year))].sort();
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            });
            
            // Заполнение фильтра жанров
            const genres = [...new Set(data.map(d => d.genre))].sort();
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreFilter.appendChild(option);
            });
            
            // Заполнение фильтра категорий
            const categories = [...new Set(data.map(d => d.category))].sort();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
            
            // Обработчики событий
            yearFilter.addEventListener('change', applyFilters);
            genreFilter.addEventListener('change', applyFilters);
            categoryFilter.addEventListener('change', applyFilters);
            
            // Загружаем остальные данные после настройки фильтров
            updateMainChart();
            updateGenreCards();
            updateComparisonCharts();
        });
}

// Применение фильтров
function applyFilters() {
    const yearFilter = document.getElementById('yearFilter').value;
    const genreFilter = document.getElementById('genreFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let params = new URLSearchParams();
    if (yearFilter !== 'all') params.append('year', yearFilter);
    if (genreFilter !== 'all') params.append('genre', genreFilter);
    if (categoryFilter !== 'all') params.append('category', categoryFilter);
    
    fetch(`/api/data?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            allData = data;
            updateMainChart();
            updateGenreCards();
            updateComparisonCharts();
        })
        .catch(error => {
            console.error('Ошибка применения фильтров:', error);
        });
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('yearFilter').value = 'all';
    document.getElementById('genreFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    applyFilters();
}

// Обновление главного графика
function updateMainChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    // Подготовка данных
    const genres = [...new Set(allData.map(d => d.genre))];
    const years = [...new Set(allData.map(d => d.year))].sort();
    
    const datasets = genres.map(genre => {
        const genreData = allData.filter(d => d.genre === genre);
        const color = genreData[0].color;
        
        return {
            label: genre,
            data: years.map(year => {
                const point = genreData.find(d => d.year === year);
                return point ? point.popularity : null;
            }),
            borderColor: color,
            backgroundColor: color + '20',
            borderWidth: 3,
            tension: 0.4,
            fill: currentChartType === 'line',
            pointRadius: 4,
            pointHoverRadius: 6
        };
    });
    
    if (mainChart) {
        mainChart.destroy();
    }
    
    mainChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 13,
                            family: 'Inter'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 20,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Популярность',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Год',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Изменение типа графика
function changeChartType(type) {
    currentChartType = type;
    
    // Обновление активной кнопки
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateMainChart();
}

// Обновление карточек жанров
function updateGenreCards() {
    const genresGrid = document.getElementById('genresGrid');
    genresGrid.innerHTML = '';
    
    const latestYear = Math.max(...allData.map(d => d.year));
    const genres = [...new Set(allData.map(d => d.genre))];
    
    genres.forEach(genre => {
        const genreData = allData.filter(d => d.genre === genre);
        const latestData = genreData.find(d => d.year === latestYear);
        
        if (latestData) {
            const card = createGenreCard(latestData, genreData);
            genresGrid.appendChild(card);
        }
    });
}

// Создание карточки жанра
function createGenreCard(latestData, allGenreData) {
    const card = document.createElement('div');
    card.className = 'genre-card';
    card.style.borderLeftColor = latestData.color;
    
    // Расчет статистики
    const avgPopularity = (allGenreData.reduce((sum, d) => sum + d.popularity, 0) / allGenreData.length).toFixed(1);
    const maxPopularity = Math.max(...allGenreData.map(d => d.popularity)).toFixed(1);
    const minPopularity = Math.min(...allGenreData.map(d => d.popularity)).toFixed(1);
    
    // Расчет тренда
    const recent = allGenreData.slice(-5);
    const old = allGenreData.slice(0, 5);
    const recentAvg = recent.reduce((sum, d) => sum + d.popularity, 0) / recent.length;
    const oldAvg = old.reduce((sum, d) => sum + d.popularity, 0) / old.length;
    const growth = ((recentAvg - oldAvg) / oldAvg * 100).toFixed(1);
    
    let trendClass = 'trend-stable';
    let trendText = 'Стабильный';
    if (growth > 5) {
        trendClass = 'trend-up';
        trendText = `↗ Рост ${growth}%`;
    } else if (growth < -5) {
        trendClass = 'trend-down';
        trendText = `↘ Падение ${Math.abs(growth)}%`;
    }
    
    card.innerHTML = `
        <div class="genre-card-header">
            <div class="genre-title">
                <span class="genre-icon">${latestData.icon}</span>
                <div>
                    <span class="genre-name">${latestData.genre}</span>
                    <div class="genre-category">${latestData.category}</div>
                </div>
            </div>
            <div class="genre-popularity">${latestData.popularity.toFixed(1)}</div>
        </div>
        <div class="genre-stats">
            <div class="genre-stat">
                <span class="stat-label">Тренд:</span>
                <span class="trend-badge ${trendClass}">${trendText}</span>
            </div>
            <div class="genre-stat">
                <span class="stat-label">Средняя:</span>
                <span class="stat-value">${avgPopularity}</span>
            </div>
            <div class="genre-stat">
                <span class="stat-label">Максимум:</span>
                <span class="stat-value">${maxPopularity}</span>
            </div>
            <div class="genre-stat">
                <span class="stat-label">Минимум:</span>
                <span class="stat-value">${minPopularity}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Обновление сравнительных графиков
function updateComparisonCharts() {
    updatePieChart();
    updateGrowthChart();
}

// Круговая диаграмма текущей популярности
function updatePieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    const latestYear = Math.max(...allData.map(d => d.year));
    const latestData = allData.filter(d => d.year === latestYear);
    
    if (pieChart) {
        pieChart.destroy();
    }
    
    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: latestData.map(d => d.genre),
            datasets: [{
                data: latestData.map(d => d.popularity),
                backgroundColor: latestData.map(d => d.color),
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        padding: 12,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed.toFixed(1) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// График роста за последние 5 лет
function updateGrowthChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    const genres = [...new Set(allData.map(d => d.genre))];
    const growthData = genres.map(genre => {
        const genreData = allData.filter(d => d.genre === genre).sort((a, b) => a.year - b.year);
        const recent = genreData.slice(-5);
        const old = genreData.slice(0, 5);
        const recentAvg = recent.reduce((sum, d) => sum + d.popularity, 0) / recent.length;
        const oldAvg = old.reduce((sum, d) => sum + d.popularity, 0) / old.length;
        const growth = recentAvg - oldAvg;
        
        return {
            genre: genre,
            growth: growth,
            color: genreData[0].color
        };
    });
    
    growthData.sort((a, b) => b.growth - a.growth);
    
    if (growthChart) {
        growthChart.destroy();
    }
    
    growthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: growthData.map(d => d.genre),
            datasets: [{
                label: 'Изменение популярности',
                data: growthData.map(d => d.growth),
                backgroundColor: growthData.map(d => d.color),
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.x.toFixed(1);
                            return value > 0 ? `Рост: +${value}` : `Падение: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Изменение популярности',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Создание карточки инсайта
function createInsightCard(insight) {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.style.borderTopColor = getGenreColor(insight.genre);
    
    card.innerHTML = `
        <div class="insight-header">
            <span class="insight-icon">${insight.icon}</span>
            <h3 class="insight-title">${insight.genre}</h3>
        </div>
        <p class="insight-description">${insight.description}</p>
        <div class="insight-metrics">
            <div class="metric">
                <div class="metric-value">${insight.current_popularity}</div>
                <div class="metric-label">Текущая популярность</div>
            </div>
            <div class="metric">
                <div class="metric-value">${insight.growth > 0 ? '+' : ''}${insight.growth}</div>
                <div class="metric-label">Рост за 5 лет</div>
            </div>
            <div class="metric">
                <div class="metric-value">${insight.peak_year}</div>
                <div class="metric-label">Год пика</div>
            </div>
            <div class="metric">
                <div class="metric-value">${insight.trend}</div>
                <div class="metric-label">Тренд</div>
            </div>
        </div>
    `;
    
    return card;
}

// Получение цвета жанра
function getGenreColor(genre) {
    const colors = {
        'Фантастика': '#3498db',
        'Фэнтези': '#9b59b6',
        'Детектив': '#e74c3c',
        'Роман': '#e91e63',
        'Триллер': '#f39c12',
        'Хоррор': '#2c3e50',
        'Нон-фикшн': '#16a085',
        'YA литература': '#ff6b6b'
    };
    return colors[genre] || '#95a5a6';
}
