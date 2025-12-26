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
        calendarEvents: [],
        currentTab: 'news',
        editingItem: null
    },

    // Данные приложения
    data: {
        news: [],
        competitions: [],
        documents: [],
        leaders: [],
        contacts: [],
        partners: []
    },

    /**
     * Инициализация приложения
     */
    init() {
        console.log('Инициализация CommissionApp...');
        
        // Загружаем данные из localStorage
        this.loadAllData();
        
        // Инициализируем модули
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initAnimations();
        this.initCalendar();
        this.initFAQ();
        this.initAdminPanel();
        this.initForms();
        this.initEventListeners();
        
        // Применяем анимации к существующим элементам
        this.animateElementsOnLoad();
        
        // Восстанавливаем состояние админ-панели
        this.restoreAdminState();
        
        console.log('CommissionApp успешно инициализирован');
    },

    /**
     * Загрузка всех данных из localStorage
     */
    loadAllData() {
        const dataKeys = ['news', 'competitions', 'documents', 'leaders', 'contacts', 'partners', 'calendarEvents'];
        
        dataKeys.forEach(key => {
            const savedData = localStorage.getItem(`commission_${key}`);
            if (savedData) {
                try {
                    if (key === 'calendarEvents') {
                        this.state[key] = JSON.parse(savedData);
                    } else {
                        this.data[key] = JSON.parse(savedData);
                    }
                } catch (e) {
                    console.error(`Ошибка загрузки ${key}:`, e);
                    if (key === 'calendarEvents') {
                        this.state[key] = [];
                    } else {
                        this.data[key] = [];
                    }
                }
            } else {
                if (key === 'calendarEvents') {
                    this.state[key] = [];
                } else {
                    this.data[key] = [];
                }
            }
        });
        
        // Загружаем начальные данные, если нет сохраненных
        this.initializeDefaultData();
    },

    /**
     * Инициализация начальных данных
     */
    initializeDefaultData() {
        // Начальные новости
        if (this.data.news.length === 0) {
            this.data.news = [
                {
                    id: 1,
                    title: 'Чемпионат России 2025',
                    date: '2025-04-15',
                    content: 'Стартовала подготовка к Чемпионату России по мотоджимхане 2025 года. Регистрация участников откроется 1 мая.'
                },
                {
                    id: 2,
                    title: 'Новые правила сезона 2025',
                    date: '2025-04-10',
                    content: 'Опубликованы обновленные правила проведения соревнований по мотоджимхане на сезон 2025 года.'
                }
            ];
            this.saveData('news');
        }

        // Начальные соревнования
        if (this.data.competitions.length === 0) {
            this.data.competitions = [
                {
                    id: 1,
                    name: 'Этап Кубка России по мотоджимхане',
                    date: '2025-04-19',
                    location: 'Москва, Мотодром "Крылатское"',
                    type: 'national',
                    description: 'Первый этап Кубка России 2025 года. Участвуют спортсмены всех возрастных категорий.'
                }
            ];
            this.saveData('competitions');
        }

        // Начальные события календаря
        if (this.state.calendarEvents.length === 0) {
            this.state.calendarEvents = [
                { title: 'Открытие сезона в Москве', date: '2025-04-05', type: 'regional' },
                { title: 'Соревнования в Нижнем Новгороде', date: '2025-04-12', type: 'regional' },
                { title: 'Этап Кубка России', date: '2025-04-19', type: 'national' },
                { title: 'Семинар для судей', date: '2025-04-18', type: 'training' }
            ];
            this.saveData('calendarEvents', true);
        }
    },

    /**
     * Сохранение данных в localStorage
     */
    saveData(key, isState = false) {
        try {
            const data = isState ? this.state[key] : this.data[key];
            localStorage.setItem(`commission_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`Ошибка сохранения ${key}:`, e);
            this.showNotification(`Ошибка сохранения ${key}`, 'error');
            return false;
        }
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
                
                if (href === '#' || href === '#!') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Закрываем мобильное меню, если оно открыто
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.querySelector('.menu-toggle').innerHTML = '<i class="fas fa-bars"></i>';
                        document.body.style.overflow = '';
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    /**
     * Анимации при прокрутке
     */
    initAnimations() {
        const animateElements = () => {
            const elements = document.querySelectorAll(
                '.card, .leader-card, .contact-card, .document-card, .partner-card, .timeline-item, .achievement-card'
            );
            
            elements.forEach((element, index) => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    setTimeout(() => {
                        element.classList.add('fade-in');
                    }, index * this.config.animationDelay);
                }
            });
        };
        
        // Запускаем анимацию при загрузке и прокрутке
        window.addEventListener('load', animateElements);
        window.addEventListener('scroll', animateElements);
        
        // Эффекты при наведении на карточки
        document.querySelectorAll('.card, .btn, .leader-card, .partner-card').forEach(element => {
            element.addEventListener('mouseenter', function() {
                if (!this.classList.contains('admin-list-item')) {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = 'var(--shadow-lg)';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (!this.classList.contains('admin-list-item')) {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '';
                }
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
        
        // Инициализируем календарь
        this.renderCalendar();
        
        // Обработчики навигации
        const prevBtn = calendarContainer.querySelector('.prev-month');
        const nextBtn = calendarContainer.querySelector('.next-month');
        
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
        
        // Обработчики фильтров
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                this.filterCompetitions(filter);
            });
        });
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
        const startDay = (firstDay.getDay() + 6) % 7; // Преобразуем к формату Пн=0, Вс=6
        
        // Пустые ячейки для первых дней
        for (let i = 0; i < startDay; i++) {
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
            const dateStr = currentDate.toISOString().split('T')[0];
            const eventsForDay = this.state.calendarEvents.filter(event => {
                const eventDate = new Date(event.date);
                const eventDateStr = eventDate.toISOString().split('T')[0];
                return eventDateStr === dateStr;
            });
            
            // Добавляем события
            eventsForDay.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'calendar-event';
                eventEl.setAttribute('data-event', event.type);
                eventEl.innerHTML = `<span class="event-title">${event.title}</span>`;
                
                // Добавляем всплывающую подсказку
                eventEl.title = event.title;
                
                dayEl.appendChild(eventEl);
            });
            
            // Подсвечиваем сегодняшний день
            const today = new Date();
            if (today.getDate() === day && 
                today.getMonth() === this.state.currentMonth && 
                today.getFullYear() === this.state.currentYear) {
                dayEl.classList.add('today');
                dayEl.querySelector('.day-number').style.backgroundColor = 'var(--primary-color)';
                dayEl.querySelector('.day-number').style.color = 'white';
                dayEl.querySelector('.day-number').style.borderRadius = '50%';
                dayEl.querySelector('.day-number').style.width = '30px';
                dayEl.querySelector('.day-number').style.height = '30px';
                dayEl.querySelector('.day-number').style.display = 'flex';
                dayEl.querySelector('.day-number').style.alignItems = 'center';
                dayEl.querySelector('.day-number').style.justifyContent = 'center';
                dayEl.querySelector('.day-number').style.margin = '0 auto';
            }
            
            calendarGrid.appendChild(dayEl);
        }
    },

    /**
     * Фильтрация соревнований
     */
    filterCompetitions(filter) {
        const competitionCards = document.querySelectorAll('.competition-card');
        
        competitionCards.forEach(card => {
            let show = false;
            
            if (filter === 'all') {
                show = true;
            } else if (filter === 'upcoming') {
                const dateStr = card.querySelector('.competition-date .date-day')?.textContent;
                const monthStr = card.querySelector('.competition-date .date-month')?.textContent;
                const yearStr = card.querySelector('.competition-date .date-year')?.textContent;
                
                if (dateStr && monthStr && yearStr) {
                    const monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 
                                       'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
                    const monthIndex = monthNames.indexOf(monthStr);
                    const competitionDate = new Date(yearStr, monthIndex, parseInt(dateStr));
                    const today = new Date();
                    
                    show = competitionDate >= today && !card.classList.contains('past');
                }
            } else if (filter === 'past') {
                show = card.classList.contains('past');
            } else if (filter === 'regional' || filter === 'national') {
                const type = card.querySelector('.competition-type')?.className.includes(filter);
                show = type && !card.classList.contains('past');
            }
            
            card.style.display = show ? 'grid' : 'none';
        });
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
        }
        
        // Переключение вкладок
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.switchAdminTab(tabId);
            });
        });
        
        // Обработка входа
        if (loginBtn && passwordInput) {
            loginBtn.addEventListener('click', () => {
                this.loginAdmin(passwordInput.value);
            });
            
            // Ввод по Enter
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.loginAdmin(passwordInput.value);
                }
            });
        }
    },

    /**
     * Вход в админ-панель
     */
    loginAdmin(password) {
        const loginMessage = document.getElementById('login-message');
        
        if (password === this.config.adminPassword) {
            this.state.isAdminLoggedIn = true;
            this.showAdminContent();
            this.showNotification('Вход выполнен успешно!', 'success');
            
            if (loginMessage) {
                loginMessage.textContent = '';
                loginMessage.className = 'login-message';
            }
            
            // Сохраняем состояние входа
            localStorage.setItem('commission_adminLoggedIn', 'true');
            localStorage.setItem('commission_adminTab', this.state.currentTab);
        } else {
            this.showNotification('Неверный пароль!', 'error');
            
            if (loginMessage) {
                loginMessage.textContent = 'Неверный пароль!';
                loginMessage.className = 'login-message error';
            }
        }
    },

    /**
     * Переключение вкладок админ-панели
     */
    switchAdminTab(tabId) {
        const adminPanel = document.getElementById('admin-panel');
        if (!adminPanel) return;
        
        // Обновляем активные кнопки
        const tabBtns = adminPanel.querySelectorAll('.tab-btn');
        tabBtns.forEach(b => b.classList.remove('active'));
        adminPanel.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
        
        // Показываем нужную вкладку
        const tabContents = adminPanel.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
        
        // Сохраняем текущую вкладку
        this.state.currentTab = tabId;
        localStorage.setItem('commission_adminTab', tabId);
        
        // Загружаем данные для вкладки
        this.loadAdminTabData(tabId);
    },

    /**
     * Восстановление состояния админ-панели
     */
    restoreAdminState() {
        const wasLoggedIn = localStorage.getItem('commission_adminLoggedIn') === 'true';
        const savedTab = localStorage.getItem('commission_adminTab');
        
        if (wasLoggedIn) {
            this.state.isAdminLoggedIn = true;
            this.state.currentTab = savedTab || 'news';
            
            // Автоматически показываем админ-контент при загрузке
            setTimeout(() => {
                this.showAdminContent();
                this.switchAdminTab(this.state.currentTab);
            }, 100);
        }
    },

    /**
     * Показать контент админ-панели после входа
     */
    showAdminContent() {
        const loginSection = document.querySelector('.admin-login');
        const adminPanel = document.getElementById('admin-panel');
        
        if (!adminPanel) return;
        
        if (loginSection) {
            loginSection.style.display = 'none';
        }
        
        // Показываем все вкладки
        const tabContents = adminPanel.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.style.display = 'block';
        });
    },

    /**
     * Загрузка данных для вкладки админ-панели
     */
    loadAdminTabData(tabId) {
        if (!this.state.isAdminLoggedIn) return;
        
        switch (tabId) {
            case 'news':
                this.renderNewsList();
                break;
            case 'calendar':
                this.renderCompetitionsList();
                break;
            case 'documents':
                this.renderDocumentsList();
                break;
            case 'structure':
                this.renderLeadersList();
                break;
            case 'contacts':
                this.renderContactsList();
                break;
            case 'partners':
                this.renderPartnersList();
                break;
        }
    },

    /**
     * Инициализация форм
     */
    initForms() {
        // Форма контактов
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }
        
        // Поиск документов
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.searchDocuments(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchDocuments(searchInput.value);
                }
            });
        }
        
        // Фильтры документов
        const docFilterBtns = document.querySelectorAll('.documents-search .filter-btn');
        docFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                docFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                this.filterDocuments(filter);
            });
        });
    },

    /**
     * Инициализация обработчиков событий
     */
    initEventListeners() {
        // Кнопка добавления новости
        const addNewsBtn = document.getElementById('add-news-btn');
        if (addNewsBtn) {
            addNewsBtn.addEventListener('click', () => {
                this.addNews();
            });
        }
        
        // Кнопка добавления соревнования
        const addCompetitionBtn = document.getElementById('add-competition-btn');
        if (addCompetitionBtn) {
            addCompetitionBtn.addEventListener('click', () => {
                this.addCompetition();
            });
        }
        
        // Кнопка добавления документа
        const addDocumentBtn = document.getElementById('add-document-btn');
        if (addDocumentBtn) {
            addDocumentBtn.addEventListener('click', () => {
                this.addDocument();
            });
        }
        
        // Кнопка добавления руководителя
        const addLeaderBtn = document.getElementById('add-leader-btn');
        if (addLeaderBtn) {
            addLeaderBtn.addEventListener('click', () => {
                this.addLeader();
            });
        }
        
        // Кнопка добавления контакта
        const addContactBtn = document.getElementById('add-contact-btn');
        if (addContactBtn) {
            addContactBtn.addEventListener('click', () => {
                this.addContact();
            });
        }
        
        // Кнопка добавления партнера
        const addPartnerBtn = document.getElementById('add-partner-btn');
        if (addPartnerBtn) {
            addPartnerBtn.addEventListener('click', () => {
                this.addPartner();
            });
        }
        
        // Кнопка добавления социальной сети
        const addSocialBtn = document.getElementById('add-social-btn');
        if (addSocialBtn) {
            addSocialBtn.addEventListener('click', () => {
                this.addSocial();
            });
        }
    },

    /**
     * Обработка формы контактов
     */
    handleContactForm() {
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        const formMessage = document.getElementById('form-message');
        
        // Валидация
        if (!name || !email || !subject || !message) {
            this.showFormMessage('Заполните все обязательные поля', 'error', formMessage);
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showFormMessage('Введите корректный email', 'error', formMessage);
            return;
        }
        
        // Имитация отправки
        this.showFormMessage('Сообщение отправляется...', 'info', formMessage);
        
        setTimeout(() => {
            this.showFormMessage('Сообщение успешно отправлено! Мы ответим вам в ближайшее время.', 'success', formMessage);
            
            // Очистка формы
            document.getElementById('contact-form')?.reset();
            
            // Логирование (в реальном приложении здесь была бы отправка на сервер)
            console.log('Новое сообщение от:', { name, email, subject, message });
            
            // Можно сохранить в localStorage для админ-панели
            const contactMessages = JSON.parse(localStorage.getItem('commission_contactMessages') || '[]');
            contactMessages.push({
                id: Date.now(),
                name,
                email,
                subject,
                message,
                date: new Date().toISOString(),
                read: false
            });
            localStorage.setItem('commission_contactMessages', JSON.stringify(contactMessages));
        }, 1500);
    },

    /**
     * Показать сообщение в форме
     */
    showFormMessage(message, type, container) {
        if (!container) return;
        
        container.textContent = message;
        container.className = `form-message ${type}`;
        
        // Автоматическое скрытие для успешных сообщений
        if (type === 'success') {
            setTimeout(() => {
                container.textContent = '';
                container.className = 'form-message';
            }, 5000);
        }
    },

    /**
     * Валидация email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Поиск документов
     */
    searchDocuments(query) {
        const documents = document.querySelectorAll('.document-card');
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'Документы не найдены';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '2rem';
        noResults.style.color = 'var(--medium-gray)';
        
        let hasResults = false;
        
        documents.forEach(doc => {
            const title = doc.querySelector('.document-title')?.textContent.toLowerCase();
            const description = doc.querySelector('.document-description')?.textContent.toLowerCase();
            const searchTerm = query.toLowerCase();
            
            if (title?.includes(searchTerm) || description?.includes(searchTerm)) {
                doc.style.display = 'flex';
                hasResults = true;
            } else {
                doc.style.display = 'none';
            }
        });
        
        // Показываем сообщение, если нет результатов
        const container = document.querySelector('.documents-container');
        const existingNoResults = container.querySelector('.no-results');
        
        if (!hasResults) {
            if (!existingNoResults && container) {
                container.appendChild(noResults);
            }
        } else {
            if (existingNoResults) {
                existingNoResults.remove();
            }
        }
    },

    /**
     * Фильтрация документов
     */
    filterDocuments(filter) {
        const documents = document.querySelectorAll('.document-card');
        
        documents.forEach(doc => {
            if (filter === 'all') {
                doc.style.display = 'flex';
            } else {
                // Здесь можно добавить логику фильтрации по категориям
                // Например, если у документа есть data-category атрибут
                const category = doc.getAttribute('data-category');
                doc.style.display = category === filter ? 'flex' : 'none';
            }
        });
    },

    /**
     * Добавление новости
     */
    addNews() {
        if (!this.state.isAdminLoggedIn) {
            this.showNotification('Требуется авторизация', 'error');
            return;
        }
        
        const title = document.getElementById('news-title')?.value.trim();
        const date = document.getElementById('news-date')?.value;
        const content = document.getElementById('news-content')?.value.trim();
        
        if (!title || !date || !content) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }
        
        const newNews = {
            id: Date.now(),
            title,
            date,
            content
        };
        
        this.data.news.unshift(newNews); // Добавляем в начало
        this.saveData('news');
        this.renderNewsList();
        
        // Очистка формы
        document.getElementById('news-title').value = '';
        document.getElementById('news-date').value = '';
        document.getElementById('news-content').value = '';
        
        this.showNotification('Новость успешно добавлена', 'success');
    },

    /**
     * Рендеринг списка новостей
     */
    renderNewsList() {
        const listContainer = document.getElementById('news-list');
        if (!listContainer) return;
        
        if (this.data.news.length === 0) {
            listContainer.innerHTML = '<div class="empty-list">Нет добавленных новостей</div>';
            return;
        }
        
        listContainer.innerHTML = this.data.news.map(news => `
            <div class="admin-list-item" data-id="${news.id}">
                <div class="item-info">
                    <strong>${news.title}</strong>
                    <div class="item-details">
                        ${news.date} • ${news.content.substring(0, 50)}...
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="news" data-id="${news.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления
        this.initDeleteHandlers('news');
    },

    /**
     * Добавление соревнования
     */
    addCompetition() {
        if (!this.state.isAdminLoggedIn) {
            this.showNotification('Требуется авторизация', 'error');
            return;
        }
        
        const name = document.getElementById('competition-name')?.value.trim();
        const date = document.getElementById('competition-date')?.value;
        const location = document.getElementById('competition-location')?.value.trim();
        const type = document.getElementById('competition-type')?.value;
        const description = document.getElementById('competition-description')?.value.trim();
        const registration = document.getElementById('competition-registration')?.value.trim();
        const results = document.getElementById('competition-results')?.value.trim();
        
        if (!name || !date || !location) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        const newCompetition = {
            id: Date.now(),
            name,
            date,
            location,
            type: type || 'regional',
            description: description || '',
            registration: registration || '',
            results: results || ''
        };
        
        this.data.competitions.unshift(newCompetition);
        this.saveData('competitions');
        this.renderCompetitionsList();
        
        // Добавляем в календарь
        this.state.calendarEvents.push({
            title: name,
            date: date,
            type: type || 'regional'
        });
        this.saveData('calendarEvents', true);
        
        // Очистка формы
        ['competition-name', 'competition-date', 'competition-location', 
         'competition-description', 'competition-registration', 'competition-results']
         .forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
         });
        
        this.showNotification('Соревнование успешно добавлено', 'success');
    },

    /**
     * Рендеринг списка соревнований
     */
    renderCompetitionsList() {
        const listContainer = document.getElementById('competitions-list');
        if (!listContainer) return;
        
        if (this.data.competitions.length === 0) {
            listContainer.innerHTML = '<div class="empty-list">Нет добавленных соревнований</div>';
            return;
        }
        
        listContainer.innerHTML = this.data.competitions.map(comp => `
            <div class="admin-list-item" data-id="${comp.id}">
                <div class="item-info">
                    <strong>${comp.name}</strong>
                    <div class="item-details">
                        ${comp.date} • ${comp.location} • ${comp.type === 'national' ? 'Всероссийские' : 'Региональные'}
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="competitions" data-id="${comp.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления
        this.initDeleteHandlers('competitions');
    },

    /**
     * Добавление документа
     */
    addDocument() {
        if (!this.state.isAdminLoggedIn) {
            this.showNotification('Требуется авторизация', 'error');
            return;
        }
        
        const name = document.getElementById('document-name')?.value.trim();
        const category = document.getElementById('document-category')?.value;
        const description = document.getElementById('document-description')?.value.trim();
        const fileInput = document.getElementById('document-file');
        
        if (!name || !category) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        let fileName = 'document.pdf';
        let fileSize = '0 KB';
        
        if (fileInput?.files[0]) {
            fileName = fileInput.files[0].name;
            fileSize = this.formatFileSize(fileInput.files[0].size);
        }
        
        const newDocument = {
            id: Date.now(),
            name,
            category,
            description: description || '',
            fileName,
            fileSize,
            date: new Date().toLocaleDateString('ru-RU'),
            downloads: 0
        };
        
        this.data.documents.unshift(newDocument);
        this.saveData('documents');
        this.renderDocumentsList();
        
        // Очистка формы
        document.getElementById('document-name').value = '';
        document.getElementById('document-description').value = '';
        if (fileInput) fileInput.value = '';
        
        this.showNotification('Документ успешно добавлен', 'success');
    },

    /**
     * Форматирование размера файла
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Рендеринг списка документов
     */
    renderDocumentsList() {
        const listContainer = document.getElementById('documents-list');
        if (!listContainer) return;
        
        if (this.data.documents.length === 0) {
            listContainer.innerHTML = '<div class="empty-list">Нет добавленных документов</div>';
            return;
        }
        
        listContainer.innerHTML = this.data.documents.map(doc => `
            <div class="admin-list-item" data-id="${doc.id}">
                <div class="item-info">
                    <strong>${doc.name}</strong>
                    <div class="item-details">
                        ${doc.date} • ${doc.category} • ${doc.fileSize}
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="documents" data-id="${doc.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления
        this.initDeleteHandlers('documents');
    },

    /**
     * Добавление руководителя
     */
    addLeader() {
        if (!this.state.isAdminLoggedIn) {
            this.showNotification('Требуется авторизация', 'error');
            return;
        }
        
        const name = document.getElementById('leader-name')?.value.trim();
        const position = document.getElementById('leader-position')?.value.trim();
        const region = document.getElementById('leader-region')?.value.trim();
        const phone = document.getElementById('leader-phone')?.value.trim();
        const email = document.getElementById('leader-email')?.value.trim();
        const icon = document.getElementById('leader-icon')?.value;
        
        if (!name || !position || !region) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        const newLeader = {
            id: Date.now(),
            name,
            position,
            region,
            phone: phone || '',
            email: email || '',
            icon: icon || 'user-tie'
        };
        
        this.data.leaders.unshift(newLeader);
        this.saveData('leaders');
        this.renderLeadersList();
        
        // Очистка формы
        ['leader-name', 'leader-position', 'leader-region', 'leader-phone', 'leader-email']
         .forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
         });
        
        this.showNotification('Руководитель успешно добавлен', 'success');
    },

    /**
     * Рендеринг списка руководителей
     */
    renderLeadersList() {
        const listContainer = document.getElementById('leaders-list');
        if (!listContainer) return;
        
        if (this.data.leaders.length === 0) {
            listContainer.innerHTML = '<div class="empty-list">Нет добавленных руководителей</div>';
            return;
        }
        
        listContainer.innerHTML = this.data.leaders.map(leader => `
            <div class="admin-list-item" data-id="${leader.id}">
                <div class="item-info">
                    <strong>${leader.name}</strong>
                    <div class="item-details">
                        ${leader.position} • ${leader.region}
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="leaders" data-id="${leader.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления
        this.initDeleteHandlers('leaders');
    },

    /**
     * Добавление контакта
     */
    addContact() {
        if (!this.state.isAdminLoggedIn) {
            this.showNotification('Требуется авторизация', 'error');
            return;
        }
        
        const name = document.getElementById('contact-name')?.value.trim();
        const person = document.getElementById('contact-person')?.value.trim();
        const phone = document.getElementById('contact-phone')?.value.trim();
        const email = document.getElementById('contact-email')?.value.trim();
        const location = document.getElementById('contact-location')?.value.trim();
        const description = document.getElementById('contact-description')?.value.trim();
        
        if (!name || !person) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        const newContact = {
            id: Date.now(),
            name,
            person,
            phone: phone || '',
            email: email || '',
            location: location || '',
            description: description || ''
        };
        
        this.data.contacts.unshift(newContact);
        this.saveData('contacts');
        this.renderContactsList();
        
        // Очистка формы
        ['contact-name', 'contact-person', 'contact-phone', 'contact-email', 'contact-location', 'contact-description']
         .forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
         });
        
        this.showNotification('Контакт успешно добавлен', 'success');
    },

    /**
     * Рендеринг списка контактов
     */
    renderContactsList() {
        const listContainer = document.getElementById('contacts-list');
        if (!listContainer) return;
        
        if (this.data.contacts.length === 0) {
            listContainer.innerHTML = '<div class="empty-list">Нет добавленных контактов</div>';
            return;
        }
        
        listContainer.innerHTML = this.data.contacts.map(contact => `
            <div class="admin-list-item" data-id="${contact.id}">
                <div class="item-info">
                    <strong>${contact.name}</strong>
                    <div class="item-details">
                        ${contact.person} • ${contact.location}
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="contacts" data-id="${contact.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления
        this.initDeleteHandlers('contacts');
    },

    /**
     * Добавление партнера
     */
    addPartner() {
        if (!this.state.isAdminLoggedIn) {
            this.showNotification('Требуется авторизация', 'error');
            return;
        }
        
        const name = document.getElementById('partner-name')?.value.trim();
        const type = document.getElementById('partner-type')?.value;
        const description = document.getElementById('partner-description')?.value.trim();
        const url = document.getElementById('partner-url')?.value.trim();
        const benefits = document.getElementById('partner-benefits')?.value.trim();
        
        if (!name || !type) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        const newPartner = {
            id: Date.now(),
            name,
            type,
            description: description || '',
            url: url || '',
            benefits: benefits || ''
        };
        
        this.data.partners.unshift(newPartner);
        this.saveData('partners');
        this.renderPartnersList();
        
        // Очистка формы
        ['partner-name', 'partner-description', 'partner-url', 'partner-benefits']
         .forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
         });
        
        this.showNotification('Партнер успешно добавлен', 'success');
    },

    /**
     * Рендеринг списка партнеров
     */
    renderPartnersList() {
        const listContainer = document.getElementById('partners-list');
        if (!listContainer) return;
        
        if (this.data.partners.length === 0) {
            listContainer.innerHTML = '<div class="empty-list">Нет добавленных партнеров</div>';
            return;
        }
        
        listContainer.innerHTML = this.data.partners.map(partner => `
            <div class="admin-list-item" data-id="${partner.id}">
                <div class="item-info">
                    <strong>${partner.name}</strong>
                    <div class="item-details">
                        ${partner.type} • ${partner.url ? 'Есть сайт' : 'Нет сайта'}
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="partners" data-id="${partner.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления
        this.initDeleteHandlers('partners');
    },

    /**
     * Добавление социальной сети
     */
    addSocial() {
        if (!this.state.isAdminLoggedIn) {
            this.showNotification('Требуется авторизация', 'error');
            return;
        }
        
        const name = document.getElementById('social-name')?.value.trim();
        const url = document.getElementById('social-url')?.value.trim();
        const icon = document.getElementById('social-icon')?.value;
        
        if (!name || !url) {
            this.showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        // Валидация URL
        try {
            new URL(url);
        } catch {
            this.showNotification('Введите корректный URL', 'error');
            return;
        }
        
        // Сохраняем в localStorage
        const socials = JSON.parse(localStorage.getItem('commission_socials') || '[]');
        socials.push({
            id: Date.now(),
            name,
            url,
            icon
        });
        localStorage.setItem('commission_socials', JSON.stringify(socials));
        
        // Очистка формы
        document.getElementById('social-name').value = '';
        document.getElementById('social-url').value = '';
        
        this.showNotification('Социальная сеть успешно добавлена', 'success');
        this.renderSocialsList();
    },

    /**
     * Рендеринг списка социальных сетей
     */
    renderSocialsList() {
        const listContainer = document.getElementById('socials-list');
        if (!listContainer) return;
        
        const socials = JSON.parse(localStorage.getItem('commission_socials') || '[]');
        
        if (socials.length === 0) {
            listContainer.innerHTML = '<div class="empty-list">Нет добавленных социальных сетей</div>';
            return;
        }
        
        listContainer.innerHTML = socials.map(social => `
            <div class="admin-list-item" data-id="${social.id}">
                <div class="item-info">
                    <strong>${social.name}</strong>
                    <div class="item-details">
                        ${social.url}
                    </div>
                </div>
                <button class="btn-danger delete-item" data-type="socials" data-id="${social.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Добавляем обработчики удаления для социальных сетей
        listContainer.querySelectorAll('.delete-item[data-type="socials"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.delete-item').getAttribute('data-id'));
                this.deleteItem('socials', id);
            });
        });
    },

    /**
     * Инициализация обработчиков удаления
     */
    initDeleteHandlers(type) {
        const listContainer = document.getElementById(`${type}-list`);
        if (!listContainer) return;
        
        listContainer.querySelectorAll(`.delete-item[data-type="${type}"]`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.delete-item').getAttribute('data-id'));
                this.deleteItem(type, id);
            });
        });
    },

    /**
     * Удаление элемента
     */
    deleteItem(type, id) {
        if (!confirm(`Вы уверены, что хотите удалить этот ${this.getTypeName(type)}?`)) return;
        
        if (type === 'socials') {
            // Особый случай для социальных сетей
            const socials = JSON.parse(localStorage.getItem('commission_socials') || '[]');
            const updatedSocials = socials.filter(item => item.id !== id);
            localStorage.setItem('commission_socials', JSON.stringify(updatedSocials));
            this.renderSocialsList();
        } else {
            // Удаление из основного массива данных
            this.data[type] = this.data[type].filter(item => item.id !== id);
            this.saveData(type);
            this.loadAdminTabData(this.state.currentTab);
        }
        
        this.showNotification(`${this.getTypeName(type, true)} успешно удален(а)`, 'success');
    },

    /**
     * Получение названия типа
     */
    getTypeName(type, capitalize = false) {
        const names = {
            'news': 'новость',
            'competitions': 'соревнование',
            'documents': 'документ',
            'leaders': 'руководитель',
            'contacts': 'контакт',
            'partners': 'партнер',
            'socials': 'социальная сеть'
        };
        
        let name = names[type] || 'элемент';
        if (capitalize) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name;
    },

    /**
     * Показать уведомление
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
        
        // Добавляем в контейнер
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
    }
};

/**
 * Инициализация при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем основное приложение
    CommissionApp.init();
    
    // Глобальные функции для отладки
    window.CommissionApp = CommissionApp;
    
    // Создаем кнопку прокрутки наверх
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.style.display = 'none';
    document.body.appendChild(scrollTopBtn);
    
    // Обработчик прокрутки
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Обработчик клика по кнопке
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('CommissionApp загружен и готов к работе');
});

/**
 * Глобальные утилиты для использования в консоли
 */
window.openAdminPanel = () => {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.add('active');
    }
};

window.closeAdminPanel = () => {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.remove('active');
    }
};

window.exportData = () => {
    const data = {
        news: CommissionApp.data.news,
        competitions: CommissionApp.data.competitions,
        documents: CommissionApp.data.documents,
        leaders: CommissionApp.data.leaders,
        contacts: CommissionApp.data.contacts,
        partners: CommissionApp.data.partners,
        calendarEvents: CommissionApp.state.calendarEvents,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `commission_data_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    CommissionApp.showNotification('Данные успешно экспортированы', 'success');
};

window.importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Проверяем структуру данных
            const requiredKeys = ['news', 'competitions', 'documents', 'leaders', 'contacts', 'partners', 'calendarEvents'];
            const isValid = requiredKeys.every(key => key in data);
            
            if (!isValid) {
                throw new Error('Неверный формат файла');
            }
            
            // Импортируем данные
            CommissionApp.data.news = data.news;
            CommissionApp.data.competitions = data.competitions;
            CommissionApp.data.documents = data.documents;
            CommissionApp.data.leaders = data.leaders;
            CommissionApp.data.contacts = data.contacts;
            CommissionApp.data.partners = data.partners;
            CommissionApp.state.calendarEvents = data.calendarEvents;
            
            // Сохраняем в localStorage
            requiredKeys.forEach(key => {
                if (key === 'calendarEvents') {
                    localStorage.setItem(`commission_${key}`, JSON.stringify(data[key]));
                } else {
                    localStorage.setItem(`commission_${key}`, JSON.stringify(data[key]));
                }
            });
            
            // Обновляем интерфейс
            CommissionApp.loadAdminTabData(CommissionApp.state.currentTab);
            CommissionApp.renderCalendar();
            
            CommissionApp.showNotification('Данные успешно импортированы!', 'success');
        } catch (error) {
            console.error('Import error:', error);
            CommissionApp.showNotification('Ошибка импорта данных: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
};

// Создаем скрытый input для импорта
const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.style.display = 'none';
importInput.addEventListener('change', window.importData);
document.body.appendChild(importInput);

window.triggerImport = () => {
    importInput.click();
};
