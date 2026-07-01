const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');

async function getWeather(city) {
    weatherResult.innerHTML = '<div class="loading">Loading weather data...</div>';
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found! Please check the spelling.');
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherResult.innerHTML = `<div class="error-message">❌ ${error.message}</div>`;
    }
}

function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const condition = data.weather[0].description;
    const humidity = data.main.humidity;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    weatherResult.innerHTML = `
        <div class="weather-card">
            <div class="city-name">📍 ${cityName}</div>
            <img class="weather-icon" src="${iconUrl}" alt="${condition}">
            <div class="temperature">${temperature}°C</div>
            <div class="condition">${condition}</div>
            <div class="humidity">💧 Humidity: ${humidity}%</div>
        </div>
    `;
}

function handleSearch() {
    const city = cityInput.value.trim();
    if (city === '') {
        weatherResult.innerHTML = '<div class="error-message">⚠️ Please enter a city name!</div>';
        return;
    }
    getWeather(city);
}

searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
