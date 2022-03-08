
var getWeatherData = function() {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=39.983334&lon=-82.983330&units=imperial&exclude={part}&appid=314928b8d3e16dd41afeacded00b5a17")
    .then(function(response) {
        response.json()
        .then(function(data) {
            console.log(data);
        })
    })
};

getWeatherData();

