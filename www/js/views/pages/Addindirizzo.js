define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var Addindirizzo = Utils.Page.extend({

    constructorName: "Addindirizzo",

    

    initialize: function(options) {

      this.template = Utils.templates.addindirizzo;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "addindirizzo",



    render: function() {
           $(this.el).html(this.template); 
    },

    script: function(){

    }
  });


  return Addindirizzo;

});