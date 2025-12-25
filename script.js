document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модальных окон
    const adminLink = document.getElementById('admin-link');
    const loginModal = document.getElementById('admin-login-modal');
    const adminModal = document.getElementById('admin-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeAdminModal = document.getElementById('close-admin-modal');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация фильтров документов
    initDocumentFilters();
    
    // Инициализация админ-панели
    initAdminPanel();
    
    // Загрузка данных из localStorage
    loadStoredData();
});

// Инициализация мобильного меню
function initMobileMenu() {
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
}

// Инициализация анимаций
function initAnimations() {
    // Анимация появления элементов при загрузке
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
    
    // Эффекты при прокрутке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card, .news-card, .document-card');
        
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
    const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card, .news-card, .document-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// Инициализация навигации
function initNavigation() {
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
}

// Инициализация фильтров документов
function initDocumentFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterDocuments(filter);
        });
    });
}

// Фильтрация документов
function filterDocuments(filter) {
    const documentsContainer = document.getElementById('documents-container');
    const documents = JSON.parse(localStorage.getItem('documentsList')) || getDefaultDocuments();
    
    documentsContainer.innerHTML = '';
    
    const filteredDocuments = filter === 'all' 
        ? documents 
        : documents.filter(doc => doc.category === filter);
    
    if (filteredDocuments.length === 0) {
        documentsContainer.innerHTML = '<p class="no-documents">Документы не найдены</p>';
        return;
    }
    
    filteredDocuments.forEach(doc => {
        documentsContainer.appendChild(createDocumentCard(doc));
    });
}

// Создание карточки документа
function createDocumentCard(document) {
    const docCard = document.createElement('div');
    docCard.className = `document-card ${document.category}`;
    
    const formatDate = (dateString) => {
        if (!dateString) return 'без даты';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };
    
    const categoryIcons = {
        'rules': 'fas fa-balance-scale',
        'regulations': 'fas fa-calendar-alt',
        'licenses': 'fas fa-id-card',
        'other': 'fas fa-file-alt'
    };
    
    const categoryNames = {
        'rules': 'Правила',
        'regulations': 'Регламенты',
        'licenses': 'Лицензии',
        'other': 'Прочее'
    };
    
    docCard.innerHTML = `
        <div class="document-icon">
            <i class="${categoryIcons[document.category] || 'fas fa-file-alt'}"></i>
        </div>
        <h3 class="document-title">${document.name}</h3>
        <p class="document-description">${document.description || ''}</p>
        <div class="document-meta">
            <span>${categoryNames[document.category] || 'Документ'}</span>
            <span>${formatDate(document.date)}</span>
        </div>
        <a href="${document.url}" target="_blank" class="document-link" download>
            <i class="fas fa-download"></i> Скачать документ
        </a>
    `;
    
    return docCard;
}

// Инициализация админ-панели
function initAdminPanel() {
    const adminLink = document.getElementById('admin-link');
    const loginModal = document.getElementById('admin-login-modal');
    const adminModal = document.getElementById('admin-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeAdminModal = document.getElementById('close-admin-modal');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    
    // Показать модальное окно входа при клике на админку
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Показать админ-панель из таблицы региональных представителей
    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', function() {
            // Сначала проверяем, авторизованы ли мы
            const isLoggedIn = localStorage.getItem('adminLoggedIn');
            if (isLoggedIn === 'true') {
                openAdminPanel('regions');
            } else {
                loginModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Закрытие модального окна входа
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            passwordInput.value = '';
        });
    }
    
    // Закрытие модального окна админки
    if (closeAdminModal) {
        closeAdminModal.addEventListener('click', function() {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закрытие модальных окон при клике вне их
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
            // Стандартный пароль, должен быть изменен Председателем комиссии
            const correctPassword = 'fum2025admin'; 
            
            if (password === correctPassword) {
                // Успешный вход
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                passwordInput.value = '';
                
                // Сохраняем факт входа
                localStorage.setItem('adminLoggedIn', 'true');
                
                // Открываем админ-панель
                openAdminPanel('calendar');
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
    
    // Переключение вкладок в админ-панели
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Обработчики кнопок добавления
    document.getElementById('add-competition-btn')?.addEventListener('click', addCompetition);
    document.getElementById('add-document-btn')?.addEventListener('click', addDocument);
    document.getElementById('add-leader-btn')?.addEventListener('click', addLeader);
    document.getElementById('add-region-btn')?.addEventListener('click', addRegion);
}

// Открытие админ-панели с определенной вкладкой
function openAdminPanel(tab = 'calendar') {
    const adminModal = document.getElementById('admin-modal');
    
    if (adminModal) {
        adminModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Активируем указанную вкладку
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`.tab-btn[data-tab="${tab}"]`)?.classList.add('active');
        document.getElementById(`${tab}-tab`)?.classList.add('active');
        
        // Загружаем список для активной вкладки
        loadAdminList(tab);
    }
}

// Загрузка данных из localStorage
function loadStoredData() {
    // Загрузка документов
    const documentsContainer = document.getElementById('documents-container');
    if (documentsContainer) {
        const documents = JSON.parse(localStorage.getItem('documentsList')) || getDefaultDocuments();
        documentsContainer.innerHTML = '';
        
        documents.forEach(doc => {
            documentsContainer.appendChild(createDocumentCard(doc));
        });
    }
    
    // Загрузка соревнований
    loadCompetitions();
}

// Загрузка соревнований
function loadCompetitions() {
    const competitions = getCompetitions();
    const container = document.getElementById('competitions-container');
    
    if (container) {
        container.innerHTML = '';
        
        if (competitions.length === 0) {
            container.innerHTML = '<p class="no-competitions">Пока нет запланированных соревнований</p>';
            return;
        }
        
        competitions.forEach(comp => {
            const compDate = new Date(comp.date);
            const today = new Date();
            const isPast = compDate < today;
            
            const compCard = document.createElement('div');
            compCard.className = `competition-card ${isPast ? 'past-competition' : ''}`;
            compCard.innerHTML = `
                <div class="competition-date">${formatDate(comp.date)}</div>
                <h3 class="competition-title">${comp.name}</h3>
                <div class="competition-location">${comp.location}</div>
                <div class="competition-contact">
                    <i class="fas fa-user"></i> ${comp.contact}<br>
                    <i class="fas fa-phone"></i> ${comp.contactPhone}
                </div>
                ${comp.protocol ? `<div class="protocol-link">
                    <i class="fas fa-file-pdf"></i> <a href="${comp.protocol}" target="_blank" download>Скачать протокол</a>
                </div>` : ''}
            `;
            compCard.addEventListener('click', () => showCompetitionDetails(comp));
            container.appendChild(compCard);
        });
    }
}

// Фильтрация документов
function filterDocuments(filter) {
    const documentsContainer = document.getElementById('documents-container');
    const documents = JSON.parse(localStorage.getItem('documentsList')) || getDefaultDocuments();
    
    documentsContainer.innerHTML = '';
    
    const filteredDocuments = filter === 'all' 
        ? documents 
        : documents.filter(doc => doc.category === filter);
    
    if (filteredDocuments.length === 0) {
        documentsContainer.innerHTML = '<p class="no-documents">Документы не найдены</p>';
        return;
    }
    
    filteredDocuments.forEach(doc => {
        documentsContainer.appendChild(createDocumentCard(doc));
    });
}

// Загрузка списка для админ-панели
function loadAdminList(tab) {
    const listContainer = document.getElementById(`${tab}-list`);
    
    if (!listContainer) return;
    
    let items = [];
    let itemType = '';
    
    switch(tab) {
        case 'calendar':
            items = getCompetitions();
            itemType = 'competition';
            break;
        case 'documents':
            items = JSON.parse(localStorage.getItem('documentsList')) || getDefaultDocuments();
            itemType = 'document';
            break;
        case 'structure':
            items = getLeadership();
            itemType = 'leader';
            break;
        case 'regions':
            items = getRegionalRepresentatives();
            itemType = 'region';
            break;
    }
    
    listContainer.innerHTML = '';
    
    items.forEach(item => {
        const previewText = tab === 'documents' ? item.name : 
                            tab === 'structure' ? item.name : 
                            tab === 'regions' ? item.region : item.name;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'list-item';
        itemElement.innerHTML = `
            <span>${previewText}</span>
            <div class="list-actions">
                <button class="action-btn edit-btn" data-id="${item.id}" data-type="${itemType}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${item.id}" data-type="${itemType}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        listContainer.appendChild(itemElement);
    });
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            editItem(id, type);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            deleteItem(id, type);
        });
    });
}

// Получение соревнований
function getCompetitions() {
    const savedCompetitions = localStorage.getItem('competitionsList');
    return savedCompetitions ? JSON.parse(savedCompetitions) : getDefaultCompetitions();
}

// Получение руководства
function getLeadership() {
    const savedLeaders = localStorage.getItem('leadershipList');
    return savedLeaders ? JSON.parse(savedLeaders) : getDefaultLeadership();
}

// Получение региональных представителей
function getRegionalRepresentatives() {
    const savedRegions = localStorage.getItem('regionalRepresentativesList');
    return savedRegions ? JSON.parse(savedRegions) : getDefaultRegionalRepresentatives();
}

// Добавление соревнования
function addCompetition() {
    const name = document.getElementById('competition-name').value.trim();
    const date = document.getElementById('competition-date').value;
    const location = document.getElementById('competition-location').value.trim();
    const contact = document.getElementById('competition-contact').value.trim();
    const protocol = document.getElementById('protocol-file').value.trim();
    
    if (!name || !date || !location || !contact) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const competitions = getCompetitions();
    const newId = competitions.length > 0 ? 
        Math.max(...competitions.map(c => c.id)) + 1 : 1;
    
    const newCompetition = {
        id: newId,
        name,
        date,
        location,
        contact,
        contactPhone: '', // Можно добавить отдельное поле для телефона
        protocol
    };
    
    competitions.push(newCompetition);
    saveCompetitions(competitions);
    
    // Очистка формы
    document.getElementById('competition-name').value = '';
    document.getElementById('competition-date').value = '';
    document.getElementById('competition-location').value = '';
    document.getElementById('competition-contact').value = '';
    document.getElementById('protocol-file').value = '';
    
    alert('Соревнование успешно добавлено!');
    
    // Обновление списка
    loadAdminList('calendar');
    loadCompetitions();
}

// Сохранение соревнований
function saveCompetitions(competitions) {
    localStorage.setItem('competitionsList', JSON.stringify(competitions));
}

// Добавление документа
function addDocument() {
    const name = document.getElementById('document-name').value.trim();
    const url = document.getElementById('document-url').value.trim();
    const category = document.getElementById('document-category').value;
    const date = document.getElementById('document-date').value;
    
    if (!name || !url || !category || !date) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const documents = JSON.parse(localStorage.getItem('documentsList')) || [];
    const newId = documents.length > 0 ? 
        Math.max(...documents.map(d => d.id)) + 1 : 1;
    
    const newDocument = {
        id: newId,
        name,
        url,
        category,
        date,
        size: '1.2 МБ' // Можно добавить автоматическое определение размера
    };
    
    documents.push(newDocument);
    localStorage.setItem('documentsList', JSON.stringify(documents));
    
    // Очистка формы
    document.getElementById('document-name').value = '';
    document.getElementById('document-url').value = '';
    document.getElementById('document-category').value = 'rules';
    document.getElementById('document-date').value = '';
    
    alert('Документ успешно добавлен!');
    
    // Обновление списка и отображения
    loadAdminList('documents');
    const documentsContainer = document.getElementById('documents-container');
    if (documentsContainer) {
        documentsContainer.innerHTML = '';
        documents.forEach(doc => {
            documentsContainer.appendChild(createDocumentCard(doc));
        });
    }
}

// Добавление руководителя
function addLeader() {
    const name = document.getElementById('leader-name').value.trim();
    const position = document.getElementById('leader-position').value.trim();
    const region = document.getElementById('leader-region').value.trim();
    const phone = document.getElementById('leader-phone').value.trim();
    const email = document.getElementById('leader-email').value.trim();
    
    if (!name || !position || !region || !phone || !email) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const leaders = getLeadership();
    const newId = leaders.length > 0 ? 
        Math.max(...leaders.map(l => l.id)) + 1 : 1;
    
    const newLeader = {
        id: newId,
        name,
        position,
        region,
        phone,
        email
    };
    
    leaders.push(newLeader);
    localStorage.setItem('leadershipList', JSON.stringify(leaders));
    
    // Очистка формы
    document.getElementById('leader-name').value = '';
    document.getElementById('leader-position').value = '';
    document.getElementById('leader-region').value = '';
    document.getElementById('leader-phone').value = '';
    document.getElementById('leader-email').value = '';
    
    alert('Руководитель успешно добавлен!');
    
    // Обновление списка
    loadAdminList('structure');
}

// Добавление регионального представителя
function addRegion() {
    const region = document.getElementById('region-name').value.trim();
    const name = document.getElementById('representative-name').value.trim();
    const position = document.getElementById('representative-position').value.trim();
    const phone = document.getElementById('representative-phone').value.trim();
    const email = document.getElementById('representative-email').value.trim();
    
    if (!region || !name || !position || !phone || !email) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const regions = getRegionalRepresentatives();
    const newId = regions.length > 0 ? 
        Math.max(...regions.map(r => r.id)) + 1 : 1;
    
    const newRegion = {
        id: newId,
        region,
        name,
        position,
        phone,
        email
    };
    
    regions.push(newRegion);
    localStorage.setItem('regionalRepresentativesList', JSON.stringify(regions));
    
    // Очистка формы
    document.getElementById('region-name').value = '';
    document.getElementById('representative-name').value = '';
    document.getElementById('representative-position').value = '';
    document.getElementById('representative-phone').value = '';
    document.getElementById('representative-email').value = '';
    
    alert('Региональный представитель успешно добавлен!');
    
    // Обновление списка и таблицы
    loadAdminList('regions');
    updateRegionsTable();
}

// Обновление таблицы региональных представителей
function updateRegionsTable() {
    const regionsTableBody = document.getElementById('regions-table-body');
    const regions = getRegionalRepresentatives();
    
    if (regionsTableBody) {
        regionsTableBody.innerHTML = '';
        
        regions.forEach(region => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${region.region}</td>
                <td>${region.name}</td>
                <td>${region.position}</td>
                <td>${region.phone}</td>
                <td>${region.email}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${region.id}" data-type="region">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${region.id}" data-type="region">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            regionsTableBody.appendChild(row);
        });
        
        // Добавляем обработчики для новых кнопок
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const type = this.getAttribute('data-type');
                editItem(id, type);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const type = this.getAttribute('data-type');
                deleteItem(id, type);
            });
        });
    }
}

// Удаление элемента
function deleteItem(id, type) {
    if (confirm('Вы уверены, что хотите удалить этот элемент?')) {
        let items = [];
        let storageKey = '';
        
        switch(type) {
            case 'competition':
                items = getCompetitions();
                storageKey = 'competitionsList';
                break;
            case 'document':
                items = JSON.parse(localStorage.getItem('documentsList')) || [];
                storageKey = 'documentsList';
                break;
            case 'leader':
                items = getLeadership();
                storageKey = 'leadershipList';
                break;
            case 'region':
                items = getRegionalRepresentatives();
                storageKey = 'regionalRepresentativesList';
                break;
        }
        
        items = items.filter(item => item.id != id);
        localStorage.setItem(storageKey, JSON.stringify(items));
        
        // Обновление интерфейса
        loadAdminList(type === 'competition' ? 'calendar' : 
                     type === 'document' ? 'documents' : 
                     type === 'leader' ? 'structure' : 'regions');
        
        if (type === 'region') {
            updateRegionsTable();
        }
        
        if (type === 'competition') {
            loadCompetitions();
        }
        
        if (type === 'document') {
            const documentsContainer = document.getElementById('documents-container');
            if (documentsContainer) {
                documentsContainer.innerHTML = '';
                items.forEach(doc => {
                    documentsContainer.appendChild(createDocumentCard(doc));
                });
            }
        }
        
        alert('Элемент успешно удален!');
    }
}

// Редактирование элемента
function editItem(id, type) {
    let items = [];
    let storageKey = '';
    
    switch(type) {
        case 'competition':
            items = getCompetitions();
            storageKey = 'competitionsList';
            break;
        case 'document':
            items = JSON.parse(localStorage.getItem('documentsList')) || [];
            storageKey = 'documentsList';
            break;
        case 'leader':
            items = getLeadership();
            storageKey = 'leadershipList';
            break;
        case 'region':
            items = getRegionalRepresentatives();
            storageKey = 'regionalRepresentativesList';
            break;
    }
    
    const item = items.find(i => i.id == id);
    
    if (item) {
        switch(type) {
            case 'competition':
                document.getElementById('competition-name').value = item.name;
                document.getElementById('competition-date').value = item.date;
                document.getElementById('competition-location').value = item.location;
                document.getElementById('competition-contact').value = item.contact;
                document.getElementById('protocol-file').value = item.protocol || '';
                break;
            case 'document':
                document.getElementById('document-name').value = item.name;
                document.getElementById('document-url').value = item.url;
                document.getElementById('document-category').value = item.category;
                document.getElementById('document-date').value = item.date;
                break;
            case 'leader':
                document.getElementById('leader-name').value = item.name;
                document.getElementById('leader-position').value = item.position;
                document.getElementById('leader-region').value = item.region;
                document.getElementById('leader-phone').value = item.phone;
                document.getElementById('leader-email').value = item.email;
                break;
            case 'region':
                document.getElementById('region-name').value = item.region;
                document.getElementById('representative-name').value = item.name;
                document.getElementById('representative-position').value = item.position;
                document.getElementById('representative-phone').value = item.phone;
                document.getElementById('representative-email').value = item.email;
                break;
        }
    }
}

// Получение данных по умолчанию
function getDefaultCompetitions() {
    return [
        {
            id: 1,
            date: '2025-05-12',
            name: '2 этап Кубка России по фигурному управлению мотоциклом',
            location: 'Смоленск',
            contact: 'Глеб Симдянкин',
            contactPhone: '+7 (910) 345-67-89',
            protocol: ''
        },
        {
            id: 2,
            date: '2025-05-20',
            name: 'Кубок Москвы',
            location: 'Москва',
            contact: 'Александр Ципилев',
            contactPhone: '+7 (903) 123-45-67',
            protocol: ''
        },
        {
            id: 3,
            date: '2025-06-15',
            name: 'Чемпионат России',
            location: 'Тверская область',
            contact: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            protocol: ''
        }
    ];
}

function getDefaultDocuments() {
    return [
        {
            id: 1,
            name: 'Правила соревнований 2025',
            url: 'https://example.com/rules2025.pdf',
            category: 'rules',
            date: '2025-01-15',
            size: '1.2 МБ'
        },
        {
            id: 2,
            name: 'Регламент Кубка России 2025',
            url: 'https://example.com/regulations2025.pdf',
            category: 'regulations',
            date: '2025-01-20',
            size: '2.4 МБ'
        },
        {
            id: 3,
            name: 'Порядок оформления лицензий',
            url: 'https://example.com/licenses2025.pdf',
            category: 'licenses',
            date: '2025-01-25',
            size: '0.8 МБ'
        }
    ];
}

function getDefaultLeadership() {
    return [
        {
            id: 1,
            name: 'Дмитрий Серов',
            position: 'Председатель Комиссии',
            region: 'Тверская область',
            phone: '+7 (977) 823-63-90',
            email: 'serovdima@list.ru'
        },
        {
            id: 2,
            name: 'Алексей Фатьянов',
            position: 'Заместитель Председателя',
            region: 'Нижний Новгород',
            phone: '+7 (920) 111-91-77',
            email: 'motogymkhana-nn@yandex.ru'
        },
        {
            id: 3,
            name: 'Наталия Недайводина',
            position: 'Главный секретарь',
            region: 'Вологодская область',
            phone: '+7 (911) 456-78-90',
            email: 'vologda-fum@mfr.ru'
        },
        {
            id: 4,
            name: 'Глеб Симдянкин',
            position: 'Член Комиссии',
            region: 'Смоленская область',
            phone: '+7 (910) 345-67-89',
            email: 'smolensk-fum@mfr.ru'
        }
    ];
}

function getDefaultRegionalRepresentatives() {
    return [
        {
            id: 1,
            region: 'Тверская область',
            name: 'Дмитрий Серов',
            position: 'Председатель Комиссии',
            phone: '+7 (977) 823-63-90',
            email: 'serovdima@list.ru'
        },
        {
            id: 2,
            region: 'Нижний Новгород',
            name: 'Алексей Фатьянов',
            position: 'Заместитель Председателя',
            phone: '+7 (920) 111-91-77',
            email: 'motogymkhana-nn@yandex.ru'
        },
        {
            id: 3,
            region: 'Вологодская область',
            name: 'Наталия Недайводина',
            position: 'Главный секретарь',
            phone: '+7 (911) 456-78-90',
            email: 'vologda-fum@mfr.ru'
        },
        {
            id: 4,
            region: 'Смоленская область',
            name: 'Глеб Симдянкин',
            position: 'Член Комиссии',
            phone: '+7 (910) 345-67-89',
            email: 'smolensk-fum@mfr.ru'
        }
    ];
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

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
