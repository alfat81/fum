// Windows Mobile Style JavaScript for FUM Commission

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tile hover effects
    document.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 15px rgba(0,0,0,0.2)';
        });
        
        tile.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Member tile animations
    document.querySelectorAll('.member-tile').forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            tile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, 300 + index * 150);
    });

    // Document item animations
    document.querySelectorAll('.document-item').forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    });

    // Competition card animations
    document.querySelectorAll('.competition-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03)';
            this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.win-header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Back to top button functionality
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
    backToTopButton.style.opacity = '0';
    backToTopButton.style.transform = 'scale(0.8)';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.zIndex = '1000';
    backToTopButton.style.transition = 'all 0.3s ease';
    backToTopButton.style.padding = '12px';
    backToTopButton.style.borderRadius = '50%';

    // Color scheme explanation animation
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mouseenter', function() {
        const colors = ['blue', 'red', 'yellow'];
        let i = 0;
        
        const interval = setInterval(() => {
            heroSection.style.background = 
                `linear-gradient(135deg, var(--dark-blue), var(--${colors[i]}))`;
            i = (i + 1) % colors.length;
        }, 2000);
        
        heroSection.addEventListener('mouseleave', function() {
            clearInterval(interval);
            heroSection.style.background = 'linear-gradient(135deg, var(--dark-blue), var(--blue))';
        });
    });

    console.log('FUM Commission Website - Windows Mobile Style');
    console.log('© 2025 Федерация мотоциклетного спорта России');
});
