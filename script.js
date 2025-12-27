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
            const tabId = `${this.getAttribute('data-tab')}-tab`;
            document.getElementById(tabId).classList.add('active');
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
    
    // Инициализация календаря на странице calendar.html
    if (document.getElementById('calendar-grid')) {
        initCalendar();
    }
    
    // Функция инициализации календаря
    function initCalendar() {
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        
        let currentMonth = 4; // May (0-indexed)
        let currentYear = 2025;
        
        // Navigation handlers
        document.getElementById('prev-month').addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
        
        document.getElementById('next-month').addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
        
        // Initial rendering
        renderCalendar(currentMonth, currentYear);
        renderCompetitions();
    }
    
    // Render calendar function
    function renderCalendar(month, year) {
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';
        
        // Update current month title
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
        
        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and days in month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayIndex = firstDay.getDay(); // 0 = Sunday
        
        // Add empty days at the beginning of the month
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        const competitions = getCompetitions();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            
            // Check for competitions on this day
            const competitionDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayCompetitions = competitions.filter(comp => comp.date === competitionDate);
            
            if (dayCompetitions.length > 0) {
                dayElement.classList.add('has-competition');
                // Create container for competitions
                const competitionsContainer = document.createElement('div');
                competitionsContainer.className = 'day-competitions';
                dayCompetitions.forEach(comp => {
                    const compElement = document.createElement('div');
                    compElement.className = 'competition-item';
                    compElement.textContent = comp.name;
                    competitionsContainer.appendChild(compElement);
                });
                dayElement.appendChild(competitionsContainer);
            }
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Function to get saved competitions
    function getCompetitions() {
        const savedCompetitions = localStorage.getItem('competitionsList');
        return savedCompetitions ? JSON.parse(savedCompetitions) : [
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
            },
            {
                id: 4,
                date: '2025-08-05',
                name: 'Женский Кубок МФР',
                location: 'Нижний Новгород',
                contact: 'Алексей Фатьянов',
                contactPhone: '+7 (905) 234-56-78',
                protocol: ''
            },
            {
                id: 5,
                date: '2025-09-12',
                name: 'Кубок юниоров',
                location: 'Вологда',
                contact: 'Наталия Недайводина',
                contactPhone: '+7 (911) 456-78-90',
                protocol: ''
            }
        ];
    }
    
    // Format date function
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    
    // Display competitions list
    function renderCompetitions() {
        const competitions = getCompetitions();
        const container = document.getElementById('competitions-container');
        
        if (!container) return;
        
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
                    <i class="fas fa-file-pdf"></i> <a href="${comp.protocol}" target="_blank" rel="noopener noreferrer" download>Скачать протокол</a>
                </div>` : ''}
            `;
            container.appendChild(compCard);
        });
    }
    
    // Обработчик отправки формы партнерства
    const submitBtn = document.querySelector('.submit-partner-form');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const companyName = document.getElementById('company-name').value;
            const contactPerson = document.getElementById('contact-person').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const partnerType = document.getElementById('partner-type').value;
            const message = document.getElementById('message').value;
            
            if (!companyName || !contactPerson || !phone || !email ||
