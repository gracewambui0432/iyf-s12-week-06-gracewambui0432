// Weather Dashboard - Grace Wambui - Week 6
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const historyList = document.getElementById("search-history");

async function getWeather(city) {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  try {
    showLoading();
    hideError();
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) throw new Error("City not found - try another city");
      if (response.status === 401) throw new Error("API key not valid yet - new keys can take an hour");
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    displayWeather(data);
    saveToHistory(city);
  } catch (err) {
    showError(err.name === "TypeError" ? "Network error - check your connection" : err.message);
  } finally {
    hideLoading();
  }
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} m/s`;
  pressure.textContent = `${data.main.pressure} hPa`;
  weatherDisplay.classList.remove("hidden");
}

function showLoading() {
  loading.classList.remove("hidden");
  weatherDisplay.classList.add("hidden");
}
function hideLoading() { loading.classList.add("hidden"); }
function showError(msg) {
  error.textContent = msg;
  error.classList.remove("hidden");
}
function hideError() { error.classList.add("hidden"); }

function saveToHistory(city) {
  let recent = JSON.parse(localStorage.getItem("recent")) || [];
  recent = [city, ...recent.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
  localStorage.setItem("recent", JSON.stringify(recent));
  loadHistory();
}

function loadHistory() {
  let recent = JSON.parse(localStorage.getItem("recent")) || [];
  historyList.innerHTML = "";
  recent.forEach(city => {
    let li = document.createElement("li");
    li.textContent = city;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => getWeather(city));
    historyList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let city = cityInput.value.trim();
  if (city) getWeather(city);
});

loadHistory();

