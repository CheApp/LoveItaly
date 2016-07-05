define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Indirizzo = require("models/Indirizzo");


  var Showindirizzo = Utils.Page.extend({

    constructorName: "Showindirizzo",
    model: Indirizzo,

    

    initialize: function(options) {

      this.template = Utils.templates.showindirizzo;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "showindirizzo",

    events: {
      "click #delete"  : "deleteAddress",
      "click #editbtn" : "editAddress"
    },


    render: function() {
           $(this.el).html(this.template(this.model.toJSON())); 
    },

     editAddress: function(e) {
      e.preventDefault();
      Backbone.history.navigate("addindirizzo?act=1&aid=" + document.getElementById("aid").value , {
        trigger: true
      });
    },

    deleteAddress : function() {

          var autenticazione = function (xhr) {
          var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
          var token = 'Basic '.concat(key64);
          xhr.setRequestHeader('Authorization', token);
        }
        var id_cliente = localStorage.getItem("ID");
        var id_indirizzo = document.getElementById("aid").value;

        $.ajax({
                    url: 'http://192.168.56.101/loveitaly/api/addresses/'+id_indirizzo,
                    async: true,
                    type: "DELETE",
                    beforeSend: autenticazione,
                    success: function (result) {
                       window.history.back();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                      console.log('Errore chiamata ajax!' +
                                  '\nReponseText: ' + XMLHttpRequest.responseText +
                                  '\nStatus: ' + textStatus +
                                  '\nError: ' + errorThrown);
                    }
                  })
      }
  });


  return Showindirizzo;

});