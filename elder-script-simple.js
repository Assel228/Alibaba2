// Simplified JavaScript for ElderConnect - focused on elderly users

// Chat variables
let currentGroup = '';
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Map variables
let routingControl = null;
let userLocationMarker = null;

// Check if user is registered when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const savedProfile = localStorage.getItem('elderConnectProfile');
    if (!savedProfile) {
        // Redirect to registration page if not registered
        window.location.href = 'index.html';
        return;
    }
});

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
                height: 180px;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #7f8c8d;
                font-size: 1rem;
                text-align: center;
                padding: 10px;
            `;
            
            fallback.innerHTML = `
                <div>
                    <div style="font-size: 2rem; margin-bottom: 10px;">📷</div>
                    <div>Image not available</div>
                </div>
            `;
            
            // Replace the image with the fallback
            img.parentNode.replaceChild(fallback, img);
        });
    });
}

// Function to ensure map visibility
function ensureMapVisibility() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // Force visibility
        mapContainer.style.display = 'block';
        mapContainer.style.visibility = 'visible';
        
        // Ensure it has dimensions
        if (mapContainer.offsetHeight < 100) {
            mapContainer.style.height = '400px';
        }
    }
}

// Function to initialize the interactive map
function initializeInteractiveMap() {
    // Check if we're on the navigation tab
    const navTabContent = document.getElementById('navigation');
    if (!navTabContent || !navTabContent.classList.contains('active')) {
        return;
    }
    
    // Check if map is already initialized
    if (window.elderConnectMapInitialized) {
        return;
    }
    
    // Mark as initialized to prevent duplicate initialization
    window.elderConnectMapInitialized = true;
    
    try {
        // Hide loader
        const loader = document.getElementById('map-loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Initialize map centered on Hong Kong
        const map = L.map('map').setView([22.3964, 114.1095], 11);
        window.elderConnectMap = map;
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 15,
        }).addTo(map);
        
        // Create a layer group for markers
        map.markerLayer = L.layerGroup().addTo(map);
        
        // Define comprehensive activity locations throughout Hong Kong
        const locations = [
            // Hong Kong Island
            {
                name: "Central Community Center",
                coords: [22.2844, 114.1567],
                description: "Community activities and events",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Admiralty Community Hall",
                coords: [22.2785, 114.1632],
                description: "Cultural and recreational activities",
                activities: ["Board Games", "Reading Club", "Craft Workshops"]
            },
            {
                name: "Wan Chai Sports Ground",
                coords: [22.2770, 114.1720],
                description: "Sports and fitness activities",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Causeway Bay Community Center",
                coords: [22.2804, 114.1839],
                description: "Various community activities",
                activities: ["Board Games", "Baking", "Volunteering"]
            },
            {
                name: "North Point Community Center",
                coords: [22.2870, 114.1920],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Quarry Bay Community Hall",
                coords: [22.2870, 114.2150],
                description: "Community activities and events",
                activities: ["Pottery", "Arts & Crafts", "Music"]
            },
            {
                name: "Sai Wan Ho Community Center",
                coords: [22.2840, 114.2180],
                description: "Recreational and wellness programs",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Shau Kei Wan Community Center",
                coords: [22.2800, 114.2320],
                description: "Local community activities",
                activities: ["Board Games", "Baking", "Craft Workshops"]
            },
            {
                name: "Chai Wan Community Center",
                coords: [22.2670, 114.2380],
                description: "Community and cultural programs",
                activities: ["Board Games", "Reading Club", "Music"]
            },
            {
                name: "Stanley Beach Community Center",
                coords: [22.2490, 114.2040],
                description: "Beach activities and outdoor events",
                activities: ["Beach Cleaning", "Fishing", "Walking Group"]
            },
            {
                name: "Aberdeen Community Hall",
                coords: [22.2500, 114.1500],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Aberdeen Sports Ground",
                coords: [22.2520, 114.1550],
                description: "Sports and fitness activities",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            // Kowloon
            {
                name: "Tsim Sha Tsui Community Center",
                coords: [22.2980, 114.1720],
                description: "Cultural and recreational activities",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Mong Kok Community Center",
                coords: [22.3210, 114.1690],
                description: "Community activities and events",
                activities: ["Board Games", "Reading Club", "Craft Workshops"]
            },
            {
                name: "Prince Edward Sports Ground",
                coords: [22.3350, 114.1700],
                description: "Sports and fitness activities",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Kowloon Tong Community Center",
                coords: [22.3380, 114.1760],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Lok Fu Community Center",
                coords: [22.3380, 114.1920],
                description: "Recreational and wellness programs",
                activities: ["Pottery", "Arts & Crafts", "Music"]
            },
            {
                name: "Kowloon City Community Center",
                coords: [22.3290, 114.1900],
                description: "Community and cultural programs",
                activities: ["Board Games", "Reading Club", "Music"]
            },
            {
                name: "To Kwa Wan Community Center",
                coords: [22.3140, 114.2000],
                description: "Local community activities",
                activities: ["Board Games", "Baking", "Craft Workshops"]
            },
            {
                name: "Ma Tau Kok Community Center",
                coords: [22.3240, 114.2080],
                description: "Community activities and events",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            // New Territories
            {
                name: "Ma On Shan Community Center",
                coords: [22.4080, 114.2280],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Sha Tin Community Center",
                coords: [22.3850, 114.1890],
                description: "Community and cultural programs",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Fo Tan Community Center",
                coords: [22.3980, 114.1950],
                description: "Recreational and wellness programs",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Tai Wai Community Center",
                coords: [22.3780, 114.1780],
                description: "Local community activities",
                activities: ["Board Games", "Reading Club", "Music"]
            },
            {
                name: "Kwai Chung Community Center",
                coords: [22.3600, 114.1280],
                description: "Community activities and events",
                activities: ["Board Games", "Baking", "Craft Workshops"]
            },
            {
                name: "Tsuen Wan Community Center",
                coords: [22.3720, 114.1100],
                description: "Cultural and recreational activities",
                activities: ["Pottery", "Arts & Crafts", "Music"]
            },
            {
                name: "Tuen Mun Community Center",
                coords: [22.3920, 113.9760],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Yuen Long Community Center",
                coords: [22.4450, 114.0220],
                description: "Community and cultural programs",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Tin Shui Wai Community Center",
                coords: [22.4580, 113.9980],
                description: "Recreational and wellness programs",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Fanling Community Center",
                coords: [22.4920, 114.1370],
                description: "Local community activities",
                activities: ["Board Games", "Reading Club", "Music"]
            }
        ];
        
        // If user location is available, calculate distances and sort
        let userLat = 22.3964; // Default to central Hong Kong
        let userLng = 114.1095;
        
        if (window.userLocation) {
            userLat = window.userLocation[0];
            userLng = window.userLocation[1];
        }
        
        // Calculate distances from user location
        locations.forEach(function(location) {
            location.distance = calculateDistance(userLat, userLng, location.coords[0], location.coords[1]);
        });
        
        // Sort locations by distance (closest first)
        locations.sort(function(a, b) {
            return a.distance - b.distance;
        });
        
        // Add user location marker if available
        if (window.userLocation) {
            const userMarker = L.marker(window.userLocation).addTo(map.markerLayer);
            userMarker.bindPopup("<b>Your Location</b>");
        }
        
        // Add markers to map with distance information and visual indicators
        locations.forEach(function(location, index) {
            // Calculate distance for display
            const distanceText = location.distance < 1 
                ? `${Math.round(location.distance * 1000)}m away` 
                : `${location.distance.toFixed(1)}km away`;
            
            // Create popup content with activities
            let activitiesList = '';
            if (location.activities && location.activities.length > 0) {
                activitiesList = '<br><b>Activities:</b> ' + location.activities.join(', ');
            }
            
            // Create marker with different colors based on distance ranking
            let markerColor;
            if (index === 0) {
                // Closest location - green
                markerColor = 'green';
            } else if (index === 1) {
                // Second closest - blue
                markerColor = 'blue';
            } else if (index === 2) {
                // Third closest - orange
                markerColor = 'orange';
            } else {
                // Others - red
                markerColor = 'red';
            }
            
            // Create custom marker icon based on distance
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-${markerColor}">${index + 1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            // Add marker to map
            const locationMarker = L.marker(location.coords, {icon: markerIcon}).addTo(map.markerLayer);
            
            // Create a unique ID for this location
            const locationId = location.name.replace(/\s+/g, '-').toLowerCase();
            
            locationMarker.bindPopup(
                `<b>${location.name}</b><br>` +
                `${location.description}<br>` +
                `<small>${distanceText}</small>` +
                activitiesList +
                `<br><br><button class="get-directions-popup-btn" data-location="${locationId}" style="background: #43cea2; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Get Directions</button>`
            );
            
            // Store location data for directions
            window.locationData = window.locationData || {};
            window.locationData[locationId] = {
                coords: location.coords,
                name: location.name
            };
            
            // Add event listener for the directions button in popup
            locationMarker.on('popupopen', function() {
                // Use a small delay to ensure the button is rendered
                setTimeout(function() {
                    const directionBtn = document.querySelector(`.get-directions-popup-btn[data-location="${locationId}"]`);
                    if (directionBtn) {
                        // Remove any existing event listeners to prevent duplicates
                        const newBtn = directionBtn.cloneNode(true);
                        directionBtn.parentNode.replaceChild(newBtn, directionBtn);
                        
                        newBtn.addEventListener('click', function() {
                            // Set this location as the destination in the directions form
                            const destinationSelect = document.getElementById('destination');
                            if (destinationSelect) {
                                // Find the option that matches this location
                                for (let i = 0; i < destinationSelect.options.length; i++) {
                                    if (destinationSelect.options[i].text === location.name) {
                                        destinationSelect.selectedIndex = i;
                                        break;
                                    }
                                }
                                
                                // Switch to navigation tab
                                const navTabButton = document.querySelector('.tab-btn[data-tab="navigation"]');
                                if (navTabButton) {
                                    navTabButton.click();
                                }
                                
                                // Scroll to the directions form
                                const locationForm = document.querySelector('.location-form');
                                if (locationForm) {
                                    locationForm.scrollIntoView({ behavior: 'smooth' });
                                }
                                
                                // Show a message to the user
                                setTimeout(function() {
                                    alert(`Selected ${location.name} as destination. Fill in your location and click "Get Directions" to see how to get there.`);
                                }, 500);
                            }
                        });
                    }
                }, 100);
            });
            
            // Add marker to map
            const marker = L.marker(location.coords, {icon: markerIcon}).addTo(map.markerLayer);
            
            marker.bindPopup(
                `<b>${location.name}</b><br>` +
                `${location.description}<br>` +
                `<small>${distanceText}</small>` +
                activitiesList
            );
            
            // Auto open popup for the closest location (but don't auto-close)
            if (index === 0) {
                setTimeout(function() {
                    marker.openPopup();
                }, 1000);
            }
        });
        
        // Disable scroll wheel zoom for elderly users
        map.scrollWheelZoom.disable();
        
        console.log('Interactive map initialized successfully with', locations.length, 'locations');
    } catch (error) {
        console.error('Error initializing interactive map:', error);
        // Show error message
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display:flex;justify-content:center;align-items:center;height:100%;padding:20px;text-align:center;">
                    <div>
                        <h3 style="color:#2c3e50;margin-bottom:15px;">Map Loading Error</h3>
                        <p style="color:#7f8c8d;">Unable to load the interactive map. Please check your internet connection.</p>
                        <p style="color:#7f8c8d;margin-top:10px;">Showing locations as text instead:</p>
                        <p style="color:#2c3e50;margin:5px 0;">📍 Central Community Center</p>
                        <p style="color:#2c3e50;margin:5px 0;">📍 Victoria Park Pavilion</p>
                        <p style="color:#2c3e50;margin:5px 0;">📍 Wan Chai Arts & Crafts Center</p>
                        <p style="color:#2c3e50;margin:5px 0;">📍 Causeway Bay Activity Hub</p>
                    </div>
                </div>
            `;
        }
    }
}

// Function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Function to detect user location
function detectUserLocation() {
    console.log('Detect User Location function called');
    
    const locationInput = document.getElementById('current-location');
    
    if (!locationInput) {
        console.error('Location input field not found');
        alert('Unable to find location input field.');
        return;
    }
    
    if (navigator.geolocation) {
        console.log('Geolocation is supported');
        locationInput.placeholder = "Detecting your location...";
        locationInput.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Update input field with coordinates
                locationInput.value = `Your Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
                locationInput.disabled = false;
                
                // Store user location
                window.userLocation = [lat, lng];
                
                // Check if we're on the navigation tab
                const navTabContent = document.getElementById('navigation');
                if (navTabContent && navTabContent.classList.contains('active')) {
                    // Ensure map is initialized first
                    if (!window.elderConnectMapInitialized) {
                        initializeInteractiveMap();
                    }
                    
                    // Update map with user location after a short delay to ensure map is fully initialized
                    setTimeout(function() {
                        if (window.elderConnectMap) {
                            updateMapWithUserLocation(lat, lng);
                        } else {
                            console.error('Map failed to initialize');
                        }
                    }, 300);
                } else {
                    // If we're not on the navigation tab, just store the location
                    // The map will be updated when the user navigates to the navigation tab
                    console.log('User location detected and stored. Map will update when navigation tab is active.');
                }
                
                console.log('User location detected:', lat, lng);
            },
            function(error) {
                console.error('Error detecting user location:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                locationInput.placeholder = "Enter your address";
                locationInput.disabled = false;
                let errorMessage = 'Unable to detect your location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied. Please enable location services in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable. Please check your device settings.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'The request to get your location timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred. Please enter your address manually.';
                        break;
                }
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000 // 10 minutes
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter your address manually.');
        locationInput.placeholder = "Enter your address";
    }
}

// Function to update map with user location and sort activities by distance
function updateMapWithUserLocation(lat, lng) {
    // Check if map is initialized
    if (!window.elderConnectMap) {
        console.error('Map is not initialized');
        // Try to initialize the map first
        initializeInteractiveMap();
        // Retry after a short delay
        setTimeout(function() {
            if (window.elderConnectMap) {
                updateMapWithUserLocation(lat, lng);
            }
        }, 500);
        return;
    }
    
    try {
        const map = window.elderConnectMap;
        
        // Remove all existing markers except user location marker
        if (map.markerLayer) {
            map.removeLayer(map.markerLayer);
        }
        
        // Create a new layer group for markers
        map.markerLayer = L.layerGroup().addTo(map);
        
        // Add user location marker
        const userMarker = L.marker([lat, lng]).addTo(map.markerLayer);
        userMarker.bindPopup("<b>Your Location</b>").openPopup();
        
        // Define comprehensive activity locations throughout Hong Kong
        const locations = [
            // Hong Kong Island
            {
                name: "Central Community Center",
                coords: [22.2844, 114.1567],
                description: "Community activities and events",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Admiralty Community Hall",
                coords: [22.2785, 114.1632],
                description: "Cultural and recreational activities",
                activities: ["Board Games", "Reading Club", "Craft Workshops"]
            },
            {
                name: "Wan Chai Sports Ground",
                coords: [22.2770, 114.1720],
                description: "Sports and fitness activities",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Causeway Bay Community Center",
                coords: [22.2804, 114.1839],
                description: "Various community activities",
                activities: ["Board Games", "Baking", "Volunteering"]
            },
            {
                name: "North Point Community Center",
                coords: [22.2870, 114.1920],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Quarry Bay Community Hall",
                coords: [22.2870, 114.2150],
                description: "Community activities and events",
                activities: ["Pottery", "Arts & Crafts", "Music"]
            },
            {
                name: "Sai Wan Ho Community Center",
                coords: [22.2840, 114.2180],
                description: "Recreational and wellness programs",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Shau Kei Wan Community Center",
                coords: [22.2800, 114.2320],
                description: "Local community activities",
                activities: ["Board Games", "Baking", "Craft Workshops"]
            },
            {
                name: "Chai Wan Community Center",
                coords: [22.2670, 114.2380],
                description: "Community and cultural programs",
                activities: ["Board Games", "Reading Club", "Music"]
            },
            {
                name: "Stanley Beach Community Center",
                coords: [22.2490, 114.2040],
                description: "Beach activities and outdoor events",
                activities: ["Beach Cleaning", "Fishing", "Walking Group"]
            },
            {
                name: "Aberdeen Community Hall",
                coords: [22.2500, 114.1500],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Aberdeen Sports Ground",
                coords: [22.2520, 114.1550],
                description: "Sports and fitness activities",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            // Kowloon
            {
                name: "Tsim Sha Tsui Community Center",
                coords: [22.2980, 114.1720],
                description: "Cultural and recreational activities",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Mong Kok Community Center",
                coords: [22.3210, 114.1690],
                description: "Community activities and events",
                activities: ["Board Games", "Reading Club", "Craft Workshops"]
            },
            {
                name: "Prince Edward Sports Ground",
                coords: [22.3350, 114.1700],
                description: "Sports and fitness activities",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Kowloon Tong Community Center",
                coords: [22.3380, 114.1760],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Lok Fu Community Center",
                coords: [22.3380, 114.1920],
                description: "Recreational and wellness programs",
                activities: ["Pottery", "Arts & Crafts", "Music"]
            },
            {
                name: "Kowloon City Community Center",
                coords: [22.3290, 114.1900],
                description: "Community and cultural programs",
                activities: ["Board Games", "Reading Club", "Music"]
            },
            {
                name: "To Kwa Wan Community Center",
                coords: [22.3140, 114.2000],
                description: "Local community activities",
                activities: ["Board Games", "Baking", "Craft Workshops"]
            },
            {
                name: "Ma Tau Kok Community Center",
                coords: [22.3240, 114.2080],
                description: "Community activities and events",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            // New Territories
            {
                name: "Ma On Shan Community Center",
                coords: [22.4080, 114.2280],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Sha Tin Community Center",
                coords: [22.3850, 114.1890],
                description: "Community and cultural programs",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Fo Tan Community Center",
                coords: [22.3980, 114.1950],
                description: "Recreational and wellness programs",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Tai Wai Community Center",
                coords: [22.3780, 114.1780],
                description: "Local community activities",
                activities: ["Board Games", "Reading Club", "Music"]
            },
            {
                name: "Kwai Chung Community Center",
                coords: [22.3600, 114.1280],
                description: "Community activities and events",
                activities: ["Board Games", "Baking", "Craft Workshops"]
            },
            {
                name: "Tsuen Wan Community Center",
                coords: [22.3720, 114.1100],
                description: "Cultural and recreational activities",
                activities: ["Pottery", "Arts & Crafts", "Music"]
            },
            {
                name: "Tuen Mun Community Center",
                coords: [22.3920, 113.9760],
                description: "Local community programs",
                activities: ["Board Games", "Gardening", "Reading Club"]
            },
            {
                name: "Yuen Long Community Center",
                coords: [22.4450, 114.0220],
                description: "Community and cultural programs",
                activities: ["Board Games", "Pottery", "Baking"]
            },
            {
                name: "Tin Shui Wai Community Center",
                coords: [22.4580, 113.9980],
                description: "Recreational and wellness programs",
                activities: ["Tai Chi", "Gentle Yoga", "Walking Group"]
            },
            {
                name: "Fanling Community Center",
                coords: [22.4920, 114.1370],
                description: "Local community activities",
                activities: ["Board Games", "Reading Club", "Music"]
            }
        ];
        
        // Calculate distances and sort locations
        locations.forEach(function(location) {
            location.distance = calculateDistance(lat, lng, location.coords[0], location.coords[1]);
        });
        
        // Sort locations by distance (closest first)
        locations.sort(function(a, b) {
            return a.distance - b.distance;
        });
        
        // Add markers to map with distance information and visual indicators
        locations.forEach(function(location, index) {
            // Calculate distance for display
            const distanceText = location.distance < 1 
                ? `${Math.round(location.distance * 1000)}m away` 
                : `${location.distance.toFixed(1)}km away`;
            
            // Create popup content with activities
            let activitiesList = '';
            if (location.activities && location.activities.length > 0) {
                activitiesList = '<br><b>Activities:</b> ' + location.activities.join(', ');
            }
            
            // Create marker with different colors based on distance ranking
            let markerColor;
            if (index === 0) {
                // Closest location - green
                markerColor = 'green';
            } else if (index === 1) {
                // Second closest - blue
                markerColor = 'blue';
            } else if (index === 2) {
                // Third closest - orange
                markerColor = 'orange';
            } else {
                // Others - red
                markerColor = 'red';
            }
            
            // Create custom marker icon based on distance
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-${markerColor}">${index + 1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            // Add marker to map
            const locationMarker = L.marker(location.coords, {icon: markerIcon}).addTo(map.markerLayer);
            
            // Create a unique ID for this location
            const locationId = location.name.replace(/\s+/g, '-').toLowerCase();
            
            locationMarker.bindPopup(
                `<b>${location.name}</b><br>` +
                `${location.description}<br>` +
                `<small>${distanceText}</small>` +
                activitiesList +
                `<br><br><button class="get-directions-popup-btn" data-location="${locationId}" style="background: #43cea2; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Get Directions</button>`
            );
            
            // Store location data for directions
            window.locationData = window.locationData || {};
            window.locationData[locationId] = {
                coords: location.coords,
                name: location.name
            };
            
            // Add event listener for the directions button in popup
            locationMarker.on('popupopen', function() {
                // Use a small delay to ensure the button is rendered
                setTimeout(function() {
                    const directionBtn = document.querySelector(`.get-directions-popup-btn[data-location="${locationId}"]`);
                    if (directionBtn) {
                        // Remove any existing event listeners to prevent duplicates
                        const newBtn = directionBtn.cloneNode(true);
                        directionBtn.parentNode.replaceChild(newBtn, directionBtn);
                        
                        newBtn.addEventListener('click', function() {
                            // Set this location as the destination in the directions form
                            const destinationSelect = document.getElementById('destination');
                            if (destinationSelect) {
                                // Find the option that matches this location
                                for (let i = 0; i < destinationSelect.options.length; i++) {
                                    if (destinationSelect.options[i].text === location.name) {
                                        destinationSelect.selectedIndex = i;
                                        break;
                                    }
                                }
                                
                                // Switch to navigation tab
                                const navTabButton = document.querySelector('.tab-btn[data-tab="navigation"]');
                                if (navTabButton) {
                                    navTabButton.click();
                                }
                                
                                // Scroll to the directions form
                                const locationForm = document.querySelector('.location-form');
                                if (locationForm) {
                                    locationForm.scrollIntoView({ behavior: 'smooth' });
                                }
                                
                                // Show a message to the user
                                setTimeout(function() {
                                    alert(`Selected ${location.name} as destination. Fill in your location and click "Get Directions" to see how to get there.`);
                                }, 500);
                            }
                        });
                    }
                }, 100);
            });
            
            // Auto open popup for the closest location (but don't auto-close)
            if (index === 0) {
                setTimeout(function() {
                    marker.openPopup();
                }, 1000);
            }
        });
        
        console.log('Map updated with user location and sorted activities');
    } catch (error) {
        console.error('Error updating map with user location:', error);
    }
}

// Function to get coordinates for destination
function getDestinationCoordinates(destinationValue) {
    const destinations = {
        // Hong Kong Island
        'central': [22.2844, 114.1567], // Central Community Center
        'admiralty': [22.2785, 114.1632], // Admiralty Community Hall
        'wan-chai-sports': [22.2770, 114.1720], // Wan Chai Sports Ground
        'causeway': [22.2804, 114.1839], // Causeway Bay Community Center
        'north-point': [22.2870, 114.1920], // North Point Community Center
        'quarry-bay': [22.2870, 114.2150], // Quarry Bay Community Hall
        'sai-wan-ho': [22.2840, 114.2180], // Sai Wan Ho Community Center
        'shau-kei-wan': [22.2800, 114.2320], // Shau Kei Wan Community Center
        'chai-wan': [22.2670, 114.2380], // Chai Wan Community Center
        'stanley': [22.2490, 114.2040], // Stanley Beach Community Center
        'aberdeen-hall': [22.2500, 114.1500], // Aberdeen Community Hall
        'aberdeen-sports': [22.2520, 114.1550], // Aberdeen Sports Ground
        // Kowloon
        'tsim-sha-tsui': [22.2980, 114.1720], // Tsim Sha Tsui Community Center
        'mong-kok': [22.3210, 114.1690], // Mong Kok Community Center
        'prince-edward': [22.3350, 114.1700], // Prince Edward Sports Ground
        'kowloon-tong': [22.3380, 114.1760], // Kowloon Tong Community Center
        'lok-fu': [22.3380, 114.1920], // Lok Fu Community Center
        'kowloon-city': [22.3290, 114.1900], // Kowloon City Community Center
        'to-kwa-wan': [22.3140, 114.2000], // To Kwa Wan Community Center
        'ma-tau-kok': [22.3240, 114.2080], // Ma Tau Kok Community Center
        // New Territories
        'ma-on-shan': [22.4080, 114.2280], // Ma On Shan Community Center
        'sha-tin': [22.3850, 114.1890], // Sha Tin Community Center
        'fo-tan': [22.3980, 114.1950], // Fo Tan Community Center
        'tai-wai': [22.3780, 114.1780], // Tai Wai Community Center
        'kwai-chung': [22.3600, 114.1280], // Kwai Chung Community Center
        'tsuen-wan': [22.3720, 114.1100], // Tsuen Wan Community Center
        'tuen-mun': [22.3920, 113.9760], // Tuen Mun Community Center
        'yuen-long': [22.4450, 114.0220], // Yuen Long Community Center
        'tin-shui-wai': [22.4580, 113.9980], // Tin Shui Wai Community Center
        'fanling': [22.4920, 114.1370] // Fanling Community Center
    };
    
    return destinations[destinationValue] || null;
}

// Function to get destination name
function getDestinationName(destinationValue) {
    const destinationNames = {
        // Hong Kong Island
        'central': 'Central Community Center',
        'admiralty': 'Admiralty Community Hall',
        'wan-chai-sports': 'Wan Chai Sports Ground',
        'causeway': 'Causeway Bay Community Center',
        'north-point': 'North Point Community Center',
        'quarry-bay': 'Quarry Bay Community Hall',
        'sai-wan-ho': 'Sai Wan Ho Community Center',
        'shau-kei-wan': 'Shau Kei Wan Community Center',
        'chai-wan': 'Chai Wan Community Center',
        'stanley': 'Stanley Beach Community Center',
        'aberdeen-hall': 'Aberdeen Community Hall',
        'aberdeen-sports': 'Aberdeen Sports Ground',
        // Kowloon
        'tsim-sha-tsui': 'Tsim Sha Tsui Community Center',
        'mong-kok': 'Mong Kok Community Center',
        'prince-edward': 'Prince Edward Sports Ground',
        'kowloon-tong': 'Kowloon Tong Community Center',
        'lok-fu': 'Lok Fu Community Center',
        'kowloon-city': 'Kowloon City Community Center',
        'to-kwa-wan': 'To Kwa Wan Community Center',
        'ma-tau-kok': 'Ma Tau Kok Community Center',
        // New Territories
        'ma-on-shan': 'Ma On Shan Community Center',
        'sha-tin': 'Sha Tin Community Center',
        'fo-tan': 'Fo Tan Community Center',
        'tai-wai': 'Tai Wai Community Center',
        'kwai-chung': 'Kwai Chung Community Center',
        'tsuen-wan': 'Tsuen Wan Community Center',
        'tuen-mun': 'Tuen Mun Community Center',
        'yuen-long': 'Yuen Long Community Center',
        'tin-shui-wai': 'Tin Shui Wai Community Center',
        'fanling': 'Fanling Community Center'
    };
    
    return destinationNames[destinationValue] || 'Unknown Location';
}

// Function to show route on map
function showRouteOnMap(startCoords, endCoords, destinationName, travelMode = 'car') {
    // Check if map is initialized
    if (!window.elderConnectMap) {
        console.error('Map is not initialized');
        return;
    }
    
    const map = window.elderConnectMap;
    
    // Remove existing routing control if present
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    
    // Hide route details button and panel when calculating new route
    const routeDetailsBtn = document.getElementById('route-details-btn');
    if (routeDetailsBtn) {
        routeDetailsBtn.style.display = 'none';
    }
    
    const routeDetailsPanel = document.getElementById('route-details-panel');
    if (routeDetailsPanel) {
        routeDetailsPanel.style.display = 'none';
    }
    
    // Clear current route data
    window.currentRoute = null;
    window.currentTravelMode = travelMode;
    
    // Configure routing options based on travel mode
    let routerOptions = {};
    
    switch(travelMode) {
        case 'walking':
            routerOptions = {
                waypoints: [
                    L.latLng(startCoords[0], startCoords[1]),
                    L.latLng(endCoords[0], endCoords[1])
                ],
                routeWhileDragging: false,
                showAlternatives: false,
                fitSelectedRoutes: true,
                show: false,
                createMarker: function() { return null; }, // Don't create additional markers
                lineOptions: {
                    styles: [{color: '#43cea2', opacity: 0.7, weight: 5}]
                },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                    profile: 'foot'
                })
            };
            break;
        case 'transit':
            // For MTR/transit, we'll show a straight line as a placeholder
            // In a real implementation, you would integrate with a transit API
            routerOptions = {
                waypoints: [
                    L.latLng(startCoords[0], startCoords[1]),
                    L.latLng(endCoords[0], endCoords[1])
                ],
                routeWhileDragging: false,
                showAlternatives: false,
                fitSelectedRoutes: true,
                show: false,
                createMarker: function() { return null; }, // Don't create additional markers
                lineOptions: {
                    styles: [{color: '#f39c12', opacity: 0.7, weight: 5}]
                }
            };
            break;
        case 'car':
        default:
            routerOptions = {
                waypoints: [
                    L.latLng(startCoords[0], startCoords[1]),
                    L.latLng(endCoords[0], endCoords[1])
                ],
                routeWhileDragging: false,
                showAlternatives: false,
                fitSelectedRoutes: true,
                show: false,
                createMarker: function() { return null; }, // Don't create additional markers
                lineOptions: {
                    styles: [{color: '#34495e', opacity: 0.7, weight: 5}]
                }
            };
            break;
    }
    
    // Create new routing control
    routingControl = L.Routing.control(routerOptions).addTo(map);
    
    // Add event listener to capture route details
    routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        const route = routes[0];
        
        // Store route details for later use
        window.currentRoute = route;
        
        // Show the route details button
        const routeDetailsBtn = document.getElementById('route-details-btn');
        if (routeDetailsBtn) {
            routeDetailsBtn.style.display = 'block';
        }
    });
    
    // Store travel mode for route details
    window.currentTravelMode = travelMode;
    
    // Remove existing markers from marker layer if present
    if (map.markerLayer) {
        map.markerLayer.clearLayers();
    }
    
    // Add start marker
    const startMarker = L.marker(startCoords).addTo(map);
    startMarker.bindPopup("Your Location").openPopup();
    
    // Add end marker
    const endMarker = L.marker(endCoords).addTo(map);
    endMarker.bindPopup(destinationName).openPopup();
    
    console.log('Route displayed from', startCoords, 'to', endCoords, 'using', travelMode, 'mode');
}

// Function to show route details
function showRouteDetails() {
    if (!window.currentRoute) {
        alert('No route details available. Please get directions first.');
        return;
    }
    
    const route = window.currentRoute;
    const travelMode = window.currentTravelMode || 'car';
    const instructionsContainer = document.getElementById('route-instructions');
    const routeDetailsPanel = document.getElementById('route-details-panel');
    
    if (!instructionsContainer || !routeDetailsPanel) {
        console.error('Route details elements not found');
        return;
    }
    
    // Clear previous instructions
    instructionsContainer.innerHTML = '';
    
    // Get travel mode display name and color
    let modeName, modeColor;
    switch(travelMode) {
        case 'walking':
            modeName = 'Walking';
            modeColor = '#43cea2';
            break;
        case 'transit':
            modeName = 'MTR';
            modeColor = '#f39c12';
            break;
        case 'car':
        default:
            modeName = 'Car';
            modeColor = '#34495e';
            break;
    }
    
    // Add route summary with travel mode
    const summary = document.createElement('div');
    summary.innerHTML = `
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h4 style="margin-top: 0; color: #2c3e50;">Route Summary</h4>
            <p><strong>Travel Mode:</strong> <span style="color: ${modeColor}; font-weight: bold;">${modeName}</span></p>
            <p><strong>Distance:</strong> ${Math.round(route.summary.totalDistance / 1000 * 100) / 100} km</p>
            <p><strong>Estimated Time:</strong> ${Math.round(route.summary.totalTime / 60)} minutes</p>
        </div>
    `;
    instructionsContainer.appendChild(summary);
    
    // Add mode-specific instructions
    const modeInstructions = document.createElement('div');
    modeInstructions.style.marginBottom = '20px';
    
    switch(travelMode) {
        case 'walking':
            modeInstructions.innerHTML = `
                <div style="background: #e8f6f3; padding: 15px; border-radius: 8px; border-left: 4px solid #43cea2;">
                    <h4 style="margin-top: 0; color: #2c3e50;">🚶 Walking Tips</h4>
                    <p>Wear comfortable shoes and stay hydrated. Follow pedestrian crossings and traffic signals.</p>
                </div>
            `;
            break;
        case 'transit':
            modeInstructions.innerHTML = `
                <div style="background: #fef5e7; padding: 15px; border-radius: 8px; border-left: 4px solid #f39c12;">
                    <h4 style="margin-top: 0; color: #2c3e50;">🚇 MTR Instructions</h4>
                    <p>Check MTR schedules and plan your journey. Bring an Octopus card for convenient travel.</p>
                    <p><strong>Note:</strong> Detailed MTR routing is not available. Plan your journey using the MTR app or website.</p>
                </div>
            `;
            break;
        case 'car':
        default:
            modeInstructions.innerHTML = `
                <div style="background: #eaecee; padding: 15px; border-radius: 8px; border-left: 4px solid #34495e;">
                    <h4 style="margin-top: 0; color: #2c3e50;">🚗 Driving Tips</h4>
                    <p>Follow traffic rules and parking regulations. Consider traffic congestion during peak hours.</p>
                </div>
            `;
            break;
    }
    
    instructionsContainer.appendChild(modeInstructions);
    
    // Add turn-by-turn instructions
    const instructionsList = document.createElement('div');
    instructionsList.innerHTML = '<h4 style="color: #2c3e50;">Turn-by-Turn Directions</h4>';
    
    const instructions = route.instructions || [];
    if (instructions.length > 0) {
        const list = document.createElement('ol');
        list.style.paddingLeft = '20px';
        
        instructions.forEach(function(instruction) {
            const listItem = document.createElement('li');
            listItem.style.marginBottom = '10px';
            listItem.style.paddingBottom = '10px';
            listItem.style.borderBottom = '1px solid #eee';
            
            // Format the instruction text
            let instructionText = instruction.text || 'Continue';
            if (instruction.distance) {
                instructionText += ` (${Math.round(instruction.distance)}m)`;
            }
            
            listItem.textContent = instructionText;
            list.appendChild(listItem);
        });
        
        instructionsList.appendChild(list);
    } else {
        // Fallback for routes without detailed instructions
        const fallbackText = document.createElement('p');
        fallbackText.textContent = 'Detailed turn-by-turn instructions are not available for this route. Follow the route line on the map.';
        fallbackText.style.color = '#7f8c8d';
        instructionsList.appendChild(fallbackText);
    }
    
    instructionsContainer.appendChild(instructionsList);
    
    // Show the route details panel
    routeDetailsPanel.style.display = 'block';
    
    // Scroll to the route details panel
    routeDetailsPanel.scrollIntoView({ behavior: 'smooth' });
}

// Function to handle profile form submission
function handleProfileFormSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const profileData = {};
    
    // Collect text inputs and selects
    for (const [key, value] of formData.entries()) {
        if (key !== 'interests') {
            profileData[key] = value;
        }
    }
    
    // Collect interests (multiple checkboxes)
    const interests = formData.getAll('interests');
    profileData.interests = interests;
    
    // Store in localStorage for persistence
    localStorage.setItem('elderConnectProfile', JSON.stringify(profileData));
    
    // Show success message
    alert(`Thank you, ${profileData.preferredName || ' valued member'}! Your profile has been saved successfully. You can now access all features of the app.`);
    
    console.log('Profile data saved:', profileData);
}

// Chat functions
function openChat(groupName) {
    currentGroup = groupName;
    document.getElementById('chat-group-name').textContent = groupName + ' Chat';
    document.getElementById('chat-modal').style.display = 'flex';
    
    // Clear previous messages
    document.getElementById('chat-messages').innerHTML = '';
    
    // Add some sample messages to start the conversation
    addMessage('Welcome to the ' + groupName + ' group!', 'System', new Date(), 'received');
    addMessage('Hello everyone! Looking forward to our activity.', 'Margaret', new Date(Date.now() - 300000), 'received');
    addMessage('Me too! See you all there.', 'Robert', new Date(Date.now() - 180000), 'received');
}

function closeChat() {
    document.getElementById('chat-modal').style.display = 'none';
    currentGroup = '';
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (message) {
        const now = new Date();
        addMessage(message, 'You', now, 'sent');
        messageInput.value = '';
        
        // Check if this is the AI Wellness Companion chat
        const chatGroupName = document.getElementById('chat-group-name').textContent;
        if (chatGroupName === 'AI Wellness Companion') {
            // Simulate AI response after a short delay
            setTimeout(() => {
                const aiResponses = [
                    "I understand how you're feeling. It takes courage to share these thoughts.",
                    "That's an important step you've taken today. How can I support you further?",
                    "Your feelings are valid, and it's okay to take things one day at a time.",
                    "What would make you feel more comfortable right now?",
                    "Remember, reaching out is a sign of strength, not weakness.",
                    "Let's explore some gentle activities that might bring you comfort.",
                    "I'm here with you every step of the way on your wellness journey.",
                    "Taking care of yourself is important. What small act of self-care could you try today?",
                    "Your perspective matters. What would you like to focus on in our conversation?",
                    "Building connections takes time. Be patient and kind with yourself."
                ];
                const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                addMessage(randomResponse, 'AI Wellness Companion', new Date(), 'received');
            }, 2000);
        } else {
            // Simulate a regular group reply after a short delay
            setTimeout(() => {
                const replies = [
                    'Thanks for sharing!',
                    'That sounds great!',
                    'Looking forward to it!',
                    'See you there!',
                    'Have a wonderful day!',
                    'Take care!'
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                addMessage(randomReply, 'Group Member', new Date(), 'received');
            }, 2000);
        }
    }
}

function addMessage(content, sender, timestamp, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    messageDiv.innerHTML = `
        <div class="message-header">${sender}</div>
        <div class="message-content">${content}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function startRecording() {
    if (isRecording) return;
    
    isRecording = true;
    document.getElementById('record-audio').style.display = 'none';
    document.getElementById('stop-record').style.display = 'inline-block';
    document.getElementById('recording-indicator').style.display = 'flex';
    
    // Simulate audio recording
    audioChunks = [];
    console.log('Recording started...');
}

function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    document.getElementById('record-audio').style.display = 'inline-block';
    document.getElementById('stop-record').style.display = 'none';
    document.getElementById('recording-indicator').style.display = 'none';
    
    // Simulate audio recording completion
    console.log('Recording stopped.');
    
    // Add audio message to chat
    const now = new Date();
    const audioMessageDiv = document.createElement('div');
    audioMessageDiv.className = 'message sent';
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    audioMessageDiv.innerHTML = `
        <div class="message-header">You (Audio Message)</div>
        <div class="message-content">
            <div class="audio-message">
                <button class="play-audio-btn" onclick="playAudioMessage()">▶</button>
                <span>Audio message (0:05)</span>
            </div>
        </div>
        <div class="message-time">${timeString}</div>
    `;
    
    document.getElementById('chat-messages').appendChild(audioMessageDiv);
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    
    // Simulate a reply after a short delay
    setTimeout(() => {
        const replies = [
            'Thanks for the audio message!',
            'Great to hear from you!',
            'Looking forward to our activity.'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(randomReply, 'Group Member', new Date(), 'received');
    }, 3000);
}

function playAudioMessage() {
    alert('Playing audio message... (simulated)');
}

document.addEventListener('DOMContentLoaded', function() {
    // Skip if redirected from index.html
    if (!localStorage.getItem('elderConnectProfile')) {
        return;
    }
    
    // Get user's mental well-being category
    const savedProfile = localStorage.getItem('elderConnectProfile');
    let mentalWellBeingCategory = 'social'; // default category
    
    if (savedProfile) {
        try {
            const profileData = JSON.parse(savedProfile);
            mentalWellBeingCategory = profileData.mentalWellBeingCategory || 'social';
        } catch (e) {
            console.error('Error parsing profile data:', e);
        }
    }
    
    // Customize activity recommendations based on mental well-being
    customizeActivitiesForWellBeing(mentalWellBeingCategory);
    
    // Ensure all images are visible
    ensureImagesVisible();
    
    // Ensure map is visible
    ensureMapVisibility();
    
    // Add event listener for detect location button
    const detectLocationBtn = document.getElementById('detect-location-btn');
    if (detectLocationBtn) {
        // Remove any existing event listeners to prevent duplicates
        const newDetectLocationBtn = detectLocationBtn.cloneNode(true);
        detectLocationBtn.parentNode.replaceChild(newDetectLocationBtn, detectLocationBtn);
        
        // Add click event listener
        newDetectLocationBtn.addEventListener('click', detectUserLocation);
        console.log('Detect Location button event listener attached');
    } else {
        console.log('Detect Location button not found');
    }
    
    // Ensure the detect location button has an event listener (fallback)
    setTimeout(function() {
        const detectLocationBtn = document.getElementById('detect-location-btn');
        if (detectLocationBtn && !detectLocationBtn.hasAttribute('data-listener-attached')) {
            // Remove any existing event listeners to prevent duplicates
            const newDetectLocationBtn = detectLocationBtn.cloneNode(true);
            detectLocationBtn.parentNode.replaceChild(newDetectLocationBtn, detectLocationBtn);
            
            // Add click event listener
            newDetectLocationBtn.addEventListener('click', detectUserLocation);
            newDetectLocationBtn.setAttribute('data-listener-attached', 'true');
            console.log('Fallback: Detect Location button event listener attached');
        }
    }, 1000);
    
    // Add event listener for route details button
    setTimeout(function() {
        const routeDetailsBtn = document.getElementById('route-details-btn');
        if (routeDetailsBtn) {
            routeDetailsBtn.addEventListener('click', function() {
                showRouteDetails();
            });
        }
        
        // Add event listener for close route details button
        const closeRouteDetailsBtn = document.getElementById('close-route-details');
        if (closeRouteDetailsBtn) {
            closeRouteDetailsBtn.addEventListener('click', function() {
                const routeDetailsPanel = document.getElementById('route-details-panel');
                if (routeDetailsPanel) {
                    routeDetailsPanel.style.display = 'none';
                }
            });
        }
    }, 1000);
    
    // Main tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            tabContents.forEach(function(content) {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // If we're showing the navigation tab, initialize the map
                if (tabId === 'navigation') {
                    // Small delay to ensure tab is fully visible
                    setTimeout(function() {
                        // If user location is available, update map with user location
                        if (window.userLocation) {
                            // Make sure map is initialized first
                            if (!window.elderConnectMapInitialized) {
                                initializeInteractiveMap();
                            }
                            // Then update with user location
                            setTimeout(function() {
                                if (window.elderConnectMap) {
                                    updateMapWithUserLocation(window.userLocation[0], window.userLocation[1]);
                                }
                            }, 300);
                        } else {
                            initializeInteractiveMap();
                        }
                    }, 100);
                }
            }
        });
    });
    
    // Initialize interactive map if we're on the navigation tab
    const navTabButton = document.querySelector('.tab-btn[data-tab="navigation"]');
    if (navTabButton && navTabButton.classList.contains('active')) {
        setTimeout(function() {
            // If user location is available, update map with user location
            if (window.userLocation) {
                // Make sure map is initialized first
                if (!window.elderConnectMapInitialized) {
                    initializeInteractiveMap();
                }
                // Then update with user location
                setTimeout(function() {
                    updateMapWithUserLocation(window.userLocation[0], window.userLocation[1]);
                }, 300);
            } else {
                initializeInteractiveMap();
            }
        }, 100);
    }
    
    // Category tab switching within Explore tab
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    categoryButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            categoryButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            categoryContents.forEach(function(content) {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const categoryId = this.getAttribute('data-category') + '-category';
            const targetContent = document.getElementById(categoryId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Join activity buttons
    const joinButtons = document.querySelectorAll('.join-btn');
    joinButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const activityName = this.closest('.activity-card').querySelector('h3').textContent;
            if (activityName === 'More Social Activities' || activityName === 'More Wellness Activities' || activityName === 'More Volunteer Activities') {
                alert('Showing more activities in the "' + activityName + '" category. Browse through additional options below.');
            } else {
                alert('You have joined the "' + activityName + '" group! You will receive a confirmation message shortly.');
            }
        });
    });
    
    // Event action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Get Directions') {
                // Get the event name from the card
                const eventName = this.closest('.event-card').querySelector('h3').textContent;
                alert('Getting directions to the ' + eventName + ' event location.');
            } else if (buttonText === 'Chat with Group') {
                // Get the event name from the card
                const eventName = this.closest('.event-card').querySelector('h3').textContent;
                openChat(eventName);
            } else if (buttonText === 'Rate Volunteer') {
                const rating = prompt('Please rate the volunteer service (1-5 stars):');
                if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
                    alert('Thank you for rating the volunteer with ' + rating + ' stars!');
                } else if (rating !== null) {
                    alert('Please enter a valid rating between 1 and 5.');
                }
            } else if (buttonText === 'Report Issue') {
                const issue = prompt('Please describe the issue you experienced:');
                if (issue) {
                    alert('Thank you for reporting the issue. Our team will review it and contact you if needed.');
                }
            }
        });
    });
    
    // Get directions button
    const directionsButton = document.querySelector('.get-directions-btn');
    if (directionsButton) {
        directionsButton.addEventListener('click', function() {
            const locationInput = document.getElementById('current-location');
            const destinationSelect = document.getElementById('destination');
            
            // Check if we have user location
            if (!window.userLocation && !locationInput.value.trim()) {
                const useCurrentLocation = confirm('Would you like to use your current location?');
                if (useCurrentLocation) {
                    detectUserLocation();
                    return;
                } else {
                    alert('Please enter your current location or allow location detection.');
                    return;
                }
            }
            
            if (!destinationSelect.value) {
                alert('Please select a destination.');
                return;
            }
            
            // Get start coordinates
            let startCoords;
            if (window.userLocation) {
                startCoords = window.userLocation;
            } else {
                // For simplicity, we'll use a default location in Hong Kong
                // In a real app, you would geocode the address
                startCoords = [22.3964, 114.1095]; // Central Hong Kong
            }
            
            // Get destination coordinates
            const endCoords = getDestinationCoordinates(destinationSelect.value);
            const destinationName = getDestinationName(destinationSelect.value);
            
            if (!endCoords) {
                alert('Invalid destination selected.');
                return;
            }
            
            // Get selected travel mode
            const activeModeBtn = document.querySelector('.route-mode-btn.active');
            const travelMode = activeModeBtn ? activeModeBtn.dataset.mode : 'car';
            
            // Show route on map
            if (window.elderConnectMap) {
                showRouteOnMap(startCoords, endCoords, destinationName, travelMode);
                const modeText = travelMode === 'car' ? 'by car' : travelMode === 'walking' ? 'by walking' : 'by MTR';
                alert(`Route displayed on map from your location to ${destinationName} ${modeText}`);
            } else {
                alert('Map is not initialized. Please try again.');
            }
        });
    }
    
    // Route mode buttons
    const routeModeButtons = document.querySelectorAll('.route-mode-btn');
    routeModeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            routeModeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Add event listener for location input to detect when user wants to use current location
    const locationInput = document.getElementById('current-location');
    if (locationInput) {
        locationInput.addEventListener('focus', function() {
            if (this.value === '') {
                const useCurrentLocation = confirm('Would you like to use your current location?');
                if (useCurrentLocation) {
                    detectUserLocation();
                }
            }
        });
    }
    
    // Profile form submission
    const profileForm = document.getElementById('registration-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileFormSubmission);
    }
    
    // Profile button
    const profileButton = document.getElementById('profile-button');
    if (profileButton) {
        profileButton.addEventListener('click', function() {
            // Switch to profile tab
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            tabContents.forEach(function(content) {
                content.classList.remove('active');
            });
            
            // Activate profile tab button and content
            const profileTabButton = document.querySelector('.tab-btn[data-tab="profile"]');
            const profileTabContent = document.getElementById('profile');
            
            if (profileTabButton && profileTabContent) {
                profileTabButton.classList.add('active');
                profileTabContent.classList.add('active');
            }
        });
    }
    
    // Settings button
    const settingsButton = document.getElementById('settings-button');
    if (settingsButton) {
        settingsButton.addEventListener('click', function() {
            // Redirect to settings page
            window.location.href = 'settings.html';
        });
    }
    
    // Chat event listeners
    document.getElementById('close-chat').addEventListener('click', closeChat);
    document.getElementById('send-message').addEventListener('click', sendMessage);
    document.getElementById('message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    document.getElementById('record-audio').addEventListener('click', startRecording);
    document.getElementById('stop-record').addEventListener('click', stopRecording);
    
    // Add calendar initialization
    const calendarTabButton = document.querySelector('.tab-btn[data-tab="calendar"]');
    if (calendarTabButton) {
        calendarTabButton.addEventListener('click', function() {
            // Small delay to ensure tab is fully visible
            setTimeout(function() {
                // Check if calendar is already initialized
                if (!window.calendarInitialized) {
                    initializeCalendar();
                    window.calendarInitialized = true;
                }
            }, 100);
        });
    }
});

// Function to customize activities based on mental well-being category
function customizeActivitiesForWellBeing(category) {
    // Get all activity cards
    const socialActivities = document.querySelectorAll('#social-category .activity-card');
    const wellnessActivities = document.querySelectorAll('#wellness-category .activity-card');
    const volunteerActivities = document.querySelectorAll('#volunteer-category .activity-card');
    
    // Show/hide AI chat box based on category
    const aiChatBox = document.getElementById('ai-chat-box');
    if (aiChatBox) {
        if (category === 'wellness') {
            aiChatBox.style.display = 'block';
        } else {
            aiChatBox.style.display = 'none';
        }
    }
    
    // Customize based on mental well-being category
    switch(category) {
        case 'social':
            // Mild loneliness - focus on light-hearted social activities
            customizeSocialActivities(socialActivities, 'light');
            customizeWellnessActivities(wellnessActivities, 'relaxing');
            customizeVolunteerActivities(volunteerActivities, 'community');
            break;
        case 'balanced':
            // Moderate loneliness - balanced mix of social and wellness
            customizeSocialActivities(socialActivities, 'engaging');
            customizeWellnessActivities(wellnessActivities, 'balanced');
            customizeVolunteerActivities(volunteerActivities, 'meaningful');
            break;
        case 'wellness':
            // Severe loneliness - focus on mental wellness and motivation
            customizeSocialActivities(socialActivities, 'supportive');
            customizeWellnessActivities(wellnessActivities, 'therapeutic');
            customizeVolunteerActivities(volunteerActivities, 'healing');
            break;
        default:
            // Default to social focus
            customizeSocialActivities(socialActivities, 'light');
            customizeWellnessActivities(wellnessActivities, 'relaxing');
            customizeVolunteerActivities(volunteerActivities, 'community');
    }
}

// Add event listener for AI chat button
document.addEventListener('DOMContentLoaded', function() {
    const aiChatButton = document.getElementById('open-ai-chat');
    if (aiChatButton) {
        aiChatButton.addEventListener('click', function() {
            // Open the existing chat modal with AI companion
            openAIWellnessChat();
        });
    }
});

// Function to open AI wellness chat
function openAIWellnessChat() {
    // Set the chat group name to AI Companion
    document.getElementById('chat-group-name').textContent = 'AI Wellness Companion';
    
    // Clear existing messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Add welcome message from AI
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message received';
    welcomeMessage.innerHTML = `
        <div class="sender">AI Wellness Companion</div>
        <div>Hello! I'm here to support your wellness journey. How are you feeling today?</div>
        <div class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    chatMessages.appendChild(welcomeMessage);
    
    // Show the chat modal
    document.getElementById('chat-modal').style.display = 'flex';
    
    // Focus on the message input
    document.getElementById('message-input').focus();
}

// Customize social activities based on theme
function customizeSocialActivities(activities, theme) {
    activities.forEach(activity => {
        const title = activity.querySelector('h3');
        const description = activity.querySelector('p');
        
        if (title && description) {
            switch(theme) {
                case 'light':
                    // Light-hearted social themes
                    if (title.textContent.includes('More Social')) {
                        title.textContent = 'Favorite Spots in HK';
                        description.textContent = 'Share your favorite places in Hong Kong with new friends';
                    } else if (title.textContent.includes('Board Games')) {
                        title.textContent = 'Board Games';
                        description.textContent = 'Share your favorite board games and stories with companions';
                    }
                    break;
                case 'engaging':
                    // More engaging social activities
                    if (title.textContent.includes('More Social')) {
                        title.textContent = 'Community Storytelling';
                        description.textContent = 'Share experiences and build connections through storytelling';
                    }
                    break;
                case 'supportive':
                    // Supportive social activities for those needing more help
                    if (title.textContent.includes('More Social')) {
                        title.textContent = 'Support Circle';
                        description.textContent = 'Join a supportive group with others on similar journeys';
                    } else if (title.textContent.includes('Board Games')) {
                        title.textContent = 'Friendly Connections';
                        description.textContent = 'Build new friendships in a welcoming environment';
                    }
                    break;
            }
        }
    });
}

// Customize wellness activities based on theme
function customizeWellnessActivities(activities, theme) {
    activities.forEach(activity => {
        const title = activity.querySelector('h3');
        const description = activity.querySelector('p');
        
        if (title && description) {
            switch(theme) {
                case 'relaxing':
                    // Relaxing wellness activities
                    if (title.textContent.includes('More Wellness')) {
                        title.textContent = 'Calming Practices';
                        description.textContent = 'Discover calming techniques for daily peace';
                    }
                    break;
                case 'balanced':
                    // Balanced wellness activities
                    if (title.textContent.includes('More Wellness')) {
                        title.textContent = 'Well-being Journey';
                        description.textContent = 'Explore activities that support both body and mind';
                    } else if (title.textContent.includes('Tai Chi')) {
                        title.textContent = 'Mindful Movement';
                        description.textContent = 'Gentle exercises that promote mindfulness and balance';
                    }
                    break;
                case 'therapeutic':
                    // Therapeutic wellness activities for severe loneliness
                    if (title.textContent.includes('More Wellness')) {
                        title.textContent = 'Self-Affirmation Routines';
                        description.textContent = 'Start your day with positive affirmations and routines';
                    } else if (title.textContent.includes('Tai Chi')) {
                        title.textContent = 'Stress Relief Sessions';
                        description.textContent = 'Learn techniques to manage stress and find inner peace';
                    } else if (title.textContent.includes('Yoga')) {
                        title.textContent = 'Emotional Wellness Yoga';
                        description.textContent = 'Yoga practices focused on emotional healing and self-compassion';
                    } else if (title.textContent.includes('Fishing')) {
                        title.textContent = 'Mindful Reflection';
                        description.textContent = 'Quiet time for introspection and mental clarity';
                    }
                    break;
            }
        }
    });
}

// Customize volunteer activities based on theme
function customizeVolunteerActivities(activities, theme) {
    activities.forEach(activity => {
        const title = activity.querySelector('h3');
        const description = activity.querySelector('p');
        
        if (title && description) {
            switch(theme) {
                case 'community':
                    // Community-focused volunteering
                    if (title.textContent.includes('More Volunteer')) {
                        title.textContent = 'Neighborhood Connections';
                        description.textContent = 'Volunteer opportunities that build local community bonds';
                    }
                    break;
                case 'meaningful':
                    // More meaningful volunteering
                    if (title.textContent.includes('More Volunteer')) {
                        title.textContent = 'Purposeful Giving';
                        description.textContent = 'Volunteer activities that align with your values and interests';
                    }
                    break;
                case 'healing':
                    // Healing-focused volunteering for those with severe loneliness
                    if (title.textContent.includes('More Volunteer')) {
                        title.textContent = 'Healing Through Helping';
                        description.textContent = 'Find purpose and connection through helping others';
                    } else if (title.textContent.includes('Crochet')) {
                        title.textContent = 'Therapeutic Crafting';
                        description.textContent = 'Create comfort items while connecting with others';
                    } else if (title.textContent.includes('Beach Cleaning')) {
                        title.textContent = 'Environmental Healing';
                        description.textContent = 'Connect with nature while making a positive impact';
                    } else if (title.textContent.includes('Animal Shelters')) {
                        title.textContent = 'Compassionate Care';
                        description.textContent = 'Find comfort and purpose through animal companionship';
                    }
                    break;
            }
        }
    });
}

// Also run visibility check after window loads
window.addEventListener('load', function() {
    // Skip if redirected from index.html
    if (!localStorage.getItem('elderConnectProfile')) {
        return;
    }
    
    ensureImagesVisible();
    ensureMapVisibility();
    
    // Load existing profile data if available
    const savedProfile = localStorage.getItem('elderConnectProfile');
    if (savedProfile) {
        try {
            const profileData = JSON.parse(savedProfile);
            // Pre-fill form with saved data
            document.getElementById('preferred-name').value = profileData.preferredName || '';
            document.getElementById('age').value = profileData.age || '';
            document.getElementById('gender').value = profileData.gender || '';
            document.getElementById('medical-needs').value = profileData.medicalNeeds || '';
            
            // Pre-select interests
            if (profileData.interests && Array.isArray(profileData.interests)) {
                profileData.interests.forEach(interest => {
                    const checkbox = document.querySelector(`input[value="${interest}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
            
            document.getElementById('personality').value = profileData.personality || '';
            // Add mental well-being fields
            document.getElementById('loneliness-level').value = profileData.lonelinessLevel || '';
            document.getElementById('well-being-goals').value = profileData.wellBeingGoals || '';
            
            document.getElementById('social-preference').value = profileData.socialPreference || '';
            document.getElementById('communication').value = profileData.communication || '';
            document.getElementById('availability').value = profileData.availability || '';
            document.getElementById('goals').value = profileData.goals || '';
        } catch (e) {
            console.error('Error loading saved profile:', e);
        }
    }
});

// Calendar functionality
function initializeCalendar() {
    // Calendar state variables
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    // Sample events data with more details
    const calendarEvents = [
        { 
            date: '2025-11-01', 
            title: 'Board Games Club', 
            status: 'finished',
            time: '2:00 PM',
            location: 'Community Center, Room 3',
            description: 'Join us for mahjong, chess, and other classic games'
        },
        { 
            date: '2025-11-02', 
            title: 'Pottery Workshop', 
            status: 'upcoming',
            time: '10:00 AM',
            location: 'Arts & Crafts Center',
            description: 'Learn pottery techniques in a relaxed environment'
        },
        { 
            date: '2025-11-03', 
            title: 'Tai Chi Session', 
            status: 'upcoming',
            time: '9:00 AM',
            location: 'Park Pavilion',
            description: 'Gentle movements for balance and relaxation'
        },
        { 
            date: '2025-11-05', 
            title: 'Baking Class', 
            status: 'upcoming',
            time: '11:00 AM',
            location: 'Community Kitchen',
            description: 'Learn to bake cookies and cakes with grandma'
        },
        { 
            date: '2025-11-07', 
            title: 'Gentle Yoga', 
            status: 'upcoming',
            time: '10:30 AM',
            location: 'Wellness Center',
            description: 'Improve flexibility and reduce stress'
        },
        { 
            date: '2025-11-10', 
            title: 'Charity Crochet', 
            status: 'upcoming',
            time: '2:00 PM',
            location: 'Community Hall',
            description: 'Create items for those in need while socializing'
        },
        { 
            date: '2025-11-12', 
            title: 'Walking Group', 
            status: 'upcoming',
            time: '9:00 AM',
            location: 'Park Entrance',
            description: 'Enjoy a peaceful walk with companions'
        },
        { 
            date: '2025-11-15', 
            title: 'Book Club', 
            status: 'upcoming',
            time: '3:00 PM',
            location: 'Library Meeting Room',
            description: 'Discuss this month\'s selected book'
        },
        { 
            date: '2025-11-18', 
            title: 'Art Class', 
            status: 'upcoming',
            time: '1:00 PM',
            location: 'Arts Center',
            description: 'Explore your creativity with painting'
        },
        { 
            date: '2025-11-20', 
            title: 'Gardening Club', 
            status: 'upcoming',
            time: '10:00 AM',
            location: 'Community Garden',
            description: 'Tend to flowers and vegetables with fellow gardeners'
        },
        { 
            date: '2025-11-22', 
            title: 'Music Therapy', 
            status: 'upcoming',
            time: '11:00 AM',
            location: 'Therapy Center',
            description: 'Relax with soothing music and gentle activities'
        },
        { 
            date: '2025-11-25', 
            title: 'Beach Cleaning', 
            status: 'upcoming',
            time: '9:30 AM',
            location: 'Central Beach',
            description: 'Contribute to environmental conservation'
        },
        { 
            date: '2025-11-28', 
            title: 'Animal Shelter Visit', 
            status: 'upcoming',
            time: '2:00 PM',
            location: 'Local Animal Shelter',
            description: 'Spend time with animals in need of love'
        }
    ];
    
    // Function to update event statuses based on date
    function updateEventStatuses(currentDate) {
        calendarEvents.forEach(event => {
            // Convert event date string to Date object
            const eventDateParts = event.date.split('-');
            const eventDate = new Date(eventDateParts[0], eventDateParts[1] - 1, eventDateParts[2]);
            
            // If event date is before current date, mark as finished
            if (eventDate < currentDate && event.status === 'upcoming') {
                event.status = 'finished';
            }
        });
    }
    
    // Function to render calendar
    function renderCalendar(month, year) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        // Update header
        document.getElementById('current-month-main').textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Clear calendar grid
        const calendarGrid = document.getElementById('calendar-grid-main');
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get current date in Hong Kong timezone
        const hongKongTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
        const hongKongDate = new Date(hongKongTime);
        const hkYear = hongKongDate.getFullYear();
        const hkMonth = hongKongDate.getMonth();
        const hkDay = hongKongDate.getDate();
        
        // Update event statuses based on date
        updateEventStatuses(hongKongDate);
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            // Format date for event matching
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Add events for this day
            const dayEvents = calendarEvents.filter(event => event.date === dateStr);
            
            // Check if this is today in Hong Kong
            let isToday = false;
            if (year === hkYear && month === hkMonth && day === hkDay) {
                isToday = true;
                dayCell.classList.add('today');
            }
            
            // Add status-based styling
            if (dayEvents.length > 0) {
                dayCell.classList.add('has-event');
                
                // Determine if any events are upcoming or finished
                const hasUpcoming = dayEvents.some(event => event.status === 'upcoming');
                const hasFinished = dayEvents.some(event => event.status === 'finished');
                
                if (hasUpcoming && !isToday) {
                    dayCell.classList.add('upcoming');
                } else if (hasFinished && !isToday) {
                    dayCell.classList.add('finished');
                } else if (hasUpcoming && isToday) {
                    dayCell.classList.add('upcoming');
                } else if (hasFinished && isToday) {
                    dayCell.classList.add('finished');
                }
            }
            
            dayCell.innerHTML = `<div class="day-number">${day}</div>`;
            
            // Add click event to show day details
            dayCell.addEventListener('click', function() {
                showDayDetails(dateStr, day, month, year, dayEvents);
            });
            
            calendarGrid.appendChild(dayCell);
        }
    }
    
    // Function to show day details
    function showDayDetails(dateStr, day, month, year, dayEvents) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        // Set the date text
        document.getElementById('detail-date-text').textContent = 
            `${monthNames[month]} ${day}, ${year}`;
        
        // Populate events
        const eventsContainer = document.getElementById('detail-events-container');
        eventsContainer.innerHTML = '';
        
        if (dayEvents.length > 0) {
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = `detail-event ${event.status}`;
                
                // Add status-specific styling
                let statusClass = '';
                let statusText = '';
                if (event.status === 'upcoming') {
                    statusClass = 'upcoming';
                    statusText = 'Upcoming';
                } else {
                    statusClass = 'finished';
                    statusText = 'Finished';
                }
                
                eventElement.innerHTML = `
                    <h4>${event.title}</h4>
                    <p class="time">${event.time}</p>
                    <p class="location">${event.location}</p>
                    <p>${event.description}</p>
                    <p class="event-status ${statusClass}"><strong>Status:</strong> ${statusText}</p>
                `;
                eventsContainer.appendChild(eventElement);
            });
        } else {
            eventsContainer.innerHTML = '<div class="no-events">No events scheduled for this day</div>';
        }
        
        // Show the detail view and overlay
        document.getElementById('day-detail-view').style.display = 'block';
        document.getElementById('calendar-overlay').style.display = 'block';
    }
    
    // Close detail view
    document.getElementById('close-detail').addEventListener('click', function() {
        document.getElementById('day-detail-view').style.display = 'none';
        document.getElementById('calendar-overlay').style.display = 'none';
    });
    
    // Close detail view when clicking on overlay
    document.getElementById('calendar-overlay').addEventListener('click', function() {
        document.getElementById('day-detail-view').style.display = 'none';
        document.getElementById('calendar-overlay').style.display = 'none';
    });
    
    // Initial render with Hong Kong timezone
    const hongKongTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"});
    const hongKongDate = new Date(hongKongTime);
    currentMonth = hongKongDate.getMonth();
    currentYear = hongKongDate.getFullYear();
    
    renderCalendar(currentMonth, currentYear);
    
    // Navigation buttons
    document.getElementById('prev-month-main').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('next-month-main').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
}

// Add tab switching function
function switchToTab(tabId) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Set the corresponding tab button as active
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

// Chat functions
function openChat(groupName) {
    // Set the chat group name
    document.getElementById('chat-group-name').textContent = groupName + ' Chat';
    
    // Clear previous messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Add some sample messages to start the conversation
    addMessage(`Welcome to the ${groupName} group chat!`, 'System', new Date(), 'received');
    
    if (groupName === 'Board Games') {
        addMessage('Hello everyone! Looking forward to our game tomorrow.', 'Margaret', new Date(Date.now() - 300000), 'received');
        addMessage('Me too! See you all there.', 'Robert', new Date(Date.now() - 180000), 'received');
    } else if (groupName === 'Tai Chi') {
        addMessage('Don\'t forget our session starts at 9 AM sharp!', 'Instructor Chen', new Date(Date.now() - 600000), 'received');
        addMessage('Thanks for the reminder!', 'Participant', new Date(Date.now() - 300000), 'received');
    } else if (groupName === 'Pottery') {
        addMessage('Just a reminder that our class has been rescheduled to next Monday.', 'Instructor Wong', new Date(Date.now() - 900000), 'received');
    } else {
        addMessage('This is the beginning of your conversation.', 'System', new Date(), 'received');
    }
    
    // Show the chat modal
    document.getElementById('chat-modal').style.display = 'flex';
    
    // Focus on the message input
    document.getElementById('message-input').focus();
}

function openNewChat() {
    alert('New chat feature coming soon!');
}

function markAllRead() {
    // In a real implementation, this would mark all notifications as read
    alert('All notifications marked as read!');
}

function addMessage(content, sender, timestamp, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    messageDiv.innerHTML = `
        <div class="message-header">${sender}</div>
        <div class="message-content">${content}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
