define(function(require) {

	var Backbone = require("backbone");
	var AddressModel = require("models/Address_Model");

	var AddressCollection = Backbone.Collection.extend({
		url: function() {
			return window.SERVER_PATH+'/addresses/?io_format=JSON&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
		},

		constructorName: "AddressCollection",
		model: AddressModel,

		byCustomer: function(customer) {

			var source_addresses = this.models;
			
			for (var c = 0; c < source_addresses.length; c++) {

				var indirizzo = source_addresses[c];

				if(indirizzo.attributes.customer != customer) {
					indirizzo.destroy();
					c--;
					
				}
			}
			
			
			return this;
        },

        byId: function(aid) {
      	filtered = this.filter(function (indirizzo) {
      		if(indirizzo.get("id_indirizzo") == aid) {
      			return indirizzo;
      		}
      	});
      	return filtered;
      },

		parse: function(data) {
			return data.addresses;
		},

		sync: function(method, collection, options){
			options = options || {};
		//	options.beforeSend = window.autenticazione;
			return Backbone.Collection.prototype.sync.apply(this, arguments);
		}
	});

	return AddressCollection;
});