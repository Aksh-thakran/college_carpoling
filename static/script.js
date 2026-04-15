let bookMap = null;
let offerMap = null;

// Tab functionality with animations
function showTab(evt, tabName) {
    if (typeof tabName === 'undefined') {
        tabName = evt;
        evt = null;
    }

    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('animate-fade-in');
    });
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));

    const targetTab = document.getElementById(tabName + '-tab');
    targetTab.style.display = 'block';
    targetTab.classList.add('animate-fade-in');

    if (evt && evt.target) {
        evt.target.classList.add('active');
    } else {
        const button = document.querySelector(`.tab-button[onclick*="${tabName}"]`);
        if (button) button.classList.add('active');
    }

    setTimeout(() => {
        if (tabName === 'book' && bookMap) {
            bookMap.invalidateSize(true);
            updateRoutePreview('book');
        }
        if (tabName === 'offer' && offerMap) {
            offerMap.invalidateSize(true);
            updateRoutePreview('offer');
        }
    }, 250);
}

// Handle offer ride form submission with enhanced animations
document.getElementById('offer-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    // Show loading animation
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '🚀 Offering...';
    submitBtn.disabled = true;
    submitBtn.classList.add('animate-pulse');

    fetch('/offer_ride', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Success animation
            submitBtn.textContent = '✅ Success!';
            submitBtn.classList.remove('animate-pulse');
            submitBtn.classList.add('success-animation');
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('success-animation');
                this.reset();
                // Add fade out animation to form
                this.closest('.form-section').classList.add('animate-slide-up');
            }, 2000);
        } else {
            submitBtn.textContent = '❌ Error';
            submitBtn.classList.remove('animate-pulse');
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.textContent = '❌ Error';
        submitBtn.classList.remove('animate-pulse');
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
});

// Handle find ride form submission with animations
document.getElementById('find-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const from = document.getElementById('book-from').value;
    const to = document.getElementById('book-to').value;
    const date = document.getElementById('find-date').value;
    const vehicleType = document.getElementById('find-vehicle-type').value;

    const params = new URLSearchParams({
        from: from,
        to: to,
        date: date,
        vehicle_type: vehicleType
    });

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '🔍 Searching...';
    submitBtn.disabled = true;
    submitBtn.classList.add('animate-pulse');

    fetch('/get_rides?' + params)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('animate-pulse');
        displayResults(data.rides);
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('animate-pulse');

        // Show user-friendly error message
        const resultsDiv = document.getElementById('results');
        const rideList = document.getElementById('ride-list');
        rideList.innerHTML = '<div class="no-rides animate-fade-in"><p>❌ Error searching rides. Please try again or <a href="/rides">view all available rides</a>.</p></div>';
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('animate-fade-in');
    });
});

// Display search results with staggered animations
function displayResults(rides) {
    const resultsDiv = document.getElementById('results');
    const rideList = document.getElementById('ride-list');

    rideList.innerHTML = '';

    if (rides.length === 0) {
        rideList.innerHTML = '<div class="no-rides animate-fade-in"><p>😔 No rides match your search criteria.</p><p>Try different locations or dates, or <a href="/rides">view all available rides</a>.</p></div>';
    } else {
        rides.forEach((ride, index) => {
            const rideDiv = document.createElement('div');
            rideDiv.className = 'ride-item animate-slide-in';
            rideDiv.style.animationDelay = `${index * 0.1}s`;

            const vehicleIcon = ride.vehicle_type === '4-wheeler' ? '🚗' : '🏍️';

            rideDiv.innerHTML = `
                <div class="ride-header">
                    <strong>${vehicleIcon} ${ride.driver}</strong>
                    <span class="vehicle-type">${ride.vehicle_type}</span>
                </div>
                <div class="ride-details">
                    <p><strong>Route:</strong> ${capitalize(ride.from)} → ${capitalize(ride.to)}</p>
                    <p><strong>Date:</strong> ${ride.date} | <strong>Time:</strong> ${ride.time}</p>
                    <p><strong>Seats:</strong> ${ride.seats} | <strong>Contact:</strong> ${ride.contact}</p>
                    ${ride.notes ? `<p><strong>Notes:</strong> ${ride.notes}</p>` : ''}
                </div>
                <button onclick="bookRide(${ride.id})" class="btn-book animate-hover">🎫 Book This Ride</button>
            `;
            rideList.appendChild(rideDiv);
        });
    }

    resultsDiv.style.display = 'block';
    resultsDiv.classList.add('animate-fade-in');
}

// Enhanced book ride function with animations
function bookRide(rideId) {
    // Add booking animation
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '🎉 Booking...';
    button.disabled = true;
    button.classList.add('animate-pulse');

    setTimeout(() => {
        button.textContent = '✅ Booked!';
        button.classList.remove('animate-pulse');
        button.classList.add('booked-animation');
        setTimeout(() => {
            alert('Ride booked! (This is a prototype - in a real app, this would handle actual booking)');
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('booked-animation');
        }, 1500);
    }, 1000);
}

// Helper function to capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const mapState = {
    book: {
        map: null,
        layer: null,
        selected: 'from',
        markers: { from: null, to: null },
        polyline: null
    },
    offer: {
        map: null,
        layer: null,
        selected: 'from',
        markers: { from: null, to: null },
        polyline: null
    }
};

const defaultCenter = [20, 0];

function initMap(mapId, tab) {
    const map = L.map(mapId, {
        zoomControl: false,
        preferCanvas: true,
        attributionControl: false
    }).setView(defaultCenter, 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        detectRetina: true
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    map.on('click', function(e) {
        handleMapClick(tab, e.latlng);
    });

    map.whenReady(() => {
        map.invalidateSize(true);
    });

    mapState[tab].map = map;
    mapState[tab].layer = layer;
    return map;
}

function initMaps() {
    if (!window.L) {
        const mapElements = document.querySelectorAll('.map-container');
        mapElements.forEach(el => {
            el.innerHTML = '<div class="map-error">Map library could not be loaded. Please check your internet connection.</div>';
        });
        return;
    }

    initMap('book-map', 'book');
    initMap('offer-map', 'offer');
    updateRoutePreview('book');
    updateRoutePreview('offer');
}

function setMapSelection(tab, field) {
    mapState[tab].selected = field;
    const instruction = document.querySelector(`#${tab}-tab .map-instruction`);
    if (instruction) {
        instruction.textContent = `Click the map to set the ${field.toUpperCase()} location.`;
    }
}

function handleMapClick(tab, latlng) {
    const state = mapState[tab];
    const field = state.selected;
    const input = document.getElementById(`${tab}-${field}`);
    const latInput = document.getElementById(`${tab}-${field}-lat`);
    const lngInput = document.getElementById(`${tab}-${field}-lng`);

    if (!input || !latInput || !lngInput) return;

    reverseGeocode(latlng).then(address => {
        input.value = address || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
        latInput.value = latlng.lat;
        lngInput.value = latlng.lng;
        updateMarker(tab, field, latlng, address || `${field.charAt(0).toUpperCase() + field.slice(1)}`);
        updateRoutePreview(tab);
    });
}

function updateMarker(tab, field, latlng, title) {
    const state = mapState[tab];
    if (state.markers[field]) {
        state.layer.removeLayer(state.markers[field]);
    }
    state.markers[field] = L.marker([latlng.lat, latlng.lng]).bindPopup(title || field);
    state.markers[field].addTo(state.layer).openPopup();
}

function reverseGeocode(latlng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`;
    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => data.display_name)
    .catch(() => null);
}

function updateRoutePreview(tab) {
    const state = mapState[tab];
    const map = state.map;
    const layer = state.layer;
    if (!map || !layer) return;

    layer.clearLayers();
    if (state.polyline) {
        map.removeLayer(state.polyline);
        state.polyline = null;
    }

    const fromLat = Number(document.getElementById(`${tab}-from-lat`).value);
    const fromLng = Number(document.getElementById(`${tab}-from-lng`).value);
    const toLat = Number(document.getElementById(`${tab}-to-lat`).value);
    const toLng = Number(document.getElementById(`${tab}-to-lng`).value);

    const fromExists = !isNaN(fromLat) && !isNaN(fromLng);
    const toExists = !isNaN(toLat) && !isNaN(toLng);

    if (fromExists) {
        state.markers.from = L.marker([fromLat, fromLng]).bindPopup(document.getElementById(`${tab}-from`).value || 'From');
        state.markers.from.addTo(layer);
    }
    if (toExists) {
        state.markers.to = L.marker([toLat, toLng]).bindPopup(document.getElementById(`${tab}-to`).value || 'To');
        state.markers.to.addTo(layer);
    }

    if (fromExists && toExists) {
        state.polyline = L.polyline([
            [fromLat, fromLng],
            [toLat, toLng]
        ], {
            color: '#764ba2',
            weight: 5,
            opacity: 0.8,
            dashArray: '8,6'
        }).addTo(layer);

        map.fitBounds([
            [fromLat, fromLng],
            [toLat, toLng]
        ], { padding: [60, 60] });
    } else if (fromExists) {
        map.setView([fromLat, fromLng], 13);
    } else if (toExists) {
        map.setView([toLat, toLng], 13);
    } else {
        map.setView(defaultCenter, 2);
    }
}

// Add interactive animations on page load
document.addEventListener('DOMContentLoaded', function() {
    showTab('book');
    initMaps();

    const routeInputs = [
        'book-from', 'book-to',
        'offer-from', 'offer-to'
    ];

    routeInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => {
                if (id.startsWith('find-')) {
                    updateRoutePreview('book');
                } else {
                    updateRoutePreview('offer');
                }
            });
        }
    });

    // Add hover animations to form elements
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('animate-slide-up');
        });
        element.addEventListener('blur', function() {
            this.parentElement.classList.remove('animate-slide-up');
        });
    });

    // Add bounce animation to header on load
    const header = document.querySelector('header h1');
    header.classList.add('animate-bounce');
    setTimeout(() => {
        header.classList.remove('animate-bounce');
    }, 2000);

    // Add fade-in animation to tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button, index) => {
        button.style.animationDelay = `${index * 0.2}s`;
        button.classList.add('animate-fade-in');
    });
});