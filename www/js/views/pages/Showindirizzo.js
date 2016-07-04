define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var Showindirizzo = Utils.Page.extend({

    constructorName: "Showindirizzo",

    

    initialize: function(options) {

      this.template = Utils.templates.showindirizzo;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "showindirizzo",



    render: function() {
           $(this.el).html(this.template); 
    },

    script: function(){

    }
  });


  return Showindirizzo;

});