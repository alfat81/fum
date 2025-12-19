document.addEventListener('DOMContentLoaded', function() {
    // Данные о регионах (в реальной версии загружаются из файла)
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
            "name": "Нижний Новгород",
            "contact_person": "Алексей Фатьянов",
            "phone": "",
            "email": "",
            "position": "Заместитель Председателя",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/6da/yfchzqsfi7av4bnnge9r5jug1z357601/Алексей%20Фатьянов.jpg",
            "notes": "Человек неравнодушный к развитию дисциплины не только у себя в регионе, но и во всей страны. Нижегородская область - одна из немногих территорий, где активно подхватили задачу по популяризации мотоджимханы."
        },
        "vologda": {
            "name": "Вологодская область",
            "contact_person": "Наталия Недайводина",
            "phone": "",
            "email": "",
            "position": "Главный секретарь",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/8d7/0rdvpnrfz1wmxswvgbiiy972fk2czmsv/Наталия%20Недайводина.jpg",
            "notes": "Наталья - человек увлечённый и активный - успешно развивает мотоджимхану в своем регионе."
        },
        "smolensk": {
            "name": "Смоленская область",
            "contact_person": "Глеб Симдянкин",
            "phone": "",
            "email": "",
            "position": "Член Комиссии",
            "photo_url": "https://www.mfr.ru/upload/medialibrary/0f6/kcmcx7epsjpld77hth8mgvvo8dyxnz3c/Глеб%20Симдянкин.jpg",
            "notes": "Вклад Глеба в развитие официальных соревнований колоссален. Именно он и его команда одними из первых включились в проведение Кубка России."
        },
        "moscow": {
            "name": "Москва",
            "contact_person": "",
            "phone": "",
            "email": "dzhimhana@mfr-ro.ru",
            "position": "",
            "photo_url": "",
            "notes": "Центральный офис комиссии по фигурному управлению мотоциклом"
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
            highlightRegion('central');
            document.getElementById('region-selector').value = '';
        }, 300);
    }
    
    // Выделить регион на карте
    function highlightRegion(regionId) {
        // Сбросить все выделения
        document.querySelectorAll('.region').forEach(region => {
            region.style.fill = '#e0e7ff';
            region.style.strokeWidth = '2';
            region.style.filter = 'none';
        });
        
        // Найти и выделить выбранный регион
        const selectedRegion = document.querySelector(`.region[data-region="${regionId}"]`);
        if (selectedRegion) {
            selectedRegion.style.fill = '#ffd700';
            selectedRegion.style.stroke = '#ff0000';
            selectedRegion.style.strokeWidth = '3';
            selectedRegion.style.filter = 'drop-shadow(0 0 5px rgba(255,0,0,0.5))';
        }
    }
    
    // Сбросить выделение регионов
    function resetRegionHighlight() {
        document.querySelectorAll('.region').forEach(region => {
            region.style.fill = '#e0e7ff';
            region.style.stroke = '#0078d7';
            region.style.strokeWidth = '2';
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
        
        // Для демонстрации показываем информацию о Тверской области
        if (regionId === 'central') {
            regionName.textContent = 'Центральный федеральный округ';
            regionContact.textContent = 'В ЦФО расположены несколько ключевых регионов развития мотоджимханы, включая Тверскую область (председатель комиссии), Московскую область и Смоленскую область.';
            regionPhoto.innerHTML = '<i class="fas fa-map-marker-alt" style="font-size: 2rem; color: #0078D7;"></i>';
        } else if (regionInfo) {
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
        } else {
            regionName.textContent = 'Регион не найден';
            regionContact.textContent = 'Информация о данном регионе отсутствует в базе данных';
            regionPhoto.innerHTML = '?';
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
