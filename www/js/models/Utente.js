define(function(require) {

	var Backbone = require("backbone");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

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
	    var url = 'http://192.168.56.101/loveitaly/api/customers/';
	    url += this.id;
	    url += '?io_format=JSON';
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
	    options.beforeSend = autenticazione;
	    return Backbone.Model.prototype.sync.apply(this, arguments);
	  }
	});

	return Utente;
});