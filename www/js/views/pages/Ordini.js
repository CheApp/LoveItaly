define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var Ordini = Utils.Page.extend({

    constructorName: "Ordini",

    

    initialize: function(options) {

      this.template = Utils.templates.ordini;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "ordini",



    render: function() {
           $(this.el).html(this.template); 
    },

    script: function(){

    }
  });


  return Ordini;

});