document.addEventListener('DOMContentLoaded', function() {
    // Russia map with regions
    function initMap() {
        const mapSvg = document.querySelector('.map-svg');
        const mapContainer = document.querySelector('.russia-map');
        const tooltip = document.getElementById('map-tooltip');
        const resetButton = document.getElementById('reset-map');
        const zoomInButton = document.getElementById('zoom-in');
        const zoomOutButton = document.getElementById('zoom-out');
        
        // Упрощенные данные о регионах (для демонстрации)
        const regionalData = {
            'moscow': {
                'name': 'Москва',
                'contact': 'Александр Петров, +7 (903) 123-45-67, moscow-fum@mfr.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/634/sbtc12d30f4y68i0ndmc2pxz415mx9dd/Александр%20Ципилев.jpg'
            },
            'tver': {
                'name': 'Тверская область',
                'contact': 'Дмитрий Серов, +7 (977) 823-63-90, serovdima@list.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/d59/vikt2s29rmx9a40mhz64l1i71tfpayy5/Дмитрий%20Серов.jpg'
            },
            'nnovgorod': {
                'name': 'Нижегородская область',
                'contact': 'Алексей Фатьянов, +7 (905) 234-56-78, fatyanov@mfr-nnov.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/6da/yfchzqsfi7av4bnnge9r5jug1z357601/Алексей%20Фатьянов.jpg'
            },
            'smolensk': {
                'name': 'Смоленская область',
                'contact': 'Глеб Симдянкин, +7 (910) 345-67-89, smolensk-fum@mfr.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/0f6/kcmcx7epsjpld77hth8mgvvo8dyxnz3c/Глеб%20Симдянкин.jpg'
            },
            'vologda': {
                'name': 'Вологодская область',
                'contact': 'Наталия Недайводина, +7 (911) 456-78-90, vologda-fum@mfr.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/8d7/0rdvpnrfz1wmxswvgbiiy972fk2czmsv/Наталия%20Недайводина.jpg'
            },
            'ulyanovsk': {
                'name': 'Ульяновская область',
                'contact': 'Андрей Сальников, +7 (923) 567-89-01, ul-fum@mfr.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/6d9/708xnufz29dsshu5v28zgc9gg4ovxslk/Андрей%20сальников.jpg'
            },
            'tatarstan': {
                'name': 'Республика Татарстан',
                'contact': 'Ильшат Сафаров, +7 (934) 678-90-12, tatarstan-fum@mfr.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/19c/b6ypbb11ifgi8m28811rm4gcnt1en62u/Ильшат%20Сафаров.jpg'
            },
            'kaluga': {
                'name': 'Калужская область',
                'contact': 'Максим Гаранин, +7 (945) 789-01-23, kaluga-fum@mfr.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/026/exok2huzhglr5cqq0sxw8ihh0g1astay/Максим%20Гаранин.jpg'
            },
            'tula': {
                'name': 'Тульская область',
                'contact': 'Александр Акимов, +7 (956) 890-12-34, tula-fum@mfr.ru',
                'photo': 'https://www.mfr.ru/upload/medialibrary/fb8/06x31ifws29zsbvd2zqrfk5a62jmzm3m/Александр%20Акимов.jpg'
            }
            // Другие регионы можно добавить по аналогии
        };
        
        // Создаем SVG paths для регионов (упрощенные контуры)
        Object.keys(regionalData).forEach(regionId => {
            const region = regionalData[regionId];
            
            // Создаем путь с упрощенными координатами для демонстрации
            // В реальном проекте нужно использовать точные координаты контуров регионов России
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', `region-path ${regionId}`);
            path.setAttribute('data-region', regionId);
            path.setAttribute('data-name', region.name);
            
            // Упрощенные координаты для демонстрации (в реальном проекте использовать точные данные)
            let dAttribute = '';
            if (regionId === 'moscow') dAttribute = 'M200,150 L250,130 L280,160 L260,200 L220,210 Z';
            else if (regionId === 'tver') dAttribute = 'M150,100 L180,80 L210,110 L190,140 L160,150 Z';
            else if (regionId === 'nnovgorod') dAttribute = 'M300,200 L350,180 L380,210 L360,250 L320,260 Z';
            else if (regionId === 'smolensk') dAttribute = 'M250,250 L280,230 L310,260 L290,300 L260,310 Z';
            else if (regionId === 'vologda') dAttribute = 'M350,100 L380,80 L410,110 L390,140 L360,150 Z';
            else if (regionId === 'ulyanovsk') dAttribute = 'M400,300 L450,280 L480,310 L460,350 L420,360 Z';
            else if (regionId === 'tatarstan') dAttribute = 'M500,350 L550,330 L580,360 L560,400 L520,410 Z';
            else if (regionId === 'kaluga') dAttribute = 'M220,300 L250,280 L280,310 L260,350 L230,360 Z';
            else if (regionId === 'tula') dAttribute = 'M270,350 L300,330 L330,360 L310,400 L280,410 Z';
            else dAttribute = `M${Math.random()*800+100},${Math.random()*400+100} L${Math.random()*800+100},${Math.random()*400+100} L${Math.random()*800+100},${Math.random()*400+100} L${Math.random()*800+100},${Math.random()*400+100} Z`;
            
            path.setAttribute('d', dAttribute);
            mapSvg.appendChild(path);
            
            // Добавляем обработчики событий
            path.addEventListener('mouseenter', function(e) {
                showTooltip(e, regionId, region);
            });
            
            path.addEventListener('mouseleave', function() {
                hideTooltip();
            });
            
            path.addEventListener('click', function() {
                setActiveRegion(regionId);
            });
        });
        
        // Функция показа подсказки
        function showTooltip(event, regionId, region) {
            const rect = mapContainer.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            document.getElementById('tooltip-region-name').textContent = region.name;
            document.getElementById('tooltip-region-contact').textContent = region.contact;
            
            // Устанавливаем фото регионального представителя
            const tooltipPhoto = document.getElementById('tooltip-photo');
            if (region.photo) {
                tooltipPhoto.innerHTML = `<img src="${region.photo}" alt="${region.name}">`;
            } else {
                tooltipPhoto.innerHTML = region.name.split(' ')[0].charAt(0) + (region.name.split(' ')[1] ? region.name.split(' ')[1].charAt(0) : '');
            }
            
            // Позиционируем подсказку
            tooltip.style.left = `${x + 20}px`;
            tooltip.style.top = `${y + 20}px`;
            tooltip.style.display = 'block';
        }
        
        // Функция скрытия подсказки
        function hideTooltip() {
            tooltip.style.display = 'none';
        }
        
        // Функция установки активного региона
        function setActiveRegion(regionId) {
            // Убираем активный класс у всех регионов
            document.querySelectorAll('.region-path').forEach(path => {
                path.classList.remove('active');
            });
            
            // Добавляем активный класс к выбранному региону
            const activeRegion = document.querySelector(`.region-path.${regionId}`);
            if (activeRegion) {
                activeRegion.classList.add('active');
            }
        }
        
        // Обработчик сброса карты
        resetButton.addEventListener('click', function() {
            document.querySelectorAll('.region-path').forEach(path => {
                path.classList.remove('active');
            });
            hideTooltip();
        });
        
        // Обработчики зума
        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        
        zoomInButton.addEventListener('click', function() {
            if (scale < 3) {
                scale += 0.5;
                updateMapTransform();
            }
        });
        
        zoomOutButton.addEventListener('click', function() {
            if (scale > 0.5) {
                scale -= 0.5;
                updateMapTransform();
            }
        });
        
        function updateMapTransform() {
            mapSvg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            mapSvg.style.transformOrigin = 'center';
        }
        
        // Перетаскивание карты
        let isDragging = false;
        let startX, startY;
        
        mapContainer.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'path') return; // Не перетаскиваем, если нажато на регион
            
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            mapContainer.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateMapTransform();
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                mapContainer.style.cursor = 'grab';
            }
        });
        
        mapContainer.addEventListener('mouseleave', function() {
            if (isDragging) {
                isDragging = false;
                mapContainer.style.cursor = 'grab';
            }
        });
        
        // Инициализация курсора
        mapContainer.style.cursor = 'grab';
    }
    
    // Инициализация карты при загрузке страницы
    if (document.querySelector('.russia-map')) {
        initMap();
    }
    
    // Calendar functionality
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    function renderCalendar(month, year) {
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                          "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();
        
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDay = document.createElement('div');
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        const competitions = getCompetitionsForMonth(month);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `<div class="calendar-day-number">${day}</div>`;
            
            // Check if there are competitions on this day
            const dayCompetitions = competitions.filter(comp => comp.day === day);
            if (dayCompetitions.length > 0) {
                dayElement.classList.add('has-event');
                dayElement.dataset.competitions = JSON.stringify(dayCompetitions);
                
                dayElement.addEventListener('mouseenter', showCompetitionTooltip);
                dayElement.addEventListener('mouseleave', hideCompetitionTooltip);
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function getCompetitionsForMonth(month) {
        // This would normally come from a database or API
        const allCompetitions = [
            { day: 12, month: 4, title: "2 этап Кубка России", location: "Смоленск", description: "Официальные соревнования по фигурному управлению мотоциклом", contact: "Глеб Симдянкин, +7 (910) 345-67-89" },
            { day: 20, month: 4, title: "Кубок Москвы", location: "Москва", description: "Открытые соревнования по фигурному управлению мотоциклом", contact: "Александр Петров, +7 (903) 123-45-67" },
            { day: 15, month: 6, title: "Чемпионат России", location: "Тверь", description: "Главное соревнование сезона по фигурному управлению мотоциклом", contact: "Дмитрий Серов, +7 (977) 823-63-90" },
            { day: 5, month: 8, title: "Женский Кубок МФР", location: "Нижний Новгород", description: "Соревнования для женщин по фигурному управлению мотоциклом", contact: "Алексей Фатьянов, +7 (905) 234-56-78" },
            { day: 12, month: 9, title: "Кубок юниоров", location: "Вологда", description: "Соревнования для юниоров по фигурному управлению мотоциклом", contact: "Наталия Недайводина, +7 (911) 456-78-90" }
        ];
        
        return allCompetitions.filter(comp => comp.month === month);
    }
    
    function showCompetitionTooltip(e) {
        const tooltip = document.getElementById('competition-tooltip');
        const competitions = JSON.parse(this.dataset.competitions);
        const rect = this.getBoundingClientRect();
        
        if (competitions.length > 0) {
            document.getElementById('tooltip-title').textContent = competitions[0].title;
            document.getElementById('tooltip-date').textContent = `Дата: ${competitions[0].day} ${getMonthName(currentMonth)}`;
            document.getElementById('tooltip-location').textContent = `Место: ${competitions[0].location}`;
            document.getElementById('tooltip-description').textContent = competitions[0].description;
            document.getElementById('tooltip-contact').textContent = `Контакты: ${competitions[0].contact}`;
            
            tooltip.style.left = `${rect.left + window.scrollX - 100}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
            tooltip.style.display = 'block';
        }
    }
    
    function hideCompetitionTooltip() {
        document.getElementById('competition-tooltip').style.display = 'none';
    }
    
    function getMonthName(monthIndex) {
        const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", 
                          "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        return monthNames[monthIndex];
    }
    
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
    
    // Initial calendar render (if calendar page is loaded)
    if (document.getElementById('calendar-grid')) {
        renderCalendar(currentMonth, currentYear);
    }
    
    // Document filtering
    const filterButtons = document.querySelectorAll('.filter-button');
    const documentCards = document.querySelectorAll('.document-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                
                // Filter documents
                documentCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Document viewer
    const viewer = document.getElementById('document-viewer');
    const iframe = document.getElementById('document-iframe');
    const closeBtn = document.getElementById('close-viewer');
    
    if (document.querySelectorAll('.view-button').length > 0) {
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.document-card');
                const title = card.querySelector('h4').textContent;
                document.getElementById('viewer-title').textContent = title;
                iframe.src = 'https://docs.google.com/gview?url=https://example.com/sample-document.pdf&embedded=true';
                viewer.style.display = 'flex';
            });
        });
        
        closeBtn.addEventListener('click', function() {
            viewer.style.display = 'none';
            iframe.src = '';
        });
        
        // Close viewer when clicking outside
        viewer.addEventListener('click', function(e) {
            if (e.target === viewer) {
                viewer.style.display = 'none';
                iframe.src = '';
            }
        });
    }
    
    // Partners carousel
    const carouselTrack = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (carouselTrack) {
        let slidePosition = 0;
        const slideCount = carouselTrack.children.length;
        const visibleSlides = Math.floor(carouselTrack.offsetWidth / 450);
        const maxPosition = -(slideCount - visibleSlides);
        
        nextBtn.addEventListener('click', function() {
            if (slidePosition > maxPosition) {
                slidePosition--;
                carouselTrack.style.transform = `translateX(${slidePosition * 450}px)`;
            }
        });
        
        prevBtn.addEventListener('click', function() {
            if (slidePosition < 0) {
                slidePosition++;
                carouselTrack.style.transform = `translateX(${slidePosition * 450}px)`;
            }
        });
    }
    
    // Initialize animations
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
    
    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Style the back to top button
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--blue);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
    `;

    backToTopButton.style.opacity = '0';
    backToTopButton.style.transform = 'scale(0.8)';

    document.querySelector('.back-to-top').addEventListener('click', function() {
        this.classList.remove('show');
    });
    
    console.log('Сайт комиссии по мотоджимхане МФР загружен');
});

// Запись в историю: при любых изменениях или добавлениях необходимо присылать файлы целиком
console.log('ИСТОРИЯ: При любых изменениях или добавлениях необходимо присылать файлы целиком');
