define(function(require) {

	var Backbone = require("backbone");

	var Utente = Backbone.Model.extend({
	  initialize: function(options) {
	  	this.id = options.id;
	  },

	  default: {
	  	nome : "",
	  	cognome : "",
	  	email : "",
	  },

	  url: function () {
	    var url = window.SERVER_PATH+'/customers/';
	    url += this.id;
	    url += '?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
	    return url;
	  },

	  constructorName: "Utente",

	  parse: function(data) {
	      this.nome = data.customer.firstname;
	      this.cognome = data.customer.lastname;
	      this.email = data.customer.email;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	//    options.beforeSend = window.autenticazione;
	    return Backbone.Model.prototype.sync.apply(this, arguments);
	  }
	});

	return Utente;
});