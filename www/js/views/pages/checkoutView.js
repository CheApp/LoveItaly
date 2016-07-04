define(function(require) {

  var Backbone = require("backbone");
  var AddressModel = require("models/Address_Model");
  var AddressCollection = require("collections/Address_Collection");
  var StateModel = require("models/State_Model");
  var StateCollection = require("collections/State_Collection");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var Utils = require("utils");

  var checkoutView = Utils.Page.extend({

    constructorName: "checkoutView",
    collection: AddressCollection,
    //model: AddressModel,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.checkout;
      // here we can register to inTheDOM or removing events
      this.listenTo(this, "inTheDOM", this.script); 
         //$('#content').on("swipe", function(data){
           //console.log(data);
           
      //});
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "checkoutView",
    //className: "i-g page",

    /*events: {
      "click #save_addr_button": "rerender"
    },*/



    render: function() {
      window.checkout = this;
      $(this.el).html(this.template({Indirizzi: this.collection.indirizzi.toJSON(), ordini: this.collection.ordini}));
      return this;
    },



    script: function() {

      document.getElementById("topbar").classList.add("disabled");
      document.getElementById("menubutton").classList.add("disabled");
      document.getElementsByTagName("nav")[0].classList.add("disabled");
      document.getElementById("acquistabtn").classList.add("disabled");
      document.getElementById("head").classList.add("disabled");
      document.getElementById("menu").classList.add("disabled");


      var lista_prodotti = document.getElementById("lista_prodotti_checkout");
      var prodotti = lista_prodotti.getElementsByClassName("prodotto_checkout");
      var totale = 0, index, prezzo;
      for (index = 0; index < prodotti.length; index++) {
        prezzo = prodotti[index].getElementsByClassName("prezzo_prodotto")[0].getElementsByTagName("span");
        totale += parseFloat(prezzo[0].innerHTML);
      }
      var loc_tot = document.getElementById("prezzo_totale").getElementsByTagName("span");
      loc_tot[0].innerHTML = totale;








      $('#forward_button').on("click", function() {
        var content_steps = document.getElementById("steps");
        var lista = content_steps.getElementsByClassName("progress-indicator");
        var steps = lista[0].getElementsByTagName("li");
        var index, newStep;
        for (index = 0; index < steps.length; index++) {
          if (!(steps[index].hasAttribute("class"))) {
              newStep = index;
              break;
          }
        }
          steps[index].setAttribute("class", "completed");
          NchangeStep(newStep);
      });

      
      function NchangeStep(newStep) {
        var nOldStep = "step" + (newStep - 1);
        var divOldStep = document.getElementById(nOldStep);
        divOldStep.style.animation = "toLeft 0.3s";
        divOldStep.style.WebkitAnimation = "toLeft 0.3s";
        setTimeout( function() {
          var annunci = divOldStep.getElementsByClassName("annunci");
          annunci[0].style.display = "none";
          divOldStep.style.visibility = "hidden";
          var nNewStep = "step" + newStep;
          var divNewStep = document.getElementById(nNewStep);
          divNewStep.style.visibility = "visible";
          divNewStep.style.animation = "fromRight 0.3s";
          divNewStep.style.WebkitAnimation = "fromRight 0.3s";
          $('#' + nNewStep).insertBefore('#' + nOldStep);
          
          if (newStep == 1) {
            document.getElementById("new_address").style.display = "inherit";
          }
          else {
            document.getElementById("new_address").style.display = "none";
          }

          if (newStep == 3) {
            close_order();
          }
          
        }, 300);

      }

      function close_order() {
        
        if (indice_indirizzo === undefined) {
          var id_indirizzo = document.getElementById('ul_indirizzi').children[0].getAttribute('data-id');
        } else {
          var id_indirizzo = document.getElementById('ul_indirizzi').children[indice_indirizzo].getAttribute('data-id');
        }        
        
        var id_cliente = document.getElementById("save_addr_button").getAttribute("data-id");

        var prodotti = window.checkout.collection.ordini;
        var totale = document.getElementById("prezzo_totale").getElementsByTagName("span")[0].innerHTML;
        var totale_con_gestione = parseFloat(totale) + 2;

        
        var autenticazione = function (xhr) {
          var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
          var token = 'Basic '.concat(key64);
          xhr.setRequestHeader('Authorization', token);
        }

        $.ajax({
          url: 'http://192.168.56.101/loveitaly/api/carts/?io_format=XML&schema=blank',
          async: true,
          type: "GET",
          dataType: 'xml',
          beforeSend: autenticazione,

          success: function (result) {

            var $xml = $(result);
            $xml.find('id_address_delivery').text(id_indirizzo);
            $xml.find('id_address_invoice').text(id_indirizzo);
            $xml.find('id_currency').text("1");
            $xml.find('id_customer').text(id_cliente);
            $xml.find('id_lang').text("1");
            $xml.find('id_carrier').text("21");
            $xml.find('secure_key').text("c513dacd36bd36e27c51568d2cc6a10a");

            for (var i = 0; i < prodotti.length - 1; i++) {
              var riga = $xml.find('associations').find('cart_rows')[1].cloneNode(true);
              $xml.find('associations').find('cart_rows')[0].appendChild(riga);
            }

            var array_id = $xml.find('id_product');
            var array_quantita = $xml.find('quantity');
            var array_indirizzi = $xml.find('id_address_delivery');
            var array_attribute = $xml.find('id_product_attribute');

            for (var i = 0; i < prodotti.length; i++) {
              array_id[i].innerHTML = prodotti[i].id_prodotto;
              array_quantita[i].innerHTML = prodotti[i].quantita;
              array_indirizzi[i].innerHTML = id_indirizzo;
              //array_attribute[i].innerHTML = "0";
            }

            var carrello = '<prestashop>' + $xml.find('prestashop').html() + '</prestashop>';

            $.ajax({
              url: 'http://192.168.56.101/loveitaly/api/carts/?io_format=XML',
              async: true,
              type: "POST",
              dataType: 'xml',
              contentType: "text/xml",
              beforeSend: autenticazione,
              data: carrello,

              success: function (result) {
                console.log(result);
                console.log("carrello salvato nel db");

                var id_carrello = $(result).find('id')[0].firstChild.nodeValue;
debugger;
                $.ajax({
                  url: 'http://192.168.56.101/loveitaly/api/orders/?io_format=XML&schema=blank',
                  async: true,
                  type: "GET",
                  dataType: 'xml',
                  beforeSend: autenticazione,

                  success: function (result) {
                          
                    var $xml = $(result);
                    $xml.find('id_customer').text(id_cliente);
                    $xml.find('id_address_delivery').text(id_indirizzo);
                    $xml.find('id_address_invoice').text(id_indirizzo);
                    $xml.find('total_paid').text(totale_con_gestione.toString());
                    $xml.find('id_cart').text(id_carrello);     
                    $xml.find('id_currency').text("1");
                    $xml.find('id_lang').text("1");     
                    $xml.find('id_carrier').text("21");
                    //$xml.find('current_state').text("10");
                    $xml.find('payment').text('Payment by check');
                    $xml.find('module').text('cheque');         
                    $xml.find('total_paid_real').text(totale_con_gestione.toString());  
                    $xml.find('total_products').text(totale.toString());  
                    $xml.find('total_products_wt').text(totale.toString());     
                    $xml.find('conversion_rate').text("1");
                    $xml.find('secure_key').text("c513dacd36bd36e27c51568d2cc6a10a");
                    //$xml.find('delivery_date').text(data_consegna);

                    // c'è il - 1 perchè un nodo (ordine) è già presente nell' xml
                    /*for (var i = 0; i < prodotti.length - 1; i++) {
                        var riga = $xml.find('associations').find('order_rows')[1].cloneNode(true);
                        $xml.find('associations').find('order_rows')[0].appendChild(riga);
                      }

                      var array_id = $xml.find('product_id');
                      var array_quantita = $xml.find('product_quantity');
                      var array_prezzi = $xml.find('product_price');
                      //var array_attribute = $xml.find('product_attribute_id');

                      for (var i = 0; i < prodotti.length; i++) {
                        array_id[i].innerHTML = prodotti[i].id_prodotto;
                        array_quantita[i].innerHTML = prodotti[i].quantita;
                        array_prezzi[i].innerHTML = prodotti[i].prezzo;
                        //array_attribute[i].innerHTML = "0";
                    }*/

                  debugger;       
                    var ordine = '<prestashop>' + $xml.find('prestashop').html() + '</prestashop>';

                    $.ajax({
                      url: 'http://192.168.56.101/loveitaly/api/orders/?io_format=XML',
                      async: true,
                      type: "POST",
                      dataType: 'xml',
                      contentType: "text/xml",
                      beforeSend: autenticazione,
                      data: ordine,

                      success: function (result) {
                        console.log("ordine salvato nel db");
                      },

                      error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('Errore chiamata ajax! Post di order' +
                                    '\nReponseText: ' + XMLHttpRequest.responseText +
                                    '\nStatus: ' + textStatus +
                                    '\nError: ' + errorThrown);
                      }
                    })

                  },

                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax! Get di order' +
                                '\nReponseText: ' + XMLHttpRequest.responseText +
                                '\nStatus: ' + textStatus +
                                '\nError: ' + errorThrown);
                  }

                })
              },
                
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Errore chiamata ajax! Post di cart' +
                            '\nReponseText: ' + XMLHttpRequest.responseText +
                            '\nStatus: ' + textStatus +
                            '\nError: ' + errorThrown);
              }
            })

          },

          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('Errore chiamata ajax! Get di cart' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
          }

        })

      }

      $("#step_precedente").on("click", function() {
        
        var content_steps = document.getElementById("steps");
        var lista = content_steps.getElementsByClassName("progress-indicator");
        var steps = lista[0].getElementsByTagName("li");
        var index, oldStep;
        if (steps[steps.length-1].hasAttribute("class")) {
          oldStep = steps.length;
        } else {
          for (index=0; index < steps.length; index++) {
              if (!(steps[index].hasAttribute("class"))) {
              oldStep = index;
              break;
            }
          }
        }
        if(!(oldStep-2 == -1)){
          steps[oldStep-1].removeAttribute("class");
          OchangeStep(oldStep-2);
        }
        
        if (oldStep == 3) {
          document.getElementById("new_address").style.display = "inherit";
        }
        else {
          document.getElementById("new_address").style.display = "none";
        }

        if (oldStep == 1) {
          window.checkout.goBack();
        }
      });

      
      function OchangeStep(oldStep) {
        var nNewStep = "step" + (oldStep + 1);
        var divNewStep = document.getElementById(nNewStep);
        divNewStep.style.animation = "toRight 0.3s";
        divNewStep.style.WebkitAnimation = "toRight 0.3s";
        setTimeout( function() {
          divNewStep.style.visibility = "hidden";
          var nOldStep = "step" + oldStep;
          var divOldStep = document.getElementById(nOldStep);
          divOldStep.style.visibility = "visible";
          divOldStep.style.animation = "fromLeft 0.3s";
          divOldStep.style.WebkitAnimation = "fromLeft 0.3s";
          $('#' + nOldStep).insertBefore('#' + nNewStep);
          
        }, 300);
      }









      var allfield = document.body.querySelectorAll('.sub_value');
        
      var j = 0;
          
      for( j = 0; j < allfield.length; j++ ) {
        allfield[j].classList.remove('opaco');
        allfield[j].classList.remove('mostra');
      }         
        
      var i = 0;
      for( i = 0; i < allfield.length; i += this.collection.indirizzi.length) {
        allfield[i].classList.add('mostra');
        allfield[i].classList.add('opaco');
      }

      var start_offset;

      var inputs = $(':input');
       
      window.onkeypress = function(e) {
          if (e.which == 13) {
            e.preventDefault();
            var nextInput = inputs.get(inputs.index(document.activeElement) + 1);
            if (nextInput) {
                nextInput.focus();
            }
          }
      };
        
      var campo_addr = document.getElementById("lista_indirizzi");
        
      campo_addr.addEventListener("touchend", function () { scrollFinished(indice_indirizzo, position_scroll); } );
        
      var ul = document.getElementById("ul_indirizzi");
                
      
      start_offset = ul.scrollHeight;
      
        
      var indice_indirizzo;
      var position_scroll;
        
      document.getElementById("ul_indirizzi").onscroll = function() { aggiornatest(this.collection.indirizzi.length) }.bind(this);

      
      function aggiornatest(count) {
          
          var current_offset = ul.scrollTop + ul.scrollHeight;

          //document.getElementById("curroff").innerHTML= current_offset;

            
          position_scroll = (current_offset - start_offset) % 28;
          
          //document.getElementById("poscrol").innerHTML = position_scroll;
                  
          //if ( (position_scroll <= 3) || (position_scroll >= 18) ) {
            var x = document.body.querySelectorAll('.sub_value');
                      
            var index = 0;
            for( index=0; index < x.length; index++ ) {
              x[index].classList.remove('mostra');
            }
                
            indice_indirizzo = Math.round((current_offset-start_offset) / 28);
                        
            var i = 0;
            for( i = indice_indirizzo; i < x.length; i += count) {
              x[i].classList.add('mostra');
            }
                  
            setOpaco = window.setTimeout(function() { add_opaco_class(); }, 200);            
                        
          //}      
                    
      }    
                
      
      function add_opaco_class() {
        
        var y = document.body.querySelectorAll('.sub_value');
        
        var j = 0;
          
        for( j = 0; j < y.length; j++ ) {
          y[j].classList.remove('opaco');
        }         
        
        var x = document.body.querySelectorAll('.mostra');
           
        var index = 0;
        
        for( index = 0; index < x.length; index++ ) {
          x[index].classList.add('opaco');
        }    

       // debugger;
      }

      function scrollFinished(indice, pos) {
        var scrolltonum = indice * 28;
        if (pos > 12) {
          scrolltonum = scrolltonum;
        }
        
        $("#ul_indirizzi").animate({ scrollTop: scrolltonum });
        
      }









      


       



      $('#new_address').on("click", function() {
        
        document.getElementById("form_addr").style.display = "inherit";
        window.setTimeout(function() {document.getElementById("input_item").focus()}, 200);
        $("#ul_indirizzi").animate({ scrollTop: 805 });
        document.getElementById("steps").style.display = "none";
        document.getElementById("selected_address").style.display = "none";
        document.getElementById("input_addr").style.display = "block";
        document.getElementById("input_addr").style.visibility = "visible";
        document.getElementById("new_address").style.color = "#444";
        document.getElementById("new_address").style.pointerEvents = "none";
        document.getElementById("forward_button").style.display = "none";
        
        getLocation();
      });

      
      $('#save_addr_button').on("click", function() {

        document.getElementById("forward_button").style.display = "block";
        //document.getElementById("input_addr").style.visibility = "hidden";
        //document.getElementById("selected_address").style.display = "block";
        document.getElementById("steps").style.display = "block";
        document.getElementById("new_address").style.color = "#BF1E2E";
        document.getElementById("new_address").style.pointerEvents = "all";
        document.getElementById("form_addr").style.display = "none";
        var nuovo_indirizzo = document.getElementById("input_item").value;
        
        if (nuovo_indirizzo != "") {
          var addr_item = document.createElement("li");
          addr_item.innerText = nuovo_indirizzo;
          var list_item = document.getElementById("ul_indirizzi").childNodes;
          var last_item = list_item[list_item.length -2];
          
          document.getElementById("ul_indirizzi").insertBefore(addr_item, last_item);
          document.getElementById("input_item").value = "";
        }
        
        
        var cliente = this.getAttribute("data-id");
        postAddress(cliente, nuovo_indirizzo);
        

        setTimeout(function () {
               window.checkout.rerender(cliente);
          }.bind(this), 800);
        
      });

      
      function getLocation() {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
          } else {
              //debugger;
          }
      }

      function showPosition(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        $.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon + "&zoom=18&addressdetails=1", function(data) {
          var myplace = data;
          
          var forms_list = document.getElementById("input_addr").childNodes;
        
          forms_list[5].childNodes[3].value = myplace.address.road;
          forms_list[7].childNodes[3].value = myplace.address.postcode;
          forms_list[9].childNodes[3].value = myplace.address.town;
          forms_list[11].childNodes[3].value = myplace.address.county;
        });
        
      }


      function postAddress(id_cliente, alias) {

        var autenticazione = function (xhr) {
          var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
          var token = 'Basic '.concat(key64);
          xhr.setRequestHeader('Authorization', token);
        }

        var forms_list = document.getElementById("input_addr").childNodes;
        
        var nome = forms_list[1].childNodes[3].value;
        var cognome = forms_list[3].childNodes[3].value;
        var via = forms_list[5].childNodes[3].value;
        var CAP = forms_list[7].childNodes[3].value;
        var comune = forms_list[9].childNodes[3].value;
        var provincia = forms_list[11].childNodes[3].value;
        var telefono = forms_list[15].childNodes[3].value;


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
                  //$xml.find('name').find('language').text(nome);


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
                      console.log("indirizzo salvato nel db");
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








      $('#sped_martedi').on("click", function() {
        selectDay_1(this);
      });

      $('#sped_venerdi').on("click", function() {
        selectDay_1(this);
      });

      $('#giorno1').on("click", function() {
        selectDate(this);
      });

      $('#giorno2').on("click", function() {
        selectDate(this);
      });

      function selectDay_1(giorno) {
        var step = giorno.parentNode;
        var div = step.getElementsByTagName("div");
        var index;
        for (index=0; index < div.length; index++) {
          if (div[index].hasAttribute("class")) {
            div[index].removeAttribute("class");
            div[index].style.background = "#ddd";
            div[index].style.color = "";
            var giorno1 = document.getElementById("giorno1");
            var giorno2 = document.getElementById("giorno2");
            giorno1.style.display = "none";
            giorno2.style.display = "none";
            if (giorno1.hasAttribute("class")){
              giorno1.removeAttribute("class")
              giorno1.style.background = "#ddd";
              giorno1.style.color = "";
            } else {
              giorno2.removeAttribute("class")
              giorno2.style.background = "#ddd";
              giorno2.style.color = "";
            }
            break;
          }
        }
        giorno.setAttribute("class", "selected_day")
        giorno.style.background = "#767676";
        giorno.style.color = "#fff";
        selectDay_2(div);
      }

      function selectDay_2(div) {
        var index, giorno;
        for (index=0; index < div.length; index++) {
          if (div[index].hasAttribute("class")) {
            giorno = index;
            break;
          }
        }
        var date = new Date();
        var today = date.getDay();
        var giorni_disponibili = new Array();

        if (giorno == 1) {
          switch (today){
            case 1:
              var nextDay = new Date();
              nextDay.setDate(nextDay.getDate() + 8);
              giorni_disponibili.push(nextDay);
              break;
            case 2:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 7);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 14);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 3:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 6);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 13);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 4:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 5);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 12);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 5: 
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 4);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 11);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 6:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 3);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 10);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 7:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 2);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 9);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            default:
            break;
          }
        } 

        if (giorno == 2) {
          switch (today){
            case 1:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 4);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 11);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 2:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 3);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 10);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 3:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 2);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 9);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 4:
              var nextDay = new Date();
              nextDay.setDate(nextDay.getDate() + 8);
              giorni_disponibili.push(nextDay);
              break;
            case 5: 
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 7);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 14);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 6:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 6);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 13);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            case 7:
              var nextDay_1 = new Date();
              nextDay_1.setDate(nextDay_1.getDate() + 5);
              var nextDay_2 = new Date();
              nextDay_2.setDate(nextDay_2.getDate() + 12);
              giorni_disponibili.push(nextDay_1);
              giorni_disponibili.push(nextDay_2);
              break;
            default:
            break;
          }
        }

        print_giorni(giorni_disponibili);

      }


      function print_giorni(giorni) {
        var giorno, mese, anno;
        var loc_giorni = document.getElementById("scelta_gg");
        loc_giorni.style.visibility = "visible";
        if (giorni.length < 2) {
          giorno = giorni[0].getDate();
          mese = giorni[0].getMonth() + 1;
          anno = giorni[0].getFullYear();
          var giorno1 = document.getElementById("giorno1");
          giorno1.style.display = "inline-block";
          giorno1.innerHTML = giorno + " / " + mese + " / " + anno; 
        } else {
          giorno = giorni[0].getDate();
          mese = giorni[0].getMonth() + 1;
          anno = giorni[0].getFullYear();
          var giorno1 = document.getElementById("giorno1");
          giorno1.style.display = "inline-block";
          giorno1.innerHTML = giorno + " / " + mese + " / " + anno;  

          giorno = giorni[1].getDate();
          mese = giorni[1].getMonth() + 1;
          anno = giorni[1].getFullYear();
          var giorno2 = document.getElementById("giorno2");
          giorno2.style.display = "inline-block";
          giorno2.innerHTML = giorno + " / " + mese + " / " + anno; 
        }
      }

      function selectDate(data) {
        var step = data.parentNode;
        var div = step.getElementsByTagName("div");
        var index;
        for (index=0; index < div.length; index++) {
          if (div[index].hasAttribute("class")) {
            div[index].removeAttribute("class");
            div[index].style.background = "#ddd";
            div[index].style.color = "";
            break;
          }
        }
        data.setAttribute("class", "selected_day")
        data.style.background = "#767676";
        data.style.color = "#fff";
      }



    },

    rerender: function(cid) {
      
      var AddrCollection = new AddressCollection();

      AddrCollection.fetch({

        success: function(collezione, response, options) {

            var ElencoProvince = new StateCollection();

            ElencoProvince.fetch({

              success: function(province, response, options) {
                
                this.collezione_filtrata = collezione.byCustomer(cid);
                console.log(this.collezione_filtrata);


                var array_addr = this.collezione_filtrata.models;
                var array_prov = province.models;


                for (var c = 0; c < array_addr.length; c++) {

                  for (var j = 0; j < array_prov.length; j++) {

                    if (array_addr[c].attributes.state == array_prov[j].attributes.id) {

                      array_addr[c].attributes.provincia = array_prov[j].attributes.provincia;

                    }

                  }
                  
                }
                this.collection.indirizzi = this.collezione_filtrata;
                html = this.template({Indirizzi: this.collezione_filtrata.toJSON() });

                var selector = "#step1";            
                this.$el.find(selector).replaceWith($(selector, html));
                
                window.checkout.script();
                this.el.querySelector('#step1').style.visibility = "visible";
                $("#ul_indirizzi").animate({ scrollTop: 805 });

              }.bind(this),



              error: function(model, response, options) {
                console.log('Errore fetch province!');
              }


            })            
            
            
          }.bind(this),

          error: function(model, response, options) {
              console.log('Errore fetch indirizzi');
          }
        });
              
              /*var allfield = this.el.querySelectorAll('.sub_value');
        
              var j = 0;
                  
              for( j = 0; j < allfield.length; j++ ) {
                allfield[j].classList.remove('opaco');
                allfield[j].classList.remove('mostra');
              }         
                
              var i = 0;
              for( i = 0; i < allfield.length; i += this.collezione_filtrata.length) {
                allfield[i].classList.add('mostra');
                allfield[i].classList.add('opaco');
              }
              
              this.el.querySelector('#step1').style.visibility = "visible";

              this.el.querySelector("#ul_indirizzi").animate({ scrollTop: 205 });*/

    },

    goBack: function() {
      if($("#menubutton").hasClass("disabled")){
        document.getElementById("menubutton").classList.remove("disabled");
        document.getElementById("backbutton").classList.add("disabled");
        document.getElementById('topbar').classList.remove('disabled');
        document.getElementById("navbar").classList.remove("disabled");
        document.getElementById("acquistabtn").classList.add("disabled");
      }
    
      window.history.back();

      $('#apri_carrello').click();
    }
    
  });

  return checkoutView;

});