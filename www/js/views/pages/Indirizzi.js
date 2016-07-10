define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var AddressCollection = require("collections/Address_Collection");
  var StateCollection = require("collections/State_Collection");
  var Jquery = require("jquery");

  var flag;
  var Indirizzi = Utils.Page.extend({

    constructorName: "Indirizzi",
    collection: AddressCollection,

    

    initialize: function(options) {

      this.template = Utils.templates.indirizzi;
      this.listenTo(this, "inTheDOM", this.script);
      flag = false;
      var view = this;
      var ListaIndirizzi  = new AddressCollection();
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
            flag = true;
            view.collection = collezione_filtrata;
            view.render();
          }
            });
            }
            }); 
      
    },


    events: {
      "click #indirizzo": "goIndirizzo",
      "click #addaddr": "goAddindirizzo"
    },

    render: function() {
      if(flag) $(this.el).html(this.template({Indirizzi: this.collection.toJSON() })); 
    },

    id: "indirizzi",

      script: function() {
          document.getElementById("menubutton").classList.add("disabled");
          document.getElementById("backbutton").classList.remove("disabled");
    },

    goAddindirizzo: function(e) {
      e.preventDefault();
      Backbone.history.navigate("addindirizzo?act=0&aid=0", {
        trigger: true
      });
    },

    goIndirizzo: function(e) {
      e.preventDefault();
      var aid = $(e.currentTarget).data("id");     
      Backbone.history.navigate("showindirizzo?aid="+aid, {
        trigger: true
      });
    }
  });




  return Indirizzi;

});