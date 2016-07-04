define(function(require) {

	var Backbone = require("backbone");
	var StateModel = require("models/State_Model");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var StateCollection = Backbone.Collection.extend({
		url: 'http://192.168.56.101/loveitaly/api/states/?io_format=JSON&display=full',

		constructorName: "StateCollection",
		model: StateModel,

		

		parse: function(data) {
			return data.states;
		},

		sync: function(method, collection, options){
			options = options || {};
			options.beforeSend = autenticazione;
			return Backbone.Collection.prototype.sync.apply(this, arguments);
		}
	});

	return StateCollection;
});