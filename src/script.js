let currentCityElement = document.querySelector(".current__title");
let currentMinElement = document.querySelector("#current-temp-min");
let currentMaxElement = document.querySelector("#current-temp-max");
let currentWindElement = document.querySelector("#current-wind");
let currentHumidityElement = document.querySelector("#current-humidity");
let currentStateElement = document.querySelector("#current-state");
let currentEmojiElement = document.querySelector("#current-emoji");

let searchForm = document.querySelector(".searcher");
let searchInput = document.querySelector("#new-city");
let currentTemp = document.querySelector(".current__temperature");
let conversorBox = document.querySelector(".temp-converter");
let conversorButton = document.querySelector("#converter");

let newCity;
let newCityLat;
let newCityLong;

// Feature #8 - Catching the person's language and applying it
let myLang = navigator.language;
myLang = myLang.slice(0, 2);

const APIKey = 'e61181eedc6dee94a571b45ef2692956';

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

  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = elaborateNow;
}
whatDayIsIt();
setInterval(whatDayIsIt, 60000);

// Feature #2 - Grab current location for first weather info

function updateInfoInApp(json){
  // Update min and max temp
  let currentMin = json.main.temp_min;
  let currentMax = json.main.temp_max;
  currentMinElement.innerHTML = Math.round(currentMin);
  currentMaxElement.innerHTML = Math.round(currentMax);

  // Update humidity info
  let currentHumidity = `Humidity: ${json.main.humidity}%`;
  currentHumidityElement.innerHTML = currentHumidity;

  // Update wind info
  let currentWind = `Wind: ${json.wind.speed}m/s`;
  currentWindElement.innerHTML = currentWind;

  // Update description of state of weather
  let currentDescription = json.weather[0].description;
  currentStateElement.innerHTML = capitaliseThis(currentDescription);

  // Update of weather emoji
  let currentState = json.weather[0].icon;
  currentState = setEmoji(currentState);
  currentEmojiElement.innerHTML = currentState;

  // Update the city name
  let currentCity = json.name;
  currentCityElement.innerHTML = currentCity;

  // Get the lat and long
  newCityLat = json.coord.lat;
  newCityLong = json.coord.lon;
}

function weatherInCurrentLocation(){

  function fetchWeatherFromCoords(position) {
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;
    let APIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${APIKey}&units=metric&lang=${myLang}`;  

    console.log(APIUrl);

    fetch(APIUrl)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        updateInfoInApp(json)
      })
      .catch((error) => console.log(error));
  }

  let myPosition = navigator.geolocation.getCurrentPosition(fetchWeatherFromCoords);
}
weatherInCurrentLocation();

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
    let newMinTemp = turnTempToF(currentMinElement.innerHTML);
    let newMaxTemp = turnTempToF(currentMaxElement.innerHTML);

    currentMinElement.innerHTML = newMinTemp;
    currentMaxElement.innerHTML = newMaxTemp;

    conversorButton.innerHTML = "See in °C";
    tempFormat.forEach(function (el){
      el.innerHTML = " °F"
    });
  } else {
    // if false, (it must say - See in ºC) we want the temp to be converted to C
    let newMinTemp = turnTempToC(currentMinElement.innerHTML);
    let newMaxTemp = turnTempToC(currentMaxElement.innerHTML);

    currentMinElement.innerHTML = newMinTemp;
    currentMaxElement.innerHTML = newMaxTemp;

    conversorButton.innerHTML = "See in °F";
    tempFormat.forEach(function (el){
      el.innerHTML = " °C"
    });
  }
})

// Feature #4 - Update the city with user input

function updateCity(event) {
  event.preventDefault();
  newCity = searchInput.value;
  searchInput.value = "";
  currentCityElement.innerHTML = newCity;
  fetchCurrentWeather();
}

searchForm.addEventListener("submit", updateCity);

// Feature #5 - Extract actual info from API
function fetchCurrentWeather() {
  let APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${APIKey}&units=metric&lang=${myLang}`

  console.log(APIUrl);

  // Getting current weather info from city that the user wrote
  fetch(APIUrl)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      updateInfoInApp(json)
    })
    .catch((error) => console.log(error));
  
    // Getting the forecast for the lat & long of the city the user searched for
//     let APIUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${newCityLat}&lon=${newCityLong}&exclude=minutely,hourly&appid=${APIKey}&units=metric`;
//     console.log(APIUrl2);
}

function setEmoji(state) {
  if (state == '01d' || state == '01n') {
    return '🌞';
  } else if (state == '02d' || state == '03d' || state == '04d' || state == '02n' || state == '03n' || state == '04n') {
    return '☁';
  } else if (state == '13d' || state == '13n') {
    return '❄'
  } else if (state == '09d' || state == '10d' || state == '09n' || state == '10n') {
    return '🌧'
  } else if (state == '11d' || state == '11n') {
    return '⚡'
  } else {
    return '🌈'
  }
}

// Feature #6 - Weather in your location button
let currentLocationButton = document.querySelector('.current-city');

currentLocationButton.addEventListener("click", weatherInCurrentLocation);

// Feature #7 - Capitalising and proper word formatting
function capitaliseThis(word) {
  word = word.toLowerCase();
  let firstLetter = word[0];
  firstLetter = firstLetter.toUpperCase();
  let restOfWOrd = word.slice(1);
  return word = firstLetter.concat(restOfWOrd);
}


// BUG
// The setEmoji is not using the OR 