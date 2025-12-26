/**
 * Основной модуль инициализации сайта Комиссии по мотоджимхане
 * Полная версия со всеми функциями
 */

// Оптимизация: Загрузка данных с кэшированием
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
 * Инициализация при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт комиссии по мотоджимхане успешно загружен');
    
    // Проверяем, находимся ли на странице партнеров
    const isPartnersPage = window.location.pathname.includes('partners.html') || 
                         document.querySelector('.partnership-contact');
    
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
    
    // Специфичная инициализация для страницы партнеров
    if (isPartnersPage) {
        initPartnersPage();
    }
    
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
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!menuToggle || !mobileMenu) return;
    
    // Устанавливаем начальное состояние для доступности
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Функции для управления меню
    const openMobileMenu = () => {
        mobileMenu.classList.add('active');
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-expanded', 'true');
    };
    
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        body.style.overflow = 'auto';
        menuToggle.setAttribute('aria-expanded', 'false');
    };
    
    // Обработчик кнопки меню
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

/**
 * Анимация элементов при прокрутке
 */
function initScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.tile, .news-card, .gallery-item, .benefit-card, .program-card, .partner-logo');
        const screenPosition = window.innerHeight / 1.3;
        
        elements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    };
    
    // Установка начальных стилей для анимации
    const animatedElements = document.querySelectorAll('.tile, .news-card, .gallery-item, .benefit-card, .program-card, .partner-logo');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

/**
 * Инициализация админ-панели
 */
function initAdminPanel() {
    const adminTab = document.getElementById('admin-tab');
    const adminPanel = document.getElementById('admin-panel');
    const closeAdminPanel = document.getElementById('close-admin-panel');
    const loginAdminBtn = document.getElementById('login-admin-btn');
    const adminPassword = document.getElementById('admin-password');
    
    // Показать админ-панель при клике на язычок
    if (adminTab && adminPanel) {
        adminTab.style.display = 'block';
        adminTab.addEventListener('click', function() {
            adminPanel.style.right = '0';
            adminPanel.removeAttribute('hidden');
            adminPanel.setAttribute('aria-hidden', 'false');
        });
    }
    
    // Закрыть админ-панель
    if (closeAdminPanel) {
        closeAdminPanel.addEventListener('click', function() {
            adminPanel.style.right = '-400px';
            adminPanel.setAttribute('hidden', '');
            adminPanel.setAttribute('aria-hidden', 'true');
        });
    }
    
    // Закрытие админ-панели при клике вне ее
    document.addEventListener('click', function(e) {
        if (adminPanel && !adminPanel.hasAttribute('hidden') && 
            !adminPanel.contains(e.target) && 
            adminTab && !adminTab.contains(e.target)) {
            adminPanel.style.right = '-400px';
            adminPanel.setAttribute('hidden', '');
            adminPanel.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Обработка входа в админ-панель
    if (loginAdminBtn && adminPassword) {
        loginAdminBtn.addEventListener('click', function() {
            // В реальном приложении пароль должен проверяться на сервере!
            if (adminPassword.value === 'fum2025admin') {
                document.querySelector('.admin-login').style.display = 'none';
                document.querySelector('.tab-content.active').style.display = 'block';
                showMessage('Вход выполнен успешно!', 'success');
            } else {
                showMessage('Неверный пароль! Обратитесь к Председателю комиссии для получения доступа.', 'error');
            }
        });
        
        // Возможность входа по нажатию Enter
        adminPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginAdminBtn.click();
            }
        });
    }
    
    // Переключение вкладок в админ-панели
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            
            this.classList.add('active');
            const tabContent = document.getElementById(`${this.dataset.tab}-tab`);
            tabContent.classList.add('active');
            tabContent.style.display = 'block';
        });
    });
    
    // Инициализация функций управления данными
    initDataManagement();
}

/**
 * Управление данными в админ-панели (LocalStorage)
 */
function initDataManagement() {
    // Добавление соревнования
    const addCompetitionBtn = document.getElementById('add-competition-btn');
    if (addCompetitionBtn) {
        addCompetitionBtn.addEventListener('click', handleAddCompetition);
    }
    
    // Добавление документа
    const addDocumentBtn = document.getElementById('add-document-btn');
    if (addDocumentBtn) {
        addDocumentBtn.addEventListener('click', handleAddDocument);
    }
    
    // Добавление руководителя
    const addLeaderBtn = document.getElementById('add-leader-btn');
    if (addLeaderBtn) {
        addLeaderBtn.addEventListener('click', handleAddLeader);
    }
    
    // Добавление регионального представителя
    const addRegionBtn = document.getElementById('add-region-btn');
    if (addRegionBtn) {
        addRegionBtn.addEventListener('click', handleAddRegion);
    }
    
    // Инициализация списков при загрузке
    if (document.getElementById('competitions-list')) renderCompetitionsList();
    if (document.getElementById('documents-list')) renderDocumentsList();
    if (document.getElementById('leaders-list')) renderLeadersList();
    if (document.getElementById('regions-list')) renderRegionsList();
}

/**
 * Обработчик добавления соревнования
 */
function handleAddCompetition() {
    const name = document.getElementById('competition-name').value.trim();
    const date = document.getElementById('competition-date').value;
    const location = document.getElementById('competition-location').value.trim();
    const contact = document.getElementById('competition-contact').value.trim();
    
    if (!name || !date || !location || !contact) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    const competitions = getCompetitions();
    const newId = competitions.length > 0 ? Math.max(...competitions.map(c => c.id)) + 1 : 1;
    
    const newCompetition = {
        id: newId,
        name,
        date,
        location,
        contact,
        contactPhone: '',
        protocol: '',
        region: ''
    };
    
    competitions.push(newCompetition);
    saveCompetitions(competitions);
    
    // Очистка формы
    document.getElementById('competition-name').value = '';
    document.getElementById('competition-date').value = '';
    document.getElementById('competition-location').value = '';
    document.getElementById('competition-contact').value = '';
    document.getElementById('protocol-upload').value = '';
    
    showMessage('Соревнование успешно добавлено!', 'success');
    renderCompetitionsList();
}

/**
 * Обработчик добавления документа
 */
function handleAddDocument() {
    const name = document.getElementById('document-name').value.trim();
    const docFile = document.getElementById('document-upload').files[0];
    const category = document.getElementById('document-category').value;
    
    if (!name || !category) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    const documents = getDocuments();
    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    
    const newDocument = {
        id: newId,
        name,
        url: docFile ? URL.createObjectURL(docFile) : '#',
        category,
        date: new Date().toLocaleDateString('ru-RU'),
        size: docFile ? `${(docFile.size / 1024).toFixed(1)} КБ` : '0 КБ'
    };
    
    documents.push(newDocument);
    saveDocuments(documents);
    
    // Очистка формы
    document.getElementById('document-name').value = '';
    document.getElementById('document-upload').value = '';
    document.getElementById('document-category').value = 'rules';
    
    showMessage('Документ успешно добавлен!', 'success');
    renderDocumentsList();
}

/**
 * Обработчик добавления руководителя
 */
function handleAddLeader() {
    const name = document.getElementById('leader-name').value.trim();
    const position = document.getElementById('leader-position').value.trim();
    const region = document.getElementById('leader-region').value.trim();
    const icon = document.getElementById('leader-icon').value;
    
    if (!name || !position || !region) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    const leaders = getLeaders();
    const newId = leaders.length > 0 ? Math.max(...leaders.map(l => l.id)) + 1 : 1;
    
    const newLeader = {
        id: newId,
        name,
        position,
        region,
        icon
    };
    
    leaders.push(newLeader);
    saveLeaders(leaders);
    
    // Очистка формы
    document.getElementById('leader-name').value = '';
    document.getElementById('leader-position').value = '';
    document.getElementById('leader-region').value = '';
    document.getElementById('leader-icon').value = 'crown';
    
    showMessage('Руководитель успешно добавлен!', 'success');
    renderLeadersList();
}

/**
 * Обработчик добавления регионального представителя
 */
function handleAddRegion() {
    const region = document.getElementById('region-name').value.trim();
    const name = document.getElementById('representative-name').value.trim();
    const position = document.getElementById('representative-position').value.trim();
    const phone = document.getElementById('representative-phone').value.trim();
    const email = document.getElementById('representative-email').value.trim();
    
    if (!region || !name || !position) {
        showMessage('Пожалуйста, заполните обязательные поля: регион, ФИО и должность', 'error');
        return;
    }
    
    const regions = getRegions();
    const newId = regions.length > 0 ? Math.max(...regions.map(r => r.id)) + 1 : 1;
    
    const newRegion = {
        id: newId,
        region,
        name,
        position,
        phone: phone || 'не указан',
        email: email || 'не указан'
    };
    
    regions.push(newRegion);
    saveRegions(regions);
    
    // Очистка формы
    document.getElementById('region-name').value = '';
    document.getElementById('representative-name').value = '';
    document.getElementById('representative-position').value = '';
    document.getElementById('representative-phone').value = '';
    document.getElementById('representative-email').value = '';
    
    showMessage('Региональный представитель успешно добавлен!', 'success');
    renderRegionsList();
}

/**
 * Визуальные эффекты для кнопок
 */
function initButtonEffects() {
    document.querySelectorAll('.btn, .tile-link').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Функции для работы с LocalStorage
 */
function getCompetitions() {
    return getLocalStorageData('competitionsList') || [];
}

function saveCompetitions(competitions) {
    saveToLocalStorage('competitionsList', competitions);
}

function getDocuments() {
    return getLocalStorageData('documentsList') || [];
}

function saveDocuments(documents) {
    saveToLocalStorage('documentsList', documents);
}

function getLeaders() {
    return getLocalStorageData('leadersList') || [];
}

function saveLeaders(leaders) {
    saveToLocalStorage('leadersList', leaders);
}

function getRegions() {
    return getLocalStorageData('regionsList') || [];
}

function saveRegions(regions) {
    saveToLocalStorage('regionsList', regions);
}

/**
 * Универсальные функции для работы с LocalStorage
 */
function getLocalStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Ошибка при получении данных из localStorage: ${error}`);
        return null;
    }
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Ошибка при сохранении данных в localStorage: ${error}`);
        return false;
    }
}

/**
 * Функции отрисовки списков
 */
function renderCompetitionsList() {
    const container = document.getElementById('competitions-list');
    if (!container) return;
    
    const competitions = getCompetitions();
    
    if (competitions.length === 0) {
        container.innerHTML = '<p class="no-data">Нет добавленных соревнований</p>';
        return;
    }
    
    container.innerHTML = competitions.map(comp => `
        <div class="list-item" data-id="${comp.id}">
            <div>
                <strong>${comp.name}</strong><br>
                <small>${comp.date} • ${comp.location}</small>
            </div>
            <div class="list-actions">
                <button class="action-btn edit-btn" data-id="${comp.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${comp.id}" onclick="deleteCompetition(${comp.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderDocumentsList() {
    const container = document.getElementById('documents-list');
    if (!container) return;
    
    const documents = getDocuments();
    
    if (documents.length === 0) {
        container.innerHTML = '<p class="no-data">Нет добавленных документов</p>';
        return;
    }
    
    container.innerHTML = documents.map(doc => `
        <div class="list-item" data-id="${doc.id}">
            <div>
                <strong>${doc.name}</strong><br>
                <small>${doc.category} • ${doc.date} • ${doc.size}</small>
            </div>
            <div class="list-actions">
                <a href="${doc.url}" class="action-btn edit-btn" download>
                    <i class="fas fa-download"></i>
                </a>
                <button class="action-btn delete-btn" data-id="${doc.id}" onclick="deleteDocument(${doc.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderLeadersList() {
    const container = document.getElementById('leaders-list');
    if (!container) return;
    
    const leaders = getLeaders();
    
    if (leaders.length === 0) {
        container.innerHTML = '<p class="no-data">Нет добавленных руководителей</p>';
        return;
    }
    
    container.innerHTML = leaders.map(leader => `
        <div class="list-item" data-id="${leader.id}">
            <div>
                <strong>${leader.name}</strong><br>
                <small>${leader.position} • ${leader.region}</small>
            </div>
            <div class="list-actions">
                <button class="action-btn edit-btn" data-id="${leader.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${leader.id}" onclick="deleteLeader(${leader.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderRegionsList() {
    const container = document.getElementById('regions-list');
    if (!container) return;
    
    const regions = getRegions();
    
    if (regions.length === 0) {
        container.innerHTML = '<p class="no-data">Нет добавленных регионов</p>';
        return;
    }
    
    container.innerHTML = regions.map(region => `
        <div class="list-item" data-id="${region.id}">
            <div>
                <strong>${region.region}</strong><br>
                <small>${region.name} • ${region.position}</small>
            </div>
            <div class="list-actions">
                <button class="action-btn edit-btn" data-id="${region.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${region.id}" onclick="deleteRegion(${region.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Функции удаления данных
 */
function deleteCompetition(id) {
    if (!confirm('Вы уверены, что хотите удалить это соревнование?')) return;
    
    const competitions = getCompetitions();
    const filtered = competitions.filter(comp => comp.id !== id);
    saveCompetitions(filtered);
    renderCompetitionsList();
    showMessage('Соревнование удалено', 'success');
}

function deleteDocument(id) {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) return;
    
    const documents = getDocuments();
    const filtered = documents.filter(doc => doc.id !== id);
    saveDocuments(filtered);
    renderDocumentsList();
    showMessage('Документ удален', 'success');
}

function deleteLeader(id) {
    if (!confirm('Вы уверены, что хотите удалить этого руководителя?')) return;
    
    const leaders = getLeaders();
    const filtered = leaders.filter(leader => leader.id !== id);
    saveLeaders(filtered);
    renderLeadersList();
    showMessage('Руководитель удален', 'success');
}

function deleteRegion(id) {
    if (!confirm('Вы уверены, что хотите удалить этот регион?')) return;
    
    const regions = getRegions();
    const filtered = regions.filter(region => region.id !== id);
    saveRegions(filtered);
    renderRegionsList();
    showMessage('Регион удален', 'success');
}

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
                    compItem.addEventListener('click', () => {
                        showMessage(`Соревнование: ${comp.name}\nМесто: ${comp.location}\nКонтакт: ${comp.contact}`, 'info', 5000);
                    });
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
    if (filterInput) filterInput.addEventListener('input', filterCompetitions);
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
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    lazyImageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
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
    if (galleryItems.length === 0) return;
    
    // Проверяем, не создано ли уже модальное окно
    if (document.querySelector('.gallery-modal')) return;
    
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
        const caption = item.querySelector('figcaption')?.textContent || item.querySelector('.gallery-caption')?.textContent || '';
        
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
    // Проверяем, не создана ли уже кнопка
    if (document.querySelector('.back-to-top')) return;
    
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
            showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
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
            showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Инициализация страницы партнеров
 */
function initPartnersPage() {
    const partnerForm = document.querySelector('.submit-partner-form');
    
    if (partnerForm) {
        partnerForm.addEventListener('click', handlePartnerFormSubmit);
    }
    
    // Инициализация карточек программ
    initProgramCards();
    
    // Инициализация партнерских логотипов
    initPartnerLogos();
}

/**
 * Обработка отправки формы партнерства
 */
function handlePartnerFormSubmit() {
    const form = document.querySelector('.partnership-contact .contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    // Валидация
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Создаем сообщение об ошибке
            let errorMsg = input.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Это поле обязательно для заполнения';
                input.parentElement.appendChild(errorMsg);
            }
        } else {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
        
        // Специфическая валидация для email
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
                
                let errorMsg = input.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Введите корректный email';
                    input.parentElement.appendChild(errorMsg);
                }
            }
        }
        
        // Специфическая валидация для телефона
        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
                
                let errorMsg = input.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Введите корректный номер телефона';
                    input.parentElement.appendChild(errorMsg);
                }
            }
        }
    });
    
    if (!isValid) {
        showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    // Сбор данных формы
    const formData = {
        companyName: document.getElementById('company-name').value,
        contactPerson: document.getElementById('contact-person').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        partnerType: document.getElementById('partner-type').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Показать индикатор загрузки
    const partnerBtn = document.querySelector('.submit-partner-form');
    const originalText = partnerBtn.innerHTML;
    partnerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    partnerBtn.disabled = true;
    
    // В реальном приложении здесь будет fetch запрос к серверу
    setTimeout(() => {
        // Сохраняем заявку в localStorage (для демонстрации)
        const partnerRequests = JSON.parse(localStorage.getItem('partnerRequests') || '[]');
        partnerRequests.push(formData);
        localStorage.setItem('partnerRequests', JSON.stringify(partnerRequests));
        
        // Показываем сообщение об успехе
        showMessage('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.', 'success');
        
        // Очищаем форму
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
        
        // Восстанавливаем кнопку
        partnerBtn.innerHTML = originalText;
        partnerBtn.disabled = false;
        
        // Прокрутка к верху формы
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1500);
}

/**
 * Инициализация интерактивных карточек программ
 */
function initProgramCards() {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach((card, index) => {
        const btn = card.querySelector('.btn');
        
        // Добавляем атрибуты для отслеживания
        card.setAttribute('data-program-index', index);
        
        // Обработчик клика по карточке
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return; // Не срабатывает при клике на кнопку
            
            // Прокрутка к форме
            const formSection = document.getElementById('contact-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
                
                // Автозаполнение типа партнерства
                const partnerTypeSelect = document.getElementById('partner-type');
                if (partnerTypeSelect) {
                    const types = ['general', 'stage', 'prizes'];
                    if (types[index]) {
                        partnerTypeSelect.value = types[index];
                    }
                }
            }
        });
        
        // Обработчик клика на кнопку в карточке
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем срабатывание клика по карточке
                
                // Прокрутка к форме
                const formSection = document.getElementById('contact-form');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Автозаполнение типа партнерства
                    const partnerTypeSelect = document.getElementById('partner-type');
                    if (partnerTypeSelect) {
                        const types = ['general', 'stage', 'prizes'];
                        if (types[index]) {
                            partnerTypeSelect.value = types[index];
                        }
                    }
                }
            });
        }
        
        // Эффект при наведении
        card.addEventListener('mouseenter', () => {
            if (card.style.transform !== 'translateY(-15px)') {
                card.style.transform = 'translateY(-15px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.style.transform === 'translateY(-15px)') {
                card.style.transform = 'translateY(-10px)';
            }
        });
    });
}

/**
 * Инициализация партнерских логотипов
 */
function initPartnerLogos() {
    const partnerLogos = document.querySelectorAll('.partner-logo');
    
    partnerLogos.forEach(logo => {
        // Добавляем эффект клика
        logo.style.cursor = 'pointer';
        
        logo.addEventListener('click', () => {
            // Прокрутка к форме партнерства
            const formSection = document.getElementById('contact-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
                
                // Автозаполнение поля компании
                const companyNameInput = document.getElementById('company-name');
                if (companyNameInput) {
                    const partnerName = logo.querySelector('.partner-name').textContent;
                    companyNameInput.value = `Компания (${partnerName})`;
                }
            }
        });
        
        // Анимация при наведении
        const placeholder = logo.querySelector('.partner-placeholder');
        if (placeholder) {
            logo.addEventListener('mouseenter', () => {
                placeholder.style.transform = 'scale(1.1)';
            });
            
            logo.addEventListener('mouseleave', () => {
                placeholder.style.transform = 'scale(1)';
            });
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
 * Универсальная функция показа сообщений
 */
function showMessage(text, type = 'info', duration = 5000) {
    // Удаляем существующие глобальные сообщения
    document.querySelectorAll('.global-message').forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `global-message message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${text}</span>
    `;
    
    // Стили для глобального сообщения
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.zIndex = '10000';
    message.style.maxWidth = '400px';
    message.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    
    document.body.appendChild(message);
    
    // Автоматическое скрытие
    if (duration > 0) {
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            setTimeout(() => message.remove(), 300);
        }, duration);
    }
    
    // Возможность закрыть сообщение вручную
    message.addEventListener('click', () => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(-10px)';
        setTimeout(() => message.remove(), 300);
    });
}

// Глобальные функции для вызова из HTML
window.deleteCompetition = deleteCompetition;
window.deleteDocument = deleteDocument;
window.deleteLeader = deleteLeader;
window.deleteRegion = deleteRegion;
window.showMessage = showMessage;
