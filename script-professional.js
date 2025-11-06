// Professional JavaScript for ElderConnect landing page

document.addEventListener('DOMContentLoaded', function() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(button) {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .hero .btn');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animation for feature cards when they come into view
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        featureCards.forEach(function(card) {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }
    
    // Get Started button functionality
    const primaryButton = document.querySelector('.btn.primary');
    if (primaryButton) {
        primaryButton.addEventListener('click', function() {
            alert('Thank you for your interest! In a full implementation, this would take you to the sign-up page.');
        });
    }
    
    // Contact button functionality
    const contactButton = document.getElementById('contact-button');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            alert('In a full implementation, this would open a contact form or email client.');
        });
    }
    
    // Feedback form handling
    const feedbackForm = document.getElementById('feedback-form');
    const formMessage = document.getElementById('form-message');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Show success message
            showFormMessage('Thank you for your feedback! We\'ll get back to you soon.', 'success');
            
            // Reset form
            feedbackForm.reset();
        });
    }
    
    // Function to show form message
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';
            
            // Hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(function() {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
});