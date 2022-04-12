var cities = [];

function getItems() {
    var searchedCity = JSON.parse(localStorage.getItem("cities"));
    if (searchedCity !== null) {
        cities = searchedCity;
    };
    for (i = 0; i < cities.length; i++) {
        if (i == 8) {
            break;
        }
        previousButton = $("<a>").attr({
            class: "list-group-item list-group-item-action"
        });
        previousButton.text(cities[i]);
        $(".list-group").append(previousButton);
    }
}
var city;
var mainCard = $(".card-body");
getItems();

function getData() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=146f52a6d2b638431cfa51e139e32332"
    mainCard.empty();
    $("#weeklyForecast").empty();
    $.ajax({
        url: queryURL
    }).then(function(response) {
        var date = moment().format(" MM/DD/YYYY");
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var name = $("<h3>").html(city + date);
        mainCard.prepend(name);
        mainCard.append($("<img>").attr("src", iconURL));
        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        mainCard.append($("<p>").html("Temperature: " + temp + "F"));
        var humidity = response.main.humidity;
        mainCard.append($("<p>").html("Humidity: " + humidity));
        var windSpeed = response.wind.speed;
        mainCard.append($("<p>").html("Wind Speed: " + windSpeed));
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=146f52a6d2b638431cfa51e139e32332",
            method: "GET"
        }).then(function(response) {
            for (i = 0; i < 5; i++) {
                var newCard = $("<div>").attr("class", "col forecast bg-warning text-white rounded-lg p-2");
                $("#weeklyForecast").append(newCard);
                var myDate = new Date(response.list[i * 8].dt * 1000);
                newCard.append($("<h4>").html(myDate.toLocaleDateString()));
                var iconCode = response.list[i * 8].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                newCard.append($("<img>").attr("src", iconURL));
                var temp = Math.round((response.list[i * 8].main.temp - 273.15) * 1.80 + 32);
                newCard.append($("<p>").html("Temp: " + temp + "F"));
                var humidity = response.list[i * 8].main.humidity;
                newCard.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })
}
$("#searchCity").click(function() {
    city = $("#city").val().trim();
    getData();
    var checkArray = cities.includes(city);
    if (checkArray == true) {
        return
    } else {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        var previousButton = $("<a>").attr({
            class: "list-group-item list-group-item-action"
        });
        previousButton.text(city);
        $(".list-group").append(previousButton);
    };
})
$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
})