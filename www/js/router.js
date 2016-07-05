define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var StructureView = require("views/StructureView");
  var Home = require("views/pages/Home");
  var InfoProdotto = require("views/pages/InfoProdotto");
  var ListaProdotti = require("views/pages/ListaProdotti");
  var SplashScreen = require("views/pages/SplashScreen");
  var checkoutView = require("views/pages/checkoutView");
  var InfoAzienda = require("views/pages/InfoAzienda");
  var Cart = require("views/pages/Cart");
  var User = require("views/pages/User");
  var Indirizzi = require("views/pages/Indirizzi");
  var Showindirizzo = require("views/pages/Showindirizzo");
  var Addindirizzo = require("views/pages/Addindirizzo");
  var Ordini = require("views/pages/Ordini");
  var CartList = require("collections/Nel_Carrello");
  var cart_object = require("models/cart_object");
  var Prodotto = require("models/Prodotto");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var CollezioneAziende = require("collections/Aziende");
  var CollezioneCategorie = require("collections/Categorie");
  var Search = require("collections/Search");
  var Azienda = require("models/Azienda");
  var Indirizzo = require("models/Indirizzo");
  var AddressCollection = require("collections/Address_Collection");
  var StateModel = require("models/State_Model");
  var StateCollection = require("collections/State_Collection");
  var Registrazione = require("views/pages/Registrazione");


  var Collezione = new CollezioneProdotti();
  var Aziende    = new CollezioneAziende();
  var Categorie  = new CollezioneCategorie();
  var ListaIndirizzi  = new AddressCollection();
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
      "infoazienda?aid=:aid" : "InfoAzienda",
      "checkout?cid=:cid": "showCheckout",
      "user" : "User",
      "indirizzi" : "Indirizzi",
      "showindirizzo?aid=:aid" : "Showindirizzo",
      "addindirizzo" : "Addindirizzo",
      "registrazione" : "Registrazione",      
      "ordini": "Ordini"
    },

    firstView: "splashscreen",

    initialize: function(options) {

      ListaCarrello.fetch({ajaxSync: false});

      this.currentView = undefined;
    },



    SplashScreen: function() {
      
      var page = new SplashScreen();

      Collezione.fetch({
        success: function (collection, response, options) {
              setTimeout(page.start , 1500);  
            }
          });

      this.changePage(page); 

    },

    Home: function() {
            
            this.refreshCart();
            //Filtrano rispettivamente i prodotti attivi ed i prodotti da mostrare in home
            var attivi   = Collezione.where({active: "1",is_virtual: "0"});
            var prodotti = Collezione.byCategory("2");
            
            //Aggiunge i 6 prodotti più recenti inseriti ed attivi di loveitaly alla lista
            for(var i=attivi.length-6; i<attivi.length; i++){
              attivi[i].nuovo=true;
              prodotti.push(attivi[i]);
            }
           
           var page = new Home({
           collection: prodotti
           });
        this.changePage(page);   
      },


    InfoProdotto: function(pid) {
       var retrieve = Collezione.get(pid);
       var page = new InfoProdotto({ model: retrieve });
       this.changePage(page); 

    },

    ListaProdotti: function(action, param) {

      this.refreshCart();
      if (action == "1") {
        var prodotti = Collezione.byCategory(param);
        var page = new ListaProdotti ({ collection : prodotti });
        this.changePage(page);
      } else if (action == "2") {
          var prodotti = Collezione.byManufacturer(param);
          var page = new ListaProdotti ({ collection : prodotti });
          this.changePage(page);
      } else {
          var newSearch = new Search({ query : param });
          var router = this;
          newSearch.fetch({ 
            success: function (collection, response, options) {
              var prodotti = null;
              if (collection.length > 0) {
                    prodotti = Collezione.bySearch(collection);
                  } 
              var page = new ListaProdotti ({ collection : prodotti });
              router.changePage(page);
            }
        }); 
      }
    },

    InfoAzienda: function(aid) {
      this.refreshCart();
      var router = this;
      var manufacturer = new Azienda({ id : aid });
      manufacturer.fetch({
        success: function (model, response, options) {
          var ind = new Indirizzo ({ id : model.num_ind });
          var azienda = model;
          ind.fetch({
            success: function(model, response, options) {
              azienda.citta = model.citta;
              azienda.indirizzo = model.via;
              azienda.tel = model.tel;
              azienda.cel = model.cel;
              var prodotti = Collezione.byManufacturer(azienda.id);
              var page = new InfoAzienda ({ model : azienda, collection : prodotti });
              router.changePage(page);            
            }
          });
        }
      });
    },

    showCheckout: function(cid) {

      
      var AddrCollection = new AddressCollection();

      AddrCollection.fetch({
        success: function(lista_ind, response, options) {

          var ElencoProvince = new StateCollection();

          ElencoProvince.fetch({
            success: function(province, response, options) {
              
              this.collezione_filtrata = lista_ind.byCustomer(cid);
              console.log(this.collezione_filtrata);


              var array_addr = this.collezione_filtrata.models;
              var array_prov = province.models;

              for (var c = 0; c < array_addr.length; c++) {

                for (var j = 0; j < array_prov.length; j++) {

                  if (array_addr[c].attributes.state == array_prov[j].attributes.id) {

                    array_addr[c].attributes.provincia = array_prov[j].attributes.provincia;

                  }

                }

               
              }

              var array_cart = ListaCarrello.models;
              var prodotti_nel_checkout = Collezione.byIDList(array_cart);

              var page = new checkoutView( {
                  collection: {
                    indirizzi: this.collezione_filtrata,
                    ordini: prodotti_nel_checkout
                  }
              });
                
              this.changePage(page);

            }.bind(this),



            error: function(model, response, options) {
              console.log('Errore fetch province!');
            }


          })            

            
            
            
          }.bind(this),

          error: function(model, response, options) {
              console.log('Errore fetch indirizzi!');
          }

        });

      
    },

    User: function() { 
        this.refreshCart();   
        var page = new User();
        this.changePage(page);   
      },


    Indirizzi: function() {
      
      var router = this;
      ListaIndirizzi.fetch({

        success: function(collezione, response, options) {

            var ElencoProvince = new StateCollection();
            ElencoProvince.fetch({

              success: function(province, response, options) {
                
                var collezione_filtrata = collezione.byCustomer(localStorage.getItem("ID"));
                var array_addr = collezione_filtrata.models;
                var array_prov = province.models;


                for (var c = 0; c < array_addr.length; c++) {
                  for (var j = 0; j < array_prov.length; j++) {

                    if (array_addr[c].attributes.state == array_prov[j].attributes.id) {
                      array_addr[c].attributes.provincia = array_prov[j].attributes.provincia;
                    }
                  }
                }
            router.ListaIndirizzi = collezione_filtrata;
            var page = new Indirizzi({collection : collezione_filtrata});
            router.changePage(page);
          }
            });
            }
            });    
    },

     Showindirizzo: function(id) {
      
      var page = new Showindirizzo({model : ListaIndirizzi.at(id)});
      this.changePage(page); 

    },

     Addindirizzo: function() {
      
      var page = new Addindirizzo();
      this.changePage(page); 

    },

    Ordini: function() {
      
      var page = new Ordini();
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
      if (!this.structureView) {
  
     Aziende.fetch({
          success: function (collection, response, options) {

            Categorie.fetch({
               success: function (collection, response, options) {

              router.structureView = new StructureView({Aziende : Aziende, Categorie : Categorie});
              document.body.appendChild(router.structureView.render().el);
              router.structureView.trigger("inTheDOM");
              router.navigate(router.firstView, {trigger: true});
            }
          });
        }
      });
     }
    },

  Registrazione: function() {
      
      var page = new Registrazione();
      this.changePage(page); 

    }
    

  });

  return AppRouter;

});