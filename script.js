document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
            menuToggle.innerHTML = mobileMenu.style.display === 'block' ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            body.style.overflow = mobileMenu.style.display === 'block' ? 'hidden' : 'auto';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.mobile-nav ul li a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.style.display = 'none';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = 'auto';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (mobileMenu.style.display === 'block' && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                mobileMenu.style.display = 'none';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = 'auto';
            }
        });
        
        // Закрытие меню при изменении размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = 'auto';
            }
        });
    }
    
    console.log('Сайт комиссии по мотоджимхане успешно загружен');
    
    // Анимация появления элементов при загрузке
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
    
    // Плавные переходы при навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Получаем путь к следующей странице
            const href = this.getAttribute('href');
            
            // Добавляем эффект исчезания
            document.body.style.opacity = '0';
            
            // Переходим на следующую страницу с задержкой
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
    
    // Эффекты при прокрутке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card, .news-card');
        
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
    const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card, .news-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Админ-панель по паролю
    const adminLink = document.getElementById('admin-link');
    const loginModal = document.getElementById('admin-login-modal');
    const adminModal = document.getElementById('admin-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeAdminModal = document.getElementById('close-admin-modal');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    
    // Показать модальное окно входа при клике на админку
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Закрыть модальное окно входа
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            passwordInput.value = '';
        });
    }
    
    // Закрыть модальное окно админки
    if (closeAdminModal) {
        closeAdminModal.addEventListener('click', function() {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закрыть модальные окна при клике вне их
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            passwordInput.value = '';
        }
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Обработка входа по паролю
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const password = passwordInput.value.trim();
            // Пароль должен быть изменен Председателем комиссии
            const correctPassword = 'fum2025admin'; 
            
            if (password === correctPassword) {
                // Успешный вход
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Показать админ-панель
                adminModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            } else {
                // Неправильный пароль
                alert('Неверный пароль! Обратитесь к Председателю комиссии для получения доступа.');
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }
    
    // Обработка нажатия Enter в поле пароля
    if (passwordInput) {
        passwordInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });
    }
    
    // Эффекты для кнопок
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Переключение вкладок в админ-панели
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Добавление соревнования в календарь
    const addCompetitionBtn = document.getElementById('add-competition-btn');
    if (addCompetitionBtn) {
        addCompetitionBtn.addEventListener('click', function() {
            const name = document.getElementById('competition-name').value.trim();
            const date = document.getElementById('competition-date').value;
            const location = document.getElementById('competition-location').value.trim();
            const contact = document.getElementById('competition-contact').value.trim();
            const protocol = document.getElementById('protocol-file').value.trim();
            
            if (!name || !date || !location || !contact) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            alert('Соревнование успешно добавлено!');
            
            // Очистка формы
            document.getElementById('competition-name').value = '';
            document.getElementById('competition-date').value = '';
            document.getElementById('competition-location').value = '';
            document.getElementById('competition-contact').value = '';
            document.getElementById('protocol-file').value = '';
        });
    }
    
    // Навигация по стрелкам
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            const prevLink = document.querySelector('.nav-link.active').previousElementSibling?.querySelector('a');
            if (prevLink) prevLink.click();
        } else if (e.key === 'ArrowRight') {
            const nextLink = document.querySelector('.nav-link.active').nextElementSibling?.querySelector('a');
            if (nextLink) nextLink.click();
        }
    });
});

// Функция для получения данных из localStorage
function getLocalStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Ошибка при получении данных из localStorage: ${error}`);
        return null;
    }
}

// Функция для сохранения данных в localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Ошибка при сохранении данных в localStorage: ${error}`);
        return false;
    }
}
