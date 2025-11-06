// JavaScript for the swipe demo

document.addEventListener('DOMContentLoaded', function() {
    const movieCard = document.getElementById('movie-card');
    const passBtn = document.getElementById('pass-btn');
    const likeBtn = document.getElementById('like-btn');
    const movieTitle = document.getElementById('movie-title');
    const movieGenre = document.getElementById('movie-genre');
    const movieYear = document.getElementById('movie-year');
    const movieRating = document.getElementById('movie-rating');
    const movieDescription = document.getElementById('movie-description');
    
    // Sample movie data
    const movies = [
        {
            title: "Inception",
            genre: "Sci-Fi, Thriller",
            year: "2010",
            rating: "⭐ 8.8/10",
            description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
        },
        {
            title: "The Shawshank Redemption",
            genre: "Drama",
            year: "1994",
            rating: "⭐ 9.3/10",
            description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
        },
        {
            title: "Parasite",
            genre: "Comedy, Drama, Thriller",
            year: "2019",
            rating: "⭐ 8.6/10",
            description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."
        },
        {
            title: "La La Land",
            genre: "Comedy, Drama, Music",
            year: "2016",
            rating: "⭐ 8.0/10",
            description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future."
        }
    ];
    
    let currentMovieIndex = 0;
    
    // Function to update movie display
    function updateMovieDisplay() {
        const movie = movies[currentMovieIndex];
        movieTitle.textContent = movie.title;
        movieGenre.textContent = movie.genre;
        movieYear.textContent = movie.year;
        movieRating.textContent = movie.rating;
        movieDescription.textContent = movie.description;
    }
    
    // Function to go to next movie
    function nextMovie() {
        currentMovieIndex = (currentMovieIndex + 1) % movies.length;
        // Add animation effect
        movieCard.style.opacity = '0';
        setTimeout(() => {
            updateMovieDisplay();
            movieCard.style.opacity = '1';
        }, 300);
    }
    
    // Event listeners for swipe buttons
    passBtn.addEventListener('click', function() {
        // Add animation for pass
        movieCard.style.transform = 'translateX(-100%) rotate(-30deg)';
        movieCard.style.opacity = '0';
        
        setTimeout(() => {
            nextMovie();
            movieCard.style.transform = 'translateX(0) rotate(0)';
            movieCard.style.opacity = '1';
        }, 500);
    });
    
    likeBtn.addEventListener('click', function() {
        // Add animation for like
        movieCard.style.transform = 'translateX(100%) rotate(30deg)';
        movieCard.style.opacity = '0';
        
        setTimeout(() => {
            nextMovie();
            movieCard.style.transform = 'translateX(0) rotate(0)';
            movieCard.style.opacity = '1';
        }, 500);
    });
    
    // Touch swipe functionality
    let startX = 0;
    let startY = 0;
    
    movieCard.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    movieCard.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const posX = e.touches[0].clientX;
        const posY = e.touches[0].clientY;
        const diffX = posX - startX;
        const diffY = posY - startY;
        
        // Only consider horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
            movieCard.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.1}deg)`;
        }
    });
    
    movieCard.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const posX = e.changedTouches[0].clientX;
        const diffX = posX - startX;
        
        // Minimum swipe distance to trigger action
        if (Math.abs(diffX) > 100) {
            if (diffX > 0) {
                // Swipe right - like
                likeBtn.click();
            } else {
                // Swipe left - pass
                passBtn.click();
            }
        } else {
            // Return to original position
            movieCard.style.transform = 'translateX(0) rotate(0)';
        }
        
        startX = 0;
        startY = 0;
    });
    
    // Initialize the first movie
    updateMovieDisplay();
});