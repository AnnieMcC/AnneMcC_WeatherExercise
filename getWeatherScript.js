$(function () {
    $('#precipTotal').hide();
    //create city buttons by city id
    var dict = [];
    dict.push({ cityId: 2147714, cityName: "Sydney, Australia" });
    dict.push({ cityId: 2163355, cityName: "Hobart, Australia" });

    //add a button to the div for each city, using ul/li/a
    $('#div_locationButtons').append($('<ul />', { id: 'ul_locationButtons' }));
    for (var i = 0; i < dict.length; i++) {
        var cityName = dict[i].cityName;
        $('<a />')
            .attr({ href: '#', id: "btn" + cityName.split(', ')[0], 'data-html': dict[i].cityId })
            .addClass('locationButton')
            .text(cityName)
            .appendTo($('#ul_locationButtons'))
            .wrap($('<li />'));
    }

    $('.locationButton').click(function () {

        //clear the previous city data
        $('*div[id*="Weather"]').each(function () {
            $(this).empty();
        });
        //re-hide totals button & remove any para text
        $('#precipTotal').hide();
        if ($('#p_totalRainFall').length > 0) {
            $('#p_totalRainFall').remove();
        }
            
        //get button data
        var locId = getLocationId(this);
        //get data by Id
        getWeatherData(locId);
    });

    function getLocationId(data) {
        return ($(data).attr('data-html'));
    }

    function getWeatherData(locId) {
        try {
            //get data from cache if < 20 mins old
            var cachedData = localStorage.weatherDataCache && JSON.parse(localStorage.weatherDataCache);
            var cacheTimestamp = (new Date()).getTime();
            if (cachedData && cachedData.locationId == locId && cachedData.timestamp && cachedData.timestamp > (cacheTimestamp - 20 * 60 * 1000)) {
                displayWeatherData(cachedData);
            }

            else {
                var weatherCurrentAPI = 'http://api.openweathermap.org/data/2.5/weather?id=' + locId + '&mode=json' + '&appid=1c2d73db1ed5445d0d1758dc38114a96';
                var weatherForecastAPI = 'http://api.openweathermap.org/data/2.5/forecast?id=' + locId + '&mode=json' + '&appid=1c2d73db1ed5445d0d1758dc38114a96';

                var responseCurrent = $.getJSON(weatherCurrentAPI);
                var responseForecast = $.getJSON(weatherForecastAPI);
                
                //use local storage to cache
                if (responseCurrent.statusText == "OK" && responseForecast.statusText == "OK") {
                    addToCache(responseCurrent, responseForecast, locId);
                    //call again & get from cache
                    getWeatherData(locId);
                }  
            }

        } catch (e) {
            alert("Cannot display weather data");
        }
    }

    function addToCache(responseCurrent, responseForecast, locId) {
        localStorage.weatherDataCache = JSON.stringify({
            timestamp: (new Date()).getTime(),
            locationId: locId,
            dataCurrent: responseCurrent,
            dataForecast: responseForecast
        });
    }

    function displayWeatherData(obj) {
        var weatherHtml;
        //CURRENT
        if (obj.dataCurrent && obj.dataCurrent.responseJSON && obj.dataCurrent.readyState == 4) {
            var current = obj.dataCurrent.responseJSON;
            weatherHtml = '<h3>This is the current weather for ' + current.name + ', measured at ' + new Date(obj.timestamp) + '</h3>' +
                              '<ul class="data"><li> Temp min: ' + current.main.temp_min + '&deg;C</li>' +
                              '<li> Temp max: ' + current.main.temp_max + '&deg;C</li>' +
                              '<li> Air pressure: ' + current.main.pressure + ' hpa</li>' +
                              '<li> Humidity: ' + current.main.humidity + ' %</li>' +
                              '<li id="rainfall"> Rainfall: ' + current.main.humidity + 'mm</li></ul>';

            $('#div_currentWeather').append(weatherHtml);
        }
        else {
            //display test data
            weatherHtml = '<h3>This is the current weather for ' + 'this city' + ', measured at ' + new Date(Date.now()) + '</h3>' +
                              '<ul class="data"><li> Temp min: ' + '24' + '&deg;C</li>' +
                              '<li> Temp max: ' + '24' + '&deg;C</li>' +
                              '<li> Air pressure: ' + '240' + ' hpa</li>' +
                              '<li> Humidity: ' + '24' + ' %</li>' +
                              '<li id="Rainfall"> Rainfall: ' + '0' + 'mm</li></ul>';

            $('#div_currentWeather').append(weatherHtml);
        }

        //FORECAST
        if (obj.dataForecast && obj.dataForecast.responseJSON && obj.dataForecast.readyState == 4) {
            var forecast = obj.dataForecast.responseJSON;
            weatherHtml = '';
            $('#div_forecastWeather').append($('<h3 />', { text: 'This is the forecast weather for ' + forecast.city.name }));
            $('#div_forecastWeather').append($('<ul />', { id: "ul_forecast" }));
            $.each(forecast.list, function () {
                var timeStr = this.dt_txt.substr(this.dt_txt.length - 8, 8);
                if (timeStr == "06:00:00") {
                    //only get weather once a day
                    weatherHtml += '<li>' +
                                        '<ul>' +
                                            '<li> Date: ' + this.dt_txt.substr(0, this.dt_txt.length - 8) + '</li>' +
                                            '<li> Temp min: ' + this.main.temp_min + '&deg;C</li>' +
                                            '<li> Temp max: ' + this.main.temp_max + '&deg;C</li>' +
                                            '<li> Air pressure: ' + this.main.pressure + ' hpa</li>' +
                                            '<li> Humidity: ' + this.main.humidity + ' %</li>' +
                                            '<li class="forecastRainfall"> Rainfall: <span>' + this.main.humidity + '</span>mm</li>' +
                                        '</ul>' +
                                    '</li>';


                }
            });
            $(weatherHtml).appendTo($('#ul_forecast'));
        }

        else {
            weatherHtml = '';
            $('#div_forecastWeather').append($('<h3 />', { text: 'This is the forecast weather for xxx' }));
            $('#div_forecastWeather').append($('<ul />', { id: "ul_forecast" }));
            forecast = ["0", "1", "2", "3", "4"];
            $.each(forecast, function () {
                weatherHtml += '<li>' +
                                        '<ul>' +
                                            '<li> Date: ' + '20 May 2016' + '</li>' +
                                            '<li> Temp min: ' + '23' + '&deg;C</li>' +
                                            '<li> Temp max: ' + '24' + '&deg;C</li>' +
                                            '<li> Air pressure: ' + '1018' + ' hpa</li>' +
                                            '<li> Humidity: ' + '44' + ' %</li>' +
                                            '<li class="forecastRainfall"> Rainfall: ' + '<span>24</span>' + 'mm</li>' +
                                        '</ul>' +
                                    '</li>';
            });
            $(weatherHtml).appendTo($('#ul_forecast'));
        }

        $('#precipTotal').show();
    }

    $('#precipTotal').click(function () {
        //clear the text by removing element
        $('#p_totalRainFall').remove();
        //find the <li class="forecastRainfall"> & add the rainfall values
        var totRainfall = 0;
        $('.forecastRainfall').each(function () {
            if (this.children.length > 0 && this.firstElementChild.innerHTML.length > 0) {
                totRainfall += parseInt(this.firstElementChild.innerHTML);
            }     
        });
        $('#div_totalRainfall').append($('<p />', { id: 'p_totalRainFall', text: 'Total expected rainfall: ' + totRainfall + 'mm' }));
    });
});

