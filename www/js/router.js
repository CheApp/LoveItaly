define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var StructureView = require("views/StructureView");
  var Home = require("views/pages/Home");
  var Registrazione = require("views/pages/Registrazione");
  var InfoProdotto = require("views/pages/InfoProdotto");
  var ListaProdotti = require("views/pages/ListaProdotti");
  var SplashScreen = require("views/pages/SplashScreen");
  var checkoutView = require("views/pages/checkoutView");
  var InfoAzienda = require("views/pages/InfoAzienda");
  var Cart = require("views/pages/Cart");
  var User = require("views/pages/User");
  var Showordine = require("views/pages/Showordine");
  var Indirizzi = require("views/pages/Indirizzi");
  var Dettagli = require("views/pages/Dettagli");
  var Showindirizzo = require("views/pages/Showindirizzo");
  var Addindirizzo = require("views/pages/Addindirizzo");
  var Ordini = require("views/pages/Ordini");
  var Desideri = require("views/pages/desideri");
  var CartList = require("collections/Nel_Carrello");
  var cart_object = require("models/cart_object");
  var Prodotto = require("models/Prodotto");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var CollezioneAziende = require("collections/Aziende");
  var CollezioneCategorie = require("collections/Categorie");
  var Azienda = require("models/Azienda");


  var Collezione = new CollezioneProdotti();
  var Aziende    = new CollezioneAziende();
  var Categorie  = new CollezioneCategorie();
  var ListaCarrello = new CartList();

  var AppRouter = Backbone.Router.extend({
    

    constructorName: "AppRouter",

    routes: {
      // the default is the structure view
      "": "showStructure",
      "splashscreen" : "SplashScreen",
      "home": "Home",
      "infoprodotto?pid=:pid" : "InfoProdotto",
      "listaprodotti?action=:act&param=:par" : "ListaProdotti",
      "infoazienda?aid=:aid&tab=:tab" : "InfoAzienda",
      "checkout?cid=:cid": "showCheckout",
      "user" : "User",
      "indirizzi" : "Indirizzi",
      "showindirizzo?aid=:aid" : "Showindirizzo",
      "addindirizzo?act=:act&aid=:aid" : "Addindirizzo",
      "registrazione" : "Registrazione",      
      "ordini?oid=:oid": "Ordini",
      "dettagli" : "Dettagli",
      "showordine?oid=:oid&uid=:uid" : "Showordine",
      "desideri": "desideri"
    },

    firstView: "splashscreen",

    initialize: function(options) {

      ListaCarrello.fetch({ajaxSync: false});

      this.currentView = undefined;
    },

    SplashScreen: function() {
      
      var page = new SplashScreen(Collezione);
      this.changePage(page); 
    },

    Home: function() {
            
      this.refreshCart();   
      var page = new Home(Collezione);
       this.changePage(page);   
      },


    InfoProdotto: function(pid) {
       var retrieve = Collezione.get(pid);
       var page = new InfoProdotto({ model: retrieve });
       this.changePage(page); 

    },

    ListaProdotti: function(action, param) {
      this.refreshCart();
      var page = new ListaProdotti(Collezione, action, param);
      this.changePage(page);
    },

    InfoAzienda: function(aid, tab) {
      this.refreshCart();
      var page = new InfoAzienda(Collezione, aid , tab);
      this.changePage(page);
    },

    showCheckout: function(cid) {

      this.refreshCart();
      var page = new checkoutView(Collezione, cid);
      this.changePage(page);
    },

    User: function() { 
        this.refreshCart();   
        var page = new User();
        this.changePage(page);   
      },


    Indirizzi: function() {
        var page = new Indirizzi();
        this.changePage(page);  
    },

     Showindirizzo: function(aid) {
        var page = new Showindirizzo(aid);
        this.changePage(page); 
    },

     Addindirizzo: function(act,aid) {
       var page = new Addindirizzo(act , aid);
       this.changePage(page);
    },

    Ordini: function(oid) {
        var page = new Ordini(oid);
       this.changePage(page);
    },

    Dettagli: function() {
      
      var page = new Dettagli();
      this.changePage(page); 

    },

    Showordine : function(oid,uid) {
       var page = new Showordine(Collezione,oid,uid);
       this.changePage(page);  
    },

    desideri: function() {
      var page = new Desideri(Collezione);
      this.changePage(page); 
    },


    refreshCart: function(){
      ListaCarrello.fetch({ajaxSync: false});
      var array_cart = ListaCarrello.models;
      var prodotti_nel_carrello = Collezione.byIDList(array_cart);
      var carrello = new Cart({
          collection: prodotti_nel_carrello
      });
      carrello.render();
      this.structureView.setCart(carrello.el);
    },

    // load the structure view
    showStructure: function() {
      var router = this;

      if (localStorage.getItem("connessione") == "true") {
            if (!this.structureView) {
              router.structureView = new StructureView(Aziende, Categorie);
              document.body.appendChild(router.structureView.render().el);
              router.structureView.trigger("inTheDOM");
              router.navigate(router.firstView, {trigger: true});
            }
            
      }
      else {
            navigator.notification.alert(
                'Controlla la connesione!',  // message
                alertDismissed,         // callback
                'Internet',            // title
                'Esci'                  // buttonName
            );
      }

      function alertDismissed() {
          navigator.app.exitApp();
      }
      
    },

  Registrazione: function() {
      var page = new Registrazione();
      this.changePage(page); 
    }
    

  });

  return AppRouter;

});