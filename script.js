// Simple JavaScript for interactive elements

// API Configuration
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with actual key
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';
const QUOTABLE_API_URL = 'https://api.quotable.io/random';

// Supabase configuration
const SUPABASE_URL = 'https://smgxivzlexhahfhlrlrp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZ3hpdnpsZXhoYWhmaGxybHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNjMwNTQsImV4cCI6MjA3NjkzOTA1NH0.UFt0TP0Zzo7aTl2h9xw870XP0KQBPoLVf6QA2DOLm1Y';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase
    let supabase;
    if (typeof supabaseJs !== 'undefined' && supabaseJs.createClient) {
        supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized successfully');
    } else if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized successfully (legacy)');
    } else {
        // Fallback if Supabase CDN fails to load
        supabase = {
            from: (table) => ({
                insert: (data) => {
                    console.warn('Supabase not available, using localStorage fallback');
                    // Store in localStorage as backup
                    const feedbackList = JSON.parse(localStorage.getItem('movieMatchFeedback') || '[]');
                    feedbackList.push(data);
                    localStorage.setItem('movieMatchFeedback', JSON.stringify(feedbackList));
                    return Promise.resolve({ data: null, error: null });
                },
                select: () => {
                    console.warn('Supabase not available, using localStorage fallback for select');
                    const feedbackList = JSON.parse(localStorage.getItem('movieMatchFeedback') || '[]');
                    return Promise.resolve({ data: feedbackList, error: null });
                }
            })
        };
        console.warn('Supabase CDN not loaded, using localStorage fallback');
    }
    
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
    const navLinks = document.querySelectorAll('nav a, .hero .btn');
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
    
    // Animation for feature cards when they come into view
    const featureCards = document.querySelectorAll('.feature-card');
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
    
    // Simple form handling for demo purposes
    const primaryButton = document.querySelector('.btn.primary');
    if (primaryButton) {
        primaryButton.addEventListener('click', function() {
            alert('Thank you for your interest! In a full implementation, this would take you to the sign-up page.');
        });
    }
    
    // Social sharing functionality
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
        shareButton.addEventListener('click', async function() {
            const shareData = {
                title: 'MovieMatch - Decide Movies Together',
                text: 'Check out MovieMatch - the easiest way for groups to decide what movie to watch together!',
                url: window.location.href
            };
            
            try {
                // Check if Web Share API is supported
                if (navigator.share) {
                    await navigator.share(shareData);
                    console.log('Shared successfully');
                } else {
                    // Fallback for browsers that don't support Web Share API
                    fallbackShare(shareData);
                }
            } catch (error) {
                console.log('Error sharing:', error);
                // Fallback if sharing fails
                fallbackShare(shareData);
            }
        });
    }
    
    // Fallback sharing function
    function fallbackShare(shareData) {
        // Create a temporary textarea to copy the link
        const textarea = document.createElement('textarea');
        textarea.value = `${shareData.text}\n\n${shareData.url}`;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show a message to the user
        alert(`Link copied to clipboard!

${shareData.text}

${shareData.url}`);
    }
    
    // Movie inspiration functionality
    loadMovieImages();
    loadMovieQuote();
    
    // Refresh buttons
    const refreshImagesBtn = document.getElementById('refresh-images');
    const refreshQuoteBtn = document.getElementById('refresh-quote');
    
    if (refreshImagesBtn) {
        refreshImagesBtn.addEventListener('click', loadMovieImages);
    }
    
    if (refreshQuoteBtn) {
        refreshQuoteBtn.addEventListener('click', loadMovieQuote);
    }
    
    // Load movie images from Unsplash API
    function loadMovieImages() {
        const imagePlaceholders = document.querySelectorAll('.image-placeholder');
        
        // For demo purposes without API key, we'll use placeholder images
        // In a real implementation, you would use the Unsplash API
        const demoImages = [
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ];
        
        // Fallback images in case primary images fail
        const fallbackImages = [
            'https://images.unsplash.com/photo-1542204165-65bfec80941d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1497514265643-008513e49c87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1517153295259-74eb0b416cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ];
        
        imagePlaceholders.forEach((placeholder, index) => {
            // Clear previous content
            placeholder.innerHTML = '';
            
            // Try primary image first
            loadImageWithFallback(placeholder, demoImages[index], fallbackImages[index], `Movie scene ${index + 1}`);
        });
    }
    
    // Helper function to load image with fallback
    function loadImageWithFallback(placeholder, primarySrc, fallbackSrc, altText) {
        // Create image element
        const img = document.createElement('img');
        img.src = primarySrc;
        img.alt = altText;
        
        // Add loading class for styling
        img.classList.add('loading-image');
        
        // Handle image load event
        img.onload = function() {
            this.classList.remove('loading-image');
        };
        
        // Handle image error
        img.onerror = function() {
            // If primary image fails, try fallback
            console.log('Primary image failed, trying fallback for:', altText);
            this.src = fallbackSrc;
            this.onerror = function() {
                // If fallback also fails, show error message
                this.parentElement.innerHTML = '<div class="loading">Image unavailable</div>';
            };
        };
        
        // Clear placeholder and add image
        placeholder.innerHTML = '';
        placeholder.appendChild(img);
    }
    
    // Load movie quote from Quotable API
    function loadMovieQuote() {
        const quoteElement = document.getElementById('movie-quote');
        const authorElement = document.getElementById('quote-author');
        
        // Show loading state
        if (quoteElement) quoteElement.innerHTML = '<div class="loading">Loading quote...</div>';
        if (authorElement) authorElement.textContent = '';
        
        // For demo purposes, we'll use sample movie quotes
        // In a real implementation, you would use the Quotable API
        const sampleQuotes = [
            {
                content: "May the Force be with you.",
                author: "Star Wars"
            },
            {
                content: "There's no place like home.",
                author: "The Wizard of Oz"
            },
            {
                content: "I'm gonna make him an offer he can't refuse.",
                author: "The Godfather"
            },
            {
                content: "You can't handle the truth!",
                author: "A Few Good Men"
            },
            {
                content: "Life is like a box of chocolates. You never know what you're gonna get.",
                author: "Forrest Gump"
            }
        ];
        
        // Select a random quote
        const randomQuote = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
        
        // Display the quote
        if (quoteElement) quoteElement.innerHTML = `"${randomQuote.content}"`;
        if (authorElement) authorElement.textContent = `— ${randomQuote.author}`;
    }
    
    // Feedback form handling
    const feedbackForm = document.getElementById('feedback-form');
    const formMessage = document.getElementById('form-message');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Show loading state
            showFormMessage('Sending your message...', 'loading');
            
            try {
                // Prepare feedback data
                const feedbackData = {
                    name: name,
                    email: email,
                    message: message,
                    created_at: new Date().toISOString()
                };
                
                console.log('Sending feedback data:', feedbackData);
                
                // Send to Supabase
                const { data, error } = await supabase
                    .from('feedback')
                    .insert([feedbackData]);
                
                console.log('Supabase response:', { data, error });
                
                if (error) {
                    throw error;
                }
                
                // Show success message
                showFormMessage('Thank you for your feedback! We\'ll get back to you soon.', 'success');
                
                // Reset form
                feedbackForm.reset();
                
                // Update feedback stats
                updateFeedbackStats();
            } catch (error) {
                console.error('Error submitting feedback:', error);
                showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            }
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
    
    // Function to update feedback statistics
    async function updateFeedbackStats() {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*', { count: 'exact' });
            
            if (error) {
                console.error('Error fetching feedback stats:', error);
                return;
            }
            
            const totalMessages = data.length;
            // For demo purposes, we'll assume 70% of messages are positive
            const positiveFeedback = Math.floor(totalMessages * 0.7);
            
            // Update the UI
            const totalMessagesElement = document.getElementById('total-messages');
            const positiveFeedbackElement = document.getElementById('positive-feedback');
            
            if (totalMessagesElement) {
                totalMessagesElement.textContent = totalMessages;
            }
            
            if (positiveFeedbackElement) {
                positiveFeedbackElement.textContent = positiveFeedback;
            }
        } catch (error) {
            console.error('Error updating feedback stats:', error);
        }
    }
    
    // Initialize feedback stats on page load
    updateFeedbackStats();
    
    // Add feedback data table functionality
    loadFeedbackData();
    
    // Refresh feedback data button
    const refreshFeedbackDataBtn = document.getElementById('refresh-feedback-data');
    if (refreshFeedbackDataBtn) {
        refreshFeedbackDataBtn.addEventListener('click', loadFeedbackData);
    }
});

// Function to load and display feedback data
async function loadFeedbackData() {
    const tableBody = document.querySelector('#feedback-data-table tbody');
    if (!tableBody) return;
    
    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading feedback data...</td></tr>';
    
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        // Clear table
        tableBody.innerHTML = '';
        
        // Populate table with data
        if (data && data.length > 0) {
            data.forEach(feedback => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${feedback.id}</td>
                    <td>${feedback.name}</td>
                    <td>${feedback.email}</td>
                    <td>${feedback.message}</td>
                    <td>${new Date(feedback.created_at).toLocaleDateString()}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="5" class="loading">No feedback data available</td></tr>';
        }
    } catch (error) {
        console.error('Error loading feedback data:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="loading">Error loading feedback data: ${error.message}</td></tr>`;
    }
}
