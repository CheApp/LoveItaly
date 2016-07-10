define(function(require) {

	var Backbone = require("backbone");

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
	    var url = window.SERVER_PATH+'/addresses/';
	    url += this.id;
	    url += '?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
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
	//    options.beforeSend = window.autenticazione;
	    return Backbone.Model.prototype.sync.apply(this, arguments);
	  }
	});

	return Indirizzo;
});