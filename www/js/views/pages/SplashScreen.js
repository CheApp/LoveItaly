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

    script: function(){
    
    },

    start: function(e) {
      document.getElementById("navbar").classList.remove("disabled");
      document.getElementById("headbar").classList.remove("disabled");
      Backbone.history.navigate("home", {
        trigger: true
      });
    }
  });


  return SplashScreen;

});