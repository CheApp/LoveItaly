define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Address_Collection = require("collections/Address_Collection")
  var Jquery = require("jquery");


  var Indirizzi = Utils.Page.extend({

    constructorName: "Indirizzi",
    collection: Address_Collection,

    

    initialize: function(options) {

      this.template = Utils.templates.indirizzi;
      this.listenTo(this, "inTheDOM", this.script);
      
    },


    events: {
      "click #indirizzo": "goIndirizzo",
      "click #addaddr": "goAddindirizzo"
    },

    render: function() {
           $(this.el).html(this.template({Indirizzi: this.collection.toJSON() })); 
    },

    id: "indirizzi",

      script: function() {
          document.getElementById("menubutton").classList.add("disabled");
          document.getElementById("backbutton").classList.remove("disabled");
    },

    goAddindirizzo: function(e) {
      e.preventDefault();
      Backbone.history.navigate("addindirizzo?act=0&aid=0", {
        trigger: true
      });
    },

    goIndirizzo: function(e) {
      e.preventDefault();
      var aid = $(e.currentTarget).data("id");     
      Backbone.history.navigate("showindirizzo?aid="+aid, {
        trigger: true
      });
    }
  });




  return Indirizzi;

});