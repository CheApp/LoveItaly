define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var Indirizzi = Utils.Page.extend({

    constructorName: "Indirizzi",

    

    initialize: function(options) {

      this.template = Utils.templates.indirizzi;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "indirizzi",



    render: function() {
           $(this.el).html(this.template); 
    },

    script: function(){

    }
  });


  return Indirizzi;

});