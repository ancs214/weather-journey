let userFormEl = document.querySelector("#user-form");
let stateEl = document.querySelector("#state");
let cityInput = document.querySelector("#cityInput");
let weatherSectionEl = document.querySelector("#weather-section");
let cityHeaderEl = document.querySelector("#city-header");
let futureWeatherEl = document.querySelector("#future-weather");
let futureDataEl = document.querySelector("#future-data");
let resultsEl = document.querySelector("#results");
let pastSearchesEl = document.querySelector("#search-hx");

let searchHistory = [];
let persistentHistory = JSON.parse(localStorage.getItem("locationEl"));

//on window load, get items from local storage
window.onload = function(locationEl, searchHistory) {
    //if items exist in local storage, use json parse to return in array form
    searchHistory = JSON.parse(localStorage.getItem("locationEl"));

    console.log(searchHistory);
    if (searchHistory===null) {
        console.log("no search history");
    } else {
        // searchHistory = JSON.parse(localStorage.getItem(locationEl));
        // console.log(locationEl);
        //for each locationEl, create a element
        searchHistory.forEach(element => {
    
            let pastCities = document.createElement("button");
            pastCities.innerHTML = element;
            pastCities.setAttribute("class", "btn btn-secondary btn-lg btn-block m-2")
            pastSearchesEl.appendChild(pastCities); 
        })
    } 
}

//function to load cities searched on btn click
let historySearch = function(event) {
    // let searchEntry = inner text of btn clicked
    let hxSearchEntry = event.target.innerHTML;
    cityHeaderEl.innerHTML = hxSearchEntry + "&nbsp" + moment().format("(MM/DD/YY)")
    //split method to separate city and state into an array
    let hxSearchEntryArr = hxSearchEntry.split(' ');
    let city = hxSearchEntryArr[0];
    let state = hxSearchEntryArr[1];
    //pass in city to fetch request
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=10&appid=314928b8d3e16dd41afeacded00b5a17")
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        //iterate over data; if state equals, state on btn clicked, save lat and lon and pass into getCurrentWeather function
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].state == state) {
                                let lat = data[i].lat;
                                let lon = data[i].lon;
                                getCurrentWeather(lat, lon);
                            }
                        } 
                    })
            } else {
                alert("There was a problem with your request!");
            }
        })
}

//on form submission, run getStates
let formSubmitHandler = function (event) {
    event.preventDefault();
    resetStateBtns();
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

//if there are previous state buttons, clear results
let resetStateBtns = function() {
    while (stateEl.firstChild) {
        stateEl.removeChild(stateEl.firstChild);
        
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
            let locationEl = city + ", " + state;
            console.log(locationEl);
            // //city, state pushed to array and saved to local storage
            searchHistory.push(locationEl);
            localStorage.setItem("locationEl", JSON.stringify(searchHistory));
            console.log(searchHistory);
    
            //set var for lat / long data
            let lat = data[i].lat;
            let lon = data[i].lon
            //plug in lat / long to getCurrentWeather function
            getCurrentWeather(lat, lon);

            //set locationEl as current weather section header with current date
            cityHeaderEl.innerHTML = locationEl + "&nbsp" + moment().format("(MM/DD/YY)")

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
                        //pass data to weather functions
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
   
    //create container for current conditions
    let currentConditions = document.createElement("div");
    //assign data to innerHTML
    currentConditions.innerHTML = "Temp: " + dataArr[0] + "°F <br />" + "Wind: " + dataArr[1] + " MPH <br />" + "Humidity: " + dataArr[2] + "% <br />";
    let addUV = document.createElement("div");
    addUV.innerHTML = "UV Index: " + dataArr[3];
    currentConditions.appendChild(addUV);
    //assign bootstrap class to weather section
    weatherSectionEl.setAttribute("class", "border border-dark conditions");
    //append to page
    weatherSectionEl.appendChild(currentConditions);

    let uvBGcolor = function () {
        let uvIndex = dataArr[3];
        if (uvIndex <= 2) {
            addUV.setAttribute("class", "bg-success uv-width");
        } if (uvIndex > 2 && uvIndex <= 5) {
            addUV.setAttribute("class", "bg-warning uv-width");
        } if (uvIndex > 5 && uvIndex <= 9) {
            addUV.setAttribute("class", "bg-orange uv-width");
        } if (uvIndex > 9) {
            addUV.setAttribute("class", "bg-danger uv-width");
        }
    }
    uvBGcolor();
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
        cardDiv.setAttribute("class", "card bg-gray");
        //create cardTitle div w class card-title
        let cardTitle = document.createElement("div");
        cardTitle.setAttribute("class", "card-title text-white");
        cardTitle.innerHTML = moment().add(i+1, 'day').format("M/DD/YY");
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
pastSearchesEl.addEventListener("click", historySearch)