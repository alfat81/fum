document.addEventListener('DOMContentLoaded', function() {
  // Load header and footer
  loadHeaderAndFooter();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Load competitions data
  loadCompetitionsData();
  
  // Initialize protocol buttons
  initProtocolButtons();
});

// Function to load header and footer
function loadHeaderAndFooter() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('.site-header-container').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));
  
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('.site-footer-container').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Initialize mobile menu
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    menuToggle.innerHTML = mobileMenu.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });
  
  // Close menu when clicking on links
  document.querySelectorAll('.mobile-nav ul li a').forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      mobileMenu.classList.remove('active');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

// Load competitions data
function loadCompetitionsData() {
  const competitions = [
    {
      id: 1,
      date: '2025-05-12',
      name: '2 этап Кубка России по фигурному управлению мотоциклом',
      location: 'Смоленск',
      time: '10:00',
      organizer: 'Глеб Симдянкин',
      phone: '+7 (910) 345-67-89',
      protocol: 'https://disk.yandex.ru/d/protocol1'
    },
    {
      id: 2,
      date: '2025-05-20',
      name: 'Кубок Москвы',
      location: 'Москва',
      time: '11:00',
      organizer: 'Александр Ципилев',
      phone: '+7 (903) 123-45-67',
      protocol: 'https://disk.yandex.ru/d/protocol2'
    },
    {
      id: 3,
      date: '2025-06-15',
      name: 'Чемпионат России',
      location: 'Тверская область',
      time: '09:00',
      organizer: 'Дмитрий Серов',
      phone: '+7 (977) 823-63-90',
      protocol: 'https://disk.yandex.ru/d/protocol3'
    },
    {
      id: 4,
      date: '2025-08-05',
      name: 'Женский Кубок МФР',
      location: 'Нижний Новгород',
      time: '10:00',
      organizer: 'Алексей Фатьянов',
      phone: '+7 (905) 234-56-78',
      protocol: 'https://disk.yandex.ru/d/protocol4'
    },
    {
      id: 5,
      date: '2025-09-12',
      name: 'Кубок юниоров',
      location: 'Вологда',
      time: '12:00',
      organizer: 'Наталия Недайводина',
      phone: '+7 (911) 456-78-90',
      protocol: 'https://disk.yandex.ru/d/protocol5'
    }
  ];
  
  // Store in localStorage for persistence
  localStorage.setItem('competitionsList', JSON.stringify(competitions));
  
  // Render competitions
  renderCompetitions();
}

// Render competitions
function renderCompetitions() {
  const competitionsGrid = document.querySelector('.competitions-grid');
  if (!competitionsGrid) return;
  
  const competitions = getCompetitions();
  competitionsGrid.innerHTML = '';
  
  competitions.forEach(comp => {
    const compDate = new Date(comp.date);
    const formattedDate = `${compDate.getDate()} ${compDate.toLocaleString('ru-RU', { month: 'long' })} ${compDate.getFullYear()}`;
    
    const competitionCard = document.createElement('div');
    competitionCard.className = 'unified-card competition-card';
    competitionCard.innerHTML = `
      <div class="card-header">
        <span class="highlight-date">${formattedDate}</span>
        <h3 class="card-title">${comp.name}</h3>
      </div>
      <div class="card-body">
        <p><i class="fas fa-map-marker-alt"></i> <strong>Регион:</strong> ${comp.location}</p>
        <p><i class="fas fa-clock"></i> <strong>Время:</strong> ${comp.time}</p>
        <p><i class="fas fa-user"></i> <strong>Организатор:</strong> ${comp.organizer}</p>
        <p><i class="fas fa-phone"></i> <strong>Телефон:</strong> ${comp.phone}</p>
      </div>
      <div class="card-footer">
        <button class="protocol-btn" data-competition-id="${comp.id}">
          <i class="fas fa-file-alt"></i> Протокол
        </button>
      </div>
    `;
    competitionsGrid.appendChild(competitionCard);
  });
}

// Get competitions from localStorage
function getCompetitions() {
  const savedCompetitions = localStorage.getItem('competitionsList');
  return savedCompetitions ? JSON.parse(savedCompetitions) : [];
}

// Initialize protocol buttons
function initProtocolButtons() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('protocol-btn') || e.target.closest('.protocol-btn')) {
      const button = e.target.closest('.protocol-btn');
      const competitionId = button.dataset.competitionId;
      loadProtocol(competitionId);
    }
  });
}

// Load protocol
function loadProtocol(competitionId) {
  const competitions = getCompetitions();
  const competition = competitions.find(comp => comp.id == competitionId);
  
  if (competition && competition.protocol) {
    window.open(competition.protocol, '_blank');
  } else {
    alert('Протокол для этого соревнования будет доступен после его проведения');
  }
}
