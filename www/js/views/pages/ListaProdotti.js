define(function(require) {

  var Backbone = require("backbone");
  var Prodotto = require("models/Prodotto");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var Search = require("collections/Search");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Swiper = require("swiper");
  var flag;


  var ListaProdotti = Utils.Page.extend({

    constructorName: "ListaProdotti",
    collection: CollezioneProdotti,

    

    initialize: function(Collezione, action, param) {

     var view = this;
     flag = false;
    this.template = Utils.templates.listaprodotti;
       if (action == "1") {
        view.collection = Collezione.byCategory(param);
        flag = true;
      } else if(action == "2") {
          view.collection = Collezione.byManufacturer(param);
          flag = true;
      } else {
          var newSearch = new Search({ query : param });
          var router = this;
          newSearch.fetch({ 
            success: function (risultato, response, options) {
              flag = true;
              if (risultato.length > 0) view.collection = Collezione.bySearch(risultato);
              else view.collection = undefined;
              view.render(); 
            }
        }); 
      }
      
    },

    id: "lista_prodotti",

    events: {
      "click .prodotto": "goinfoprodotto"
    },

    render: function() {
      if(flag){
             $(this.el).html(this.template({Prodotti : this.collection}));
           } 
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