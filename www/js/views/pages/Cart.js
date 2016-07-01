define(function(require) {

  var Backbone = require("backbone");
  var Prodotto = require("models/Prodotto");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Swiper = require("swiper");

  var Cart = Utils.Page.extend({

    constructorName: "Cart",
    collection: CollezioneProdotti,

    

    initialize: function() {
 
      this.template = Utils.templates.cart;
      
    },

    id: "cart",

    events: {
    },

    render: function() {
           $(this.el).html(this.template({ProdottiNelCarrello : this.collection})); 
    },

  });


  return Cart;

});