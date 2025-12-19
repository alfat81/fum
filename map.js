document.addEventListener('DOMContentLoaded', function() {
    // Данные о регионах
    let regionData = {
        "tver": {
            "name": "Тверская область",
            "contact_person": "Дмитрий Серов",
            "phone": "+7 (977) 823-63-90",
            "email": "serovdima@list.ru",
            "position": "Председатель Комиссии",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/d59/vikt2s29rmx9a40mhz64l1i71tfpayy5/Дмитрий%20Серов.jpg",
            "notes": "За два года руководства Дмитрий доказал свои профессиональные компетенции и преданность делу. Благодаря Дмитрию и с его непосредственным участием проведён не только ряд федеральных мероприятий - кроме этого состоялись официальные соревнования в Санкт-Петербурге, Тверской, Ленинградской, Смоленской, Нижегородской, Вологодской областях и Пермском крае."
        },
        "nnovgorod": {
            "name": "Нижегородская область",
            "contact_person": "Алексей Фатьянов",
            "phone": "+7 (905) 234-56-78",
            "email": "fatyanov@mfr-nnov.ru",
            "position": "Заместитель Председателя",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/6da/yfchzqsfi7av4bnnge9r5jug1z357601/Алексей%20Фатьянов.jpg",
            "notes": "Человек неравнодушный к развитию дисциплины не только у себя в регионе, но и во всей страны. Нижегородская область - одна из немногих территорий, где активно подхватили задачу по популяризации мотоджимханы."
        },
        "vologda": {
            "name": "Вологодская область",
            "contact_person": "Наталия Недайводина",
            "phone": "+7 (911) 456-78-90",
            "email": "vologda-fum@mfr.ru",
            "position": "Главный секретарь",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/8d7/0rdvpnrfz1wmxswvgbiiy972fk2czmsv/Наталия%20Недайводина.jpg",
            "notes": "Наталья - человек увлечённый и активный - успешно развивает мотоджимхану в своем регионе. Одна из задач Наталии на ближайшие несколько лет - налаживание международного сотрудничества."
        },
        "smolensk": {
            "name": "Смоленская область",
            "contact_person": "Глеб Симдянкин",
            "phone": "+7 (910) 345-67-89",
            "email": "smolensk-fum@mfr.ru",
            "position": "Член Комиссии",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/0f6/kcmcx7epsjpld77hth8mgvvo8dyxnz3c/Глеб%20Симдянкин.jpg",
            "notes": "Вклад Глеба в развитие официальных соревнований колоссален. Именно он и его команда одними из первых включились в проведение Кубка России и сделали это первоклассно."
        },
        "ulyanovsk": {
            "name": "Ульяновская область",
            "contact_person": "Андрей Сальников",
            "phone": "+7 (923) 567-89-01",
            "email": "ul-fum@mfr.ru",
            "position": "Член Комиссии",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/6d9/708xnufz29dsshu5v28zgc9gg4ovxslk/Андрей%20сальников.jpg",
            "notes": "Это человек, который внёс значительный вклад в историю официальной мотоджимханы. Именно ульяновские организаторы первыми в стране начали проводить официальные соревнования, и именно ульяновские спортсмены первыми получили спортивные разряды."
        },
        "tatarstan": {
            "name": "Республика Татарстан",
            "contact_person": "Ильшат Сафаров",
            "phone": "+7 (934) 678-90-12",
            "email": "tatarstan-fum@mfr.ru",
            "position": "Член Комиссии",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/19c/b6ypbb11ifgi8m28811rm4gcnt1en62u/Ильшат%20Сафаров.jpg",
            "notes": "Ильшат с командой увлечённых мотоджимханой делают в своем регионе акцент на детских тренировках и соревнованиях. Комиссия будет перенимать и транслировать их опыт на федеральном уровне."
        },
        "kaluga": {
            "name": "Калужская область",
            "contact_person": "Максим Гаранин",
            "phone": "+7 (945) 789-01-23",
            "email": "kaluga-fum@mfr.ru",
            "position": "Член Комиссии",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/026/exok2huzhglr5cqq0sxw8ihh0g1astay/Максим%20Гаранин.jpg",
            "notes": "Максим так же ставит в приоритеты развития мотоджимханы страны детские тренировки и соревнования. Совместно с Ильшатом Сафаровым ему предстоит проделать большую и, безусловно, полезную работу по этому направлению."
        },
        "tula": {
            "name": "Тульская область",
            "contact_person": "Александр Акимов",
            "phone": "+7 (956) 890-12-34",
            "email": "tula-fum@mfr.ru",
            "position": "Член Комиссии",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/fb8/06x31ifws29zsbvd2zqrfk5a62jmzm3m/Александр%20Акимов.jpg",
            "notes": "Представитель мотоджимханы из Тульской области."
        },
        "moscow": {
            "name": "Москва",
            "contact_person": "Александр Ципилев",
            "phone": "",
            "email": "moscow-fum@mfr.ru",
            "position": "Представитель МОО \"Федерация Мотоджимханы\"",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/634/sbtc12d30f4y68i0ndmc2pxz415mx9dd/Александр%20Ципилев.jpg",
            "notes": "Представитель МОО \"Федерация Мотоджимханы\"."
        }
    };
    
    // Инициализация карты
    function initMap() {
        console.log('Инициализация SVG карты России');
        
        // Обработчики событий для регионов на карте
        document.querySelectorAll('.region').forEach(region => {
            region.addEventListener('mouseenter', function() {
                const regionId = this.dataset.region;
                highlightRegion(regionId);
                showRegionInfo(regionId);
            });
            
            region.addEventListener('mouseleave', function() {
                resetRegionHighlight();
                hideRegionInfo();
            });
            
            region.addEventListener('click', function() {
                const regionId = this.dataset.region;
                highlightRegion(regionId);
                showRegionInfo(regionId);
                
                // Выбрать регион в выпадающем меню
                document.getElementById('region-selector').value = regionId;
            });
        });
        
        // Обработчик выбора региона из выпадающего меню
        document.getElementById('region-selector').addEventListener('change', function() {
            const regionId = this.value;
            if (regionId) {
                highlightRegion(regionId);
                showRegionInfo(regionId);
                
                // Скролл к карте
                document.querySelector('.russia-svg-map-container').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                resetRegionHighlight();
                hideRegionInfo();
            }
        });
        
        // Обработчик клика вне подсказки для ее скрытия
        document.addEventListener('click', function(e) {
            const tooltip = document.getElementById('region-tooltip');
            const regionSelector = document.getElementById('region-selector');
            
            if (tooltip.style.display === 'block' && 
                !tooltip.contains(e.target) && 
                e.target !== regionSelector && 
                !regionSelector.contains(e.target) &&
                !e.target.closest('.region')) {
                hideRegionInfo();
                resetRegionHighlight();
                document.getElementById('region-selector').value = '';
            }
        });
        
        // Инициализация с подсветкой Тверской области
        setTimeout(() => {
            highlightRegion('tver');
            showRegionInfo('tver');
            document.getElementById('region-selector').value = 'tver';
        }, 500);
    }
    
    // Выделить регион на карте
    function highlightRegion(regionId) {
        // Сбросить все выделения
        document.querySelectorAll('.region').forEach(region => {
            region.style.fill = '#e0e7ff';
            region.style.strokeWidth = '1';
            region.style.filter = 'none';
        });
        
        // Найти и выделить выбранный регион
        const selectedRegion = document.querySelector(`.region[data-region="${regionId}"]`);
        if (selectedRegion) {
            selectedRegion.style.fill = '#ffd700';
            selectedRegion.style.stroke = '#ff0000';
            selectedRegion.style.strokeWidth = '2';
            selectedRegion.style.filter = 'drop-shadow(0 0 5px rgba(255,0,0,0.5))';
        }
    }
    
    // Сбросить выделение регионов
    function resetRegionHighlight() {
        document.querySelectorAll('.region').forEach(region => {
            region.style.fill = '#e0e7ff';
            region.style.stroke = '#0078d7';
            region.style.strokeWidth = '1';
            region.style.filter = 'none';
        });
    }
    
    // Показать информацию о регионе
    function showRegionInfo(regionId) {
        const tooltip = document.getElementById('region-tooltip');
        const regionName = document.getElementById('tooltip-region-name');
        const regionContact = document.getElementById('tooltip-region-contact');
        const regionPhoto = document.getElementById('tooltip-region-photo');
        
        // Получаем данные о регионе
        const regionInfo = regionData[regionId] || {
            name: document.querySelector(`#region-selector option[value="${regionId}"]`).textContent,
            contact: 'Контактная информация пока не добавлена',
            photo: null
        };
        
        // Заполняем информацию
        regionName.textContent = regionInfo.name;
        regionContact.innerHTML = `
            <strong>${regionInfo.contact_person}</strong><br>
            Должность: ${regionInfo.position}<br>
            Телефон: ${regionInfo.phone || 'не указан'}<br>
            Email: ${regionInfo.email || 'не указан'}
        `;
        
        // Устанавливаем фото
        if (regionInfo.photo_url) {
            regionPhoto.innerHTML = `<img src="${regionInfo.photo_url}" alt="${regionInfo.name}">`;
        } else {
            // Генерируем инициалы для фото
            const initials = regionInfo.contact_person ? regionInfo.contact_person.split(' ').map(word => word[0]).join('') : '?';
            regionPhoto.innerHTML = initials;
        }
        
        // Показываем подсказку
        tooltip.style.display = 'block';
        
        // Позиционируем подсказку
        const mapContainer = document.querySelector('.russia-svg-map-container');
        const mapRect = mapContainer.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Позиционируем подсказку справа от карты
        tooltip.style.left = `${mapRect.right + 20}px`;
        tooltip.style.top = `${mapRect.top + (mapRect.height / 2) - (tooltipRect.height / 2)}px`;
    }
    
    // Скрыть информацию о регионе
    function hideRegionInfo() {
        document.getElementById('region-tooltip').style.display = 'none';
    }
    
    // Инициализация карты при загрузке страницы
    initMap();
    
    console.log('SVG карта России успешно инициализирована');
});
