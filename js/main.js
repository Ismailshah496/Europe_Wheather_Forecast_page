const citySelect = document.getElementById('citySelect');
const container = document.getElementById('weatherContainer');
const mainView = document.getElementById('mainView');
const backButton = document.getElementById('backButton');
const footer = document.querySelector('.footer');

// Weather icon mapping for 7timer API codes
const weatherIcons = {
    'clear': 'clear.png',
    'pcloudy': 'pcloudy.png',
    'mcloudy': 'mcloudy.png',
    'cloudy': 'cloudy.png',
    'humid': 'humid.png',
    'lightrain': 'lightrain.png',
    'oshower': 'oshower.png',
    'ishower': 'ishower.png',
    'lightsnow': 'lightsnow.png',
    'rain': 'rain.png',
    'snow': 'snow.png',
    'rainsnow': 'rainsnow.png',
    'ts': 'tstorm.png',
    'tsrain': 'tsrain.png',
    'fog': 'fog.png',
    'windy': 'windy.png'
};

// Back button click handler
backButton.addEventListener('click', () => {
    mainView.style.display = 'block';
    container.innerHTML = '';
    backButton.style.display = 'none';
    citySelect.value = '';
    footer.classList.remove('show');
});

// When a city is selected
citySelect.addEventListener('change', async () => {
    if (!citySelect.value) return;
    
    container.innerHTML = '<p>Loading weather data...</p>';
    mainView.style.display = 'none';
    backButton.style.display = 'block';
    footer.classList.remove('show');
    
    try {
        const [lat, lon] = citySelect.value.split(',');
        const cityName = citySelect.options[citySelect.selectedIndex].text;
        
        // Call 7timer API
        const response = await fetch(
            `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`
        );
        
        if (!response.ok) throw new Error('Weather data fetch failed');
        
        const data = await response.json();
        displayWeather(cityName, data.dataseries.slice(0, 7));
        footer.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p style="color: red;">Failed to load weather data. Please try again.</p>';
        footer.classList.remove('show');
    }
});

function getWeatherIcon(weatherCode) {
    // Convert 7timer weather codes to our icon names
    const codeMapping = {
        'clear': 'clear',
        'clearday': 'clear',
        'clearnight': 'clear',
        'pcloudyday': 'pcloudy',
        'pcloudynight': 'pcloudy',
        'mcloudyday': 'mcloudy',
        'mcloudynight': 'mcloudy',
        'cloudyday': 'cloudy',
        'cloudynight': 'cloudy',
        'humidday': 'humid',
        'humidnight': 'humid',
        'lightrainday': 'lightrain',
        'lightrainnight': 'lightrain',
        'oshowerday': 'oshower',
        'oshowernight': 'oshower',
        'ishowerday': 'ishower',
        'ishowernight': 'ishower',
        'lightsnowday': 'lightsnow',
        'lightsnownight': 'lightsnow',
        'rainday': 'rain',
        'rainnight': 'rain',
        'snowday': 'snow',
        'snownight': 'snow',
        'rainsnowday': 'rainsnow',
        'rainsnownight': 'rainsnow',
        'tsday': 'ts',
        'tsnight': 'ts',
        'tsrainday': 'tsrain',
        'tsrainnight': 'tsrain',
        'fogday': 'fog',
        'fognight': 'fog'
    };

    const mappedCode = codeMapping[weatherCode.toLowerCase()] || 'cloudy';
    return weatherIcons[mappedCode];
}

function displayWeather(cityName, days) {
    container.innerHTML = '';
    
    const weatherGrid = document.createElement('div');
    weatherGrid.className = 'weather-container';
    
    days.forEach((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        
        const card = document.createElement('div');
        card.className = 'weather-card';
        
        // Get weather icon using the new mapping function
        const iconFile = getWeatherIcon(day.weather);
        
        // Convert weather code to description
        let weatherDesc = getWeatherDescription(day.weather);
        
        card.innerHTML = `
            <div class="weather-icon">
                <img src="images/${iconFile}" alt="${weatherDesc}">
            </div>
            <h4>${date.toDateString()}</h4>
            <p class="weather-desc">${weatherDesc}</p>
            <p><strong>Temperature:</strong> ${day.temp2m}°C</p>
            <p><strong>Wind Speed:</strong> ${day.wind10m_max} km/h</p>
        `;
        
        weatherGrid.appendChild(card);
    });
    
    container.appendChild(weatherGrid);
    
    // Show the footer after weather data is displayed
    if (footer) {
        footer.classList.add('show');
    }
}

function getWeatherDescription(code) {
    const weatherTypes = {
        'clearday': 'Clear Sky',
        'clearnight': 'Clear Sky',
        'pcloudyday': 'Partly Cloudy',
        'pcloudynight': 'Partly Cloudy',
        'mcloudyday': 'Mostly Cloudy',
        'mcloudynight': 'Mostly Cloudy',
        'cloudyday': 'Cloudy',
        'cloudynight': 'Cloudy',
        'humidday': 'Humid',
        'humidnight': 'Humid',
        'lightrainday': 'Light Rain',
        'lightrainnight': 'Light Rain',
        'oshowerday': 'Occasional Showers',
        'oshowernight': 'Occasional Showers',
        'ishowerday': 'Isolated Showers',
        'ishowernight': 'Isolated Showers',
        'lightsnowday': 'Light Snow',
        'lightsnownight': 'Light Snow',
        'rainday': 'Rain',
        'rainnight': 'Rain',
        'snowday': 'Snow',
        'snownight': 'Snow',
        'rainsnowday': 'Rain with Snow',
        'rainsnownight': 'Rain with Snow',
        'tsday': 'Thunderstorm',
        'tsnight': 'Thunderstorm',
        'tsrainday': 'Thunderstorm with Rain',
        'tsrainnight': 'Thunderstorm with Rain',
        'fogday': 'Foggy',
        'fognight': 'Foggy'
    };
    
    return weatherTypes[code.toLowerCase()] || code;
}
