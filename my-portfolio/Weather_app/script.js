const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatheritemEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const API_KEY = '8ff5fd7bff234edadb01c5141c463a08'; // <== Use /weather compatible key

// Time
setInterval(() => {
  const time = new Date();
  const day = time.getDay();
  const month = time.getMonth();
  const date = time.getDate();
  const hour = time.getHours();
  const min = time.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hoursIn12HrFormat = hour % 12 || 12;

  timeEl.innerHTML = `${hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat}:${min < 10 ? '0' + min : min} <span id="am-pm">${ampm}</span>`;
  dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

getWeatherData();

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;

    // Get current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        timezone.innerHTML = data.name;
        countryEl.innerHTML = `${data.sys.country}`;
        currentWeatheritemEl.innerHTML = `
          <div class="weather-item"><div>Humidity</div><div>${data.main.humidity}%</div></div>
          <div class="weather-item"><div>Pressure</div><div>${data.main.pressure} hPa</div></div>
          <div class="weather-item"><div>Wind Speed</div><div>${data.wind.speed} m/s</div></div>
          <div class="weather-item"><div>Temp</div><div>${data.main.temp}&#176; C</div></div>
        `;

        currentTempEl.innerHTML = `
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" class="w-icon" alt="weather-icon">
          <div class="other">
            <div class="day">${moment.unix(data.dt).format('dddd')}</div>
            <div class="temp">Current - ${data.main.temp}&#176; C</div>
            <div class="temp">Feels like - ${data.main.feels_like}&#176; C</div>
          </div>
        `;
      });

    // Get 5-day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        let forecastMap = {};

        // Group forecasts by day
        data.list.forEach(forecast => {
          const date = moment(forecast.dt_txt).format('ddd');
          if (!forecastMap[date]) forecastMap[date] = [];
          forecastMap[date].push(forecast);
        });

        // Build forecast cards
let forecastHTML = '';
let usedDays = new Set();
let today = moment().format('ddd');

data.list.forEach(forecast => {
  const day = moment(forecast.dt_txt).format('ddd');

  // Skip today's forecasts
  if (day === today || usedDays.has(day)) return;

  usedDays.add(day);

  const icon = forecast.weather[0].icon;
  const nightTemp = forecast.main.temp_min.toFixed(1);
  const dayTemp = forecast.main.temp_max.toFixed(1);

  forecastHTML += `
    <div class="weather-forecast-item">
      <div class="day">${day}</div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="w-icon" alt="icon">
      <div class="temp">Night - ${nightTemp}&#176; C</div>
      <div class="temp">Day - ${dayTemp}&#176; C</div>
    </div>
  `;
  
  if (usedDays.size >= 5) return;
});

weatherForecastEl.innerHTML = forecastHTML;

      });
  }, (error) => {
    alert("Please enable location to get weather updates.");
    console.error("Location error:", error);
  });
}
