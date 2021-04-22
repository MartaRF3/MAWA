//                         //
//     The variables       //
//                         //

// Current weather variables
let currentCityElement = document.querySelector(".current__title");
let currentMinElement = document.querySelector("#current-temp-min");
let currentMaxElement = document.querySelector("#current-temp-max");
let currentWindElement = document.querySelector("#current-wind");
let currentHumidityElement = document.querySelector("#current-humidity");
let currentStateElement = document.querySelector("#current-state");
let currentEmojiElement = document.querySelector("#current-emoji");

// Forecast weather variables
let forecast = document.querySelector(".forecast");

// Searcher variables
let searchForm = document.querySelector(".searcher");
let searchInput = document.querySelector("#new-city");

// Conversor variables
let currentTemp = document.querySelector(".current__temperature");
let conversorBox = document.querySelector(".temp-converter");
let conversorButton = document.querySelector("#converter");

let newCity;
let newCityLat;
let newCityLong;

const APIKey = 'e61181eedc6dee94a571b45ef2692956';

// Catching the user's language
let myLongLang = navigator.language;
let myLang = myLongLang.slice(0, 2);

//                                  //
//     The reusable functions       //
//                                  //

// Updates the current info in the html with the json data from the API
function updateCurrentInfoInApp(json){
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

// Updates forecast info in the html
function updateForecastInfoInApp(json) {
  let forecastHTML;
  // Make an array of days
  let dayOne = makeThisADate(json.daily[1].dt);
  let dayTwo = makeThisADate(json.daily[2].dt);
  let dayThree = makeThisADate(json.daily[3].dt);
  let dayFour = makeThisADate(json.daily[4].dt);
  let dayFive = makeThisADate(json.daily[5].dt);

  let daysArray = [dayOne, dayTwo, dayThree, dayFour, dayFive];

  daysArray.forEach(element => {
    let number = daysArray.indexOf(element) + 1;
    // Grab the min and max temp
    let forecastMin = json.daily[number].temp.min;
    let forecastMax = json.daily[number].temp.max;
    forecastMin = Math.round(forecastMin);
    forecastMax = Math.round(forecastMax);

    // Grab the weather emoji
    let forecastState = json.daily[number].weather[0].icon;
    forecastState = setEmoji(forecastState);

    let newDay = `
    <div class="forecast__card">
      <p class="forecast__date">${element}</p>
      <p class="forecast__emoji">${forecastState}</p>
      <p class="forecast__temperature">
        <span class="temp">${forecastMin}</span><span class="temp-format">°C</span> /
        <span class="temp">${forecastMax}</span><span class="temp-format">°C</span>
      </p>
    </div>
    `;
    
    if(forecastHTML) {
      forecastHTML = forecastHTML + newDay;
    } else {
      forecastHTML = newDay;
    }
  })

  forecast.innerHTML = forecastHTML;
}

// Picks the emoji that you need depending on weather description
function setEmoji(state) {
  if (state == '01d' || state == '01n') {
    return '🌞';
  } else if (state == '02d' || state == '03d' || state == '04d' || state == '02n' || state == '03n' || state == '04n') {
    return '☁';
  } else if (state == '13d' || state == '13n') {
    return '⛄'
  } else if (state == '09d' || state == '10d' || state == '09n' || state == '10n') {
    return '☔'
  } else if (state == '11d' || state == '11n') {
    return '⚡'
  } else {
    return '🌈'
  }
}

// Capitalises words
function capitaliseThis(word) {
  word = word.toLowerCase();
  let firstLetter = word[0];
  firstLetter = firstLetter.toUpperCase();
  let restOfWOrd = word.slice(1);
  return word = firstLetter.concat(restOfWOrd);
}

// Converts unix timestamp into a date DD/MM
function makeThisADate(unix) {
  let date = new Date(unix*1000).toLocaleDateString(myLongLang, {
    day: '2-digit',
    month: 'short'
  });
  return date;
}

//                        //
//     The features       //
//                        //


// Feature #1 - Display time & date
function whatDayIsIt() {
  let now = new Date();

  let date = now.getDate();
  let day = now.getDay();
  let weekDays;
  if (myLang = 'es') {
    weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  } else if (myLang = 'ca') {
    weekDays = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'];
  } else if (myLang = 'de') {
    weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  } else {
    weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
  };
  day = weekDays[day-1];
  let month = now.getMonth();
  let allMonths;
  if (myLang = 'es') {
    allMonths = ['Enero', 'Ferbrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  } else if (myLang = 'ca') {
    allMonths =  ['Gener', 'Ferbrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Septembre', 'Octubre', 'Novembre', 'Decembre'];
  } else if (myLang = 'de') {
    allMonths =  ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  } else {
    allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
  };
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


// Feature #2 - Grab weather from current location for first weather info
function weatherInCurrentLocation(){
  
  function fetchWeatherFromCoords(position) {
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;
    let APIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${APIKey}&units=metric&lang=${myLang}`;  

    console.log(APIUrl);
    fetch(APIUrl)
      .then((response) => response.json())
      .then((json) => {
        updateCurrentInfoInApp(json);
      })
      .catch((error) => console.log(error));
  }

  function fetchForecastFromCoords(position) {
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;
    let APIUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${myLat}&lon=${myLong}&exclude=current,minutely,hourly,alerts&appid=${APIKey}&units=metric&lang=${myLang}`;
    
    console.log(APIUrl2);
    
    fetch(APIUrl2)
      .then(response => response.json())
      .then(json => {
        updateForecastInfoInApp(json);
      })
  }
  navigator.geolocation.getCurrentPosition(fetchWeatherFromCoords);
  navigator.geolocation.getCurrentPosition(fetchForecastFromCoords);
}
weatherInCurrentLocation();

// Feature #3 - Grab weather from a user-inputed city
function weatherInCity(event){  
  // Stops the submit doing its normal behaviour
  event.preventDefault();
  // Assigns the input value to the newCIty
  newCity = searchInput.value;
  // Resets the searcher
  searchInput.value = "";
  // Paints the city name in the app
  currentCityElement.innerHTML = newCity;
  // Grabs the current weather for that city
  fetchCurrentWeatherFromCity();
  // Grabs the forecast weather for that city
  fetchForecastWeatherFromCity();
}

searchForm.addEventListener("submit", weatherInCity);

function fetchCurrentWeatherFromCity(){
  let APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${APIKey}&units=metric&lang=${myLang}`

  console.log(APIUrl);

  // Getting current weather info from city that the user wrote
  fetch(APIUrl)
    .then(response => response.json())
    .then(json => {
      updateCurrentInfoInApp(json)
    })
    .catch((error) => console.log(error));
  
    console.log('New city lat and long: ' + newCityLat, newCityLong)
}

function fetchForecastWeatherFromCity() {
  // Getting the forecast for the lat & long of the city the user searched for
  let APIUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${newCityLat}&lon=${newCityLong}&exclude=current,minutely,hourly,alerts&appid=${APIKey}&units=metric`;
  
  console.log(APIUrl);

  fetch(APIUrl)
    .then(response => response.json())
    .then(json => {
      updateForecastInfoInApp(json)
    })
}

// Feature #4 - Celsius / Farhenreit Converter

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
  let tempArray = document.querySelectorAll(".temp");

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

    tempArray.forEach(temp => {
      let newTemp = turnTempToF(temp.innerHTML);
      temp.innerHTML = newTemp;
    })

    conversorButton.innerHTML = "See in °C";
    tempFormat.forEach(function (el){
      el.innerHTML = " °F"
    });
  } else {
    // if false, (it must say - See in ºC) we want the temp to be converted to C

    tempArray.forEach(temp => {
      let newTemp = turnTempToC(temp.innerHTML);
      temp.innerHTML = newTemp;
    })

    conversorButton.innerHTML = "See in °F";
    tempFormat.forEach(function (el){
      el.innerHTML = " °C"
    });
  }
})

// Feature #5 - Weather in your location button
let currentLocationButton = document.querySelector('.current-city');

currentLocationButton.addEventListener("click", weatherInCurrentLocation);