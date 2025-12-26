/**
 * ОСНОВНОЙ ОБЪЕКТ ДЛЯ РАБОТЫ С ДАННЫМИ
 */
const CommissionApp = {
    // Ключ для хранения данных в localStorage
    storageKey: 'commissionData_v1',
    
    // Инициализация приложения
    init() {
        // Загружаем данные при загрузке страницы
        this.loadData();
        
        // Инициализируем админ-панель
        this.initAdminPanel();
        
        // Загружаем данные на страницу
        this.renderLeaders();
        this.renderRegions();
        
        // Инициализируем переключение вкладок в админ-панели
        this.initAdminTabs();
        
        console.log('Commission App initialized');
    },
    
    /**
     * РАБОТА С ХРАНИЛИЩЕМ ДАННЫХ
     */
    
    // Данные по умолчанию
    defaultData: {
        leaders: [
            {
                id: 1,
                name: 'Иванов Иван Иванович',
                position: 'Председатель комиссии',
                description: 'Доктор юридических наук, профессор',
                photo: 'https://via.placeholder.com/300x200/2c3e50/ffffff?text=Иван+Иванов'
            },
            {
                id: 2,
                name: 'Петрова Мария Сергеевна',
                position: 'Заместитель председателя',
                description: 'Кандидат педагогических наук',
                photo: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Мария+Петрова'
            },
            {
                id: 3,
                name: 'Сидоров Алексей Владимирович',
                position: 'Ответственный секретарь',
                description: 'Мастер спорта международного класса',
                photo: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Алексей+Сидоров'
            }
        ],
        regions: [
            {
                id: 1,
                region: 'Центральный федеральный округ',
                representative: 'Смирнов Александр Петрович',
                phone: '+7 (495) 123-45-67',
                email: 'smirnov@example.com'
            },
            {
                id: 2,
                region: 'Северо-Западный федеральный округ',
                representative: 'Кузнецова Ольга Ивановна',
                phone: '+7 (812) 987-65-43',
                email: 'kuznetsova@example.com'
            },
            {
                id: 3,
                region: 'Южный федеральный округ',
                representative: 'Попов Дмитрий Сергеевич',
                phone: '+7 (863) 456-78-90',
                email: 'popov@example.com'
            },
            {
                id: 4,
                region: 'Приволжский федеральный округ',
                representative: 'Васильева Екатерина Андреевна',
                phone: '+7 (843) 321-09-87',
                email: 'vasileva@example.com'
            },
            {
                id: 5,
                region: 'Уральский федеральный округ',
                representative: 'Морозов Павел Викторович',
                phone: '+7 (343) 654-32-10',
                email: 'morozov@example.com'
            }
        ]
    },
    
    // Текущие данные приложения
    data: null,
    
    // Загрузка данных из localStorage
    loadData() {
        const savedData = localStorage.getItem(this.storageKey);
        
        if (savedData) {
            try {
                this.data = JSON.parse(savedData);
                console.log('Data loaded from localStorage');
            } catch (e) {
                console.error('Error parsing saved data:', e);
                this.data = JSON.parse(JSON.stringify(this.defaultData));
                this.saveData();
            }
        } else {
            // Если данных нет, используем данные по умолчанию
            this.data = JSON.parse(JSON.stringify(this.defaultData));
            this.saveData();
            console.log('Default data initialized');
        }
    },
    
    // Сохранение данных в localStorage
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        console.log('Data saved to localStorage');
    },
    
    /**
     * ОТОБРАЖЕНИЕ ДАННЫХ НА СТРАНИЦЕ
     */
    
    // Отображение руководителей
    renderLeaders() {
        const container = document.querySelector('.leadership-cards');
        if (!container) return;
        
        // Очищаем контейнер (кроме статического примера, если он есть)
        container.innerHTML = '';
        
        // Создаем карточки для каждого руководителя
        this.data.leaders.forEach(leader => {
            const card = document.createElement('div');
            card.className = 'leader-card';
            card.dataset.id = leader.id;
            
            card.innerHTML = `
                <div class="leader-img" style="background-image: url('${leader.photo}')"></div>
                <div class="leader-info">
                    <h3 class="leader-name">${leader.name}</h3>
                    <p class="leader-post">${leader.position}</p>
                    <p class="leader-description">${leader.description}</p>
                </div>
            `;
            
            container.appendChild(card);
        });
    },
    
    // Отображение региональных представителей
    renderRegions() {
        const tableBody = document.querySelector('.regions-table tbody');
        if (!tableBody) {
            // Если tbody нет, пытаемся найти таблицу и создать tbody
            const table = document.querySelector('.regions-table');
            if (table) {
                // Удаляем старые строки кроме заголовка
                const rows = table.querySelectorAll('tr:not(:first-child)');
                rows.forEach(row => row.remove());
                
                // Добавляем новые строки
                this.data.regions.forEach(region => {
                    const row = document.createElement('tr');
                    row.dataset.id = region.id;
                    
                    row.innerHTML = `
                        <td>${region.region}</td>
                        <td>${region.representative}</td>
                        <td>${region.phone}</td>
                        <td><a href="mailto:${region.email}">${region.email}</a></td>
                    `;
                    
                    table.appendChild(row);
                });
            }
            return;
        }
        
        // Если tbody существует, очищаем и заполняем его
        tableBody.innerHTML = '';
        
        this.data.regions.forEach(region => {
            const row = document.createElement('tr');
            row.dataset.id = region.id;
            
            row.innerHTML = `
                <td>${region.region}</td>
                <td>${region.representative}</td>
                <td>${region.phone}</td>
                <td><a href="mailto:${region.email}">${region.email}</a></td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    /**
     * АДМИН-ПАНЕЛЬ
     */
    
    // Инициализация админ-панели
    initAdminPanel() {
        // Обработчик для кнопки открытия/закрытия админ-панели
        const toggleBtn = document.querySelector('.admin-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleAdminPanel();
            });
        }
        
        // Обработчик для кнопки закрытия админ-панели
        const closeBtn = document.querySelector('.close-admin');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.toggleAdminPanel(false);
            });
        }
        
        // Инициализация форм
        this.initForms();
        
        // Загрузка списков в админ-панель
        this.renderAdminLists();
    },
    
    // Переключение админ-панели
    toggleAdminPanel(show) {
        const adminPanel = document.querySelector('.admin-panel');
        if (!adminPanel) return;
        
        if (show !== undefined) {
            if (show) {
                adminPanel.classList.add('active');
                // При открытии обновляем списки
                this.renderAdminLists();
            } else {
                adminPanel.classList.remove('active');
            }
        } else {
            adminPanel.classList.toggle('active');
            if (adminPanel.classList.contains('active')) {
                // При открытии обновляем списки
                this.renderAdminLists();
            }
        }
    },
    
    // Инициализация вкладок админ-панели
    initAdminTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Удаляем активный класс у всех кнопок и вкладок
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Добавляем активный класс нажатой кнопке
                btn.classList.add('active');
                
                // Показываем соответствующую вкладку
                const tabId = btn.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    },
    
    // Инициализация форм добавления
    initForms() {
        // Форма добавления руководителя
        const addLeaderForm = document.getElementById('add-leader-form');
        if (addLeaderForm) {
            addLeaderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewLeader();
            });
        }
        
        // Форма добавления региона
        const addRegionForm = document.getElementById('add-region-form');
        if (addRegionForm) {
            addRegionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewRegion();
            });
        }
    },
    
    // Добавление нового руководителя
    addNewLeader() {
        const nameInput = document.getElementById('leader-name');
        const positionInput = document.getElementById('leader-position');
        const descriptionInput = document.getElementById('leader-description');
        const photoInput = document.getElementById('leader-photo');
        
        if (!nameInput || !positionInput) return;
        
        const newLeader = {
            id: Date.now(), // Используем timestamp как уникальный ID
            name: nameInput.value.trim(),
            position: positionInput.value.trim(),
            description: descriptionInput ? descriptionInput.value.trim() : '',
            photo: photoInput && photoInput.value.trim() ? 
                   photoInput.value.trim() : 
                   'https://via.placeholder.com/300x200/95a5a6/ffffff?text=Фото'
        };
        
        // Проверяем заполненность обязательных полей
        if (!newLeader.name || !newLeader.position) {
            alert('Пожалуйста, заполните обязательные поля: ФИО и Должность');
            return;
        }
        
        // Добавляем руководителя в данные
        this.data.leaders.push(newLeader);
        
        // Сохраняем данные
        this.saveData();
        
        // Обновляем отображение
        this.renderLeaders();
        this.renderAdminLists();
        
        // Очищаем форму
        nameInput.value = '';
        positionInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        if (photoInput) photoInput.value = '';
        
        alert('Руководитель успешно добавлен!');
    },
    
    // Добавление нового региона
    addNewRegion() {
        const regionInput = document.getElementById('region-name');
        const representativeInput = document.getElementById('region-representative');
        const phoneInput = document.getElementById('region-phone');
        const emailInput = document.getElementById('region-email');
        
        if (!regionInput || !representativeInput) return;
        
        const newRegion = {
            id: Date.now(), // Используем timestamp как уникальный ID
            region: regionInput.value.trim(),
            representative: representativeInput.value.trim(),
            phone: phoneInput ? phoneInput.value.trim() : '',
            email: emailInput ? emailInput.value.trim() : ''
        };
        
        // Проверяем заполненность обязательных полей
        if (!newRegion.region || !newRegion.representative) {
            alert('Пожалуйста, заполните обязательные поля: Регион и Представитель');
            return;
        }
        
        // Добавляем регион в данные
        this.data.regions.push(newRegion);
        
        // Сохраняем данные
        this.saveData();
        
        // Обновляем отображение
        this.renderRegions();
        this.renderAdminLists();
        
        // Очищаем форму
        regionInput.value = '';
        representativeInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (emailInput) emailInput.value = '';
        
        alert('Региональный представитель успешно добавлен!');
    },
    
    // Отображение списков в админ-панели
    renderAdminLists() {
        this.renderAdminLeadersList();
        this.renderAdminRegionsList();
    },
    
    // Отображение списка руководителей в админ-панели
    renderAdminLeadersList() {
        const listContainer = document.getElementById('admin-leaders-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        if (this.data.leaders.length === 0) {
            listContainer.innerHTML = '<p class="empty-list">Нет добавленных руководителей</p>';
            return;
        }
        
        this.data.leaders.forEach(leader => {
            const item = document.createElement('div');
            item.className = 'admin-list-item';
            item.dataset.id = leader.id;
            
            item.innerHTML = `
                <div class="admin-list-item-content">
                    <strong>${leader.name}</strong>
                    <span>${leader.position}</span>
                </div>
                <button class="delete-btn" data-type="leader" data-id="${leader.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            listContainer.appendChild(item);
        });
        
        // Добавляем обработчики для кнопок удаления
        this.initDeleteButtons();
    },
    
    // Отображение списка регионов в админ-панели
    renderAdminRegionsList() {
        const listContainer = document.getElementById('admin-regions-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        if (this.data.regions.length === 0) {
            listContainer.innerHTML = '<p class="empty-list">Нет добавленных регионов</p>';
            return;
        }
        
        this.data.regions.forEach(region => {
            const item = document.createElement('div');
            item.className = 'admin-list-item';
            item.dataset.id = region.id;
            
            item.innerHTML = `
                <div class="admin-list-item-content">
                    <strong>${region.region}</strong>
                    <span>${region.representative}</span>
                </div>
                <button class="delete-btn" data-type="region" data-id="${region.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            listContainer.appendChild(item);
        });
        
        // Добавляем обработчики для кнопок удаления
        this.initDeleteButtons();
    },
    
    // Инициализация кнопок удаления
    initDeleteButtons() {
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.getAttribute('data-type');
                const id = parseInt(btn.getAttribute('data-id'));
                
                if (confirm('Вы уверены, что хотите удалить эту запись?')) {
                    this.deleteItem(type, id);
                }
                
                e.stopPropagation();
            });
        });
    },
    
    // Удаление элемента
    deleteItem(type, id) {
        if (type === 'leader') {
            this.data.leaders = this.data.leaders.filter(leader => leader.id !== id);
        } else if (type === 'region') {
            this.data.regions = this.data.regions.filter(region => region.id !== id);
        }
        
        // Сохраняем изменения
        this.saveData();
        
        // Обновляем отображение
        if (type === 'leader') {
            this.renderLeaders();
            this.renderAdminLeadersList();
        } else if (type === 'region') {
            this.renderRegions();
            this.renderAdminRegionsList();
        }
        
        console.log(`Deleted ${type} with id ${id}`);
    },
    
    /**
     * УТИЛИТЫ
     */
    
    // Сброс данных к значениям по умолчанию
    resetData() {
        if (confirm('ВНИМАНИЕ! Все ваши данные будут удалены и заменены на значения по умолчанию. Продолжить?')) {
            this.data = JSON.parse(JSON.stringify(this.defaultData));
            this.saveData();
            
            // Обновляем отображение
            this.renderLeaders();
            this.renderRegions();
            this.renderAdminLists();
            
            alert('Данные сброшены к значениям по умолчанию!');
        }
    },
    
    // Экспорт данных в JSON файл
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'commission_data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },
    
    // Импорт данных из JSON файла
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Простая проверка структуры данных
                if (importedData.leaders && importedData.regions) {
                    if (confirm('Заменить текущие данные импортированными?')) {
                        this.data = importedData;
                        this.saveData();
                        
                        // Обновляем отображение
                        this.renderLeaders();
                        this.renderRegions();
                        this.renderAdminLists();
                        
                        alert('Данные успешно импортированы!');
                    }
                } else {
                    alert('Ошибка: файл имеет неправильную структуру данных.');
                }
            } catch (error) {
                alert('Ошибка при чтении файла: ' + error.message);
            }
        };
        
        reader.readAsText(file);
        
        // Сброс input для возможности повторной загрузки того же файла
        event.target.value = '';
    }
};

/**
 * ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
 */
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем наше приложение
    CommissionApp.init();
    
    // Добавляем кнопку сброса данных (для разработки)
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Сброс данных';
    resetBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 10px 15px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1001;
    `;
    resetBtn.addEventListener('click', () => {
        CommissionApp.resetData();
    });
    
    document.body.appendChild(resetBtn);
    
    // Добавляем кнопку экспорта данных
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Экспорт данных';
    exportBtn.style.cssText = `
        position: fixed;
        bottom: 60px;
        left: 20px;
        padding: 10px 15px;
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1001;
    `;
    exportBtn.addEventListener('click', () => {
        CommissionApp.exportData();
    });
    
    document.body.appendChild(exportBtn);
    
    // Добавляем input для импорта данных
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 20px;
        padding: 10px 15px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1001;
        width: 180px;
    `;
    importInput.addEventListener('change', (e) => {
        CommissionApp.importData(e);
    });
    
    // Создаем красивую кнопку для импорта
    const importBtn = document.createElement('button');
    importBtn.textContent = 'Импорт данных';
    importBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 20px;
        padding: 10px 15px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1001;
        width: 180px;
    `;
    importBtn.addEventListener('click', () => {
        importInput.click();
    });
    
    document.body.appendChild(importBtn);
    document.body.appendChild(importInput);
    importInput.style.display = 'none';
});

/**
 * ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML
 */
// Функция для переключения админ-панели (вызывается из HTML)
function toggleAdminPanel() {
    CommissionApp.toggleAdminPanel();
}
