let userFormEl = document.querySelector("#user-form");
let stateEl = document.querySelector("#state");
let cityInput = document.querySelector("#cityInput");
let weatherSectionEl = document.querySelector("#weather-section");




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
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        //create a link element
        let stateLinkEl = document.createElement("a");
        //set attribute to link
        stateLinkEl.setAttribute("href", data[i].state);
        //create btn to display state text
        let stateBtn = document.createElement("button");
        //put state text into btn element
        stateBtn.textContent = data[i].state;
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
            //header to display city, state
            weatherSectionEl.innerHTML = location;
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
                    })
            } else {
                alert("There was a problem with your request!");
            }
        })
};


let displayCurrentWeather = function(data) {
    console.log(data);
    let dataArr = [data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi];
    console.log(dataArr);
    //create container for current conditions
    let currentConditions = document.createElement("div");
    //assign data to innerHTML
    currentConditions.innerHTML = "Temp: " + dataArr[0] + "°F <br />" + "Wind: " + dataArr[1] + " MPH <br />" + "Humidity: " + dataArr[2] + "% <br />" + "UV Index: " + dataArr[3];
    console.log(currentConditions);
    //append to page
    weatherSectionEl.appendChild(currentConditions);
}

userFormEl.addEventListener("submit", formSubmitHandler);
