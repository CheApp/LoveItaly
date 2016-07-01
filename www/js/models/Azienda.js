define(function(require) {

	var Handlebars = require("handlebars");
	var Backbone = require("backbone");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

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
	    var url = 'http://192.168.56.101/loveitaly/api/manufacturers/';
	    url += this.id;
	    url += '?io_format=JSON';
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
	    options.beforeSend = autenticazione;
	    return Backbone.Model.prototype.sync.apply(this, arguments);
	  }
	});

	return Azienda;
});