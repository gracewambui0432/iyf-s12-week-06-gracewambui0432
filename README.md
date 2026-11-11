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

## How to Run

1. Clone this repo:
```bash
git clone https://github.com/gracewambui0432/iyf-s12-week-06-gracewambui0432.git
