define(function(require) {

  var Backbone = require("backbone");
  var Prodotto = require("models/Prodotto");
  var WishList = require("collections/ListaDesideri");
  var Wish = require("models/Prodotto_Desiderio");
  var CartList = require("collections/Nel_Carrello");
  var cart_object = require("models/cart_object");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Swiper = require("swiper");
  var ListaDesideri = new WishList();
  var ListaCarrello = new CartList();


  var InfoProdotto = Utils.Page.extend({

    constructorName: "InfoProdotto",
    model: Prodotto,

    

    initialize: function(options) {

      this.template = Utils.templates.infoprodotto;

      ListaDesideri.fetch({ajaxSync: false});
      ListaCarrello.fetch({ajaxSync: false});

      this.listenTo(this, "inTheDOM", this.script);

    },

    id: "infoprodotto",

    events: {
     
    },

    render: function() {
           $(this.el).html(this.template(this.model)); 
    },




    script: function(){
        $("#add_to_cart").css("background-color", "green");
        var array_cart = ListaCarrello.models;
        
        var c;
        for (c = 0; c < array_cart.length; c++) {
            if (array_cart[c].attributes.id_prodotto == this.model.id) {
                
                $("#add_to_cart").css("background-color", "gray");
                
            }
        }

        $(".heart").css("background-position", "left");
        var array_wish = ListaDesideri.models;
        
        var c;
        for (c = 0; c < array_wish.length; c++) {
            if (array_wish[c].attributes.id_prodotto == this.model.id) {

                
                $(".heart").css("background-position", "right");
                
            }
        }

        var productslider = new Swiper('#slide-product', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 0,
            centeredSlides: true
        });

        $(".dettagli").click(function() {
            $("#descrizione").slideToggle(500, function () {
                $(".dettagli").text(function () {
                    return $("#descrizione").is(":visible") ? "☰ Meno informazioni" : "☰ Più informazioni";
                });
            });
                        
            $('#content').animate({
                scrollTop: $("#descrizione").offset().top + $('window').height()
            }, 1000);
                        
        });
                
        $(".heart").unbind('click');
                
        $(".heart").click(function() {

            var array_wish = ListaDesideri.models;
        
            var c;
            for (c = 0; c < array_wish.length; c++) {
                if (array_wish[c].attributes.id_prodotto == this.model.id) {
                    var current_wish = array_wish[c];
                    
                    current_wish.destroy();
                    
                    $(".heart").css("background-position", "left");        
                    return;       
                }
            }      
        
            var New_Wish = new Wish();
            New_Wish.set({
                id_prodotto: this.model.id,
            })

            ListaDesideri.add(New_Wish);
            
            New_Wish.save();
            

            $(this).toggleClass('animating');
            $(".heart").css("background-position", "right");
        
        
        }.bind(this));

        $(".acquistabtn").unbind('click');
                    
        $(".acquistabtn").click(function() {

            var array_cart = ListaCarrello.models;
                
            var c;
            for (c = 0; c < array_cart.length; c++) {
                if (array_cart[c].attributes.id_prodotto == this.model.id) {
                            
                    return;       
                }
            }      
                
            var Cart_Object = new cart_object();
            Cart_Object.set({
                id_prodotto: this.model.id,
                quantità: 1,
            })

            ListaCarrello.add(Cart_Object);
                    
            Cart_Object.save();
                    
            $("#add_to_cart").css("background-color", "gray");
                    
        }.bind(this));
    
        document.getElementById("menubutton").classList.add("disabled");
        document.getElementById("backbutton").classList.remove("disabled");
        document.getElementById("acquistabtn").classList.remove("disabled");
        document.getElementById("navbar").classList.add("disabled");
    
    }
  });


  return InfoProdotto;

});