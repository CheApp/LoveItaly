define(function(require) {

	var Backbone = require("backbone");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var Search = Backbone.Collection.extend({
	  initialize: function(options) {
	  	this.query = options.query;
	  },

	  url: function() { 
		  return 'http://192.168.56.101/loveitaly/api/search?query='+this.query+'&language=1&io_format=JSON'
		},

	  constructorName: "Search",

	  parse: function(data) {
	        return data;
	  },

	  sync: function(method, collection, options){
	    options = options || {};
	    options.beforeSend = autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }
	});

	return Search;
});