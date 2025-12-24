// Основной файл скриптов для сайта комиссии по фигурному управлению мотоциклом

document.addEventListener('DOMContentLoaded', function() {
    // Обработка кликов по ссылкам навигации для активного состояния
    const navLinks = document.querySelectorAll('.nav ul li a');
    const currentPath = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Функция для плавной прокрутки к элементу
    function scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Обработка клика по логотипу для возврата на главную
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
    
    // Анимация появления контента при прокрутке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-card, .leader-card, .competition-card, .document-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Установка начальных стилей для анимации
    const elements = document.querySelectorAll('.section-card, .leader-card, .competition-card, .document-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Обработка формы обратной связи (если будет добавлена)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь будет логика отправки формы
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData.entries());
            
            console.log('Данные формы:', formObject);
            
            // Показать сообщение об успешной отправке
            alert('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
            
            // Очистить форму
            this.reset();
        });
    }
    
    // Функция для сохранения данных в localStorage
    window.saveDataToLocalStorage = function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Данные успешно сохранены в localStorage под ключом: ${key}`);
            return true;
        } catch (error) {
            console.error(`Ошибка при сохранении данных в localStorage: ${error}`);
            return false;
        }
    };
    
    // Функция для загрузки данных из localStorage
    window.loadDataFromLocalStorage = function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Ошибка при загрузке данных из localStorage: ${error}`);
            return null;
        }
    };
    
    // Функция для очистки всех данных из localStorage
    window.clearAllLocalStorage = function() {
        if (confirm('Вы уверены, что хотите очистить все сохраненные данные? Это действие нельзя отменить.')) {
            localStorage.clear();
            alert('Все данные успешно очищены!');
            location.reload();
        }
    };
    
    // Инициализация админ-панели (если страница admin.html)
    if (window.location.pathname.includes('admin.html')) {
        console.log('Инициализация админ-панели');
    }
    
    console.log('Скрипты сайта успешно загружены');
});
