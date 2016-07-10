define(function(require) {

	var Backbone = require("backbone");
	var Order = require("models/Order");

	var CollezioneOrdini = Backbone.Collection.extend({

		initialize : function(options) {
        
        this.id   =  options.id;
        this.url  = window.SERVER_PATH+'/carts/?filter[id_customer]='+this.id+'&io_format=JSON&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
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
	//    options.beforeSend = window.autenticazione;
	    return Backbone.Collection.prototype.sync.apply(this, arguments);
	  }
	});

	return CollezioneOrdini;
});