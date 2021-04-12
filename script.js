let currentCity = document.querySelector(".current__title");
let searchForm = document.querySelector(".searcher");
let searchInput = document.querySelector("#city");
let newCity;
let currentTemp = document.querySelector(".current__temperature");
let conversorBox = document.querySelector(".temp-converter");
let conversorButton = document.querySelector("#converter");
let minTemp = document.querySelector("#current-temp-min");
let maxTemp = document.querySelector("#current-temp-max");
let emojiWeather = document.querySelector("#current-emoji");

// Feature #1 - Display time & date

function whatDayIsIt() {

  let now = new Date();

  let date = now.getDate();
  let day = now.getDay();
  let weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  day = weekDays[day];
  let month = now.getMonth();
  let allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  month = allMonths[month];
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // if the minutes are lower than 10, we still want them to have two digits
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  // if the date is the first, second or third, the appendix "th" is different
  switch(date) {
    case 1:
      date = `${date}st`
      break;
    case 21:
      date = `${date}st`
      break;
    case 31:
      date = `${date}st`
      break;
    case 2:
      date = `${date}nd`
      break;
    case 22:
      date = `${date}nd`
      break;
    case 3:
      date = `${date}rd`
      break;
    case 23:
      date = `${date}rd`
      break;
    default:
      date = `${date}th`
  }

  let elaborateNow = `${day} ${date} ${month}, ${hours}:${minutes}` // Wednesday 24th March, 10.30

  let currentDate = document.querySelector(".current__date");
  currentDate.innerHTML = elaborateNow;
}
whatDayIsIt();
setInterval(whatDayIsIt, 60000);

// Feature #1.2 - Grab current location for first weather info
function currentWeatherInCurrentLocation(){
  function fetchWeatherFrom(position) {
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;
    let APIKey;
    let APIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${APIKey}&units=metric`;

    fetch(APIUrl)
      .then((response) => response.json())
      .then((json) => {
        let newMinTemp = json.main.temp_min;
        let newMaxTemp = json.main.temp_max;
        let newState = json.weather[0].main;
        let newCity = json.name;
        
        minTemp.innerHTML = Math.round(newMinTemp);
        maxTemp.innerHTML = Math.round(newMaxTemp);
        setEmoji(newState);
        currentCity.innerHTML = newCity;
      })
      .catch((error) => console.log(error));
  }

  let myPosition = navigator.geolocation.getCurrentPosition(fetchWeatherFrom);
}
currentWeatherInCurrentLocation();

// Feature #2 - Update the city with form input

function updateCity(event) {
  event.preventDefault();
  newCity = searchInput.value;
  currentCity.innerHTML = newCity;
  fetchCurrentWeather()
}

searchForm.addEventListener("submit", updateCity);

// Feature #3 - Celsius / Farhenreit Converter

function displayBox() {
  conversorBox.style.display = "inline-block";
  setTimeout(hideBox, 2000);
}
function hideBox() {
  conversorBox.style.display = "none";
}

currentTemp.addEventListener("mouseover", displayBox);

conversorButton.addEventListener("click", function(){
  let tempFormat = document.querySelectorAll(".temp-format");

  function turnTempToF(temp) {
    let newTemp = (temp * 1.8) + 32;
    return Math.round(newTemp);
  }
  function turnTempToC(temp) {
    let newTemp = (temp - 32) / 1.8
    return Math.round(newTemp);
  }

  if (conversorButton.innerHTML == "See in °F") {
    // if true, we want the temp to be converted to F
    let newMinTemp = turnTempToF(minTemp.innerHTML);
    let newMaxTemp = turnTempToF(maxTemp.innerHTML);

    minTemp.innerHTML = newMinTemp;
    maxTemp.innerHTML = newMaxTemp;

    conversorButton.innerHTML = "See in °C";
    tempFormat.forEach(function (el){
      el.innerHTML = " °F"
    });
  } else {
    // if false, (it must say - See in ºC) we want the temp to be converted to C
    let newMinTemp = turnTempToC(minTemp.innerHTML);
    let newMaxTemp = turnTempToC(maxTemp.innerHTML);

    minTemp.innerHTML = newMinTemp;
    maxTemp.innerHTML = newMaxTemp;

    conversorButton.innerHTML = "See in °F";
    tempFormat.forEach(function (el){
      el.innerHTML = " °C"
    });

  }
})

// Feature #4 - Extract actual info from API
function fetchCurrentWeather() {
  const APIKey;
  // let myLang = 'es';
  let APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${APIKey}&units=metric`
  // let APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${APIKey}&units=metric&lang=${myLang}`

  fetch(APIUrl)
    .then(response => response.json())
    .then(json => {
      let newMinTemp = json.main.temp_min;
      let newMaxTemp = json.main.temp_max;
      let newState = json.weather[0].main;
      
      setEmoji(newState);
      minTemp.innerHTML = Math.round(newMinTemp);
      maxTemp.innerHTML = Math.round(newMaxTemp);
    })
}

function setEmoji(state) {
  if (state == 'Clear') {
    emojiWeather.innerHTML = '🌞';
  } else if (state == 'Clouds') {
    emojiWeather.innerHTML = '☁';
  } else if (state == 'Snow') {
    emojiWeather.innerHTML = '❄'
  } else if (state == 'Rain' && state == 'Drizzle') {
    emojiWeather.innerHTML = '🌧'
  } else if (state == 'Thunderstorm') {
    emojiWeather.innerHTML = '⚡'
  } else {
    emojiWeather.innerHTML = '🌈'
  }
}

// Feature #5 - Weather in your location button
let currentLocationButton = document.querySelector('.local-city');

currentLocationButton.addEventListener("click", currentWeatherInCurrentLocation);
