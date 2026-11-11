

// Weather Dashboard - Grace Wambui
// Works with OpenWeatherMap if you have a key, otherwise uses Open-Meteo (no key)

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const cityNameEl = document.getElementById("city-name");
const weatherIconEl = document.getElementById("weather-icon");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");
const historyList = document.getElementById("search-history");

let searchHistory = JSON.parse(localStorage.getItem("graceWeatherHistory") || "[]");

function showLoading() {
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  weatherDisplay.classList.add("hidden");
}
function hideLoading() {
  loadingEl.classList.add("hidden");
}
function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  hideLoading();
}

function displayWeather(data) {
  cityNameEl.textContent = data.name;
  tempEl.textContent = Math.round(data.main.temp) + "°C";
  descEl.textContent = data.weather[0].description;
  feelsLikeEl.textContent = Math.round(data.main.feels_like) + "°C";
  humidityEl.textContent = data.main.humidity + "%";
  windEl.textContent = data.wind.speed + " m/s";
  pressureEl.textContent = data.main.pressure + " hPa";
  weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIconEl.alt = data.weather[0].description;
  weatherDisplay.classList.remove("hidden");
  hideLoading();
}

function saveToHistory(city) {
  // Don't add duplicates
  searchHistory = [city, ...searchHistory.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
  localStorage.setItem("graceWeatherHistory", JSON.stringify(searchHistory));
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = "";
  searchHistory.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      cityInput.value = city;
      getWeather(city);
    });
    historyList.appendChild(li);
  });
}

async function getWeather(city) {
  showLoading();
  try {
    // If you have API_KEY from config.js, use OpenWeatherMap
    if (typeof API_KEY !== "undefined" && API_KEY) {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
      if (!res.ok) throw new Error("City not found. Try Nairobi, London, Paris...");
      const data = await res.json();
      displayWeather(data);
      saveToHistory(data.name);
      return;
    }

    // No key - fallback to Open-Meteo (free, no key)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) throw new Error("City not found. Try Nairobi, London, Paris...");
    const place = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,weather_code&timezone=auto`);
    const w = await weatherRes.json();
    const cur = w.current;

    // Convert to same shape as OpenWeatherMap so displayWeather works
    const codeMap = { 0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 48: "Fog", 51: "Drizzle", 61: "Rain", 71: "Snow", 80: "Rain showers", 95: "Thunderstorm" };
    const fakeData = {
      name: place.name + ", " + (place.country || ""),
      main: { temp: cur.temperature_2m, feels_like: cur.apparent_temperature, humidity: cur.relative_humidity_2m, pressure: cur.pressure_msl },
      wind: { speed: cur.wind_speed_10m },
      weather: [{ description: codeMap[cur.weather_code] || "Cloudy", icon: "02d" }]
    };
    displayWeather(fakeData);
    saveToHistory(fakeData.name);

  } catch (err) {
    showError(err.message);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

renderHistory();
// Load Nairobi on start so page is not empty
getWeather("Nairobi");
