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
  var quantita_selezionata = false;
  var num_quantita = 0;


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
      "click .ref_azienda": "goinfoazienda"
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

            event.stopPropagation();

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
        
            var quantità_scelta = document.getElementById("numeretto_quantità").innerHTML;
            
            var Cart_Object = new cart_object();
            Cart_Object.set({
                id_prodotto: this.model.id,
                quantità: quantità_scelta,
            })

            ListaCarrello.add(Cart_Object);
                    
            Cart_Object.save();
                    
            $("#add_to_cart").css("background-color", "gray");
                    
        }.bind(this));
    
        document.getElementById("menubutton").classList.add("disabled");
        document.getElementById("backbutton").classList.remove("disabled");
        document.getElementById("acquistabtn").classList.remove("disabled");
        document.getElementById("navbar").classList.add("disabled");

    $(".popupQuantitaP").click(function () {
      if ($("#descrizione").is(":visible")) {
        $("#descrizione").slideToggle(500, function () {
            $(".dettagli").text(function () {
                return "☰ Più informazioni";
            });
        });
      }
        var content = document.getElementById("content");
        var lista_quantita = document.getElementById("lista_quantita");
        var copertura = document.getElementById("copertura_carrello");

        content.style.overflow = "hidden";
        copertura.style.display = "inline-block";
        copertura.style.animation = "stay_copertura 0.5s";
        copertura.style.WebkitAnimation = "stay_copertura 0.5s";
        lista_quantita.style.display = "inline-block";
        lista_quantita.style.animation = "stay 0.5s";
        lista_quantita.style.WebkitAnimation = "stay 0.5s";

        var height_content = content.offsetHeight;
        var width_content = content.offsetWidth;
        var width_popup = width_content/2;
        var height_popup = lista_quantita.offsetHeight;

        lista_quantita.style.width = width_popup + "px";
        lista_quantita.style.top = height_content/2 - height_popup/1.3 + "px";
        lista_quantita.style.left = width_content/2 - width_popup/2 + "px";

        aspettaSelezione(this);
      });

      function aspettaSelezione(quantita) {

        if (!quantita_selezionata) {
          setTimeout(function() { aspettaSelezione(quantita) }, 500);
        } else {
          quantita.getElementsByTagName("span")[1].innerHTML = num_quantita;
          var content = document.getElementById("content");
          var copertura = document.getElementById("copertura_carrello");
          var lista_quantita = document.getElementById("lista_quantita");
          content.style.overflow = "auto";
          copertura.style.animation = "leave_copertura 0.8s";
          copertura.style.WebkitAnimation = "leave_copertura 0.8s";
          lista_quantita.style.animation = "leave 0.8s";
          lista_quantita.style.WebkitAnimation = "leave 0.8s";
          setTimeout(function() {
            lista_quantita.style.display = "none";
            copertura.style.display = "none";
          }, 800)
          quantita_selezionata = false;
        }

      }

      $(".item_q").click(function () {
        num_quantita = this.innerHTML;
        quantita_selezionata = true;
      });
    
    },

    goinfoazienda: function(e) {
      e.preventDefault();
      var aid = $(e.currentTarget).data("id");
     
      Backbone.history.navigate("infoazienda?aid=" + aid + "&tab=1", {
        trigger: true
      });
    }
  });


  return InfoProdotto;

});