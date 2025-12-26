document.addEventListener('DOMContentLoaded', function() {
    // Инициализация мобильного меню
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
        const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card, .news-card');
        
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
    const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card, .news-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Админ-панель
    const adminTab = document.getElementById('admin-tab');
    const adminPanel = document.getElementById('admin-panel');
    const closeAdminPanel = document.getElementById('close-admin-panel');
    const loginAdminBtn = document.getElementById('login-admin-btn');
    const adminPassword = document.getElementById('admin-password');
    
    // Показать админ-панель при клике на язычок
    if (adminTab) {
        adminTab.addEventListener('click', function() {
            adminPanel.style.right = '0';
        });
    }
    
    // Закрыть админ-панель
    if (closeAdminPanel) {
        closeAdminPanel.addEventListener('click', function() {
            adminPanel.style.right = '-400px';
        });
    }
    
    // Закрытие админ-панели при клике вне ее
    document.addEventListener('click', function(e) {
        if (adminPanel.style.right === '0px' && 
            !adminPanel.contains(e.target) && 
            !adminTab.contains(e.target)) {
            adminPanel.style.right = '-400px';
        }
    });
    
    // Обработка входа в админ-панель
    if (loginAdminBtn) {
        loginAdminBtn.addEventListener('click', function() {
            if (adminPassword.value === 'fum2025admin') {
                document.querySelector('.admin-login').style.display = 'none';
                document.querySelector('.tab-content.active').style.display = 'block';
                alert('Вход выполнен успешно!');
            } else {
                alert('Неверный пароль! Обратитесь к Председателю комиссии для получения доступа.');
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
    
    // Добавление соревнования
    const addCompetitionBtn = document.getElementById('add-competition-btn');
    if (addCompetitionBtn) {
        addCompetitionBtn.addEventListener('click', function() {
            const name = document.getElementById('competition-name').value.trim();
            const date = document.getElementById('competition-date').value;
            const location = document.getElementById('competition-location').value.trim();
            const contact = document.getElementById('competition-contact').value.trim();
            const protocolFile = document.getElementById('protocol-upload').files[0];
            
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
                contactPhone: '',
                protocol: protocolFile ? URL.createObjectURL(protocolFile) : ''
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
            
            // Обновление списка
            if (document.getElementById('competitions-list')) {
                renderCompetitionsList();
            }
        });
    }
    
    // Добавление документа
    const addDocumentBtn = document.getElementById('add-document-btn');
    if (addDocumentBtn) {
        addDocumentBtn.addEventListener('click', function() {
            const name = document.getElementById('document-name').value.trim();
            const docFile = document.getElementById('document-upload').files[0];
            const category = document.getElementById('document-category').value;
            
            if (!name || !docFile || !category) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            const documents = getDocuments();
            const newId = documents.length > 0 ? 
                Math.max(...documents.map(d => d.id)) + 1 : 1;
            
            const newDocument = {
                id: newId,
                name,
                url: URL.createObjectURL(docFile),
                category,
                date: new Date().toLocaleDateString('ru-RU'),
                size: `${(docFile.size / 1024 / 1024).toFixed(1)} МБ`
            };
            
            documents.push(newDocument);
            saveDocuments(documents);
            
            // Очистка формы
            document.getElementById('document-name').value = '';
            document.getElementById('document-upload').value = '';
            document.getElementById('document-category').value = 'rules';
            
            alert('Документ успешно добавлен!');
            
            // Обновление списка
            if (document.getElementById('documents-list')) {
                renderDocumentsList();
            }
        });
    }
    
    // Добавление руководителя
    const addLeaderBtn = document.getElementById('add-leader-btn');
    if (addLeaderBtn) {
        addLeaderBtn.addEventListener('click', function() {
            const name = document.getElementById('leader-name').value.trim();
            const position = document.getElementById('leader-position').value.trim();
            const region = document.getElementById('leader-region').value.trim();
            const icon = document.getElementById('leader-icon').value;
            
            if (!name || !position || !region) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            const leaders = getLeaders();
            const newId = leaders.length > 0 ? 
                Math.max(...leaders.map(l => l.id)) + 1 : 1;
            
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
            
            // Обновление списка
            if (document.getElementById('leaders-list')) {
                renderLeadersList();
            }
        });
    }
    
    // Добавление регионального представителя
    const addRegionBtn = document.getElementById('add-region-btn');
    if (addRegionBtn) {
        addRegionBtn.addEventListener('click', function() {
            const region = document.getElementById('region-name').value.trim();
            const name = document.getElementById('representative-name').value.trim();
            const position = document.getElementById('representative-position').value.trim();
            const phone = document.getElementById('representative-phone').value.trim();
            const email = document.getElementById('representative-email').value.trim();
            
            if (!region || !name || !position || !phone || !email) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            const regions = getRegions();
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
            saveRegions(regions);
            
            // Очистка формы
            document.getElementById('region-name').value = '';
            document.getElementById('representative-name').value = '';
            document.getElementById('representative-position').value = '';
            document.getElementById('representative-phone').value = '';
            document.getElementById('representative-email').value = '';
            
            alert('Региональный представитель успешно добавлен!');
            
            // Обновление списка
            if (document.getElementById('regions-list')) {
                renderRegionsList();
            }
        });
    }
    
    // Функции для работы с localStorage
    function getCompetitions() {
        const savedCompetitions = localStorage.getItem('competitionsList');
        return savedCompetitions ? JSON.parse(savedCompetitions) : [];
    }
    
    function saveCompetitions(competitions) {
        localStorage.setItem('competitionsList', JSON.stringify(competitions));
    }
    
    function getDocuments() {
        const savedDocuments = localStorage.getItem('documentsList');
        return savedDocuments ? JSON.parse(savedDocuments) : [];
    }
    
    function saveDocuments(documents) {
        localStorage.setItem('documentsList', JSON.stringify(documents));
    }
    
    function getLeaders() {
        const savedLeaders = localStorage.getItem('leadersList');
        return savedLeaders ? JSON.parse(savedLeaders) : [];
    }
    
    function saveLeaders(leaders) {
        localStorage.setItem('leadersList', JSON.stringify(leaders));
    }
    
    function getRegions() {
        const savedRegions = localStorage.getItem('regionsList');
        return savedRegions ? JSON.parse(savedRegions) : [];
    }
    
    function saveRegions(regions) {
        localStorage.setItem('regionsList', JSON.stringify(regions));
    }
    
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
    
    // Эффекты для кнопок
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
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
