define(function(require) {

	var Backbone = require("backbone");

	var Categorie = Backbone.Collection.extend({

	  url: function() {
		  return window.SERVER_PATH+'/categories?io_format=JSON&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
		},

	  constructorName: "Categorie",

	  parse: function(data) {
	        return data.categories;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	 //   options.beforeSend = window.autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }
	});

	return Categorie;
});