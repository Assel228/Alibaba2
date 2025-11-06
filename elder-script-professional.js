// JavaScript for ElderConnect Professional application

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab') + '-tab';
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
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
    
    // Get Directions button functionality
    const directionsButton = document.querySelector('.btn.primary.full-width');
    if (directionsButton) {
        directionsButton.addEventListener('click', function() {
            const locationInput = document.getElementById('location-input');
            const activitySelect = document.getElementById('activity-select');
            
            if (!locationInput.value.trim()) {
                alert('Please enter your location');
                return;
            }
            
            if (!activitySelect.value) {
                alert('Please select an activity');
                return;
            }
            
            alert(`Getting directions to "${activitySelect.options[activitySelect.selectedIndex].text}" from "${locationInput.value}". In a full implementation, this would show a map with the route.`);
        });
    }
    
    // Event action buttons
    const eventActionButtons = document.querySelectorAll('.event-actions .btn');
    eventActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Get Directions') {
                alert('Getting directions to the event location. In a full implementation, this would show a map with the route.');
            } else if (buttonText === 'Chat') {
                alert('Opening chat with event participants. In a full implementation, this would open a chat interface.');
            } else if (buttonText === 'Rate Volunteer') {
                alert('Opening volunteer rating interface. In a full implementation, this would show a rating form.');
            } else if (buttonText === 'Report Issue') {
                alert('Opening issue reporting interface. In a full implementation, this would show a form to report issues.');
            }
        });
    });
    
    // Activity join buttons
    const joinButtons = document.querySelectorAll('.activity-card .btn.small');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityName = this.closest('.activity-card').querySelector('h3').textContent;
            alert(`You have joined the "${activityName}" group! In a full implementation, this would add you to the activity group.`);
        });
    });
    
    // Feedback form handling
    const feedbackForm = document.getElementById('elder-feedback-form');
    const formMessage = document.getElementById('elder-form-message');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('elder-name').value;
            const email = document.getElementById('elder-email').value;
            const message = document.getElementById('elder-message').value;
            
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
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // Simple animation for feature cards when they come into view
    const featureCards = document.querySelectorAll('.activity-card, .ai-feature-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Get Started button functionality
    const primaryButton = document.querySelector('.btn.primary');
    if (primaryButton) {
        primaryButton.addEventListener('click', function() {
            alert('Thank you for your interest! In a full implementation, this would take you to the sign-up page.');
        });
    }
    
    // Function to ensure all images are visible and handle loading errors
    function ensureImagesVisible() {
        // Handle image loading errors
        const images = document.querySelectorAll('img[data-activity]');
        
        images.forEach(function(img) {
            // If image is already loaded, skip
            if (img.complete && img.naturalHeight !== 0) {
                return;
            }
            
            // Add error handler
            img.addEventListener('error', function() {
                console.log('Image failed to load:', img.src);
                
                // Get the activity type from data attribute
                const activityType = img.getAttribute('data-activity');
                
                // Load fallback image script
                const script = document.createElement('script');
                script.src = 'image-fallbacks.js';
                document.head.appendChild(script);
                
                // Create a fallback element
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.style.cssText = `
                    width: 100%;
                    height: 200px;
                    background-color: #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #7f8c8d;
                    font-size: 1.1rem;
                    text-align: center;
                    padding: 15px;
                `;
                
                fallback.innerHTML = `
                    <div>
                        <div style="font-size: 2.5rem; margin-bottom: 15px;">📷</div>
                        <div>Image not available</div>
                    </div>
                `;
                
                // Replace the image with the fallback
                img.parentNode.replaceChild(fallback, img);
            });
        });
    }
});
