define(function(require) {

	var Backbone = require("backbone");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var Indirizzo = Backbone.Model.extend({
	  initialize: function(options) {
	  	this.id = options.id;
	  },

	  default: {
	  	citta : "",
	  	via : "",
	  	tel : "",
	  	cel : ""
	  },

	  url: function () {
	    var url = 'http://192.168.56.101/loveitaly/api/addresses/';
	    url += this.id;
	    url += '?io_format=JSON';
	    return url;
	  },

	  constructorName: "Indirizzo",

	  parse: function(data) {
	      this.citta = data.address.city;
	      this.via = data.address.address1;
	      this.tel = data.address.phone;
	      this.cel = data.address.phone_mobile;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	    options.beforeSend = autenticazione;
	    return Backbone.Model.prototype.sync.apply(this, arguments);
	  }
	});

	return Indirizzo;
});