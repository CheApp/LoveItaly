define(function(require) {

	var Backbone = require("backbone");

	var Search = Backbone.Collection.extend({
	  initialize: function(options) {
	  	this.query = options.query;
	  },

	  url: function() { 
		  return window.SERVER_PATH+'/search?query='+this.query+'&language=1&io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
		},

	  constructorName: "Search",

	  parse: function(data) {
	        return data;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	//    options.beforeSend = window.autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }
	});

	return Search;
});