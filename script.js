// Windows Mobile Style JavaScript for FUM Commission

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Member card animations
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + index * 100);
    });

    // Card hover effects
    const cards = document.querySelectorAll('.hero-card, .commission-card, .about-card, .contacts-card, .documents-card, .competitions-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
        });
    });

    // Document item animations
    const documentItems = document.querySelectorAll('.document-item');
    documentItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.background = 'rgba(255,255,255,0.25)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.background = 'rgba(255,255,255,0.1)';
        });
    });

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top win-button blue';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'scale(1)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'scale(0.8)';
        }
    });

    // Initialize with hidden state
    backToTopButton.style.cssText = `
        opacity: 0;
        transform: scale(0.8);
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        transition: all 0.3s ease;
        padding: 12px;
        border-radius: 50%;
        min-width: 40px;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    backToTopButton.querySelector('i').style.fontSize = '1.5rem';

    // Hero card color animation
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
        let colors = [
            'linear-gradient(135deg, #1a2c56, #0078d7)',
            'linear-gradient(135deg, #1a2c56, #e74c3c)',
            'linear-gradient(135deg, #1a2c56, #f39c12)'
        ];
        let currentColor = 0;
        
        heroCard.addEventListener('mouseenter', function() {
            const interval = setInterval(() => {
                currentColor = (currentColor + 1) % colors.length;
                heroCard.style.background = colors[currentColor];
            }, 2000);
            
            heroCard._interval = interval;
        });
        
        heroCard.addEventListener('mouseleave', function() {
            if (heroCard._interval) {
                clearInterval(heroCard._interval);
                heroCard.style.background = 'linear-gradient(135deg, var(--dark-blue), var(--blue))';
            }
        });
    }

    console.log('FUM Commission Website - Windows Mobile Style with Wide Fonts');
    console.log('© 2025 Федерация мотоциклетного спорта России');
    
    // Initialize all animations
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
});
