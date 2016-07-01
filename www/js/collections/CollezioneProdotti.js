define(function(require) {

	var Backbone = require("backbone");
	var Prodotto = require("models/Prodotto");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var CollezioneProdotti = Backbone.Collection.extend({
	  url: 'http://192.168.56.101/loveitaly/api/products/?io_format=JSON&display=full',

	  constructorName: "CollezioneProdotti",

	  model: Prodotto,

	  byCategory: function (category) {
        filtered = this.filter(function (prodotto) {
        	for (var i=0; i<(prodotto.get("associations").categories.length);i++){
           
        	if(prodotto.get("associations").categories[i].id == category && prodotto.get("active") == 1 && prodotto.get("is_virtual") == 0 ){
            return prodotto;
           }
          }
        });
        return filtered;
      },

      byManufacturer: function(manufacturer) {
      	filtered = this.filter(function (prodotto) {
      		if(prodotto.get("id_manufacturer") == manufacturer) {
      			return prodotto;
      		}
      	});
      	return filtered;
      },

      bySearch: function(collection) {
      	var products = collection.at(0).get("products");
      	filtered = this.filter(function (prodotto) {
      		for(var i=0; i<products.length; i++) {
      			if (prodotto.get("id") == products[i].id) {
      				return prodotto;
      			}
      		}
      	});
      	return filtered;
      },

			byIDList: function(elenco) {
      	filtered = this.filter(function (prodotto) {
					var c;

					for (c = 0; c < elenco.length; c++) {
							if (elenco[c].attributes.id_prodotto == prodotto.get("id")) {
									
									prodotto.quantita = elenco[c].attributes.quantità;

									return prodotto;
								  
									
							}
					}
      		
      	});
      	return filtered;
      },

	  parse: function(data) {
	        return data.products;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	    options.beforeSend = autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }
	});

	return CollezioneProdotti;
});