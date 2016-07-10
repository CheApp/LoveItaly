define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Indirizzo = require("models/Indirizzo");
  var AddressCollection = require("collections/Address_Collection");
  var StateCollection = require("collections/State_Collection");

  var flag;
  var Showindirizzo = Utils.Page.extend({

    constructorName: "Showindirizzo",
    model: Indirizzo,

    

    initialize: function(aid) {

      this.template = Utils.templates.showindirizzo;
      this.listenTo(this, "inTheDOM", this.script);
      var view = this;
      flag = false;
      var ListaIndirizzi  = new AddressCollection();
      ListaIndirizzi.fetch({

        success: function(collezione, response, options) {

            var ElencoProvince = new StateCollection();
            ElencoProvince.fetch({

              success: function(province, response, options) {
                
                var collezione_filtrata = collezione.byId(aid)[0];
                var array_prov = province.models;


            
                  for (var j = 0; j < array_prov.length; j++) {

                    if (collezione_filtrata.get("state") == array_prov[j].attributes.id) {
                      collezione_filtrata.attributes.provincia = array_prov[j].attributes.provincia;
                    }
                  }
                  view.model = collezione_filtrata; 
                  flag = true;
                  view.render(); 
          }
            });
            }
            }); 
      
    },

    id: "showindirizzo",

    events: {
      "click #delete"  : "deleteAddress",
      "click #editbtn" : "editAddress"
    },


    render: function() {
         if(flag)  $(this.el).html(this.template(this.model.toJSON())); 
    },

    script: function() {
      if(($("#backbutton").hasClass("disabled"))){
      document.getElementById("backbutton").classList.remove("disabled"); 
    }
      if((!($("#menubutton").hasClass("disabled")))){
      document.getElementById("menubutton").classList.add("disabled");   
      }
    },

     editAddress: function(e) {
      e.preventDefault();
      Backbone.history.navigate("addindirizzo?act=1&aid=" + document.getElementById("aid").value , {
        trigger: true
      });
    },

    deleteAddress : function() {

        var id_cliente = localStorage.getItem("ID");
        var id_indirizzo = document.getElementById("aid").value;

        $.ajax({
                    url: window.SERVER_PATH+'/addresses/'+id_indirizzo+'&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                    async: true,
                    type: "DELETE",
                    beforeSend: window.autenticazione,
                    success: function (result) {
                       window.history.back();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                      console.log('Errore chiamata ajax!' +
                                  '\nReponseText: ' + XMLHttpRequest.responseText +
                                  '\nStatus: ' + textStatus +
                                  '\nError: ' + errorThrown);
                    }
                  })
      }
  });


  return Showindirizzo;

});