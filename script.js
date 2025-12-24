document.addEventListener('DOMContentLoaded', function() {
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
        const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card');
        
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
    const elements = document.querySelectorAll('.tile, .timeline-item, .practical-card, .leader-card');
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
    const adminModal = document.getElementById('admin-modal');
    const closeBtn = document.querySelector('.close-modal');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    
    // Показать модальное окно при клике на админку
    adminLink.addEventListener('click', function(e) {
        e.preventDefault();
        adminModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Закрыть модальное окно
    closeBtn.addEventListener('click', function() {
        adminModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        passwordInput.value = '';
    });
    
    // Закрыть модальное окно при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            passwordInput.value = '';
        }
    });
    
    // Обработка входа по паролю
    loginBtn.addEventListener('click', function() {
        const password = passwordInput.value.trim();
        const correctPassword = 'fum2025admin'; // Этот пароль должен быть изменен на настоящий
        
        if (password === correctPassword) {
            // Успешный вход
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Редирект на админ-панель
            window.location.href = 'admin.html?auth=success';
        } else {
            // Неправильный пароль
            alert('Неверный пароль! Обратитесь к Председателю комиссии для получения доступа.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // Обработка нажатия Enter в поле пароля
    passwordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
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
    
    // Панель администратора
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const adminModalContent = document.querySelector('#admin-modal .modal-content');
    
    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', function() {
            adminModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Обновляем контент модального окна для панели администратора
            adminModalContent.innerHTML = `
                <span class="close-modal">&times;</span>
                <h2>Панель администратора</h2>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" data-tab="regions">Региональные комиссии</button>
                    <button class="tab-btn" data-tab="calendar">Календарь соревнований</button>
                    <button class="tab-btn" data-tab="documents">Документы</button>
                </div>
                
                <div class="tab-content active" id="regions-tab">
                    <h3>Управление региональными комиссиями</h3>
                    <div class="form-group">
                        <label for="region-select">Регион</label>
                        <select id="region-select" class="form-control">
                            <option value="">Выберите регион</option>
                            <option value="moscow">Москва</option>
                            <option value="spb">Санкт-Петербург</option>
                            <option value="tver">Тверская область</option>
                            <option value="nnovgorod">Нижегородская область</option>
                            <option value="smolensk">Смоленская область</option>
                            <option value="vologda">Вологодская область</option>
                            <option value="ulyanovsk">Ульяновская область</option>
                            <option value="tatarstan">Республика Татарстан</option>
                            <option value="kaluga">Калужская область</option>
                            <option value="tula">Тульская область</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="commission-leader">ФИО руководителя</label>
                        <input type="text" id="commission-leader" class="form-control" placeholder="Введите ФИО">
                    </div>
                    
                    <div class="form-group">
                        <label for="leader-phone">Телефон</label>
                        <input type="tel" id="leader-phone" class="form-control" placeholder="+7 (XXX) XXX-XX-XX">
                    </div>
                    
                    <div class="form-group">
                        <label for="leader-email">Email</label>
                        <input type="email" id="leader-email" class="form-control" placeholder="email@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="commission-status">Статус комиссии</label>
                        <select id="commission-status" class="form-control">
                            <option value="active">Действующая</option>
                            <option value="developing">Развивается</option>
                            <option value="planned">Планируется</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-primary" id="add-commission-btn">
                        <i class="fas fa-plus"></i> Добавить/Обновить комиссию
                    </button>
                </div>
                
                <div class="tab-content" id="calendar-tab">
                    <h3>Управление календарем соревнований</h3>
                    <p>Функционал для управления календарем соревнований будет доступен в следующей версии</p>
                </div>
                
                <div class="tab-content" id="documents-tab">
                    <h3>Управление документами</h3>
                    <p>Все документы хранятся на Яндекс.Диске: <a href="https://disk.yandex.ru/d/ubxzU_0RzkFsJw" target="_blank">https://disk.yandex.ru/d/ubxzU_0RzkFsJw</a></p>
                    <p>Для добавления новых документов используйте интерфейс Яндекс.Диска</p>
                </div>
            `;
            
            // Добавляем обработчики для новой формы
            document.querySelector('.close-modal').addEventListener('click', function() {
                adminModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            // Переключение вкладок
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    this.classList.add('active');
                    document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
                });
            });
            
            // Кнопка добавления комиссии
            const addCommissionBtn = document.getElementById('add-commission-btn');
            if (addCommissionBtn) {
                addCommissionBtn.addEventListener('click', function() {
                    const region = document.getElementById('region-select').value;
                    const leader = document.getElementById('commission-leader').value;
                    
                    if (!region || !leader) {
                        alert('Пожалуйста, заполните обязательные поля: Регион и ФИО руководителя');
                        return;
                    }
                    
                    // Здесь будет логика добавления/обновления комиссии
                    alert('Функционал добавления комиссии будет доступен в следующей версии');
                    adminModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            }
        });
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
