/**
 * Основной модуль инициализации сайта Комиссии по мотоджимхане
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт комиссии по мотоджимхане успешно загружен');

    // Инициализация основных модулей
    initMobileMenu();
    initScrollAnimations();
    initAdminPanel();
    initButtonEffects();
    
    // Плавное появление страницы (альтернативный вариант)
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
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
        const elements = document.querySelectorAll('.tile, .news-card, .gallery-item');
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
    const animatedElements = document.querySelectorAll('.tile, .news-card, .gallery-item');
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
                alert('Вход выполнен успешно!');
            } else {
                alert('Неверный пароль! Обратитесь к Председателю комиссии для получения доступа.');
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
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
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
        alert('Пожалуйста, заполните все обязательные поля');
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
        protocol: ''
    };
    
    competitions.push(newCompetition);
    saveCompetitions(competitions);
    
    // Очистка формы
    document.getElementById('competition-name').value = '';
    document.getElementById('competition-date').value = '';
    document.getElementById('competition-location').value = '';
    document.getElementById('competition-contact').value = '';
    document.getElementById('protocol-upload').value = '';
    
    alert('Соревнование успешно добавлено!');
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
        alert('Пожалуйста, заполните все обязательные поля');
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
    
    alert('Документ успешно добавлен!');
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
        alert('Пожалуйста, заполните все обязательные поля');
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
    
    alert('Руководитель успешно добавлен!');
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
        alert('Пожалуйста, заполните обязательные поля: регион, ФИО и должность');
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
    
    alert('Региональный представитель успешно добавлен!');
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
 * Функции отрисовки списков (заглушки - нужно реализовать под конкретные потребности)
 */
function renderCompetitionsList() {
    const container = document.getElementById('competitions-list');
    if (!container) return;
    
    const competitions = getCompetitions();
    container.innerHTML = competitions.map(comp => `
        <div class="list-item">
            <div>
                <strong>${comp.name}</strong><br>
                <small>${comp.date} • ${comp.location}</small>
            </div>
            <div class="list-actions">
                <button class="action-btn edit-btn" data-id="${comp.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${comp.id}">
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
    container.innerHTML = documents.map(doc => `
        <div class="list-item">
            <div>
                <strong>${doc.name}</strong><br>
                <small>${doc.category} • ${doc.date} • ${doc.size}</small>
            </div>
            <div class="list-actions">
                <a href="${doc.url}" class="action-btn edit-btn" download>
                    <i class="fas fa-download"></i>
                </a>
                <button class="action-btn delete-btn" data-id="${doc.id}">
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
    container.innerHTML = leaders.map(leader => `
        <div class="list-item">
            <div>
                <strong>${leader.name}</strong><br>
                <small>${leader.position} • ${leader.region}</small>
            </div>
            <div class="list-actions">
                <button class="action-btn edit-btn" data-id="${leader.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${leader.id}">
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
    container.innerHTML = regions.map(region => `
        <div class="list-item">
            <div>
                <strong>${region.region}</strong><br>
                <small>${region.name} • ${region.position}</small>
            </div>
            <div class="list-actions">
                <button class="action-btn edit-btn" data-id="${region.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${region.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}
