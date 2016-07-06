define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var User = Utils.Page.extend({

    constructorName: "User",
    id: "user",

     events: {
      "click #addr"  : "goAddresses",
      "click #userdetails" : "goDettagli"
    },

    

    initialize: function(options) {

      this.template = Utils.templates.user;
      this.listenTo(this, "inTheDOM", this.script);
      
    },



    render: function() {
           $(this.el).html(this.template); 
    },

    script: function(){
      document.getElementById("menubutton").classList.add("disabledp");
      document.getElementById("searchbutton").classList.add("disabled"); 
    },

     goAddresses: function(e) {
     e.preventDefault();
     Backbone.history.navigate("indirizzi", {
        trigger: true
      });
    },

     goDettagli: function(e) {
     e.preventDefault();
     Backbone.history.navigate("dettagli", {
        trigger: true
      });
    }
  });


  return User;

});