define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var CollezioneOrdini = require("collections/CollezioneOrdini");
  var Order = require("models/Order");


  var Ordini = Utils.Page.extend({

    constructorName: "Ordini",
    collection : CollezioneOrdini,

    

    initialize: function(options) {

      this.template = Utils.templates.ordini;
      
    },

    id: "ordini",

    events: {
      "click #orderitem": "goOrder"
    },

    goOrder : function(e) {
      var uid = $(e.currentTarget).data("id");
      Backbone.history.navigate("showordine?oid="+ localStorage.getItem("ID") + "&uid=" + uid  , {
        trigger: true
      });
    },

    render: function() {
           $(this.el).html(this.template({Ordini : this.collection })); 
    }
  });


  return Ordini;

});