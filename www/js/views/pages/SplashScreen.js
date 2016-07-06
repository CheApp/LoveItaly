define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var SplashScreen = Utils.Page.extend({

    constructorName: "SplashScreen",

    

    initialize: function(options) {

      this.template = Utils.templates.splashscreen;
      
    },

    id: "splashscreen",



    render: function() {
           $(this.el).html(this.template); 
    },

    start: function(e) {
      document.getElementById("navbar").classList.remove("disabled");
      document.getElementById("headbar").classList.remove("disabled");

          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                showPosition,
                displayError,
                {timeout: 3000, enableHighAccuracy: false}
              );
              
          } else {
              console.log('Geolocation is not supported by this browser');
          }

          function showPosition(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            
            $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon, function(data) {
              if (data.results.length != 0) {
                var myplace = data.results[0].address_components[2].long_name;
                $('#mylocation').text("Stai guardando: " + myplace);
                $('#mylocation').attr("data-value", "1");

                
                
              }
              else {
                displayError();
              }
              
            });

            setTimeout(function () {

                if ($('#mylocation').attr("data-value") == "null") {
                  
                  $('#popup_location').attr("style", "display: block");
                  $('#irraggiungibile').attr("style", "display: block");
                }

            }, 2000);
            
          }

          function displayError(error) {
            var errors = { 
              1: 'Permission denied',
              2: 'Position unavailable',
              3: 'Request timeout'
            };
            console.log("Error: " + errors[error.code]);
            $('#nondisponibile').attr("style", "display: block");
            $('#popup_location').attr("style", "display: block");
          }

      Backbone.history.navigate("home", {
        trigger: true
      });
    }
  });


  return SplashScreen;

});