/**
 * Оптимизация: Загрузка данных с кэшированием
 */
const DataManager = {
    cache: new Map(),
    cacheDuration: 5 * 60 * 1000, // 5 минут кэширования
    
    async fetchWithCache(url, options = {}) {
        const cacheKey = JSON.stringify({ url, options });
        const cached = this.cache.get(cacheKey);
        
        // Проверяем кэш
        if (cached && (Date.now() - cached.timestamp < this.cacheDuration)) {
            console.log('Используем кэшированные данные для:', url);
            return cached.data;
        }
        
        try {
            console.log('Загружаем данные для:', url);
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // Сохраняем в кэш
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            // Возвращаем кэшированные данные, даже если они устарели
            if (cached) {
                console.log('Используем устаревшие кэшированные данные');
                return cached.data;
            }
            throw error;
        }
    },
    
    clearCache() {
        this.cache.clear();
        console.log('Кэш очищен');
    }
};

/**
 * Инициализация календаря соревнований
 */
function initCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthEl = document.querySelector('.current-month');
    const prevMonthBtn = document.querySelector('.prev-month-btn');
    const nextMonthBtn = document.querySelector('.next-month-btn');
    
    if (!calendarGrid || !currentMonthEl) return;
    
    let currentDate = new Date();
    let competitions = getCompetitions();
    
    // Обновляем календарь
    const updateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Устанавливаем текущий месяц
        currentMonthEl.textContent = currentDate.toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric'
        });
        
        // Очищаем календарь
        calendarGrid.innerHTML = '';
        
        // Заголовки дней недели
        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Определяем первый день месяца
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay();
        
        // Корректировка для понедельника (0 -> воскресенье в JS)
        const startingDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Пустые ячейки до первого дня
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Ячейки дней месяца
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            // Проверяем, есть ли соревнования в этот день
            const dayCompetitions = competitions.filter(comp => {
                const compDate = new Date(comp.date);
                return compDate.getDate() === day && 
                       compDate.getMonth() === month && 
                       compDate.getFullYear() === year;
            });
            
            // Номер дня
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            
            // Отмечаем сегодняшний день
            if (dayDate.getTime() === today.getTime()) {
                dayNumber.classList.add('today');
            }
            
            // Отмечаем прошедшие дни
            if (dayDate < today) {
                dayNumber.classList.add('past-day');
            }
            
            dayCell.appendChild(dayNumber);
            
            // Добавляем соревнования
            if (dayCompetitions.length > 0) {
                dayCell.classList.add('has-competition');
                const competitionsList = document.createElement('div');
                competitionsList.className = 'day-competitions';
                
                dayCompetitions.forEach(comp => {
                    const compItem = document.createElement('div');
                    compItem.className = 'competition-item';
                    compItem.textContent = comp.name;
                    compItem.title = `Место: ${comp.location}\nКонтакт: ${comp.contact}`;
                    competitionsList.appendChild(compItem);
                });
                
                dayCell.appendChild(competitionsList);
            }
            
            calendarGrid.appendChild(dayCell);
        }
    };
    
    // Инициализация кнопок навигации
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }
    
    // Инициализация календаря
    updateCalendar();
}

/**
 * Фильтрация и поиск соревнований
 */
function initCompetitionsFilter() {
    const filterInput = document.querySelector('#competitions-filter');
    const filterDate = document.querySelector('#competitions-date');
    const filterRegion = document.querySelector('#competitions-region');
    
    if (!filterInput) return;
    
    const filterCompetitions = () => {
        const searchTerm = filterInput.value.toLowerCase();
        const dateFilter = filterDate ? filterDate.value : '';
        const regionFilter = filterRegion ? filterRegion.value : '';
        
        const competitions = getCompetitions();
        const filtered = competitions.filter(comp => {
            // Поиск по названию и месту
            const matchesSearch = comp.name.toLowerCase().includes(searchTerm) || 
                                 comp.location.toLowerCase().includes(searchTerm);
            
            // Фильтр по дате
            const matchesDate = !dateFilter || comp.date === dateFilter;
            
            // Фильтр по региону (нужно добавить поле region в данные соревнований)
            const matchesRegion = !regionFilter || comp.region === regionFilter;
            
            return matchesSearch && matchesDate && matchesRegion;
        });
        
        renderFilteredCompetitions(filtered);
    };
    
    // Слушатели событий
    filterInput.addEventListener('input', filterCompetitions);
    if (filterDate) filterDate.addEventListener('change', filterCompetitions);
    if (filterRegion) filterRegion.addEventListener('change', filterCompetitions);
}

/**
 * Рендер отфильтрованных соревнований
 */
function renderFilteredCompetitions(competitions) {
    const container = document.querySelector('.competitions-list');
    if (!container) return;
    
    if (competitions.length === 0) {
        container.innerHTML = `
            <div class="no-competitions">
                <i class="fas fa-calendar-times" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <h3>Соревнования не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    container.innerHTML = competitions.map(comp => {
        const compDate = new Date(comp.date);
        const isPast = compDate < today;
        
        return `
            <article class="competition-card ${isPast ? 'past-competition' : ''}">
                <div class="competition-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${new Date(comp.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </div>
                <h3 class="competition-title">${comp.name}</h3>
                <div class="competition-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${comp.location}
                </div>
                <div class="competition-contact">
                    <i class="fas fa-user"></i>
                    ${comp.contact}
                    ${comp.contactPhone ? `<br><i class="fas fa-phone"></i> ${comp.contactPhone}` : ''}
                </div>
                ${comp.protocol ? `
                    <div class="protocol-link">
                        <i class="fas fa-file-pdf"></i>
                        <a href="${comp.protocol}" target="_blank">Скачать протокол</a>
                    </div>
                ` : ''}
            </article>
        `;
    }).join('');
}

/**
 * Галерея изображений с ленивой загрузкой
 */
function initLazyLoadingGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (!galleryItems.length) return;
    
    // Проверка поддержки Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    lazyImageObserver.unobserve(img);
                }
            });
        });
        
        galleryItems.forEach(img => {
            if (img.dataset.src) {
                lazyImageObserver.observe(img);
            }
        });
    } else {
        // Fallback для старых браузеров
        galleryItems.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}

/**
 * Модальное окно для изображений галереи
 */
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="modal-image-container">
                <img src="" alt="" class="modal-image">
            </div>
            <div class="modal-caption"></div>
            <button class="modal-nav prev"><i class="fas fa-chevron-left"></i></button>
            <button class="modal-nav next"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    document.body.appendChild(modal);
    
    let currentIndex = 0;
    const images = Array.from(galleryItems);
    
    const showModal = (index) => {
        currentIndex = index;
        const item = images[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('figcaption')?.textContent || '';
        
        modal.querySelector('.modal-image').src = img.src || img.dataset.src;
        modal.querySelector('.modal-caption').textContent = caption;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    
    const hideModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    const showNext = () => {
        showModal((currentIndex + 1) % images.length);
    };
    
    const showPrev = () => {
        showModal((currentIndex - 1 + images.length) % images.length);
    };
    
    // Открытие модального окна
    galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => showModal(index));
    });
    
    // Закрытие модального окна
    modal.querySelector('.modal-close').addEventListener('click', hideModal);
    modal.querySelector('.modal-overlay').addEventListener('click', hideModal);
    
    // Навигация
    modal.querySelector('.modal-nav.next').addEventListener('click', showNext);
    modal.querySelector('.modal-nav.prev').addEventListener('click', showPrev);
    
    // Навигация клавиатурой
    document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'block') return;
        
        switch(e.key) {
            case 'Escape':
                hideModal();
                break;
            case 'ArrowRight':
                showNext();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
        }
    });
}

/**
 * Кнопка "Наверх"
 */
function initBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Наверх');
    document.body.appendChild(backToTopBtn);
    
    const toggleBackToTop = () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', toggleBackToTop);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Инициализация при загрузке
    toggleBackToTop();
}

/**
 * Валидация формы обратной связи
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (!contactForm) return;
    
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    const validatePhone = (phone) => {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone);
    };
    
    const showFieldError = (field, message) => {
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        field.classList.add('error');
    };
    
    const clearFieldError = (field) => {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    };
    
    const validateField = (field) => {
        const value = field.value.trim();
        
        if (field.required && !value) {
            showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        if (field.type === 'email' && value && !validateEmail(value)) {
            showFieldError(field, 'Введите корректный email');
            return false;
        }
        
        if (field.name === 'phone' && value && !validatePhone(value)) {
            showFieldError(field, 'Введите корректный номер телефона');
            return false;
        }
        
        clearFieldError(field);
        return true;
    };
    
    // Валидация при вводе
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
    
    // Отправка формы
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fields = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('Пожалуйста, исправьте ошибки в форме');
            return;
        }
        
        // Показываем индикатор загрузки
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        try {
            // В реальном приложении здесь должен быть fetch на сервер
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Показываем сообщение об успехе
            contactForm.innerHTML = `
                <div class="message success">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h3>Сообщение отправлено!</h3>
                        <p>Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.</p>
                    </div>
                </div>
            `;
            
        } catch (error) {
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Обработка внешних ссылок
 */
function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Добавляем иконку для внешних ссылок
            if (!link.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-external-link-alt';
                icon.style.marginLeft = '5px';
                link.appendChild(icon);
            }
        }
    });
}

/**
 * Управление видимостью элементов при прокрутке
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], .section-title');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id || 
                           entry.target.parentElement.id || 
                           entry.target.getAttribute('data-section');
                
                if (id) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Инициализация оффлайн-режима
 */
function initOfflineSupport() {
    // Кэширование критических ресурсов
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
        });
    }
    
    // Обработка онлайн/офлайн статуса
    window.addEventListener('online', () => {
        showMessage('Соединение восстановлено', 'success');
    });
    
    window.addEventListener('offline', () => {
        showMessage('Отсутствует подключение к интернету. Работаем в оффлайн-режиме', 'info');
    });
}

/**
 * Универсальная функция показа сообщений
 */
function showMessage(text, type = 'info', duration = 5000) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${text}</span>
    `;
    
    document.body.appendChild(message);
    
    // Удаляем сообщение через указанное время
    if (duration > 0) {
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            setTimeout(() => message.remove(), 300);
        }, duration);
    }
}

/**
 * Оптимизация производительности
 */
function initPerformanceOptimizations() {
    // Отложенная загрузка невидимых изображений
    const images = document.querySelectorAll('img[data-src]');
    if ('loading' in HTMLImageElement.prototype) {
        // Поддержка native lazy loading
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    // Оптимизация анимаций
    let lastScrollTime = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > 16) { // ~60fps
            requestAnimationFrame(() => {
                // Обновление анимаций при скролле
            });
            lastScrollTime = now;
        }
    }, { passive: true });
}

/**
 * Основная инициализация
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт комиссии по мотоджимхане успешно загружен');
    
    // Инициализация модулей
    initMobileMenu();
    initScrollAnimations();
    initAdminPanel();
    initButtonEffects();
    initCalendar();
    initCompetitionsFilter();
    initLazyLoadingGallery();
    initGalleryModal();
    initBackToTopButton();
    initContactForm();
    initExternalLinks();
    initScrollSpy();
    initPerformanceOptimizations();
    
    // Плавное появление страницы
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    });
    
    // Проверка браузерной поддержки
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver не поддерживается');
    }
    
    if (!('localStorage' in window)) {
        console.error('localStorage не поддерживается');
        showMessage('Ваш браузер не поддерживает локальное хранилище данных', 'error');
    }
    
    // Загрузка демо данных при первом посещении
    if (!localStorage.getItem('firstVisit')) {
        loadDemoData();
        localStorage.setItem('firstVisit', 'true');
    }
});

/**
 * Загрузка демо-данных
 */
function loadDemoData() {
    const demoCompetitions = [
        {
            id: 1,
            name: "Открытый чемпионат Москвы",
            date: "2024-05-15",
            location: "Москва, Мотодром 'Серебряный дождь'",
            contact: "Иванов Петр Сергеевич",
            contactPhone: "+7 (916) 123-45-67",
            region: "Москва"
        },
        {
            id: 2,
            name: "Кубок Московской области",
            date: "2024-06-20",
            location: "Красногорск, Автодром 'Форсаж'",
            contact: "Сидорова Анна Владимировна",
            contactPhone: "+7 (925) 234-56-78",
            region: "Московская область"
        }
    ];
    
    const demoDocuments = [
        {
            id: 1,
            name: "Регламент проведения соревнований 2024",
            url: "#",
            category: "rules",
            date: "15.01.2024",
            size: "2.1 МБ"
        },
        {
            id: 2,
            name: "Заявка на участие",
            url: "#",
            category: "forms",
            date: "10.02.2024",
            size: "145 КБ"
        }
    ];
    
    const demoLeaders = [
        {
            id: 1,
            name: "Иванов Петр Сергеевич",
            position: "Председатель комиссии",
            region: "Центральный федеральный округ",
            icon: "crown"
        },
        {
            id: 2,
            name: "Сидорова Анна Владимировна",
            position: "Зам. председателя",
            region: "Московская область",
            icon: "user-tie"
        }
    ];
    
    // Сохраняем демо-данные
    saveToLocalStorage('competitionsList', demoCompetitions);
    saveToLocalStorage('documentsList', demoDocuments);
    saveToLocalStorage('leadersList', demoLeaders);
    
    console.log('Демо-данные загружены');
}

/**
 * CSS для дополнительных стилей
 */
const additionalStyles = `
/* Стили для модального окна галереи */
.gallery-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

.gallery-modal .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
}

.gallery-modal .modal-content {
    position: relative;
    z-index: 1001;
    width: 90%;
    max-width: 1200px;
    height: 90vh;
    margin: 5vh auto;
    background: var(--light-text);
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.gallery-modal .modal-image-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #000;
}

.gallery-modal .modal-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.gallery-modal .modal-caption {
    padding: 15px 20px;
    background: var(--primary-dark-blue);
    color: var(--light-text);
    text-align: center;
    font-weight: 500;
}

.gallery-modal .modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    color: var(--light-text);
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 1002;
    transition: var(--transition);
}

.gallery-modal .modal-close:hover {
    background: var(--accent-red);
    transform: rotate(90deg);
}

.gallery-modal .modal-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    color: var(--light-text);
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 1002;
    transition: var(--transition);
}

.gallery-modal .modal-nav:hover {
    background: var(--accent-yellow);
}

.gallery-modal .modal-nav.prev {
    left: 15px;
}

.gallery-modal .modal-nav.next {
    right: 15px;
}

/* Стили для сообщений об ошибках формы */
.error-message {
    color: var(--accent-red);
    font-size: 0.9rem;
    margin-top: 5px;
    font-weight: 500;
}

.form-control.error {
    border-color: var(--accent-red);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

/* Стили для списков в админ-панели */
.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: var(--light-text);
    border-radius: 8px;
    margin-bottom: 10px;
    border-left: 4px solid var(--primary-dark-blue);
    transition: var(--transition);
}

.list-item:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.list-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    color: var(--light-text);
}

.edit-btn {
    background: var(--accent-yellow);
}

.edit-btn:hover {
    background: #e67e22;
    transform: rotate(15deg);
}

.delete-btn {
    background: var(--accent-red);
}

.delete-btn:hover {
    background: #c0392b;
    transform: rotate(15deg);
}

/* Адаптивность модального окна */
@media (max-width: 768px) {
    .gallery-modal .modal-content {
        width: 95%;
        height: 95vh;
        margin: 2.5vh auto;
    }
    
    .gallery-modal .modal-nav {
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }
    
    .gallery-modal .modal-close {
        width: 35px;
        height: 35px;
        font-size: 1rem;
    }
}

/* Эффект загрузки изображений */
img[data-src] {
    opacity: 0;
    transition: opacity 0.3s ease;
}

img.loaded {
    opacity: 1;
}
`;

// Добавляем дополнительные стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('Все модули JavaScript успешно загружены и инициализированы');
