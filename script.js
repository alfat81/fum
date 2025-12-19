document.addEventListener('DOMContentLoaded', function() {
    // Russia map functionality
    const regions = document.querySelectorAll('.region');
    const regionName = document.getElementById('region-name');
    const regionContact = document.getElementById('region-contact');
    
    const regionalRepresentatives = {
        'moscow': {
            'name': 'Московская комиссия ФУМ',
            'contact': 'Александр Петров, +7 (903) 123-45-67, moscow-fum@mfr.ru',
            'photo': 'moscow_rep.jpg'
        },
        'tver': {
            'name': 'Тверская комиссия ФУМ',
            'contact': 'Дмитрий Серов, +7 (977) 823-63-90, serovdima@list.ru',
            'photo': 'dmitry_serov.jpg'
        },
        'nnovgorod': {
            'name': 'Нижегородская комиссия ФУМ',
            'contact': 'Алексей Фатьянов, +7 (905) 234-56-78, fatyanov@mfr-nnov.ru',
            'photo': 'alexey_fatyanov.jpg'
        },
        'smolensk': {
            'name': 'Смоленская комиссия ФУМ',
            'contact': 'Глеб Симдянкин, +7 (910) 345-67-89, smolensk-fum@mfr.ru',
            'photo': 'gleb_simdyankin.jpg'
        },
        'vologda': {
            'name': 'Вологодская комиссия ФУМ',
            'contact': 'Наталия Недайводина, +7 (911) 456-78-90, vologda-fum@mfr.ru',
            'photo': 'natalya_nedaivodina.jpg'
        },
        'ulyanovsk': {
            'name': 'Ульяновская комиссия ФУМ',
            'contact': 'Андрей Сальников, +7 (923) 567-89-01, ul-fum@mfr.ru',
            'photo': 'andrey_salnikov.jpg'
        },
        'tatarstan': {
            'name': 'Татарстан комиссия ФУМ',
            'contact': 'Ильшат Сафаров, +7 (934) 678-90-12, tatarstan-fum@mfr.ru',
            'photo': 'ilshat_safarov.jpg'
        },
        'kaluga': {
            'name': 'Калужская комиссия ФУМ',
            'contact': 'Максим Гаранин, +7 (945) 789-01-23, kaluga-fum@mfr.ru',
            'photo': 'maxim_garanin.jpg'
        },
        'tula': {
            'name': 'Тульская комиссия ФУМ',
            'contact': 'Александр Акимов, +7 (956) 890-12-34, tula-fum@mfr.ru',
            'photo': 'alexander_akimov.jpg'
        },
        'rostov': {
            'name': 'Ростовская комиссия ФУМ',
            'contact': 'Сергей Кузнецов, +7 (967) 901-23-45, rostov-fum@mfr.ru',
            'photo': 'sergey_kuznetsov.jpg'
        },
        'perm': {
            'name': 'Пермская комиссия ФУМ',
            'contact': 'Олег Иванов, +7 (978) 012-34-56, perm-fum@mfr.ru',
            'photo': 'oleg_ivanov.jpg'
        },
        'stpetersburg': {
            'name': 'Петербургская комиссия ФУМ',
            'contact': 'Михаил Соколов, +7 (989) 123-45-67, spb-fum@mfr.ru',
            'photo': 'mihail_sokolov.jpg'
        }
    };
    
    regions.forEach(region => {
        region.addEventListener('mouseenter', function() {
            const regionId = this.dataset.region;
            
            if (regionalRepresentatives[regionId]) {
                regionName.textContent = regionalRepresentatives[regionId].name;
                regionContact.textContent = regionalRepresentatives[regionId].contact;
                document.querySelector('.region-photo-placeholder').innerHTML = regionalRepresentatives[regionId].name.split(' ')[0][0] + regionalRepresentatives[regionId].name.split(' ')[1][0];
            }
        });
        
        region.addEventListener('mouseleave', function() {
            regionName.textContent = 'Выберите регион на карте';
            regionContact.textContent = 'Информация о региональном представителе появится здесь';
            document.querySelector('.region-photo-placeholder').innerHTML = '?';
        });
    });
    
    // Position regions on the map
    function positionRegions() {
        const map = document.querySelector('.russia-map');
        const mapRect = map.getBoundingClientRect();
        
        regions.forEach(region => {
            const coords = region.dataset.coords.split(',');
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            
            // Simple projection for Russia map
            const x = (lng + 10) / 90 * mapRect.width;
            const y = (70 - lat) / 50 * mapRect.height;
            
            region.style.left = `${x}px`;
            region.style.top = `${y}px`;
        });
    }
    
    positionRegions();
    window.addEventListener('resize', positionRegions);
    
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
