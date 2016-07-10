define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var WishList = require("collections/ListaDesideri");
  var Wish = require("models/Prodotto_Desiderio");
  var Jquery = require("jquery");


  var ListaDesideri = new WishList();

  var desideri = Utils.Page.extend({

    constructorName: "desideri",
    collection: CollezioneProdotti,

    

    initialize: function(Collezione) {

      this.template = Utils.templates.desideri;
      this.listenTo(this, "inTheDOM", this.script);
      var ListaDesideri = new WishList();
      ListaDesideri.fetch({ajaxSync: false});
      var array_wish = ListaDesideri.models;
      this.collection = Collezione.byIDList(array_wish);
      
    },


    render: function() {
           $(this.el).html(this.template({Desideri: this.collection })); 
    },

    id: "desideri",

    script: function() {
      document.getElementById("menubutton").classList.add("disabled");
      document.getElementById("backbutton").classList.remove("disabled");

      if (this.collection.length == 0) {
        $(".nessun_desiderio").attr("style", "display: block;");
      }

      $(".eliminaDesiderio").click(function() {
          var desiderio_contain = this.parentNode.parentNode.parentNode.parentNode;

          desiderio_contain.style.animation = "car_elimina_desiderio 0.5s";
          desiderio_contain.style.WebkitAnimation = "car_elimina_desiderio 0.5s"; 

          setTimeout(function() {
            
            var id_des_object = desiderio_contain.getAttribute('data-id');

            desiderio_contain.remove();

            ListaDesideri.fetch({ajaxSync: false});
              
            var array_wish = ListaDesideri.models;

            var c;
            for (c = 0; c < array_wish.length; c++) {
              if (array_wish[c].attributes.id_prodotto == id_des_object) {
                var current_wish = array_wish[c];
                    
                current_wish.destroy();
                                  
                return;       
              }
            }

          }, 500);
          
                
      });
    }
  });
  
            
  return desideri;    
});

    
 

