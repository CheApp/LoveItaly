define(function(require) {

	var Backbone = require("backbone");
	var AddressModel = require("models/Address_Model");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var AddressCollection = Backbone.Collection.extend({
		url: 'http://192.168.56.101/loveitaly/api/addresses/?io_format=JSON&display=full',

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
			options.beforeSend = autenticazione;
			return Backbone.Collection.prototype.sync.apply(this, arguments);
		}
	});

	return AddressCollection;
});