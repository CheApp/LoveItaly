define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var Profilo = Utils.Page.extend({

    constructorName: "Profilo",

    

    initialize: function(options) {

      this.template = Utils.templates.profilo;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "profilo",



    render: function() {
           $(this.el).html(this.template); 
    },

    script: function(){
      document.getElementById("menubutton").classList.add("disabledp");
      document.getElementById("searchbutton").classList.add("disabled"); 
    }
  });


  return Profilo;

});