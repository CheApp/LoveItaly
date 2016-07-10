define(function(require) {

	var Handlebars = require("handlebars");
	var Backbone = require("backbone");

	var Azienda = Backbone.Model.extend({
	  initialize: function(options) {
	  	this.id = options.id;
	  },

	  default: {
	  	nome : "",
	  	descrizione : "",
	  	tel : "",
	  	cel : "",
	  	citta : "",
	  	indirizzo : "",
	  	num_ind : ""
	  }, 

	  url: function () {
	    var url = window.SERVER_PATH+'/manufacturers/';
	    url += this.id;
	    url += '?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
	    return url;
	  },

	  constructorName: "Azienda",

	  parse: function(data) {
	  	  this.nome = data.manufacturer.name;
	  	  this.descrizione = Handlebars.compile(data.manufacturer.description);
	  	  if (data.manufacturer.associations != null) {
		  	  this.num_ind = data.manufacturer.associations.addresses[0].id;
	  	  } else {
	  		  this.num_ind = null;
	  	  }
	  }, 

	  sync: function(method, collection, options){
	    options = options || {};
	//    options.beforeSend = window.autenticazione;
	    return Backbone.Model.prototype.sync.apply(this, arguments);
	  }
	});

	return Azienda;
});