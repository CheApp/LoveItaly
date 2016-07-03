define(function(require) {

	var Backbone = require("backbone");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var Aziende = Backbone.Collection.extend({

	  url: 'http://192.168.56.101/loveitaly/api/manufacturers?io_format=JSON&display=full',

	  constructorName: "Aziende",

	  parse: function(data) {
	        return data.manufacturers;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	    options.beforeSend = autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }
	});

	return Aziende;
});