define(function(require) {

	var Backbone = require("backbone");
	var Storage = require("localstorage")
	var cart_object = require("models/cart_object");

	
	var CartList = Backbone.Collection.extend({
	  
	  localStorage: new Backbone.LocalStorage("CartList"),
	  model: cart_object,

	  
	});

	return CartList;
});