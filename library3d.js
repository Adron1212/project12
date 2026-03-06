// ===================================
// 3D ВИРТУАЛЬНАЯ БИБЛИОТЕКА
// ===================================

class Library3DManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.books = [];
        this.currentShelf = 'classics';
        this.init();
    }

    init() {
        this.setupControls();
        this.init3DLibrary();
    }

    setupControls() {
        const buttons = document.querySelectorAll('.library-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const shelf = btn.getAttribute('data-shelf');
                this.loadShelf(shelf);
                
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    init3DLibrary() {
        const container = document.getElementById('library3D');
        if (!container || typeof THREE === 'undefined') return;

        try {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0a0a0f);

            this.camera = new THREE.PerspectiveCamera(
                60,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            this.camera.position.set(0, 2, 8);
            this.camera.lookAt(0, 0, 0);

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);

            // Освещение
            const ambientLight = new THREE.AmbientLight(0x404040, 2);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 10, 5);
            this.scene.add(directionalLight);

            // Создаем полку с книгами
            this.createBookshelf();

            // Анимация
            this.animate();

            // Адаптивность
            window.addEventListener('resize', () => {
                if (!container) return;
                this.camera.aspect = container.clientWidth / container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.clientWidth, container.clientHeight);
            });

        } catch (error) {
            console.error('Ошибка 3D библиотеки:', error);
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">3D библиотека временно недоступна</div>';
        }
    }

    createBookshelf() {
        const bookData = [
            { title: 'Война и мир', color: 0x6366f1, width: 0.3 },
            { title: 'Преступление и наказание', color: 0x8b5cf6, width: 0.25 },
            { title: 'Анна Каренина', color: 0x22c55e, width: 0.28 },
            { title: 'Евгений Онегин', color: 0xfb923c, width: 0.2 },
            { title: 'Мастер и Маргарита', color: 0xef4444, width: 0.32 },
            { title: 'Идиот', color: 0x3b82f6, width: 0.27 }
        ];

        let xPosition = -3;

        bookData.forEach((data, index) => {
            const geometry = new THREE.BoxGeometry(data.width, 1, 0.15);
            const material = new THREE.MeshPhongMaterial({ 
                color: data.color,
                shininess: 30
            });
            const book = new THREE.Mesh(geometry, material);

            book.position.set(xPosition + data.width / 2, 0, 0);
            book.userData = { title: data.title, index: index };

            this.scene.add(book);
            this.books.push(book);

            xPosition += data.width + 0.05;
        });
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;

        requestAnimationFrame(() => this.animate());

        // Анимация книг
        this.books.forEach((book, index) => {
            book.position.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
            book.rotation.y = Math.sin(Date.now() * 0.0005 + index) * 0.05;
        });

        this.renderer.render(this.scene, this.camera);
    }

    loadShelf(shelf) {
        this.currentShelf = shelf;
        console.log('Загружена полка:', shelf);
        
        // Анимация смены полки
        this.books.forEach((book, index) => {
            gsap.to(book.position, {
                duration: 0.8,
                y: book.position.y + 0.3,
                ease: 'back.out(1.7)',
                delay: index * 0.1
            });
        });
    }
}

// Инициализация
let library3DManager;
document.addEventListener('DOMContentLoaded', () => {
    library3DManager = new Library3DManager();
});