# Week 06: Asynchronous JavaScript - Weather Dashboard

**Author**
- **Name:** Grace Wambui
- **GitHub:** @gracewambui0432
- **Date:** November 11, 2026

## Project Description

For this week I had to learn async JavaScript. It was about callbacks, promises, async/await and the Fetch API. The main project was to build a weather dashboard using OpenWeatherMap API. You type a city and it shows you the weather. I also did the other small tasks like the user directory with JSONPlaceholder.

At first async was very confusing for me. I kept asking why `setTimeout` with 0 still runs last. But after practicing with my own examples from Nairobi, it started to make sense.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- OpenWeatherMap API
- Open-Meteo API as fallback (no key needed)
- JSONPlaceholder API for practice tasks

## Features

**Weather Dashboard**
- Shows real weather for any city
- Shows temperature, feels like, humidity, wind, pressure, description and icon
- Search form with loading and error messages
- Handles errors like city not found and network error
- Recent searches saved in localStorage (last 5)
- Click on a recent city to search again
- Loads Nairobi by default so the page is not empty

## Project Structure
```
iyf-s12-week-06-gakuruclaire39-cmd/
├── daily-challenges.js    # Day 1-5 challenges
├── async-practice.js      # Lesson 11
├── app.js                 # Weather Dashboard
├── config.js
├── index.html
├── style.css
└── README.md
```

## How to Run

1. Clone this repo:
```bash
git clone https://github.com/gracewambui0432/iyf-s12-week-06-gracewambui0432.git
```

## Challenges Faced
I had many errors this week.First I got a SyntaxError: unexpected token: numeric literal in async-practice.js:208 - it was because I pasted a heading like 12.3 POST without // in front.
 I learned every heading in JS must be a comment.Then I got GET config.js 404 on GitHub Pages. My config.js was git-ignored so it worked on my laptop but not live. I fixed it by making my app.js check if (typeof API_KEY !== "undefined") and fall back to Open-Meteo if there is no key.
I also got Cannot set properties of null (innerHTML) because I used the same JS file on different HTML pages and one page didn't have users-container. I fixed it by checking if (!container) 
Another problem was top-level await SyntaxError, I wrapped it in an async main() function. For weather icons I had to build the URL like https://openweathermap.org/img/wn/${icon}@2x.png.

## Live Demo
View Weather DashboardView Async Practice - I added this to the live demo to see my async-practice.js in the console and to check for errors in the codeView User Directory:https://gracewambui0432.github.io/iyf-s12-week-06-gracewambui0432/

 
