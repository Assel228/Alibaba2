// JavaScript for ElderConnect application

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
    
    // Determine current user role to adjust UI
    let currentUserRole = 'elderly';
    try {
        const savedProfile = localStorage.getItem('elderConnectProfile');
        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            if (parsedProfile && parsedProfile.userType === 'volunteer') {
                currentUserRole = 'volunteer';
            }
            const accountNameField = document.getElementById('account-name');
            const accountEmailField = document.getElementById('account-email');
            if (accountNameField) {
                const profileNameField = document.getElementById('preferred-name');
                const derivedName = parsedProfile.preferredName || (profileNameField ? profileNameField.value : '');
                accountNameField.value = derivedName || (parsedProfile.userType === 'volunteer' ? 'Volunteer User' : 'Elderly User');
            }
            if (accountEmailField) {
                if (parsedProfile.email) {
                    accountEmailField.value = parsedProfile.email;
                } else {
                    accountEmailField.value = '';
                    accountEmailField.placeholder = 'Add your email';
                }
            }
        }
    } catch (error) {
        console.warn('Unable to determine user role:', error);
    }
    document.body.setAttribute('data-user-role', currentUserRole);
    
    const eventActionButtons = document.querySelectorAll('.event-actions .btn');
    
    eventActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Get Directions') {
                alert('Getting directions to the event location. In a full implementation, this would show a map with the route.');
            } else if (buttonText === 'Chat') {
                alert('Opening chat with event participants. In a full implementation, this would open a chat interface.');
            } else if (buttonText === 'Rate Volunteer') {
                const feedback = prompt('Enter your rating or feedback for the volunteer:');
                if (feedback !== null) {
                    alert('Thank you! Your feedback has been recorded.');
                }
            } else if (buttonText === 'Report Issue') {
                const issue = prompt('Describe the issue you would like to report:');
                if (issue !== null) {
                    alert('Thank you! Your report has been submitted to the coordinators.');
                }
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
});