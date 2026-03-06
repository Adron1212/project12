// ===================================
// ГРАФ СВЯЗЕЙ ЛИТЕРАТУРЫ
// ===================================

class NetworkManager {
    constructor() {
        this.currentType = 'authors';
        this.svg = null;
        this.simulation = null;
        this.init();
    }

    init() {
        this.setupControls();
        this.renderNetwork();
    }

    setupControls() {
        const buttons = document.querySelectorAll('.network-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.switchNetwork(type);
                
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    renderNetwork() {
        const container = document.getElementById('networkGraph');
        if (!container || typeof d3 === 'undefined') return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // Очищаем контейнер
        container.innerHTML = '';

        // Создаем SVG
        this.svg = d3.select('#networkGraph')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, width, height]);

        // Данные графа
        const data = this.getNetworkData();

        // Создаем симуляцию
        this.simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(40));

        // Рисуем связи
        const link = this.svg.append('g')
            .selectAll('line')
            .data(data.links)
            .join('line')
            .attr('stroke', '#6366f1')
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', 2);

        // Рисуем узлы
        const node = this.svg.append('g')
            .selectAll('circle')
            .data(data.nodes)
            .join('circle')
            .attr('r', d => d.size || 20)
            .attr('fill', d => d.color || '#6366f1')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .call(this.drag(this.simulation));

        // Подписи
        const label = this.svg.append('g')
            .selectAll('text')
            .data(data.nodes)
            .join('text')
            .text(d => d.name)
            .attr('font-size', 12)
            .attr('fill', '#b4b4c8')
            .attr('text-anchor', 'middle')
            .attr('dy', -25)
            .style('pointer-events', 'none');

        // Обработчики событий
        node.on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', (d.size || 20) * 1.3);
        }).on('mouseout', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.size || 20);
        });

        // Обновление позиций
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });
    }

    getNetworkData() {
        // Пример данных для графа авторов
        const nodes = [
            { id: '1', name: 'Пушкин', size: 30, color: '#6366f1' },
            { id: '2', name: 'Лермонтов', size: 25, color: '#8b5cf6' },
            { id: '3', name: 'Гоголь', size: 28, color: '#22c55e' },
            { id: '4', name: 'Достоевский', size: 32, color: '#fb923c' },
            { id: '5', name: 'Толстой', size: 35, color: '#ef4444' },
            { id: '6', name: 'Чехов', size: 27, color: '#3b82f6' },
            { id: '7', name: 'Тургенев', size: 26, color: '#a855f7' },
            { id: '8', name: 'Гончаров', size: 24, color: '#10b981' }
        ];

        const links = [
            { source: '1', target: '2' },
            { source: '1', target: '3' },
            { source: '2', target: '3' },
            { source: '3', target: '4' },
            { source: '4', target: '5' },
            { source: '5', target: '6' },
            { source: '6', target: '7' },
            { source: '3', target: '7' },
            { source: '3', target: '8' },
            { source: '7', target: '4' }
        ];

        return { nodes, links };
    }

    switchNetwork(type) {
        this.currentType = type;
        
        // Анимация перехода
        if (this.svg) {
            this.svg.transition()
                .duration(300)
                .style('opacity', 0)
                .on('end', () => {
                    this.renderNetwork();
                    this.svg.style('opacity', 0)
                        .transition()
                        .duration(300)
                        .style('opacity', 1);
                });
        }
    }

    drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
}

// Инициализация
let networkManager;
document.addEventListener('DOMContentLoaded', () => {
    if (typeof d3 !== 'undefined') {
        networkManager = new NetworkManager();
    }
});