define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Swiper = require("swiper");
  var Leaflet = require("leaflet");
  var Azienda = require("models/Azienda");
  var CollezioneProdotti = require("collections/CollezioneProdotti");


  var InfoAzienda = Utils.Page.extend({

    constructorName: "InfoAzienda",
    model: Azienda,
    collection: CollezioneProdotti, 

    

    initialize: function(options) {

      this.template = Utils.templates.infoazienda;
      this.listenTo(this, "inTheDOM", this.script);

    },

    id: "contenuto_azienda",
	className: "contenuto_azienda",

    events: {
     
    },

    render: function() {
           $(this.el).html(this.template({
           		azienda : this.model, 
           		prodotti : this.collection
           })); 
    },


    script: function(){
		var mapCenter = {
		    lat: 50,
		    lon: 50
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

		$(".segmented-control").css("margin-top", "44px");
	        
		$("#item1mobile, #item2mobile, #item3mobile").removeClass('opaco');
		            
		$("#item1mobile, #item2mobile, #item3mobile").removeClass('active');
		            
		$("#item1mobile").addClass('active');
		$("#item1mobile").addClass('opaco');
		
	}
	});

	return InfoAzienda;

});