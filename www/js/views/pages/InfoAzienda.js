define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Swiper = require("swiper");
  var Leaflet = require("leaflet");
  var Azienda = require("models/Azienda");
  var Indirizzo = require("models/Indirizzo");
  var CollezioneProdotti = require("collections/CollezioneProdotti");

  var flag;
  var InfoAzienda = Utils.Page.extend({

    constructorName: "InfoAzienda",
    model: Azienda,
    collection: CollezioneProdotti, 

    

    initialize: function(Collezione, aid , tab) {

      this.template = Utils.templates.infoazienda;
      flag= false;
      var view = this;
      var manufacturer = new Azienda({ id : aid });
      manufacturer.fetch({
        success: function (model, response, options) {
          var ind = new Indirizzo ({ id : model.num_ind });
          var azienda = model;
          ind.fetch({
            success: function(model, response, options) {
              azienda.citta = model.citta;
              azienda.indirizzo = model.via;
              azienda.tel = model.tel;
              azienda.cel = model.cel;
              var prodotti = Collezione.byManufacturer(azienda.id);
              view.model = azienda;
              view.collection = prodotti;
              view.tab_selected = tab; 
              flag = true;
              view.render();     
              view.script();      
            }
          });
        }
      });

    },

    id: "contenuto_azienda",
  className: "contenuto_azienda",

    events: {
      "click .prodotto": "goinfoprodotto"
    },

    render: function() {
      if(flag){
           $(this.el).html(this.template({
              azienda : this.model, 
              prodotti : this.collection
           })); 
         var html = this.model.descrizione({});          
           setTimeout(function() {
               var descr_azienda = document.getElementById("descr_azienda");
               var thumbnail_azienda = document.getElementById("thumbnail_azienda");
               var foto_azienda = document.getElementById("foto_azienda");
             descr_azienda.innerHTML = html; 
             var thumbnails = descr_azienda.getElementsByTagName("img");
             if (thumbnails.length == 1) {
              foto_azienda.style.paddingLeft = "5%";
             } else if (thumbnails.length == 0) {
              foto_azienda.style.display = "none";
           } else {
              thumbnail_azienda.style.width = 20*thumbnails.length + "em";              
             }
             for (var i=0; i<thumbnails.length; i++) {
              var img = document.createElement("img");
              img.setAttribute("src", thumbnails[i].getAttribute("src"));
              thumbnail_azienda.appendChild(img);
             }                  
           }, 1000);
       }
    },


    script: function() {
    window.acquistabtn.classList.add("disabled");
    //document.getElementById("head").classList.add("disabled");
    window.navbar.classList.remove("disabled");


      var latitudine, longitudine;
      var par = this.model.citta+", "+this.model.indirizzo;
      var URL = "http://maps.google.com/maps/api/geocode/json?address="+encodeURIComponent(par)+"&sensor=false";

      $.getJSON(URL, function(data) {
        latitudine = JSON.stringify(data.results[0].geometry.location.lat);
        longitudine = JSON.stringify(data.results[0].geometry.location.lng);

        var mapCenter = {
          lat: latitudine,
          lon: longitudine
      };

      var options = {
          center: new L.LatLng(mapCenter.lat, mapCenter.lon),
          zoom: 14
      };

      var map_obj = L.map('map', options);
      map_obj.attributionControl.setPrefix("Leaflet");

      var pomomarker = L.icon({
          iconUrl: 'img/pomomarker.png',
          
          iconSize:     [50, 50], 
          iconAnchor:   [28, 40], 
          
      });

      L.marker([mapCenter.lat, mapCenter.lon], {icon: pomomarker}).addTo(map_obj);

      var layer = L.tileLayer(
          'https://api.tiles.mapbox.com/v4/dif.08epg4ig/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlmIiwiYSI6ImNpb3I1ZnB5dzAwMG92dmx3Y3hkMHc4cHMifQ.d357AuSEIb3Osxd3PgGfeA', {
          maxZoom: 19
          });
      map_obj.addLayer(layer);

      window.mappa = map_obj;
    });

    setTimeout(function() {
      $(".segmented-control").css("margin-top", "44px");
    }, 300); 
          
    $("#item1mobile, #item2mobile, #item3mobile").removeClass('opaco');
                
    //$("#item1mobile, #item2mobile, #item3mobile").removeClass('active');

    if (this.tab_selected == 1) {
      //$('#c_item3').removeClass('active');
      //$('#c_item1').addClass('active');
      $("#item1mobile").addClass('active');
      $("#item1mobile").addClass('opaco');
    }       
    else {
      if (this.tab_selected == 3) {
        $('#c_item1').removeClass('active');
        $('#c_item3').addClass('active');
        $("#item3mobile").addClass('active');
        $("#item3mobile").addClass('opaco');
      }     
    }
    
  },

  goinfoprodotto: function(e) {
      e.preventDefault();
      var pid = $(e.currentTarget).data("id");
     
      Backbone.history.navigate("infoprodotto?pid="+pid, {
        trigger: true
      });
    }
  });

  return InfoAzienda;

});