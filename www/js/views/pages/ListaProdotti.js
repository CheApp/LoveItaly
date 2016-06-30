define(function(require) {

  var Backbone = require("backbone");
  var Prodotto = require("models/Prodotto");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Swiper = require("swiper");


  var ListaProdotti = Utils.Page.extend({

    constructorName: "ListaProdotti",
    collection: CollezioneProdotti,

    

    initialize: function() {
 
      this.template = Utils.templates.listaprodotti;
 //     this.listenTo(this, "inTheDOM", this.slider);
      
    },

    id: "lista_prodotti",

    events: {
      "click .prodotto": "goinfoprodotto"
    },

    render: function() {
           $(this.el).html(this.template({Prodotti : this.collection})); 
    },

    goinfoprodotto: function(e) {
      e.preventDefault();
      var pid = $(e.currentTarget).data("id");
     
      Backbone.history.navigate("infoprodotto?pid="+pid, {
        trigger: true
      });
    }
  });


  return ListaProdotti;

});