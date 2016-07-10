define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var AddressCollection = require("collections/Address_Collection");
  var StateCollection = require("collections/State_Collection");

  var flag;
  var Addindirizzo = Utils.Page.extend({

    constructorName: "Addindirizzo",
    act: undefined,
    model: undefined,

    

    initialize: function(act , aid) {

      this.act = act;
      flag = false;
      this.template = Utils.templates.addindirizzo;
      if(act == 0) this.listenTo(this, "inTheDOM", this.script);
      view = this;
      
      var ListaIndirizzi  = new AddressCollection();
      if(act != 0){
      ListaIndirizzi.fetch({

        success: function(collezione, response, options) {

            var ElencoProvince = new StateCollection();
            ElencoProvince.fetch({

              success: function(province, response, options) {
                
                var collezione_filtrata = collezione.byId(aid)[0];
                var array_prov = province.models;


            
                  for (var j = 0; j < array_prov.length; j++) {

                    if (collezione_filtrata.get("state") == array_prov[j].attributes.id) {
                      collezione_filtrata.attributes.provincia = array_prov[j].attributes.provincia;
                    }
                  }
              view.model = collezione_filtrata;
              flag = true;
              view.render();
              view.script();
          }
            });
            }
            }); 
    } else flag = true;
      
    },

    id: "addindirizzo",

     events: {
      "click #addaddress"  : "opAddress"
    },



    render: function() {
      if(flag) $(this.el).html(this.template); 
    },

    script : function() {
      if(this.act!=0){
        document.getElementById("addaddress").innerHTML = "Modifica";
        document.getElementById("addrtitle").innerHTML = "Modifica Indirizzo";
        document.getElementById("alias").value = this.model.get("alias");
        document.getElementById("name").value  = this.model.get("firstname");
        document.getElementById("surname").value = this.model.get("lastname");
        document.getElementById("address").value = this.model.get("address1");
        document.getElementById("CAP").value = this.model.get("postcode");
        document.getElementById("city").value = this.model.get("city");
        document.getElementById("provincia").value = this.model.get("provincia");
        document.getElementById("phone").value = this.model.get("phone");
      } else {
        document.getElementById("addrtitle").innerHTML = "Nuovo Indirizzo";
        document.getElementById("addaddress").innerHTML = "Aggiungi";
      }
    },

   
   opAddress : function() {
     if(this.act == 0) this.addAddress();
     else this.editAddress();
   },

   editAddress : function() {
    
        var id_indirizzo = this.model.get("id_indirizzo");
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
          url: window.SERVER_PATH+'/states/?io_format=XML&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
          async: true,
          type: "GET",
          dataType: 'xml',
    //      beforeSend: window.autenticazione,

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
                url: window.SERVER_PATH+'/addresses/?io_format=XML&schema=blank&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                async: true,
                type: "GET",
                dataType: 'xml',
        //        beforeSend: window.autenticazione,

                success: function (result) {
                  
                  var $xml = $(result);
                  $xml.find('id').text(id_indirizzo);
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
                    url: window.SERVER_PATH+'/addresses/' + id_indirizzo + '?io_format=XML&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                    async: true,
                    type: "PUT",
                    dataType: 'xml',
                    contentType: "text/xml",
           //         beforeSend: window.autenticazione,
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
              });

    
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.log('Errore chiamata ajax!' +
                          '\nReponseText: ' + XMLHttpRequest.responseText +
                          '\nStatus: ' + textStatus +
                          '\nError: ' + errorThrown);
            }
          });            
   },

    addAddress : function() {

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
          url: window.SERVER_PATH+'/states/?io_format=XML&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
          async: true,
          type: "GET",
          dataType: 'xml',
    //      beforeSend: window.autenticazione,

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
                url: window.SERVER_PATH+'/addresses/?io_format=XML&schema=blank&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                async: true,
                type: "GET",
                dataType: 'xml',
        //        beforeSend: window.autenticazione,

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
                    url: window.SERVER_PATH+'/addresses/?io_format=XML&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                    async: true,
                    type: "POST",
                    dataType: 'xml',
                    contentType: "text/xml",
           //         beforeSend: window.autenticazione,
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