define(function(require) {

	var Backbone = require("backbone");
	var StateModel = require("models/State_Model");

	var StateCollection = Backbone.Collection.extend({
		url: function() {
			return window.SERVER_PATH+'/states/?io_format=JSON&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
		},

		constructorName: "StateCollection",
		model: StateModel,

		

		parse: function(data) {
			return data.states;
		},

		sync: function(method, collection, options){
			options = options || {};
		//	options.beforeSend = window.autenticazione;
			return Backbone.Collection.prototype.sync.apply(this, arguments);
		}
	});

	return StateCollection;
});