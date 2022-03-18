let userFormEl = document.querySelector("#user-form");
let stateEl = document.querySelector("#state");
let cityInput = document.querySelector("#cityInput");
let weatherSectionEl = document.querySelector("#weather-section");
let cityHeaderEl = document.querySelector("#city-header");
let futureWeatherEl = document.querySelector("#future-weather");
let futureDataEl = document.querySelector("#future-data");



//on form submission, run getStates
let formSubmitHandler = function (event) {
    event.preventDefault();
    //obtain text for city user searched for; trim any space around
    let searchEntry = cityInput.value.trim();
    if (searchEntry) {
        //pass in the city user searched for into geocode function
        getStates(searchEntry);
        //clear search form afterwards
        // cityInput.value = "";
    } else {
        alert("Please enter a city.");
    }
}

//fetch resulted states from users search
let getStates = function (searchEntry) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchEntry + "&limit=10&appid=314928b8d3e16dd41afeacded00b5a17")
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        //pass state names data and create buttons for each
                        displayStates(data);
                        // console.log(data[0].lat);
                    })
            } else {
                alert("There was a problem with your request!");
            }
        })
};


//function to create buttons for each state name resulted
let displayStates = function (data) {
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
        //create a link element
        let stateLinkEl = document.createElement("a");
        //set attribute to link
        stateLinkEl.setAttribute("href", data[i].state);
        //create btn to display state text
        let stateBtn = document.createElement("button");
        //put state text into btn element
        stateBtn.textContent = data[i].state;
        stateBtn.setAttribute("class", "btn btn-info")
        //append link to btn
        stateBtn.appendChild(stateLinkEl);
        //append btn to page
        stateEl.appendChild(stateBtn);
        //on state button click, run getCurrentWeather, plugging in lat and long coordinates
        stateBtn.onclick = function () {
            let city = data[i].name;
            let state = data[i].state;
            let location = city + ", " + state;
            //city, state saved to local storage
            localStorage.setItem("location", location);
            //set var for lat / long data
            let lat = data[i].lat;
            let lon = data[i].lon
            //plug in lat / long to getCurrentWeather function
            getCurrentWeather(lat, lon);
        }
    }
}



//lat and long passed into getCurrentWeather func
let getCurrentWeather = function (lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude={part}&appid=314928b8d3e16dd41afeacded00b5a17")
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        //pass data to displayCurrentWeather function
                        displayCurrentWeather(data);
                        displayFutureWeather(data);
                    })
            } else {
                alert("There was a problem with your request!");
            }
        })
};


//display current weather conditions
let displayCurrentWeather = function(data) {
    let dataArr = [data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi];
    //get city,state from local storage and make header
    let cityState = localStorage.getItem("location").toString();
    cityHeaderEl.innerHTML = cityState + "&nbsp" + moment().format("(MM/DD/YY)");
    //create container for current conditions
    let currentConditions = document.createElement("div");
    //assign data to innerHTML
    currentConditions.innerHTML = "Temp: " + dataArr[0] + "°F <br />" + "Wind: " + dataArr[1] + " MPH <br />" + "Humidity: " + dataArr[2] + "% <br />" + "UV Index: " + dataArr[3];
    //assign bootstrap class to weather section
    weatherSectionEl.setAttribute("class", "border border-dark conditions");
    //append to page
    weatherSectionEl.appendChild(currentConditions);
}


//display 5 day weather forecast
let displayFutureWeather = function(data) {
    let data5days = data.daily;
   
    for (let i=0; i<data5days.length-2; i++){
        //create div w class col
        let colDiv = document.createElement("div");
        colDiv.setAttribute("class", "col");
        //create card div w class card        
        let cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card bg-dark");
        //create cardTitle div w class card-title
        let cardTitle = document.createElement("div");
        cardTitle.setAttribute("class", "card-title");
        //create card-text div w class card-text
        let cardText = document.createElement("div");
        cardText.setAttribute("class", "card-text text-white");
        cardText.innerHTML = "Temp: " + data.daily[i].temp.day + "°F <br />" + "Wind: " + data.daily[i].wind_speed + " MPH <br />" + "Humidity: " + data.daily[i].humidity;
       
        //append all elements
        colDiv.appendChild(cardDiv);
        cardDiv.appendChild(cardTitle);
        cardTitle.appendChild(cardText);
        futureDataEl.appendChild(colDiv);
        //remove display none class 
        futureWeatherEl.removeAttribute("class", "d-none");
    }
}




userFormEl.addEventListener("submit", formSubmitHandler);
