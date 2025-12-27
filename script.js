document.addEventListener('DOMContentLoaded', function() {
console.log('Сайт комиссии по мотоджимхане успешно загружен');
// Load header and footer
fetchHeaderAndFooter();
// Initialize mobile menu
initMobileMenu();
// Initialize animations
initAnimations();
// Load competition data
loadCompetitionsData();
});
// Function to load header and footer
function fetchHeaderAndFooter() {
fetch('header.html')
.then(response => response.text())
.then(data => {
document.querySelector('.site-header').innerHTML = data;
})
.catch(error => console.error('Error loading header:', error));
fetch('footer.html')
.then(response => response.text())
.then(data => {
document.querySelector('.site-footer').innerHTML = data;
})
.catch(error => console.error('Error loading footer:', error));
}
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
const elements = document.querySelectorAll('.card, .timeline-item, .leader-card, .news-card, .competition-card, .document-card, .partner-card');
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
const elements = document.querySelectorAll('.card, .timeline-item, .leader-card, .news-card, .competition-card, .document-card, .partner-card');
elements.forEach(element => {
element.style.opacity = '0';
element.style.transform = 'translateY(20px)';
element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});
// Trigger animations
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);
}
// Load competitions data
function loadCompetitionsData() {
// Sample data for competitions
const competitions = [
{
id: 1,
date: '2025-05-12',
name: '2 этап Кубка России по фигурному управлению мотоциклом',
location: 'Смоленск',
contact: 'Глеб Симдянкин',
contactPhone: '+7 (910) 345-67-89',
protocol: ''
},
{
id: 2,
date: '2025-05-20',
name: 'Кубок Москвы',
location: 'Москва',
contact: 'Александр Ципилев',
contactPhone: '+7 (903) 123-45-67',
protocol: ''
},
{
id: 3,
date: '2025-06-15',
name: 'Чемпионат России',
location: 'Тверская область',
contact: 'Дмитрий Серов',
contactPhone: '+7 (977) 823-63-90',
protocol: ''
},
{
id: 4,
date: '2025-08-05',
name: 'Женский Кубок МФР',
location: 'Нижний Новгород',
contact: 'Алексей Фатьянов',
contactPhone: '+7 (905) 234-56-78',
protocol: ''
},
{
id: 5,
date: '2025-09-12',
name: 'Кубок юниоров',
location: 'Вологда',
contact: 'Наталия Недайводина',
contactPhone: '+7 (911) 456-78-90',
protocol: ''
}
];
// Store in localStorage for persistence
localStorage.setItem('competitionsList', JSON.stringify(competitions));
}
// Get competitions from localStorage
function getCompetitions() {
const savedCompetitions = localStorage.getItem('competitionsList');
return savedCompetitions ? JSON.parse(savedCompetitions) : [];
}
// Format date function
function formatDate(dateString) {
const date = new Date(dateString);
const day = date.getDate();
const month = date.toLocaleString('ru-RU', { month: 'long' });
const year = date.getFullYear();
return `${day} ${month} ${year}`;
}
// Render calendar function
function renderCalendar(month, year) {
const calendarGrid = document.querySelector('.calendar-grid');
if (!calendarGrid) return;
calendarGrid.innerHTML = '';
// Month names
const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
// Day names
const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
// Update current month title
const currentMonthElement = document.querySelector('.current-month');
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
const competitions = getCompetitions();
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
competitionsContainer.appendChild(compElement);
});
dayElement.appendChild(competitionsContainer);
}
calendarGrid.appendChild(dayElement);
}
}
// Initialize calendar if exists
function initCalendar() {
const prevMonthBtn = document.querySelector('#prev-month');
const nextMonthBtn = document.querySelector('#next-month');
const calendarGrid = document.querySelector('.calendar-grid');
if (!calendarGrid) return;
let currentMonth = 4; // May (0-indexed)
let currentYear = 2025;
// Initial rendering
renderCalendar(currentMonth, currentYear);
// Navigation handlers
if (prevMonthBtn) {
prevMonthBtn.addEventListener('click', function() {
currentMonth--;
if (currentMonth < 0) {
currentMonth = 11;
currentYear--;
}
renderCalendar(currentMonth, currentYear);
});
}
if (nextMonthBtn) {
nextMonthBtn.addEventListener('click', function() {
currentMonth++;
if (currentMonth > 11) {
currentMonth = 0;
currentYear++;
}
renderCalendar(currentMonth, currentYear);
});
}
}
// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
initCalendar();
});
