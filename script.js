document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
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
    
    // Админ-панель по паролю
    const adminLink = document.getElementById('admin-link');
    const loginModal = document.getElementById('admin-login-modal');
    const adminModal = document.getElementById('admin-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeAdminModal = document.getElementById('close-admin-modal');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    
    // Показать модальное окно входа при клике на админку
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Закрыть модальное окно входа
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            passwordInput.value = '';
        });
    }
    
    // Закрыть модальное окно админки
    if (closeAdminModal) {
        closeAdminModal.addEventListener('click', function() {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закрыть модальные окна при клике вне их
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
                
                // Показать админ-панель
                adminModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
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
    
    // Эффекты для кнопок
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Переключение вкладок в админ-панели
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Добавление соревнования в календарь
    const addCompetitionBtn = document.getElementById('add-competition-btn');
    if (addCompetitionBtn) {
        addCompetitionBtn.addEventListener('click', function() {
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
            renderCompetitionsList();
        });
    }
    
    // Функции для работы с соревнованиями
    function getCompetitions() {
        const savedCompetitions = localStorage.getItem('competitionsList');
        return savedCompetitions ? JSON.parse(savedCompetitions) : [];
    }
    
    function saveCompetitions(competitions) {
        localStorage.setItem('competitionsList', JSON.stringify(competitions));
    }
    
    function renderCompetitionsList() {
        const competitions = getCompetitions();
        const listContainer = document.getElementById('competitions-list');
        
        if (!listContainer) return;
        
        listContainer.innerHTML = competitions.map(comp => `
            <div class="list-item">
                <span>${comp.name} (${comp.date})</span>
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
        
        // Добавление обработчиков для кнопок
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editCompetition(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteCompetition(id);
            });
        });
    }
    
    function editCompetition(id) {
        const competitions = getCompetitions();
        const competition = competitions.find(c => c.id == id);
        
        if (competition) {
            document.getElementById('competition-name').value = competition.name;
            document.getElementById('competition-date').value = competition.date;
            document.getElementById('competition-location').value = competition.location;
            document.getElementById('competition-contact').value = competition.contact;
            document.getElementById('protocol-file').value = competition.protocol || '';
        }
    }
    
    function deleteCompetition(id) {
        if (confirm('Вы уверены, что хотите удалить это соревнование?')) {
            let competitions = getCompetitions();
            competitions = competitions.filter(c => c.id != id);
            saveCompetitions(competitions);
            renderCompetitionsList();
            alert('Соревнование успешно удалено!');
        }
    }
    
    // Инициализация списка соревнований при загрузке админки
    if (document.getElementById('competitions-list')) {
        renderCompetitionsList();
    }
    
    // Функция для отображения карточек руководства
    function renderLeadershipCards() {
        // Данные о руководителях
        const leaders = [
            {
                id: 'chairman',
                name: 'Дмитрий Серов',
                position: 'Председатель Комиссии',
                region: 'Тверская область',
                contact: '+7 (977) 823-63-90',
                email: 'serovdima@list.ru',
                defaultIcon: 'fa-crown',
                color: 'leader-blue'
            },
            {
                id: 'deputy',
                name: 'Алексей Фатьянов',
                position: 'Заместитель Председателя',
                region: 'Нижний Новгород',
                contact: '+7 (905) 234-56-78',
                email: 'fatyanov@mfr-nnov.ru',
                defaultIcon: 'fa-user-tie',
                color: 'leader-yellow'
            },
            {
                id: 'secretary',
                name: 'Наталия Недайводина',
                position: 'Главный секретарь',
                region: 'Вологодская область',
                contact: '+7 (911) 456-78-90',
                email: 'vologda-fum@mfr.ru',
                defaultIcon: 'fa-file-signature',
                color: 'leader-blue'
            },
            {
                id: 'glad',
                name: 'Глеб Симдянкин',
                position: 'Член Комиссии',
                region: 'Смоленская область',
                contact: '+7 (910) 345-67-89',
                email: 'smolensk-fum@mfr.ru',
                defaultIcon: 'fa-medal',
                color: 'leader-red'
            },
            {
                id: 'andrey',
                name: 'Андрей Сальников',
                position: 'Член Комиссии',
                region: 'Ульяновская область',
                contact: '+7 (923) 567-89-01',
                email: 'ul-fum@mfr.ru',
                defaultIcon: 'fa-history',
                color: 'leader-yellow'
            },
            {
                id: 'ilsat',
                name: 'Ильшат Сафаров',
                position: 'Член Комиссии',
                region: 'Республика Татарстан',
                contact: '+7 (934) 678-90-12',
                email: 'tatarstan-fum@mfr.ru',
                defaultIcon: 'fa-child',
                color: 'leader-blue'
            },
            {
                id: 'maxim',
                name: 'Максим Гаранин',
                position: 'Член Комиссии',
                region: 'Калужская область',
                contact: '+7 (945) 789-01-23',
                email: 'kaluga-fum@mfr.ru',
                defaultIcon: 'fa-child',
                color: 'leader-red'
            },
            {
                id: 'alexander',
                name: 'Александр Акимов',
                position: 'Член Комиссии',
                region: 'Тульская область',
                contact: '+7 (956) 890-12-34',
                email: 'tula-fum@mfr.ru',
                defaultIcon: 'fa-motorcycle',
                color: 'leader-yellow'
            },
            {
                id: 'alexander_c',
                name: 'Александр Ципилев',
                position: 'Член Комиссии',
                region: 'Москва, МОО "Федерация Мотоджимханы"',
                contact: '+7 (903) 123-45-67',
                email: 'moscow-fum@mfr.ru',
                defaultIcon: 'fa-building',
                color: 'leader-blue'
            }
        ];
        
        const leadershipGrid = document.querySelector('.leadership-grid');
        leadershipGrid.innerHTML = '';
        
        leaders.forEach(leader => {
            // Проверяем, есть ли сохраненная иконка в localStorage
            const savedIcon = localStorage.getItem(`leader-icon-${leader.id}`);
            const iconClass = savedIcon || leader.defaultIcon;
            
            // Проверяем, есть ли сохраненная фотография в localStorage
            const savedPhoto = localStorage.getItem(`leader-photo-${leader.id}`);
            
            const leaderCard = document.createElement('div');
            leaderCard.className = `leader-card ${leader.color}`;
            leaderCard.id = `region-${leader.id}`;
            
            if (savedPhoto) {
                // Используем фотографию
                leaderCard.innerHTML = `
                    <div class="leader-photo">
                        <img src="${savedPhoto}" alt="${leader.name}">
                    </div>
                    <div class="leader-info">
                        <h3 class="leader-name">${leader.name}</h3>
                        <div class="leader-position">${leader.position}</div>
                        <div class="leader-region">${leader.region}</div>
                        <div class="leader-contact">
                            <i class="fas fa-phone"></i> ${leader.contact}<br>
                            <i class="fas fa-envelope"></i> ${leader.email}
                        </div>
                    </div>
                `;
            } else {
                // Используем иконку
                leaderCard.innerHTML = `
                    <div class="leader-icon">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="leader-info">
                        <h3 class="leader-name">${leader.name}</h3>
                        <div class="leader-position">${leader.position}</div>
                        <div class="leader-region">${leader.region}</div>
                        <div class="leader-contact">
                            <i class="fas fa-phone"></i> ${leader.contact}<br>
                            <i class="fas fa-envelope"></i> ${leader.email}
                        </div>
                    </div>
                `;
            }
            
            leadershipGrid.appendChild(leaderCard);
        });
    }
    
    // Инициализация при загрузке страницы
    if (document.querySelector('.leadership-grid')) {
        renderLeadershipCards();
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
