document.addEventListener('DOMContentLoaded', function() {
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
        const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card');
        
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
    const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card');
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
    const adminModal = document.getElementById('admin-modal');
    const closeBtn = document.querySelector('.close-modal');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    
    // Показать модальное окно при клике на админку
    adminLink.addEventListener('click', function(e) {
        e.preventDefault();
        adminModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Закрыть модальное окно
    closeBtn.addEventListener('click', function() {
        adminModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        passwordInput.value = '';
    });
    
    // Закрыть модальное окно при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            passwordInput.value = '';
        }
    });
    
    // Обработка входа по паролю
    loginBtn.addEventListener('click', function() {
        const password = passwordInput.value.trim();
        const correctPassword = 'fum2025admin'; // Этот пароль должен быть изменен на настоящий
        
        if (password === correctPassword) {
            // Успешный вход
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Редирект на админ-панель
            window.location.href = 'admin.html?auth=success';
        } else {
            // Неправильный пароль
            alert('Неверный пароль! Обратитесь к Председателю комиссии для получения доступа.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // Обработка нажатия Enter в поле пароля
    passwordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
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
