define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var User = Utils.Page.extend({

    constructorName: "User",
    id: "user",

     events: {
      "click #addr"  : "goAddresses",
      "click #userdetails" : "goDettagli",
      "click #ordini" : "goOrdini",
      "click #wishlist" : "gowish"
    },

    

    initialize: function(options) {

      this.template = Utils.templates.user;
      this.listenTo(this, "inTheDOM", this.script);
      
    },



    render: function() {
           $(this.el).html(this.template); 
    },

    script: function(){
      window.menubutton.classList.add("disabledp");
      window.searchbutton.classList.add("disabled"); 
    },

    goOrdini: function(e) {
     e.preventDefault();
     Backbone.history.navigate("ordini?oid=" + localStorage.getItem("ID"), {
        trigger: true
      });
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
    },

    gowish: function(e) {
     e.preventDefault();
     Backbone.history.navigate("desideri", {
        trigger: true
      });
    }
  });


  return User;

});