document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт комиссии по фигурному управлению мотоциклом успешно загружен');
    
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    document.querySelector('.menu-toggle i').className = 'fas fa-bars';
                }
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                document.querySelector('.menu-toggle i').className = 'fas fa-bars';
            }
        });
    }
    
    // Админ-панель
    const adminTab = document.getElementById('admin-tab');
    const adminPanel = document.getElementById('admin-panel');
    const closeAdminPanel = document.getElementById('close-admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const loginAdminBtn = document.getElementById('login-admin-btn');
    
    if (adminTab) {
        adminTab.addEventListener('click', function() {
            adminPanel.classList.add('active');
        });
    }
    
    if (closeAdminPanel) {
        closeAdminPanel.addEventListener('click', function() {
            adminPanel.classList.remove('active');
        });
    }
    
    if (loginAdminBtn) {
        loginAdminBtn.addEventListener('click', function() {
            const password = document.getElementById('admin-password').value.trim();
            const correctPassword = 'fum2025admin';
            
            if (password === correctPassword) {
                // Показать панели управления после входа
                document.querySelectorAll('.admin-login').forEach(el => {
                    el.style.display = 'none';
                });
                document.querySelectorAll('.tab-content').forEach(el => {
                    el.style.display = 'none';
                });
                document.querySelector('.tab-content.active').style.display = 'block';
                alert('Добро пожаловать в админ-панель!');
            } else {
                alert('Неверный пароль! Обратитесь к Председателю комиссии для получения доступа.');
            }
        });
    }
    
    // Переключение вкладок в админ-панели
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Закрытие админ-панели при клике вне ее
    document.addEventListener('click', function(e) {
        if (adminPanel.classList.contains('active') && 
            !adminPanel.contains(e.target) && 
            !adminTab.contains(e.target)) {
            adminPanel.classList.remove('active');
        }
    });
    
    // Эффекты для кнопок
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Анимация появления элементов при загрузке
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
    
    // Анимации при прокрутке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.tile, .news-card, .leader-card, .competition-card');
        
        elements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    };
    
    // Установка начальных стилей для анимации
    const elements = document.querySelectorAll('.tile, .news-card, .leader-card, .competition-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Обработчики для добавления контента (просто для демонстрации)
    if (document.getElementById('add-news-btn')) {
        document.getElementById('add-news-btn').addEventListener('click', function() {
            alert('Новость успешно добавлена!');
        });
    }
    
    if (document.getElementById('add-document-btn')) {
        document.getElementById('add-document-btn').addEventListener('click', function() {
            alert('Документ успешно добавлен!');
        });
    }
    
    if (document.getElementById('add-leader-btn')) {
        document.getElementById('add-leader-btn').addEventListener('click', function() {
            alert('Руководитель успешно добавлен!');
        });
    }
    
    if (document.getElementById('add-region-btn')) {
        document.getElementById('add-region-btn').addEventListener('click', function() {
            alert('Региональный представитель успешно добавлен!');
        });
    }
    
    if (document.getElementById('add-competition-btn')) {
        document.getElementById('add-competition-btn').addEventListener('click', function() {
            alert('Соревнование успешно добавлено!');
        });
    }
});
