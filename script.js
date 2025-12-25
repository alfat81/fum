document.addEventListener('DOMContentLoaded', function() {
    // ... предыдущий код остается без изменений ...
    
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
    renderLeadershipCards();
    
    // ... остальной код остается без изменений ...
});
