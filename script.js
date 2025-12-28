document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт комиссии по мотоджимхане успешно загружен');
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация фильтров документов
    initDocumentFilters();
    
    // Инициализация формы партнеров
    initPartnerForm();
});

// Инициализация мобильного меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        menuToggle.innerHTML = mobileMenu.style.display === 'block' ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        body.style.overflow = mobileMenu.style.display === 'block' ? 'hidden' : 'auto';
    });
    
    // Закрытие меню при клике на ссылки
    document.querySelectorAll('.mobile-nav a').forEach(link => {
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
}

// Инициализация анимаций
function initAnimations() {
    // Плавное появление элементов при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .news-card, .competition-card, .document-card, .leader-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Начальные стили для анимации
    document.querySelectorAll('.card, .news-card, .competition-card, .document-card, .leader-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Запуск анимаций
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// Инициализация фильтров документов
function initDocumentFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const documentCards = document.querySelectorAll('.document-card');
    const searchInput = document.getElementById('document-search');
    
    if (!filterButtons.length || !documentCards.length) return;
    
    // Фильтрация по кнопкам
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновление активной кнопки
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация карточек
            documentCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(`document-${filter}`)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Поиск по документам
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            documentCards.forEach(card => {
                const title = card.querySelector('.document-title').textContent.toLowerCase();
                const description = card.querySelector('.document-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Инициализация формы партнеров
function initPartnerForm() {
    const partnerForm = document.querySelector('.submit-partner-form');
    
    if (!partnerForm) return;
    
    partnerForm.addEventListener('click', function(e) {
        e.preventDefault();
        
        const companyName = document.getElementById('company-name').value;
        const contactPerson = document.getElementById('contact-person').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const partnerType = document.getElementById('partner-type').value;
        
        if (!companyName || !contactPerson || !phone || !email || !partnerType) {
            alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
            return;
        }
        
        // Здесь должна быть логика отправки формы на сервер
        // Временно покажем сообщение об успехе
        alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
        
        // Сброс формы
        document.querySelector('.contact-form').reset();
    });
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Получение соревнований из localStorage
function getCompetitions() {
    const savedCompetitions = localStorage.getItem('competitionsList');
    return savedCompetitions ? JSON.parse(savedCompetitions) : [];
}
