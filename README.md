# AnneMcC_WeatherExercise
Coding exercise - Open weather Map

a small single page application to pull data from API requests: OpenWeatherMap.org

- basic page layout in HTML5
- all page events triggered in getWeatherScript.js
- based around the concept of user-selected locationsById --> user clicks a button --> creates a list of Weather objects
- the API response data is placed into local storage (if not already found by <20 minute timestamp && the current locationID) 
- data is then retrieved from local cache (in JSON format) & parsed into the weather object - displaying Temps, humidity, Air pressure,    Rainfall
- Known issues - in the API responses for both current weather & 5-day forecast, I couldn't find the Rainfall property!
               - given time constrainsts I haven't really focussed on styling or modularising, but the main focus was around the weather objects being created, retrieved & parsed into a list of objects
