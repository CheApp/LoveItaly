define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var Addindirizzo = Utils.Page.extend({

    constructorName: "Addindirizzo",

    

    initialize: function(options) {

      this.template = Utils.templates.addindirizzo;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "addindirizzo",

     events: {
      "click #addaddress"  : "addAddress"
    },



    render: function() {
           $(this.el).html(this.template); 
    },

   

    addAddress : function() {

        var autenticazione = function (xhr) {
          var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
          var token = 'Basic '.concat(key64);
          xhr.setRequestHeader('Authorization', token);
        }
        var id_cliente = localStorage.getItem("ID");

        var alias = document.getElementById("alias").value;
        var nome =  document.getElementById("name").value;
        var cognome =  document.getElementById("surname").value;
        var via =  document.getElementById("address").value;
        var CAP =  document.getElementById("CAP").value;
        var comune =  document.getElementById("city").value;
        var provincia = document.getElementById("provincia").value;
        var telefono = document.getElementById("phone").value;


        $.ajax({
          url: 'http://192.168.56.101/loveitaly/api/states/?io_format=XML&display=full',
          async: true,
          type: "GET",
          dataType: 'xml',
          beforeSend: autenticazione,

          success: function (result) {
              
            var $xml = $(result);

            var codes = $xml.find('state').find('iso_code');
              
            var c;
            for (c = 0; c < codes.length; c++) { 
              if (codes[c].firstChild.nodeValue == provincia) { 
                break; 
              }
            }

            var stati = $xml.find('state');
            var id_stato = stati[c].childNodes[1].firstChild.nodeValue;

              $.ajax({
                url: 'http://192.168.56.101/loveitaly/api/addresses/?io_format=XML&schema=blank',
                async: true,
                type: "GET",
                dataType: 'xml',
                beforeSend: autenticazione,

                success: function (result) {
                  
                  var $xml = $(result);
                  $xml.find('id_customer').text(id_cliente);
                  $xml.find('alias').text(alias);
                  $xml.find('firstname').text(nome);
                  $xml.find('lastname').text(cognome);
                  $xml.find('address1').text(via);
                  $xml.find('postcode').text(CAP);
                  $xml.find('city').text(comune);
                  $xml.find('id_country').text("10");
                  $xml.find('id_state').text(id_stato);
                  $xml.find('phone').text(telefono);


                  var indirizzo = '<prestashop>' + $xml.find('prestashop').html() + '</prestashop>';

                  $.ajax({
                    url: 'http://192.168.56.101/loveitaly/api/addresses/?io_format=XML',
                    async: true,
                    type: "POST",
                    dataType: 'xml',
                    contentType: "text/xml",
                    beforeSend: autenticazione,
                    data: indirizzo,
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


                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                  console.log('Errore chiamata ajax!' +
                              '\nReponseText: ' + XMLHttpRequest.responseText +
                              '\nStatus: ' + textStatus +
                              '\nError: ' + errorThrown);
                }
              })

    
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


  return Addindirizzo;

});