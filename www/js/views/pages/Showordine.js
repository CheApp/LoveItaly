define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Order = require("models/Order");
  var CollezioneProdotti = require("collections/CollezioneProdotti");


  var Showordine = Utils.Page.extend({

    constructorName: "Showordine",
    model : Order,
    collection : CollezioneProdotti,

    

    initialize: function(options) {

      this.template = Utils.templates.showordine;
      this.listenTo(this, "inTheDOM", this.script); 
      
    },

    id: "ordini",

    script: function() {
      var lista_prodotti = document.getElementById("lista_prodotti_checkout");
      var prodotti = lista_prodotti.getElementsByClassName("prodotto_checkout");
      var totale = 0, index, prezzo;
      for (index = 0; index < prodotti.length; index++) {
        prezzo = prodotti[index].getElementsByClassName("prezzo_prodotto")[0].getElementsByTagName("span");
        totale += parseFloat(prezzo[0].innerHTML);
      }
      var loc_tot = document.getElementById("prezzo_totale").getElementsByTagName("span");
      loc_tot[0].innerHTML = totale.toFixed(2);;
    },

    render: function() {
      console.log(this.model.cart_rows[0].quantity);
            $(this.el).html(this.template({ Ordine : this.model, Prodotti : this.collection}));  
    }
  });


  return Showordine;

});