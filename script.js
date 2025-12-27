document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт комиссии по мотоджимхане успешно загружен');
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize animations
    initAnimations();
    
    // Initialize calendar if exists
    if (document.querySelector('.calendar-grid')) {
        initCalendar();
    }
    
    // Initialize form submissions
    initForms();
    
    // Initialize social media links
    initSocialLinks();
    
    // Initialize document filters
    initDocumentFilters();
});

// Initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        menuToggle.innerHTML = mobileMenu.style.display === 'block' ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        body.style.overflow = mobileMenu.style.display === 'block' ? 'hidden' : 'auto';
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.mobile-nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.style.display = 'none';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu.style.display === 'block' && 
            !mobileMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            mobileMenu.style.display = 'none';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            body.style.overflow = 'auto';
        }
    });
}

// Initialize animations
function initAnimations() {
    // Fade in elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll(
            '.card, .timeline-item, .leader-card, .news-card, .competition-card, .document-card, .partner-card, ' +
            '.benefit-card, .program-card, .goal-card, .contact-card, .category-card'
        );
        
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
    
    // Set initial transition styles
    const elements = document.querySelectorAll(
        '.card, .timeline-item, .leader-card, .news-card, .competition-card, .document-card, .partner-card, ' +
        '.benefit-card, .program-card, .goal-card, .contact-card, .category-card'
    );
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger animations
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// Initialize calendar
function initCalendar() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!calendarGrid) return;
    
    let currentMonth = 4; // May (0-indexed)
    let currentYear = 2026; // Updated to 2026 based on requirements
    
    // Get competitions data
    const competitions = getCompetitions();
    
    // Initial rendering
    renderCalendar(currentMonth, currentYear, competitions);
    
    // Navigation handlers
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear, competitions);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear, competitions);
        });
    }
    
    // Clear event card when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.calendar-day') && !e.target.closest('.event-card')) {
            clearEventCard();
        }
    });
}

// Get competitions from localStorage or use default data
function getCompetitions() {
    const savedCompetitions = localStorage.getItem('competitionsList');
    if (savedCompetitions) {
        return JSON.parse(savedCompetitions);
    }
    
    // Default competitions data for 2026
    const defaultCompetitions = [
        {
            id: 1,
            date: '2026-04-25',
            name: '1 этап Кубка Тверской области',
            location: 'Тверская область, г. Тверь',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Первый этап Кубка Тверской области по фигурному управлению мотоциклом.',
            category: 'Региональные соревнования',
            ageCategory: '18+',
            startTime: '10:00',
            address: 'Тверская область, г. Тверь, автодром'
        },
        {
            id: 2,
            date: '2026-05-16',
            name: '1 этап Кубка России по ФУМ',
            location: 'Москва',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Первый этап Кубка России по фигурному управлению мотоциклом.',
            category: 'Кубок России',
            ageCategory: '18+',
            startTime: '09:00',
            address: 'г. Москва, автодром "Мячково"'
        },
        {
            id: 3,
            date: '2026-06-06',
            name: 'Межрегиональные соревнования на Игоре Драйв',
            location: 'Ленинградская область',
            contactPerson: 'Алексей Фатьянов',
            contactPhone: '+7 (920) 111-91-77',
            description: 'Межрегиональные соревнования по фигурному управлению мотоциклом на трассе Игора Драйв.',
            category: 'Межрегиональные соревнования',
            ageCategory: '18+',
            startTime: '10:00',
            address: 'Ленинградская область, Игора Драйв'
        },
        {
            id: 4,
            date: '2026-06-07',
            name: '2 этап Кубка России по ФУМ на Игоре Драйв',
            location: 'Ленинградская область',
            contactPerson: 'Алексей Фатьянов',
            contactPhone: '+7 (920) 111-91-77',
            description: 'Второй этап Кубка России по фигурному управлению мотоциклом.',
            category: 'Кубок России',
            ageCategory: '18+',
            startTime: '09:00',
            address: 'Ленинградская область, Игора Драйв'
        },
        {
            id: 5,
            date: '2026-06-13',
            name: 'Мотоджимахна. Дети',
            location: 'Нижний Новгород',
            contactPerson: 'Евгений Кораблев',
            contactPhone: '+7 (904) 060-34-80',
            description: 'Детские соревнования по мотоджимхане для юных спортсменов 8-16 лет. Обучение безопасному вождению мотоциклов.',
            category: 'Детские',
            ageCategory: '8-16 лет',
            startTime: '11:00',
            address: 'Нижний Новгород'
        },
        {
            id: 6,
            date: '2026-06-13',
            name: 'Межрегиональные соревнования в Череповце',
            location: 'Вологодская область, г. Череповец',
            contactPerson: 'Игорь Васильев',
            contactPhone: '+7 (952) 202-44-10',
            description: 'Межрегиональные соревнования по фигурному управлению мотоциклом в г. Череповец. Открытые соревнования для всех регионов Северо-Западного федерального округа.',
            category: 'Межрегиональные соревнования',
            ageCategory: '18+',
            startTime: '10:00',
            address: 'Вологодская область, г. Череповец'
        },
        {
            id: 7,
            date: '2026-06-27',
            name: '3 этап Кубка России',
            location: 'Московская область',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Третий этап Кубка России по фигурному управлению мотоциклом. Соревнования проводятся в соответствии с правилами МФР.',
            category: 'Кубок России',
            ageCategory: '18+',
            startTime: '09:00',
            address: 'Московская область'
        },
        {
            id: 8,
            date: '2026-07-25',
            name: '5 этап Кубка России по ФУМ',
            location: 'Санкт-Петербург',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Пятый этап Кубка России по фигурному управлению мотоциклом. Соревнования проводятся в историческом центре Санкт-Петербурга.',
            category: 'Кубок России',
            ageCategory: '18+',
            startTime: '09:00',
            address: 'Санкт-Петербург'
        },
        {
            id: 9,
            date: '2026-07-26',
            name: 'ПЕРВЕНСТВО МФР. Детские соревнования',
            location: 'Санкт-Петербург',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Официальное первенство МФР по фигурному управлению мотоциклом среди детей и юношей. Соревнования проводятся в возрастных категориях 8-10, 11-13, 14-16 лет.',
            category: 'Детские',
            ageCategory: '8-16 лет',
            startTime: '10:00',
            address: 'Санкт-Петербург'
        },
        {
            id: 10,
            date: '2026-08-29',
            name: '3 этап Кубка Тверской области',
            location: 'Тверская область, г. Тверь',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Третий этап Кубка Тверской области по фигурному управлению мотоциклом. Заключительные соревнования регионального чемпионата.',
            category: 'Региональные соревнования',
            ageCategory: '18+',
            startTime: '10:00',
            address: 'Тверская область, г. Тверь'
        },
        {
            id: 11,
            date: '2026-08-29',
            name: 'Межрегиональные соревнования в Екатеринбурге',
            location: 'Свердловская область, г. Екатеринбург',
            contactPerson: 'Михаил Ефимов',
            contactPhone: '+7 (904) 800-70-00',
            description: 'Межрегиональные соревнования по фигурному управлению мотоциклом в г. Екатеринбург. Открытые соревнования для всех регионов Уральского федерального округа.',
            category: 'Межрегиональные соревнования',
            ageCategory: '18+',
            startTime: '11:00',
            address: 'Свердловская область, г. Екатеринбург'
        },
        {
            id: 12,
            date: '2026-09-12',
            name: '4 этап Кубка Тверской области',
            location: 'Тверская область, г. Тверь',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Четвертый этап Кубка Тверской области по фигурному управлению мотоциклом. Финальные соревнования регионального чемпионата.',
            category: 'Региональные соревнования',
            ageCategory: '18+',
            startTime: '10:00',
            address: 'Тверская область, г. Тверь'
        },
        {
            id: 13,
            date: '2026-09-12',
            name: '7 этап Кубка России',
            location: 'Москва',
            contactPerson: 'Дмитрий Серов',
            contactPhone: '+7 (977) 823-63-90',
            description: 'Седьмой этап Кубка России по фигурному управлению мотоциклом. Предпоследние соревнования в календаре Кубка России.',
            category: 'Кубок России',
            ageCategory: '18+',
            startTime: '09:00',
            address: 'Москва'
        },
        {
            id: 14,
            date: '2026-09-19',
            name: 'Межрегиональные соревнования в Перми',
            location: 'Пермский край, г. Пермь',
            contactPerson: 'Антон Соколов',
            contactPhone: '+7 (904) 800-25-39',
            description: 'Межрегиональные соревнования по фигурному управлению мотоциклом в г. Пермь. Открытые соревнования для всех регионов Приволжского федерального округа.',
            category: 'Межрегиональные соревнования',
            ageCategory: '18+',
            startTime: '10:00',
            address: 'Пермский край, г. Пермь'
        }
    ];
    
    localStorage.setItem('competitionsList', JSON.stringify(defaultCompetitions));
    return defaultCompetitions;
}

// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Format time function
function formatTime(timeString) {
    return timeString;
}

// Render calendar function
function renderCalendar(month, year, competitions) {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    // Month names
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    
    // Day names
    const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    
    // Update current month title
    const currentMonthElement = document.getElementById('current-month');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    }
    
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
                compElement.dataset.id = comp.id;
                
                compElement.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const selectedComp = competitions.find(c => c.id == this.dataset.id);
                    renderEventCard(selectedComp);
                });
                
                competitionsContainer.appendChild(compElement);
            });
            
            dayElement.appendChild(competitionsContainer);
            
            // Add click event to the day element
            dayElement.addEventListener('click', function() {
                if (dayCompetitions.length > 0) {
                    renderEventCard(dayCompetitions[0]);
                }
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Clear event card when clicking on empty days
    document.querySelectorAll('.calendar-day:not(.has-competition)').forEach(day => {
        day.addEventListener('click', clearEventCard);
    });
}

// Render event card
function renderEventCard(competition) {
    if (!competition) return;
    
    const eventCard = document.getElementById('event-card');
    if (!eventCard) return;
    
    eventCard.classList.add('active');
    eventCard.innerHTML = `
        <div class="event-card-header">
            <h3 class="event-title">${competition.name}</h3>
            <div class="event-date">
                <i class="fas fa-calendar-alt"></i> ${formatDate(competition.date)}
            </div>
        </div>
        <div class="event-card-content">
            <div class="event-meta">
                <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${competition.location}</span>
                <span class="event-category">${competition.category}</span>
                <span class="event-age"><i class="fas fa-user-clock"></i> ${competition.ageCategory}</span>
            </div>
            <p class="event-description">${competition.description}</p>
            <div class="event-contact">
                <h4>Контактное лицо:</h4>
                <p><i class="fas fa-user"></i> ${competition.contactPerson}</p>
                <p><i class="fas fa-phone"></i> ${competition.contactPhone}</p>
                <p><i class="fas fa-clock"></i> Начало в ${competition.startTime}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${competition.address}</p>
            </div>
            <a href="#" class="event-register-btn">
                <i class="fas fa-clipboard-list"></i> Зарегистрироваться на соревнование
            </a>
        </div>
        <div class="event-footer">
            <p class="event-footer-text">Для регистрации необходимо иметь действующую спортивную лицензию и медицинскую справку установленного образца.</p>
        </div>
    `;
    
    // Add event listener to register button
    const registerBtn = eventCard.querySelector('.event-register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Регистрация на соревнование будет доступна за месяц до начала мероприятия. Следите за обновлениями на сайте.');
        });
    }
}

// Clear event card
function clearEventCard() {
    const eventCard = document.getElementById('event-card');
    if (!eventCard) return;
    
    eventCard.classList.remove('active');
    eventCard.innerHTML = `
        <div class="event-card-header">
            <h3 class="event-title">Выберите дату соревнования</h3>
        </div>
        <div class="event-card-content">
            <p class="event-description">Нажмите на любую дату в календаре со значком соревнования, чтобы увидеть подробную информацию о мероприятии.</p>
            <div class="event-placeholder">
                <i class="fas fa-calendar-alt"></i>
            </div>
        </div>
    `;
}

// Initialize forms
function initForms() {
    // Partner form submission
    const partnerForm = document.querySelector('.contact-form');
    const submitBtn = document.getElementById('submit-partner-form');
    const messageElement = document.getElementById('form-message');
    
    if (submitBtn && partnerForm) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const companyName = document.getElementById('company-name').value.trim();
            const contactPerson = document.getElementById('contact-person').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const partnerType = document.getElementById('partner-type').value;
            
            // Validate required fields
            if (!companyName || !contactPerson || !phone || !email || !partnerType) {
                showMessage('Пожалуйста, заполните все обязательные поля (*)', 'error');
                return;
            }
            
            // Basic phone validation
            const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(phone.replace(/[^\d+()\-]/g, ''))) {
                showMessage('Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX', 'error');
                return;
            }
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            // Simulate form submission (in real app, this would send data to server)
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            
            setTimeout(() => {
                // Reset form
                partnerForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
                
                showMessage('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            }, 1500);
        });
    }
    
    // Program card buttons
    const programButtons = document.querySelectorAll('.program-cta button');
    programButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Scroll to contact form
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth' });
                
                // Set partner type based on button clicked
                let partnerType = '';
                if (this.classList.contains('btn-primary')) {
                    partnerType = 'general';
                } else if (this.classList.contains('btn-secondary')) {
                    partnerType = 'stage';
                } else if (this.classList.contains('btn-tertiary')) {
                    partnerType = 'prizes';
                }
                
                const partnerTypeSelect = document.getElementById('partner-type');
                if (partnerTypeSelect) {
                    partnerTypeSelect.value = partnerType;
                }
            }
        });
    });
}

// Function to show messages
function showMessage(text, type) {
    const messageElement = document.getElementById('form-message');
    if (!messageElement) return;
    
    messageElement.textContent = text;
    messageElement.style.color = type === 'success' ? '#27ae60' : '#e74c3c';
    messageElement.style.minHeight = '20px';
    
    // Hide message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageElement.textContent = '';
        }, 5000);
    }
}

// Initialize social media links
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add tracking or analytics here if needed
            console.log(`Clicked on social link: ${this.textContent.trim()}`);
        });
    });
}

// Initialize document filters
function initDocumentFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const documentCards = document.querySelectorAll('.document-card');
    const searchInput = document.getElementById('document-search');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterType = this.getAttribute('data-filter');
                
                documentCards.forEach(card => {
                    if (filterType === 'all' || card.classList.contains(`document-${filterType}`)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            documentCards.forEach(card => {
                const title = card.querySelector('.document-title').textContent.toLowerCase();
                const description = card.querySelector('.document-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}
