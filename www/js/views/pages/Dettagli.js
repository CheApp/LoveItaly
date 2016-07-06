define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Utente = require("models/Utente");


  var Dettagli = Utils.Page.extend({

    constructorName: "Dettagli",

    

    initialize: function(options) {

      this.template = Utils.templates.dettagli;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    render: function() {
           var thisview = this;
           var cliente = new Utente({id : localStorage.getItem("ID")});
           cliente.fetch({
        success: function (model, response, options) {
           $(thisview.el).html(thisview.template(cliente)); 
         }
       });

    },

    id: "dettagli",

      script: function() {
          document.getElementById("menubutton").classList.add("disabled");
          document.getElementById("backbutton").classList.remove("disabled");
    }
  });

  return Dettagli;

});