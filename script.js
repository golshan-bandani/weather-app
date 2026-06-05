const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMsg = document.getElementById('errorMsg');
const darkModeBtn = document.getElementById('darkModeBtn');

const API_KEY = 'a0e44b1688def3872014be3e11992243';

async function getWeather(city) {

    weatherCard.classList.add('hidden');
    errorMsg.classList.add('hidden');

    searchBtn.disabled = true;
    searchBtn.textContent = 'در حال جستجو...';

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fa`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'شهر پیدا نشد');
        }

        showWeather(data);
        localStorage.setItem('lastCity', city);

    } catch (error) {

        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
        console.error(error);

    } finally {

        searchBtn.disabled = false;
        searchBtn.textContent = 'جستجو';

    }
}

function showWeather(data) {

    document.getElementById('cityName').textContent = data.name;

    document.getElementById('bigTemp').textContent =
        `${Math.round(data.main.temp)}°`;

    document.getElementById('temp').textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById('humidity').textContent =
        `${data.main.humidity}%`;

    document.getElementById('wind').textContent =
        `${data.wind.speed} m/s`;

    document.getElementById('description').textContent =
        data.weather[0].description;

    document.getElementById('weatherIcon').src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherCard.classList.remove('hidden');

    const weatherMain = data.weather[0].main;

switch (weatherMain) {
    
    case 'Clear':
        document.body.style.background =
            'linear-gradient(135deg, #56ccf2, #2f80ed)';
        break;

    case 'Clouds':
        document.body.style.background =
            'linear-gradient(135deg, #bdc3c7, #2c3e50)';
        break;

    case 'Rain':
    case 'Drizzle':
        document.body.style.background =
            'linear-gradient(135deg, #4b79a1, #283e51)';
        break;

    case 'Thunderstorm':
        document.body.style.background =
            'linear-gradient(135deg, #232526, #414345)';
        break;

    case 'Snow':
        document.body.style.background =
            'linear-gradient(135deg, #e6dada, #274046)';
        break;

    default:
        document.body.style.background =
            'linear-gradient(135deg, #74b9ff, #0984e3)';
}
}

searchBtn.addEventListener('click', () => {

    const city = cityInput.value.trim();

    if (!city) {
        errorMsg.textContent = 'لطفاً نام شهر را وارد کنید';
        errorMsg.classList.remove('hidden');
        return;
    }

    getWeather(city);
});

cityInput.addEventListener('keypress', (event) => {

    if (event.key === 'Enter') {

        const city = cityInput.value.trim();

        if (!city) {
            errorMsg.textContent = 'لطفاً نام شهر را وارد کنید';
            errorMsg.classList.remove('hidden');
            return;
        }

        getWeather(city);
    }
});

darkModeBtn.addEventListener('click', () => {

    document.body.classList.toggle('dark');

    const isDark =
        document.body.classList.contains('dark');

    localStorage.setItem('darkMode', isDark);

    darkModeBtn.textContent =
        isDark ? '☀️' : '🌙';
});

window.addEventListener('load', () => {

    if (localStorage.getItem('darkMode') === 'true') {

        document.body.classList.add('dark');
        darkModeBtn.textContent = '☀️';
    }

    const lastCity = localStorage.getItem('lastCity');

    if (lastCity) {

        cityInput.value = lastCity;
        getWeather(lastCity);
    }
});
