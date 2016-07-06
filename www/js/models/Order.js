define(function(require) {

	var Backbone = require("backbone");

	

	var Order = Backbone.Model.extend({

	  constructorName: "Order",

	  initialize : function(options) {
        
        if(options.associations != undefined)   this.cart_rows  =  options.associations.cart_rows;          
	    if(options.date_add  != undefined)   this.inserimento  = (options.date_add).substring(0, 10);   
	    this.id   = options.id;    
    }
    });
    
	return Order;
});




