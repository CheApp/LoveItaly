define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Order = require("models/Order");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var CollezioneOrdini = require("collections/CollezioneOrdini");

  var flag;
  var Showordine = Utils.Page.extend({

    constructorName: "Showordine",
    model : Order,
    collection : CollezioneProdotti,

    

    initialize: function(Collezione ,oid ,uid) {

      this.template = Utils.templates.showordine;
      flag = false;
      var view = this;
        var orders = new CollezioneOrdini({ id : oid });
            orders.fetch({
        success: function (collection, response, options) {
               var filterorders = orders.byId(uid)[0];
               var orderproducts = Collezione.byOrder(filterorders.cart_rows);
               view.model = filterorders;
               view.collection = orderproducts;
               flag = true;
               view.render(); 
               view.script();
            }
          });
    },

    id: "ordini",

    script: function() {
      var lista_prodotti = document.getElementById("lista_prodotti_checkout");
      var prodotti = lista_prodotti.getElementsByClassName("prodotto_checkout");
      var totale = 0, index, prezzo;
      for (index = 0; index < prodotti.length; index++) {
        prezzo = prodotti[index].getElementsByClassName("prezzo_prodotto")[0].getElementsByTagName("span");
        quantita = prodotti[index].getElementsByClassName("quantita_prodotto")[0].innerHTML;
        totale += parseFloat(quantita*prezzo[0].innerHTML);
      }
      var loc_tot = document.getElementById("prezzo_totale").getElementsByTagName("span");
      loc_tot[0].innerHTML = totale.toFixed(2);;
    },

    render: function() {
          if(flag)  $(this.el).html(this.template({ Ordine : this.model, Prodotti : this.collection}));  
    }
  });


  return Showordine;

});