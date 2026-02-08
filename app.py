import pandas as pd
import numpy as np
from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

# Генерация реалистичных данных о популярности жанров (2000-2026)
def generate_genre_data():
    years = list(range(2000, 2027))
    
    # Расширенный список жанров с реалистичными трендами
    genres_data = {
        # Эпос
        'Роман': {
            'base': 80,
            'trend': lambda x: 80 - (x - 2000) * 0.4 + np.cos(x/3) * 4,
            'color': '#e91e63',
            'icon': '📖',
            'category': 'Эпос'
        },
        'Роман-эпопея': {
            'base': 55,
            'trend': lambda x: 55 + (x - 2000) * 0.3 + np.sin(x/4) * 3,
            'color': '#8e44ad',
            'icon': '📚',
            'category': 'Эпос'
        },
        'Повесть': {
            'base': 70,
            'trend': lambda x: 70 - (x - 2000) * 0.2 + np.cos(x/2.5) * 3,
            'color': '#3498db',
            'icon': '📘',
            'category': 'Эпос'
        },
        'Рассказ': {
            'base': 75,
            'trend': lambda x: 75 + (x - 2000) * 0.5 + np.sin(x/3) * 4,
            'color': '#2ecc71',
            'icon': '📗',
            'category': 'Эпос'
        },
        'Очерк': {
            'base': 50,
            'trend': lambda x: 50 + (x - 2000) * 0.8 + np.cos(x/3.5) * 2,
            'color': '#16a085',
            'icon': '📝',
            'category': 'Эпос'
        },
        'Сказка': {
            'base': 65,
            'trend': lambda x: 65 + (x - 2010) * 0.6 if x >= 2010 else 65 + (x - 2000) * 0.2,
            'color': '#f39c12',
            'icon': '🧚',
            'category': 'Эпос'
        },
        'Притча': {
            'base': 45,
            'trend': lambda x: 45 + (x - 2000) * 0.7 + np.sin(x/2.8) * 3,
            'color': '#d35400',
            'icon': '📜',
            'category': 'Эпос'
        },
        
        # Лирика
        'Лирическое стихотворение': {
            'base': 60,
            'trend': lambda x: 60 + (x - 2000) * 0.4 + np.sin(x/3.2) * 5,
            'color': '#e74c3c',
            'icon': '💫',
            'category': 'Лирика'
        },
        'Элегия': {
            'base': 42,
            'trend': lambda x: 42 + (x - 2000) * 0.3 + np.cos(x/4.5) * 2,
            'color': '#95a5a6',
            'icon': '🌙',
            'category': 'Лирика'
        },
        'Ода': {
            'base': 38,
            'trend': lambda x: 38 + (x - 2000) * 0.2 + np.sin(x/5) * 2,
            'color': '#f1c40f',
            'icon': '🎺',
            'category': 'Лирика'
        },
        'Послание': {
            'base': 40,
            'trend': lambda x: 40 + (x - 2000) * 0.35 + np.cos(x/3.8) * 2.5,
            'color': '#9b59b6',
            'icon': '✉️',
            'category': 'Лирика'
        },
        'Эпиграмма': {
            'base': 35,
            'trend': lambda x: 35 + (x - 2000) * 0.5 + np.sin(x/4.2) * 3,
            'color': '#34495e',
            'icon': '✍️',
            'category': 'Лирика'
        },
        'Сонет': {
            'base': 43,
            'trend': lambda x: 43 + (x - 2000) * 0.25 + np.cos(x/3.5) * 2,
            'color': '#e67e22',
            'icon': '🌹',
            'category': 'Лирика'
        },
        
        # Драма
        'Трагедия': {
            'base': 52,
            'trend': lambda x: 52 + (x - 2000) * 0.4 + np.sin(x/3.5) * 4,
            'color': '#c0392b',
            'icon': '🎭',
            'category': 'Драма'
        },
        'Комедия': {
            'base': 68,
            'trend': lambda x: 68 + (x - 2000) * 0.3 + np.cos(x/2.8) * 3,
            'color': '#27ae60',
            'icon': '🎪',
            'category': 'Драма'
        },
        'Драма': {
            'base': 64,
            'trend': lambda x: 64 + (x - 2000) * 0.5 + np.sin(x/3) * 3.5,
            'color': '#2c3e50',
            'icon': '🎬',
            'category': 'Драма'
        },
        'Водевиль': {
            'base': 48,
            'trend': lambda x: 48 + (x - 2000) * 0.2 + np.cos(x/4) * 2.5,
            'color': '#f39c12',
            'icon': '🎨',
            'category': 'Драма'
        },
        'Фарс': {
            'base': 45,
            'trend': lambda x: 45 + (x - 2000) * 0.25 + np.sin(x/3.5) * 3,
            'color': '#e67e22',
            'icon': '🤹',
            'category': 'Драма'
        },
        
        # Лироэпика
        'Поэма': {
            'base': 55,
            'trend': lambda x: 55 + (x - 2000) * 0.35 + np.cos(x/3.2) * 3,
            'color': '#9b59b6',
            'icon': '📜',
            'category': 'Лироэпика'
        },
        'Баллада': {
            'base': 50,
            'trend': lambda x: 50 + (x - 2000) * 0.45 + np.sin(x/2.9) * 3.5,
            'color': '#8e44ad',
            'icon': '🏰',
            'category': 'Лироэпика'
        }
    }
    
    data = []
    for year in years:
        for genre, props in genres_data.items():
            popularity = props['trend'](year) + np.random.normal(0, 1.5)
            popularity = max(20, min(100, popularity))  # Ограничение 20-100
            
            data.append({
                'year': year,
                'genre': genre,
                'popularity': round(popularity, 1),
                'color': props['color'],
                'icon': props['icon'],
                'category': props['category']
            })
    
    return pd.DataFrame(data), genres_data

# Генерация аналитических инсайтов
def generate_insights(df):
    insights = []
    
    # Анализ по каждому жанру
    for genre in df['genre'].unique():
        genre_data = df[df['genre'] == genre].sort_values('year')
        
        recent_growth = genre_data.iloc[-5:]['popularity'].mean() - genre_data.iloc[:5]['popularity'].mean()
        max_year = genre_data.loc[genre_data['popularity'].idxmax(), 'year']
        current_popularity = genre_data.iloc[-1]['popularity']
        category = genre_data.iloc[0]['category']
        
        insight = {
            'genre': genre,
            'icon': genre_data.iloc[0]['icon'],
            'category': category,
            'current_popularity': round(current_popularity, 1),
            'growth': round(recent_growth, 1),
            'peak_year': int(max_year),
            'trend': 'растущий' if recent_growth > 3 else 'стабильный' if recent_growth > -3 else 'падающий'
        }
        
        # Описание тренда по категориям и жанрам
        descriptions = {
            'Роман': 'Классический жанр с постепенным смещением в нишевые направления',
            'Роман-эпопея': 'Рост интереса к масштабным историческим повествованиям',
            'Повесть': 'Стабильный средний формат между романом и рассказом',
            'Рассказ': 'Растущая популярность малой прозы в цифровую эпоху',
            'Очерк': 'Возрождение документальной прозы и нон-фикшн',
            'Сказка': 'Новая волна современной сказки для взрослых',
            'Притча': 'Философская проза набирает популярность',
            'Лирическое стихотворение': 'Возрождение поэзии в социальных сетях',
            'Элегия': 'Классическая лирика с узкой аудиторией',
            'Ода': 'Торжественная поэзия в традиционном формате',
            'Послание': 'Эпистолярный жанр в современной интерпретации',
            'Эпиграмма': 'Сатирическая поэзия и афоризмы',
            'Сонет': 'Классическая форма с постоянной аудиторией',
            'Трагедия': 'Классическая драма на сцене и в литературе',
            'Комедия': 'Популярный жанр с широкой аудиторией',
            'Драма': 'Жизненные конфликты остаются актуальными',
            'Водевиль': 'Лёгкий театральный жанр',
            'Фарс': 'Комический жанр с гротеском',
            'Поэма': 'Сюжетная поэзия средней популярности',
            'Баллада': 'Песенная традиция в литературе'
        }
        
        insight['description'] = descriptions.get(genre, 'Интересный литературный жанр')
        insights.append(insight)
    
    # Сортировка по текущей популярности
    insights.sort(key=lambda x: x['current_popularity'], reverse=True)
    
    return insights

# Генерация данных при запуске
df, genres_info = generate_genre_data()
insights = generate_insights(df)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    year_filter = request.args.get('year', None)
    genre_filter = request.args.get('genre', None)
    category_filter = request.args.get('category', None)
    
    filtered_df = df.copy()
    
    if year_filter and year_filter != 'all':
        try:
            filtered_df = filtered_df[filtered_df['year'] == int(year_filter)]
        except ValueError:
            pass
    
    if genre_filter and genre_filter != 'all':
        filtered_df = filtered_df[filtered_df['genre'] == genre_filter]
    
    if category_filter and category_filter != 'all':
        filtered_df = filtered_df[filtered_df['category'] == category_filter]
    
    return jsonify(filtered_df.to_dict('records'))

@app.route('/api/insights')
def get_insights():
    category_filter = request.args.get('category', None)
    
    if category_filter and category_filter != 'all':
        filtered_insights = [i for i in insights if i['category'] == category_filter]
        return jsonify(filtered_insights)
    
    return jsonify(insights)

@app.route('/api/summary')
def get_summary():
    latest_year = df['year'].max()
    latest_data = df[df['year'] == latest_year]
    
    summary = {
        'total_genres': len(df['genre'].unique()),
        'years_analyzed': len(df['year'].unique()),
        'top_genre': latest_data.loc[latest_data['popularity'].idxmax(), 'genre'],
        'avg_popularity': round(latest_data['popularity'].mean(), 1),
        'trending_up': len([i for i in insights if i['growth'] > 3]),
        'trending_down': len([i for i in insights if i['growth'] < -3]),
        'categories': sorted(df['category'].unique().tolist())
    }
    
    return jsonify(summary)

@app.route('/api/genre/<genre_name>')
def get_genre_detail(genre_name):
    genre_data = df[df['genre'] == genre_name].sort_values('year')
    
    if len(genre_data) == 0:
        return jsonify({'error': 'Жанр не найден'}), 404
    
    detail = {
        'genre': genre_name,
        'icon': genre_data.iloc[0]['icon'],
        'color': genre_data.iloc[0]['color'],
        'category': genre_data.iloc[0]['category'],
        'history': genre_data[['year', 'popularity']].to_dict('records'),
        'min_popularity': round(genre_data['popularity'].min(), 1),
        'max_popularity': round(genre_data['popularity'].max(), 1),
        'avg_popularity': round(genre_data['popularity'].mean(), 1),
        'current_popularity': round(genre_data.iloc[-1]['popularity'], 1)
    }
    
    return jsonify(detail)

@app.route('/api/categories')
def get_categories():
    categories = df.groupby('category').agg({
        'genre': 'count',
        'popularity': 'mean'
    }).reset_index()
    
    categories.columns = ['category', 'genres_count', 'avg_popularity']
    categories['avg_popularity'] = categories['avg_popularity'].round(1)
    
    return jsonify(categories.to_dict('records'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
