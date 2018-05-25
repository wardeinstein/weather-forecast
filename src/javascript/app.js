var city="";
var err="Please enter a city name";

$(document).ready(function(){

  $('#submit').click(function(){
      city = $("#city").val();
      if(city==""){
        $("#error").html(err);
      }else{
        $.ajax({
          url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&type=like&&appid=5cc40c82f30039c6d1e9ab096d89c4cd",
          type: "GET",
          dataType: "jsonp",
          success: function(data){
            //console.log(data);
              var widget = display(data);
              $("#display").html(widget); //print the 5 day weather forecast
              $("#cit").html(data.city.name+", "+data.city.country); //print the city and country
              $("#city").val("");
          }
        });
      }
  });

  function display(data){

    var retVal = "";
    var date = [];
    var icon = [];
    var temp_min = [];
    var temp_max = [];
    var desc = [];
    var wind = [];
    var pressure = [];
    var humidity = [];
    var length = data.list.length; //get the length of the weather api list
    var pos = 0;
    var tempDate = "";
    var average = 0.0;

    for(var i=0;i<length;i++){
      if(!date[pos]){
        date[pos] = data.list[i].dt_txt; //get the date
        date[pos] = date[pos].substr(0,date[pos].indexOf(' ')); // get the date without time
        temp_min[pos] = data.list[i].main.temp_min;
        temp_max[pos] = data.list[i].main.temp_max;
        icon[pos] = data.list[i].weather[0].icon;
        desc[pos] = data.list[i].weather[0].description;
        wind[pos] = data.list[i].wind.speed; 
        pressure[pos] = data.list[i].main.pressure;
        humidity[pos] = data.list[i].main.humidity;
      }else{
        tempDate = data.list[i].dt_txt;
        tempDate = tempDate.substr(0,tempDate.indexOf(' '));
        if(date[pos].localeCompare(tempDate)!=0){ //if date is different 
          pos++;
          i--;
        }
      }
    }

    for(var i=0;i<length;i++){ //get average pressure
      average+=data.list[i].main.pressure;
    }
    average/=length;
    average=Math.round(average*100)/100;

    for(var i=0;i<5;i++){ //add data to 5 day weather forecast boxes
    retVal += "<div class='col-lg-2 col-md-2 col-sm-6 col-xs-12'>"+
    "<div class='forecast'>"+
    "<div class='date'><h5>"+ date[i]+"</h5></div>"+
    "<div class='mainWeather'>"+
    "<img src='http://openweathermap.org/img/w/"+icon[i]+".png'>"+
    "<h5>"+ temp_min[i] +"&deg;C ~ "+ temp_max[i] +"&deg;C</h5>"+
    "<h5><i>"+ desc[i] +"</i></h5>"+
    "<p>Wind: "+wind[i]+"m/s<br />Pressure: "+pressure[i]+" hpa<br />Humidity: "+humidity[i]+"%</p>"+
    "</div>"+
    "</div>"+
    "</div>";
    }

    retVal += "<div class='col-lg-2 col-md-2 col-sm-6 col-xs-12'>"+
    "<div class='forecast'>"+
    "<div class='date'><h5>Bonus</h5></div>"+
    "<div class='mainWeather'>"+
    "<br /><h5>The Average Preesure For The Week: "+average+" hpa</h5>"+
    "</div>"+
    "</div>"+
    "</div>";
    return  retVal;

  }


});