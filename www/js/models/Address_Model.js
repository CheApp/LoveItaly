define(function(require) {

    var Backbone = require("backbone");
    //var StateModel = require("models/State_Model");

    var AddressModel = Backbone.Model.extend({

      constructorName: "AddressModel",

      initialize: function(options) {
        this.attributes.id_indirizzo = options.id;
        this.attributes.customer = options.id_customer;
        this.attributes.firstname = options.firstname;
        this.attributes.lastname = options.lastname;
        this.attributes.city = options.city;
        this.attributes.address1 = options.address1;
        this.attributes.address2 = options.address2;
        this.attributes.alias = options.alias;
        this.attributes.phone = options.phone;
        this.attributes.phone_mobile = options.phone_mobile;
        this.attributes.postcode = options.postcode;
        //this.attributes.country = options.id_country;
        this.attributes.state = options.id_state;
        this.attributes.provincia = "undefined";
        this.attributes.paese = "Italia";


        /*var statemod = new StateModel({ id: options.id_state});

        statemod.fetch({

          success: function(model, response, options) {
          	console.log(model);

            this.attributes.provincia = model.provincia;

              
          }.bind(this),

          error: function (model, response, options) {
          	console.log("state non definito")
          }

        })*/

      },

      
      parse: function(data) {
        return data.address;
      },

      sync: function(method, collection, options){
        options = options || {};
   //     options.beforeSend = window.autenticazione;
        return Backbone.Model.prototype.sync.apply(this, arguments);
      }
    });  

    return AddressModel;
    
});

