// Основной JavaScript файл для сайта комиссии

document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт комиссии по мотоджимхане успешно загружен');
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Анимация при прокрутке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.tile, .leader-card, .competition-card, .document-card, .contact-card');
        
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
    const elements = document.querySelectorAll('.tile, .leader-card, .competition-card, .document-card, .contact-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Отображение модального окна админ-панели
    const adminBtn = document.getElementById('admin-panel-btn');
    const adminModal = document.getElementById('admin-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (adminBtn && adminModal && closeBtn) {
        adminBtn.addEventListener('click', function() {
            adminModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', function() {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                adminModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Функция для получения региона по ID
function getRegionName(regionId) {
    const regions = {
        'moscow': 'Москва',
        'spb': 'Санкт-Петербург',
        'tver': 'Тверская область',
        'nnovgorod': 'Нижегородская область',
        'smolensk': 'Смоленская область',
        'vologda': 'Вологодская область',
        'ulyanovsk': 'Ульяновская область',
        'tatarstan': 'Республика Татарстан',
        'kaluga': 'Калужская область',
        'tula': 'Тульская область'
    };
    return regions[regionId] || regionId;
}

// Функция для получения статуса по ID
function getStatusName(statusId) {
    const statuses = {
        'active': 'Действующая',
        'developing': 'Развивается',
        'planned': 'Планируется'
    };
    return statuses[statusId] || statusId;
}
