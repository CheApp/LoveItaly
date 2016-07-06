define(function(require) {

	var Backbone = require("backbone");
	var Order = require("models/Order");

	var autenticazione = function (xhr) {
	  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
	  var token = 'Basic '.concat(key64);
	  xhr.setRequestHeader('Authorization', token);
	}

	var CollezioneOrdini = Backbone.Collection.extend({

		initialize : function(options) {
        
        this.id   =  options.id;
        this.url  = 'http://192.168.56.101/loveitaly/api/carts/?filter[id_customer]='+this.id+'&io_format=JSON&display=full';
    },

	  constructorName: "CollezioneOrdini",

	  model: Order,

	  parse: function(data) {
	        return data.carts;
	  },

	  byId: function(oid) {
      	filtered = this.filter(function (order) {
      		if(order.get("id") == oid) {
      			return order;
      		}
      	});
      	return filtered;
      },

	  sync: function(method, collection, options){
	    options = options || {};
	    options.beforeSend = autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }
	});

	return CollezioneOrdini;
});