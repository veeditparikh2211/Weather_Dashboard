var current = dayjs();
var date = (current.format("MM/DD/YYYY"));
var cityName = $("#name");
var citybutton = $("#city-name");
var city = "";


citybutton.on("click", weather);

//Clears localstorage
function Delete() {
    $("#list").empty();
    $("#weather").empty();
    $("#weatherforecast").empty();
    $("#name").empty();
    localStorage.clear();
}

function weather(event) {
    event.preventDefault();

    if (cityName.val().trim() !== "") {
        city = cityName.val().trim();
        currentWeather(city);

        var cityList = document.getElementById("list");
        cityList.textContent = "";

        var searches = localStorage.getItem("Cities");
        if (searches === null) {
            searches = [];
        } else {
            searches = JSON.parse(searches);
        }
        searches.push(city);

        var CityNames = JSON.stringify(searches);
        localStorage.setItem("Cities", CityNames);

        for (let i = 0; i < searches.length; i++) {
            var list = document.createElement("li");
            list.setAttribute("class", "list-group-item");
            list.setAttribute("id", "city-link");
            list.textContent = searches[i];
            cityList.appendChild(list);
        }
    }
}

function currentWeather(city) {

    const apiKey = "946e55c4d55b3abaa90dbcc53301c4f1";
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryUrl,
        method: "GET",
    }).then(function(Data) {

        var icon = Data.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        var current = dayjs();
        var currentcity = document.getElementById("current-city");
        currentcity.innerHTML = (Data.name + " " + "(" + current.format("MM/DD/YYYY") + ")" + '<img src="' + iconurl + '">');

        var temp = document.getElementById("temperature");
        temp.textContent = "Temperature: " + Data.main.temp + " °F";

        var humidity = document.getElementById("humidity");
        humidity.textContent = "Humidity: " + Data.main.humidity + "%";

        var wind = document.getElementById("wind-speed");
        wind.textContent = "Wind Speed: " + Data.wind.speed + " MPH";

        var latValue = Data.coord.lat;
        var lonValue = Data.coord.lon;
        var queryUv = "https://api.openweathermap.org/data/2.5/uvi?";
        var uvdata = queryUv + "lat=" + latValue + "&lon=" + lonValue + "&appid=" + apiKey

        $.ajax({
            url: uvdata,
            method: "GET",
        }).then(function(uvIndexData) {
            var uvIndex = document.getElementById("uv-index");
            uvIndex.textContent = "UV Index: " + uvIndexData.value;

            var uvText = uvIndexData.value;
            if (uvText <= 2) {
                uvIndex.setAttribute("class", "badge bg-success");
            } else if (uvText <= 6) {
                uvIndex.setAttribute("class", "badge bg-warning");
            } else if (uvText > 6) {
                uvIndex.setAttribute("class", "badge bg-danger");
            }
        });
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?units=imperial&" + "lat=" + latValue + "&lon=" + lonValue + "&exclude=current,minutely,hourly,alerts" + "&appid=" + apiKey,
            method: "GET",
        }).then(function(forecastData) {
            $("#weatherforecast").empty();
            for (var i = 1; i < 6; i++) {
                var forecast = document.getElementById("weatherforecast");

                var unix_timestamp = forecastData.daily[i].dt;
                var date = new Date(unix_timestamp * 1000);
                var forecastDate = dayjs(date).format('MM/DD/YYYY');

                var div1 = document.createElement("div");
                div1.setAttribute("class", "col-sm");
                forecast.appendChild(div1);

                var div2 = document.createElement("div");
                div2.setAttribute("class", "card card-body bg-primary border-dark");
                div1.appendChild(div2);

                var ptag1 = document.createElement("p");
                ptag1.textContent = forecastDate;
                div2.appendChild(ptag1);

                var img2 = document.createElement('img');
                img2.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + "@2x.png");
                img2.setAttribute("alt", forecastData.daily[i].weather[0].description);
                div2.appendChild(img2);

                var forecastTemp = forecastData.daily[i].temp.day;
                var ptag2 = document.createElement("p");
                div2.appendChild(ptag2);
                ptag2.textContent = "Temp:" + forecastTemp + "°F";

                var forecastHumidity = forecastData.daily[i].humidity;
                var ptag3 = document.createElement("p");
                div2.appendChild(ptag3);
                ptag3.textContent = "Humidity:" + forecastHumidity + "%";



            }
        })
    });
};