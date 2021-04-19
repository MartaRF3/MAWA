let currentCityElement = document.querySelector(".current__title");
let currentMinElement = document.querySelector("#current-temp-min");
let currentMaxElement = document.querySelector("#current-temp-max");
let currentEmojiElement = document.querySelector("#current-emoji");

let searchForm = document.querySelector(".searcher");
let searchInput = document.querySelector("#new-city");
let currentTemp = document.querySelector(".current__temperature");
let conversorBox = document.querySelector(".temp-converter");
let conversorButton = document.querySelector("#converter");

let newCity;
let newCityLat;
let newCityLong;

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

  let currentDate = document.querySelector(".current__date");
  currentDate.innerHTML = elaborateNow;
}
whatDayIsIt();
setInterval(whatDayIsIt, 60000);

// Feature #2 - Grab current location for first weather info

function weatherInCurrentLocation(){
  function fetchWeatherFrom(position) {
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;
    let APIUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${myLat}&lon=${myLong}&exclude=minutely,hourly&appid=${APIKey}&units=metric`;

    console.log(APIUrl);

    fetch(APIUrl)
      .then((response) => response.json())
      .then((json) => {
        let currentMin = json.daily[0].temp.min;
        let currentMax = json.daily[0].temp.max;
        let currentState = json.current.weather[0].main;
        let currentCity = json.name;
        
        currentMinElement.innerHTML = Math.round(currentMin);
        currentMiaxElement.innerHTML = Math.round(currentMax);
        setEmoji(currentState);
        currentCityElement.innerHTML = currentCity;
      })
      .catch((error) => console.log(error));
  }

  let myPosition = navigator.geolocation.getCurrentPosition(fetchWeatherFrom);
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
    currentMaxElementinnerHTML = newMaxTemp;

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
  currentCity.innerHTML = newCity;
  fetchCurrentWeather();
}

searchForm.addEventListener("submit", updateCity);

// Feature #5 - Extract actual info from API
function fetchCurrentWeather() {
  let APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${APIKey}&units=metric`

  // Getting current weather info from city that the user wrote
  fetch(APIUrl)
    .then(response => response.json())
    .then(json => {
      let newMinTemp = json.main.temp_min;
      let newMaxTemp = json.main.temp_max;
      let newState = json.weather[0].main;
      
      setEmoji(newState);
      emojiWeather.innerHTML = newState;
      minTemp.innerHTML = Math.round(newMinTemp);
      maxTemp.innerHTML = Math.round(newMaxTemp);

      // Get the lat and long
      newCityLat = json.coord.lat;
      newCityLong = json.coord.lon;
    })
  
    // Getting the forecast for the lat & long of the city the user searched for
    let APIUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${newCityLat}&lon=${newCityLong}&exclude=minutely,hourly&appid=${APIKey}&units=metric`;
    console.log(APIUrl2);
}

function setEmoji(state) {
  if (state == 'Clear') {
    return state = '🌞';
  } else if (state == 'Clouds') {
    return state = '☁';
  } else if (state == 'Snow') {
    return state = '❄'
  } else if (state == 'Rain' && state == 'Drizzle') {
    return state = '🌧'
  } else if (state == 'Thunderstorm') {
    return state = '⚡'
  } else {
    return state = '🌈'
  }
}

// Feature #6 - Weather in your location button
let currentLocationButton = document.querySelector('.current-city');

currentLocationButton.addEventListener("click", weatherInCurrentLocation);


setTimeout(function(){
  console.log(`New City: ${newCity}, Lat: ${newCityLat}, Long: ${newCityLong}`);
}, 15000)


// Feature #7 - Weather Forecast for current city
// function fetchForecastWeather(){
//   // let myLat = '41.4215928';
//   // let myLong = '2.1723421';
//   let APIUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${newCityLat}&lon=${newCityLong}&exclude=minutely,hourly&appid=${APIKey}&units=metric`
//   console.log(APIUrl);

//   fetch(APIUrl)
//     .then(response => response.json())
//     .then(json => {
//       let todayPlus;
//       function convertToDate(unix) {
//         // The date are given in unix (seconds since 01/01/1970 UTC)
//         // can be converted with new Date(unixUnit * 1000).toLocaleString("es-ES", dateFormat) // the Date takes in *Miliseconds
//         let dateFormat = {
//           weekday: 'short', 
//           day: '2-digit',
//           month: 'long'
//         }
//         return new Date(unix * 1000).toLocaleString("en-GB", dateFormat);
//       }

//       function extractDayInfo(json, num) {
//         todayPlus = {
//           date: convertToDate(json.daily[num].dt),
//           minTemp: json.daily[num].temp.min,
//           maxTemp: json.daily[num].temp.max,
//           state: json.daily[num].weather[0].main,
//         };
//         return todayPlus;
//       }
//       let todayPlus1 = extractDayInfo(json, 1);

//       // let plus1Date = querySelector('#foreast-date-1');
//       // let plus1Min = querySelector('#forecast-temp-min-1');
//       // let plus1Max = querySelector('#forecast-temp-max-1');
//       // let plus1State = querySelector('#forecast-emoji-1');
//       // console.log(todayPlus1.date);
//       // plus1Date.innerHTML = todayPlus1.date;
//       // plus1Min.innerHTML = todayPlus1.minTemp;
//       // plus1Max.innerHTML = todayPlus1.maxTemp;
//       // plus1State.innerHTML = todayPlus1.state;

//       // let todayPlus2 = extractDayInfo(json, 2);
//       // let todayPlus3 = extractDayInfo(json, 3);
//       // let todayPlus4 = extractDayInfo(json, 4);
//       // let todayPlus5 = extractDayInfo(json, 5);

//     })
// }

// fetchForecastWeather();

// LEFT TO DO

// place the info from the forecast into the cards
// Automate the system

// Whenever people write a city
// we have to translate that into a lat and long 
// to feed it to the forecast API