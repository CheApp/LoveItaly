define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var ProdottiCarrello = require("collections/CollezioneProdotti");
  var CartList = require("collections/Nel_Carrello");
  var cart_object = require("models/cart_object");

  var flag = false;
  var quantita_selezionata = false;
  var num_quantita = 0;

  var ListaCarrello = new CartList();

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",
    collection: ProdottiCarrello,

    id: "main",
    Aziende : undefined,
    Categorie : undefined,

    events: {
      "click #backbutton"  : "goBack",
      "click #category"    : "goCategory",
      "click #manufacturer": "goManufacturer",
      "click #home"        : "goHome",
      "keypress #inp"      : "search"
    },

    initialize: function(options) {
    
      this.template = Utils.templates.structure;
      this.listenTo(this, "inTheDOM", this.bars);
      this.Aziende = options.Aziende.toJSON();
      this.Categorie  = options.Categorie.toJSON();

      ListaCarrello.fetch({ajaxSync: false});
  
    },

    render: function() {

      this.el.innerHTML = this.template({Aziende : this.Aziende, Categorie : this.Categorie});
      this.contentElement = this.$el.find('#content')[0];
      return this;

    },

     goHome: function() {
      Backbone.history.navigate("home", {
        trigger: true
      });
    },
 
    goBack: function() {
      if($("#menubutton").hasClass("disabled")){
      document.getElementById("menubutton").classList.remove("disabled");
      document.getElementById("backbutton").classList.add("disabled");
      document.getElementById("navbar").classList.remove("disabled");
      document.getElementById("acquistabtn").classList.add("disabled");
      }
      window.history.back();

    },

    goCategory: function(e) {
      $contenutomenu.slideToggle(500);
      e.preventDefault();
      var cid = $(e.currentTarget).data("id");
     
      Backbone.history.navigate("listaprodotti?action=1&param="+cid, {
        trigger: true
      });
    },

    goManufacturer: function(e) {
      $contenutomenu.slideToggle(500);
      e.preventDefault();
      var aid = $(e.currentTarget).data("id");
     
      Backbone.history.navigate("listaprodotti?action=2&param="+aid, {
        trigger: true
      });
    },

    search: function(e) {
      if(e.keyCode == 13){
      if($("#menubutton").hasClass("disabled")){
      document.getElementById("menubutton").classList.remove("disabled");
      document.getElementById("backbutton").classList.add("disabled");
      document.getElementById("navbar").classList.remove("disabled");
      document.getElementById("acquistabtn").classList.add("disabled");
      }
      $contenuto.slideToggle(500);
      var str = $("#inp").val();
      Backbone.history.navigate("listaprodotti?action=3&param="+str, {
        trigger: true
      });
      $("#inp").val('');
    }
    },

    setCart : function (cart){
      this.$('#cart').remove();
      this.$('#car_lista_prodotti').append(cart);

      $(document).ready(function() {


        $(".popupQuantita").click(function () {
          var carrello = document.getElementById("carrello");
          var lista_quantita = document.getElementById("car_lista_quantita");
          var copertura = document.getElementById("car_copertura_carrello");

          carrello.style.overflow = "hidden";
          copertura.style.display = "inline-block";
          copertura.style.animation = "car_stay_copertura 0.5s";
          copertura.style.WebkitAnimation = "car_stay_copertura 0.5s";
          lista_quantita.style.display = "inline-block";
          lista_quantita.style.animation = "car_stay 0.5s";
          lista_quantita.style.WebkitAnimation = "car_stay 0.5s";

          var height_carrello = carrello.offsetHeight;
          var width_carrello = carrello.offsetWidth;
          var width_popup = width_carrello/2;
          var height_popup = lista_quantita.offsetHeight;

          lista_quantita.style.width = width_popup + "px";
          lista_quantita.style.top = height_carrello/2 - height_popup/1.3 + "px";
          lista_quantita.style.left = width_carrello/2 - width_popup/2 + "px";

          aspettaSelezione(this);
        });

        function aspettaSelezione(quantita) {

          if (!quantita_selezionata) {
            setTimeout(function() { aspettaSelezione(quantita) }, 500);
          } else {
            quantita.getElementsByTagName("span")[1].innerHTML = num_quantita;
            
            var id_cart_object = quantita.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');

            var array_cart = ListaCarrello.models;
                
            var c;
            for (c = 0; c < array_cart.length; c++) {

                if (array_cart[c].attributes.id_prodotto == id_cart_object) {
                    var current_obj = array_cart[c];
                    
                    current_obj.destroy();

                    var Cart_Object = new cart_object();
                    Cart_Object.set({
                        id_prodotto: id_cart_object,
                        quantità: num_quantita,
                    })

                    ListaCarrello.add(Cart_Object);
                            
                    Cart_Object.save();
                     
                    break;    
                }
            } 


            var carrello = document.getElementById("carrello")
            var copertura = document.getElementById("car_copertura_carrello")
            var lista_quantita = document.getElementById("car_lista_quantita");
            carrello.style.overflow = "auto";
            copertura.style.animation = "car_leave_copertura 0.8s";
            copertura.style.WebkitAnimation = "car_leave_copertura 0.8s";
            lista_quantita.style.animation = "car_leave 0.8s";
            lista_quantita.style.WebkitAnimation = "car_leave 0.8s";
            setTimeout(function() {
              lista_quantita.style.display = "none";
              copertura.style.display = "none";
            }, 800)
            quantita_selezionata = false;
          }

        }

        $(".car_item_q").click(function () {
          num_quantita = this.innerHTML;
          quantita_selezionata = true;
        });

        $(".eliminaProdotto").click(function() {
          var prodotto = this.parentNode.parentNode.parentNode.parentNode;
          prodotto.style.animation = "car_elimina_prodotto 0.5s";
          prodotto.style.WebkitAnimation = "car_elimina_prodotto 0.5s"; 
          setTimeout(function() { 
            //debugger;
            prodotto.remove();

            var id_cart_object = prodotto.getAttribute('data-id');

            var array_cart = ListaCarrello.models;
                
            var c;
            for (c = 0; c < array_cart.length; c++) {
                if (array_cart[c].attributes.id_prodotto == id_cart_object) {
                    var current_obj = array_cart[c];
                    
                    current_obj.destroy();
                     
                    break;       
                }
            } 


            cambiaBadge();
            if (conta_prodotti() === 0) {
              var checkout = document.getElementById("car_checkout");
              checkout.style.animation = "car_down_checkout 0.4s";
              checkout.style.WebkitAnimation = "car_down_checkout 0.4s";
              setTimeout (function() {
                checkout.style.visibility = "hidden";
              }, 400)
            } 
           }, 500);
        });
        cambiaBadge();
      });

      function conta_prodotti() {
        var lista_prodotti = document.getElementById("car_lista_prodotti");
        var prodotti = lista_prodotti.getElementsByClassName("car_prodotto");
        return prodotti.length;
      }

      function cambiaBadge(){
        var badge = document.getElementById("badge_carrello");
        badge.innerHTML = conta_prodotti();
      }
    },


    bars: function(){ 
      $header = $("#head");
      $contenuto = $header.next();
      $headermenu = $("#menuhead");
      $contenutomenu = $headermenu.next();

      $("#searchbutton").click(function () {
        if($contenutomenu.is(":visible")){
          $contenutomenu.slideToggle(500, function () {
          $contenuto.slideToggle(500, function () {
              $header.text(function () {
                  $("#inp").focus();
              });
          });
          });
      }
          else{
            $contenuto.slideToggle(500, function () {
              $header.text(function () {
                  $("#inp").focus();
              });
          });
          }

      });

      $("#menubutton").click(function () {
        if($contenuto.is(":visible")){
          $contenuto.slideToggle(500, function () {
            $contenutomenu.slideToggle(500);
          });
      }
          else {
            $contenutomenu.slideToggle(500);
          }

      });

      $("#categorie").click(function() {
        document.getElementById("categoriamenu").classList.remove("disabled");
        document.getElementById("startmenu").classList.add("disabled");
        document.getElementById("menu").setAttribute("style", "overflow-y:auto");
      });

      $("#aziende").click(function() {
        document.getElementById("aziendamenu").classList.remove("disabled");
        document.getElementById("startmenu").classList.add("disabled");
        document.getElementById("menu").setAttribute("style", "overflow-y:auto");
      });

       $("#indietroc").click(function() {
        document.getElementById("categoriamenu").classList.add("disabled");
        document.getElementById("startmenu").classList.remove("disabled");
      });

        $("#indietroa").click(function() {
        document.getElementById("aziendamenu").classList.add("disabled");
        document.getElementById("startmenu").classList.remove("disabled");
      });

      $(document).on('click', function(e) {
       if ($(e.target).closest('#headbar').length == 0 ) {
         if($contenuto.is(":visible"))$contenuto.slideToggle(500);
          if($contenutomenu.is(":visible"))$contenutomenu.slideToggle(500);
      }
     });

      $("#apri_carrello").click(function() {
        
        if(flag){
          close_car();
        }else{
        var carrello = document.getElementById("carrello");
        var content = document.getElementById("content");       
        carrello.style.visibility = "visible";
        carrello.style.animation =  "car_up 0.3s";
        carrello.style.WebkitAnimation =  "car_up 0.3s";
        var header = document.getElementsByTagName("header");
        var checkout = document.getElementById("car_checkout");          
        setTimeout(function(){
          if (conta_prodotti() > 0) {
            checkout.style.visibility = "visible";
            checkout.style.animation = "car_up_checkout 0.3s";
            checkout.style.WebkitAnimation = "car_up_checkout 0.3s";
          } else {
            checkout.style.visibility = "hidden";
          }
          var lista_prodotti = document.getElementById("car_lista_prodotti");
          lista_prodotti.style.visibility = "visible";
          lista_prodotti.style.animation = "car_stay 0.2s";
          lista_prodotti.style.WebkitAnimation = "car_stay 0.2s";
          header[0].style.animation = "car_leave 0.5s";
          header[0].style.WebkitAnimation = "car_leave 0.5s";
          setTimeout(function() {
            header[0].style.visibility = "hidden";
            }, 500);
          content.style.display = "none";
        }, 300);
        flag = true;
        } 
      });

      $("#x_car").click(close_car);

      function close_car(){
        flag = false;
        var carrello = document.getElementById("carrello");
        carrello.style.animation =  "car_down 0.5s";
        carrello.style.WebkitAnimation =  "car_down 0.5s";
        var lista_prodotti = document.getElementById("car_lista_prodotti");
        lista_prodotti.style.animation = "car_leave 0.4s"
        lista_prodotti.style.WebkitAnimation = "car_leave 0.4s"
        var header = document.getElementsByTagName("header");
        header[0].style.visibility = "visible";
        header[0].style.animation = "car_stay 0s";
        header[0].style.WebkitAnimation = "car_stay 0s";
        var checkout = document.getElementById("car_checkout");
        checkout.style.animation = "car_down_checkout 0.5s";
        checkout.style.WebkitAnimation = "car_down_checkout 0.5s";
        setTimeout(function() {
          var content = document.getElementById("content");
          content.style.display = "inline-block";
        }, 200); 
        setTimeout(function() {
          var lista_prodotti = document.getElementById("car_lista_prodotti");
          lista_prodotti.style.animation = "car_leave 0.3s"
          lista_prodotti.style.WebkitAnimation = "car_leave 0.3s"
          lista_prodotti.style.visibility = "hidden";
          carrello.style.visibility = "hidden";
          checkout.style.visibility = "hidden";
        }, 300);
      }

      function conta_prodotti() {
        var lista_prodotti = document.getElementById("car_lista_prodotti");
        var prodotti = lista_prodotti.getElementsByClassName("car_prodotto");
        return prodotti.length;
      }

    },

  });

  return StructureView;

});