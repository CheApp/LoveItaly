define(function(require) {

    var Backbone = require("backbone");

    var StateModel = Backbone.Model.extend({

      constructorName: "StateModel",

      initialize: function(options) {
        this.attributes.id = options.id;
        this.attributes.stato = options.name;
        this.attributes.provincia = options.iso_code;
      },

      /*default: {
        id_state: "",
        stato: "",
        provincia: ""
      },*/

      /*url: function () {
        var url = 'http://192.168.56.101/loveitaly/api/states/';
        url += this.id;
        url += '?io_format=JSON';
        return url;
      },*/

      
      parse: function(data) {
        return data.state;        
      },

      sync: function(method, collection, options){
        options = options || {};
   //     options.beforeSend = window.autenticazione;
        return Backbone.Model.prototype.sync.apply(this, arguments);
      }
    });  

    return StateModel;
    
});

