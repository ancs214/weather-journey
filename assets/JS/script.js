let userFormEl = document.querySelector("#user-form");
let stateEl = document.querySelector("#state");
let cityInput = document.querySelector("#cityInput");




//on form submission, run getStates
let formSubmitHandler = function(event) {
    event.preventDefault();
    //obtain text for city user searched for; trim any space around
    let searchEntry = cityInput.value.trim();
    if (searchEntry) {
        //pass in the city user searched for into geocode function
        getStates(searchEntry);
        //clear search form afterwards
        cityInput.value = "";
    } else {
        alert("Please enter a city.");
    }
}

//fetch resulted states from users search
let getStates = function(searchEntry) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchEntry + "&limit=10&appid=314928b8d3e16dd41afeacded00b5a17")
    .then(function(response) {
        if (response.ok) {
            response.json()
            .then(function(data) {
                console.log(data);
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
let displayStates = function(data) {
    for (let i=0; i<data.length; i++) {
        //create a link element
        let stateLinkEl = document.createElement("a");
        //set attribute to link
        // stateLinkEl.setAttribute("href", data[i].state);
        //create btn to display state text
        let stateBtn = document.createElement("button");
        //put state text into btn element
        stateBtn.textContent = data[i].state;
        //append link to btn
        stateBtn.appendChild(stateLinkEl);
        //append btn to page
        stateEl.appendChild(stateBtn);
    }
}

 //when user clicks specific state btn, lat and long are retrieved from data
 let stateBtnClickHandler = function(event) {
     //get textcontent of btn user clicked
    let stateClicked = event.target.textContent;
     //enter textcontent into 
 }
    //lat and long passed into getCurrentWeather func


//fetch current weather data for city entered into search form
let getCurrentWeather = function () {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=39.983334&lon=-82.983330&units=imperial&exclude={part}&appid=314928b8d3e16dd41afeacded00b5a17")
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // console.log(data);
                        //pass data to function to display current conditions for city
                    })
            } else {
                alert("There was a problem with your request!");
            }
        })
};



userFormEl.addEventListener("submit", formSubmitHandler);
stateEl.addEventListener("click", stateBtnClickHandler);