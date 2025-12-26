/**
 * CommissionApp - Основной объект управления сайтом комиссии по мотоджимхане
 */
const CommissionApp = {
    // Конфигурация
    config: {
        adminPassword: 'fum2025admin',
        storageKey: 'commissionData_v2',
        animationDelay: 100,
        mobileBreakpoint: 768
    },

    // Состояние приложения
    state: {
        isAdminLoggedIn: false,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        calendarEvents: []
    },

    /**
     * Инициализация приложения
     */
    init() {
        console.log('Инициализация CommissionApp...');
        
        // Загружаем данные из localStorage
        this.loadFromStorage();
        
        // Инициализируем модули
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initAnimations();
        this.initCalendar();
        this.initFAQ();
        this.initAdminPanel();
        this.initForms();
        
        // Применяем анимации к существующим элементам
        this.animateElementsOnLoad();
        
        console.log('CommissionApp успешно инициализирован');
    },

    /**
     * Мобильное меню
     */
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');
        
        if (!menuToggle || !mobileMenu) return;
        
        // Переключение меню
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            menuToggle.innerHTML = mobileMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            
            // Блокировка прокрутки body
            document.body.style.overflow = mobileMenu.classList.contains('active') 
                ? 'hidden' 
                : '';
        });
        
        // Закрытие меню по клику на ссылку
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню по клику вне его
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
        
        // Автоматическое закрытие меню при ресайзе
        window.addEventListener('resize', () => {
            if (window.innerWidth > this.config.mobileBreakpoint && 
                mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
    },

    /**
     * Плавная прокрутка
     */
    initSmoothScrolling() {
        // Для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Для кнопок "наверх"
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: var(--shadow-md);
            z-index: 998;
            transition: all var(--transition-normal);
        `;
        
        document.body.appendChild(scrollTopBtn);
        
        scrollTopBtn.addEventListener('mouseenter', () => {
            scrollTopBtn.style.transform = 'translateY(-3px)';
            scrollTopBtn.style.boxShadow = 'var(--shadow-lg)';
        });
        
        scrollTopBtn.addEventListener('mouseleave', () => {
            scrollTopBtn.style.transform = 'translateY(0)';
            scrollTopBtn.style.boxShadow = 'var(--shadow-md)';
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            scrollTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
        });
    },

    /**
     * Анимации при прокрутке
     */
    initAnimations() {
        const animateElements = () => {
            const elements = document.querySelectorAll(
                '.card, .leader-card, .contact-card, .document-card, .partner-card, .tile'
            );
            
            elements.forEach((element, index) => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100 && elementBottom > 0) {
                    setTimeout(() => {
                        element.classList.add('fade-in');
                    }, index * 100);
                }
            });
        };
        
        // Запускаем анимацию при загрузке и прокрутке
        window.addEventListener('load', animateElements);
        window.addEventListener('scroll', animateElements);
        
        // Эффекты при наведении на карточки
        document.querySelectorAll('.card, .btn').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    },

    /**
     * Анимация элементов при загрузке
     */
    animateElementsOnLoad() {
        // Плавное появление body
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // Анимация для hero секции
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(30px)';
            heroSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                heroSection.style.opacity = '1';
                heroSection.style.transform = 'translateY(0)';
            }, 200);
        }
    },

    /**
     * Календарь событий
     */
    initCalendar() {
        const calendarContainer = document.querySelector('.calendar-container');
        if (!calendarContainer) return;
        
        // Загружаем события из localStorage
        this.state.calendarEvents = this.getFromStorage('calendarEvents') || [];
        
        // Инициализируем календарь
        this.renderCalendar();
        
        // Обработчики навигации
        const prevBtn = calendarContainer.querySelector('.nav-btn:first-of-type');
        const nextBtn = calendarContainer.querySelector('.nav-btn:last-of-type');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.state.currentMonth--;
                if (this.state.currentMonth < 0) {
                    this.state.currentMonth = 11;
                    this.state.currentYear--;
                }
                this.renderCalendar();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.state.currentMonth++;
                if (this.state.currentMonth > 11) {
                    this.state.currentMonth = 0;
                    this.state.currentYear++;
                }
                this.renderCalendar();
            });
        }
    },

    /**
     * Отрисовка календаря
     */
    renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const currentMonthEl = document.querySelector('.current-month');
        
        if (!calendarGrid || !currentMonthEl) return;
        
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        
        // Обновляем заголовок
        currentMonthEl.textContent = `${monthNames[this.state.currentMonth]} ${this.state.currentYear}`;
        
        // Очищаем календарь
        calendarGrid.innerHTML = '';
        
        // Добавляем заголовки дней
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-header';
            dayEl.textContent = day;
            calendarGrid.appendChild(dayEl);
        });
        
        // Получаем первый день месяца и количество дней
        const firstDay = new Date(this.state.currentYear, this.state.currentMonth, 1);
        const lastDay = new Date(this.state.currentYear, this.state.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Пустые ячейки для первых дней
        for (let i = 0; i < (firstDay.getDay() || 7) - 1; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Ячейки с днями месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.innerHTML = `<div class="day-number">${day}</div>`;
            
            // Проверяем события на этот день
            const currentDate = new Date(this.state.currentYear, this.state.currentMonth, day);
            const eventsForDay = this.state.calendarEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getDate() === day && 
                       eventDate.getMonth() === this.state.currentMonth &&
                       eventDate.getFullYear() === this.state.currentYear;
            });
            
            // Добавляем события
            eventsForDay.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'calendar-event';
                eventEl.textContent = event.title;
                eventEl.setAttribute('data-event', event.type);
                dayEl.appendChild(eventEl);
            });
            
            calendarGrid.appendChild(dayEl);
        }
    },

    /**
     * FAQ аккордеон
     */
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Закрываем все остальные
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Переключаем текущий
                item.classList.toggle('active');
            });
        });
    },

    /**
     * Админ-панель
     */
    initAdminPanel() {
        const adminTab = document.getElementById('admin-tab');
        const adminPanel = document.getElementById('admin-panel');
        const closeBtn = document.getElementById('close-admin-panel');
        const loginBtn = document.getElementById('login-admin-btn');
        const passwordInput = document.getElementById('admin-password');
        
        // Открытие/закрытие панели
        if (adminTab && adminPanel) {
            adminTab.addEventListener('click', (e) => {
                e.stopPropagation();
                adminPanel.classList.add('active');
            });
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    adminPanel.classList.remove('active');
                });
            }
            
            // Закрытие по клику вне панели
            document.addEventListener('click', (e) => {
                if (adminPanel.classList.contains('active') &&
                    !adminPanel.contains(e.target) &&
                    !adminTab.contains(e.target)) {
                    adminPanel.classList.remove('active');
                }
            });
            
            // Переключение вкладок
            const tabBtns = adminPanel.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.getAttribute('data-tab');
                    
                    // Обновляем активные кнопки
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Показываем нужную вкладку
                    const tabContents = adminPanel.querySelectorAll('.tab-content');
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === `${tabId}-tab`) {
                            content.classList.add('active');
                        }
                    });
                });
            });
            
            // Обработка входа
            if (loginBtn && passwordInput) {
                loginBtn.addEventListener('click', () => {
                    if (passwordInput.value === this.config.adminPassword) {
                        this.state.isAdminLoggedIn = true;
                        this.showAdminContent();
                        this.showNotification('Вход выполнен успешно!', 'success');
                    } else {
                        this.showNotification('Неверный пароль!', 'error');
                    }
                });
                
                // Ввод по Enter
                passwordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        loginBtn.click();
                    }
                });
            }
        }
    },

    /**
     * Показать контент админ-панели после входа
     */
    showAdminContent() {
        const loginSection = document.querySelector('.admin-login');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (loginSection) {
            loginSection.style.display = 'none';
        }
        
        tabContents.forEach(content => {
            if (content.classList.contains('active')) {
                content.style.display = 'block';
            }
        });
        
        // Загружаем данные для списков
        this.loadAdminLists();
    },

    /**
     * Загрузка списков в админ-панель
     */
    loadAdminLists() {
        // Загружаем данные из localStorage
        const competitions = this.getFromStorage('competitions') || [];
        const documents = this.getFromStorage('documents') || [];
        const leaders = this.getFromStorage('leaders') || [];
        const regions = this.getFromStorage('regions') || [];
        
        // Обновляем списки
        this.updateList('competitions-list', competitions, 'competition');
        this.updateList('documents-list', documents, 'document');
        this.updateList('leaders-list', leaders, 'leader');
        this.updateList('regions-list', regions, 'region');
    },

    /**
     * Обновление списка в админ-панели
     */
    updateList(listId, items, type) {
        const listContainer = document.getElementById(listId);
        if (!listContainer) return;
        
        if (items.length === 0) {
            listContainer.innerHTML = `<div class="empty-list">Нет добавленных ${this.getTypeName(type)}</div>`;
            return;
        }
        
        listContainer.innerHTML = items.map((item, index) => `
            <div class="admin-list-item" data-id="${item.id || index}">
                <div class="item-info">
                    <strong>${item.name || item.title || item.region || 'Без названия'}</strong>
                    <div class="item-details">
                        ${item.date || ''} ${item.location ? `• ${item.location}` : ''}
                        ${item.position ? `• ${item.position}` : ''}
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="${type}" data-id="${item.id || index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления
        listContainer.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.closest('.delete-item').getAttribute('data-type');
                const id = parseInt(e.target.closest('.delete-item').getAttribute('data-id'));
                this.deleteItem(type, id);
            });
        });
    },

    /**
     * Удаление элемента
     */
    deleteItem(type, id) {
        if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return;
        
        const key = `${type}s`;
        let items = this.getFromStorage(key) || [];
        
        items = items.filter(item => (item.id || item) !== id);
        this.saveToStorage(key, items);
        
        this.loadAdminLists();
        this.showNotification(`${this.getTypeName(type)} удален(а)`, 'success');
    },

    /**
     * Получение названия типа
     */
    getTypeName(type) {
        const names = {
            'competition': 'соревнований',
            'document': 'документов',
            'leader': 'руководителей',
            'region': 'регионов'
        };
        return names[type] || 'элементов';
    },

    /**
     * Инициализация форм
     */
    initForms() {
        // Форма добавления соревнования
        const addCompetitionBtn = document.getElementById('add-competition-btn');
        if (addCompetitionBtn) {
            addCompetitionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addCompetition();
            });
        }
        
        // Форма добавления документа
        const addDocumentBtn = document.getElementById('add-document-btn');
        if (addDocumentBtn) {
            addDocumentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addDocument();
            });
        }
        
        // Форма добавления руководителя
        const addLeaderBtn = document.getElementById('add-leader-btn');
        if (addLeaderBtn) {
            addLeaderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addLeader();
            });
        }
        
        // Форма добавления региона
        const addRegionBtn = document.getElementById('add-region-btn');
        if (addRegionBtn) {
            addRegionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addRegion();
            });
        }
    },

    /**
     * Добавление соревнования
     */
    addCompetition() {
        const name = this.getValue('competition-name');
        const date = this.getValue('competition-date');
        const location = this.getValue('competition-location');
        const description = this.getValue('competition-description');
        
        if (!name || !date || !location) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        const competitions = this.getFromStorage('competitions') || [];
        const newCompetition = {
            id: Date.now(),
            name,
            date,
            location,
            description,
            type: 'competition'
        };
        
        competitions.push(newCompetition);
        this.saveToStorage('competitions', competitions);
        
        this.clearForm('competition');
        this.loadAdminLists();
        this.showNotification('Соревнование добавлено', 'success');
    },

    /**
     * Добавление документа
     */
    addDocument() {
        const name = this.getValue('document-name');
        const category = this.getValue('document-category');
        const fileInput = document.getElementById('document-upload');
        
        if (!name || !category || !fileInput.files[0]) {
            this.showNotification('Заполните все поля и выберите файл', 'error');
            return;
        }
        
        const documents = this.getFromStorage('documents') || [];
        const newDocument = {
            id: Date.now(),
            name,
            category,
            filename: fileInput.files[0].name,
            size: this.formatFileSize(fileInput.files[0].size),
            date: new Date().toLocaleDateString('ru-RU'),
            type: 'document'
        };
        
        documents.push(newDocument);
        this.saveToStorage('documents', documents);
        
        this.clearForm('document');
        this.loadAdminLists();
        this.showNotification('Документ добавлен', 'success');
    },

    /**
     * Добавление руководителя
     */
    addLeader() {
        const name = this.getValue('leader-name');
        const position = this.getValue('leader-position');
        const region = this.getValue('leader-region');
        const phone = this.getValue('leader-phone');
        const email = this.getValue('leader-email');
        
        if (!name || !position || !region) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        const leaders = this.getFromStorage('leaders') || [];
        const newLeader = {
            id: Date.now(),
            name,
            position,
            region,
            phone,
            email,
            type: 'leader'
        };
        
        leaders.push(newLeader);
        this.saveToStorage('leaders', leaders);
        
        this.clearForm('leader');
        this.loadAdminLists();
        this.showNotification('Руководитель добавлен', 'success');
    },

    /**
     * Добавление региона
     */
    addRegion() {
        const region = this.getValue('region-name');
        const representative = this.getValue('representative-name');
        const position = this.getValue('representative-position');
        const phone = this.getValue('representative-phone');
        const email = this.getValue('representative-email');
        
        if (!region || !representative || !position) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        const regions = this.getFromStorage('regions') || [];
        const newRegion = {
            id: Date.now(),
            region,
            representative,
            position,
            phone,
            email,
            type: 'region'
        };
        
        regions.push(newRegion);
        this.saveToStorage('regions', regions);
        
        this.clearForm('region');
        this.loadAdminLists();
        this.showNotification('Регион добавлен', 'success');
    },

    /**
     * Вспомогательные методы
     */
    getValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.value.trim() : '';
    },

    clearForm(type) {
        const forms = {
            'competition': ['competition-name', 'competition-date', 'competition-location', 'competition-description'],
            'document': ['document-name', 'document-category', 'document-upload'],
            'leader': ['leader-name', 'leader-position', 'leader-region', 'leader-phone', 'leader-email'],
            'region': ['region-name', 'representative-name', 'representative-position', 'representative-phone', 'representative-email']
        };
        
        if (forms[type]) {
            forms[type].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.type === 'file') {
                        element.value = '';
                    } else {
                        element.value = '';
                    }
                }
            });
        }
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Работа с localStorage
     */
    loadFromStorage() {
        // Загружаем все данные
        ['competitions', 'documents', 'leaders', 'regions', 'calendarEvents'].forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    this[key] = JSON.parse(data);
                } catch (e) {
                    console.error(`Ошибка загрузки ${key}:`, e);
                }
            }
        });
    },

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`Ошибка сохранения ${key}:`, e);
            return false;
        }
    },

    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Ошибка получения ${key}:`, e);
            return null;
        }
    },

    /**
     * Уведомления
     */
    showNotification(message, type = 'info') {
        // Создаем контейнер для уведомлений, если его нет
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
        
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            padding: 15px 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 
                        type === 'error' ? 'var(--accent-color)' : 
                        'var(--primary-color)'};
            color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        container.appendChild(notification);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Добавляем стили для анимации
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

/**
 * Инициализация при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем основное приложение
    CommissionApp.init();
    
    // Добавляем служебные кнопки для разработки
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('github.io')) {
        const devTools = document.createElement('div');
        devTools.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9997;
        `;
        
        // Кнопка сброса данных
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Сбросить данные';
        resetBtn.className = 'btn btn-danger';
        resetBtn.style.cssText = `
            padding: 10px 15px;
            font-size: 14px;
        `;
        resetBtn.addEventListener('click', () => {
            if (confirm('Сбросить все данные в localStorage?')) {
                localStorage.clear();
                location.reload();
            }
        });
        
        // Кнопка тестового уведомления
        const testNotifBtn = document.createElement('button');
        testNotifBtn.textContent = 'Тест уведомления';
        testNotifBtn.className = 'btn btn-primary';
        testNotifBtn.style.cssText = `
            padding: 10px 15px;
            font-size: 14px;
        `;
        testNotifBtn.addEventListener('click', () => {
            CommissionApp.showNotification('Тестовое уведомление!', 'success');
        });
        
        devTools.appendChild(resetBtn);
        devTools.appendChild(testNotifBtn);
        document.body.appendChild(devTools);
    }
});

/**
 * Глобальные утилиты
 */
// Открытие админ-панели из любого места
window.openAdminPanel = () => {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.add('active');
    }
};

// Закрытие админ-панели
window.closeAdminPanel = () => {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.remove('active');
    }
};

// Проверка авторизации
window.isAdminLoggedIn = () => {
    return CommissionApp.state.isAdminLoggedIn;
};

// Добавление события в календарь
window.addCalendarEvent = (title, date, type = 'competition') => {
    CommissionApp.state.calendarEvents.push({ title, date, type });
    CommissionApp.saveToStorage('calendarEvents', CommissionApp.state.calendarEvents);
    CommissionApp.renderCalendar();
    return true;
};

// Экспорт данных
window.exportData = () => {
    const data = {
        competitions: CommissionApp.getFromStorage('competitions') || [],
        documents: CommissionApp.getFromStorage('documents') || [],
        leaders: CommissionApp.getFromStorage('leaders') || [],
        regions: CommissionApp.getFromStorage('regions') || [],
        calendarEvents: CommissionApp.state.calendarEvents
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'commission_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};

// Импорт данных
window.importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.competitions) CommissionApp.saveToStorage('competitions', data.competitions);
            if (data.documents) CommissionApp.saveToStorage('documents', data.documents);
            if (data.leaders) CommissionApp.saveToStorage('leaders', data.leaders);
            if (data.regions) CommissionApp.saveToStorage('regions', data.regions);
            if (data.calendarEvents) {
                CommissionApp.state.calendarEvents = data.calendarEvents;
                CommissionApp.saveToStorage('calendarEvents', data.calendarEvents);
            }
            
            CommissionApp.loadAdminLists();
            CommissionApp.renderCalendar();
            CommissionApp.showNotification('Данные успешно импортированы!', 'success');
        } catch (error) {
            CommissionApp.showNotification('Ошибка импорта данных', 'error');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(file);
};

console.log('CommissionApp загружен и готов к работе');
