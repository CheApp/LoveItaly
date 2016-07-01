define(function(require) {

	var Backbone = require("backbone");
	var Storage = require("localstorage")
	var Wish = require("models/Prodotto_Desiderio");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var WishList = Backbone.Collection.extend({
	  //url: 'http://loveitaly.altervista.org/api/products/?io_format=JSON&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',

	  localStorage: new Backbone.LocalStorage("WishList"),
	  model: Wish,

	  /*parse: function(data) {
	        return data.products;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	    //options.beforeSend = autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }*/
	});

	return WishList;
});