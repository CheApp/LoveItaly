define(function(require) {

  var Backbone = require("backbone");
  var Prodotto = require("models/Prodotto");
  var CollezioneProdotti = require("collections/CollezioneProdotti");
  var Utils = require("utils");
  var Jquery = require("jquery");
  var Swiper = require("swiper");


  var Home = Utils.Page.extend({

    constructorName: "Home",
    collection: CollezioneProdotti,

    

    initialize: function() {
 
      this.template = Utils.templates.home;
      this.listenTo(this, "inTheDOM", this.slider);
      
    },

    id: "home",

    events: {
      "click .product": "goinfoprodotto"
    },

    render: function() {
           $(this.el).html(this.template({Prodotti : this.collection})); 
    },


    slider: function(){
    
    var num=2;
    if(screen.width>500){
      num=5;
    }

  var homeslider = new Swiper('#slide-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });

  var homecarousel = new Swiper('#carousel', {
        pagination: '',
        slidesPerView: num,
        paginationClickable: true,
        spaceBetween: 10,
        freeMode: true
    });

  var homecarousel2 = new Swiper('#carousel2', {
        pagination: '',
        slidesPerView: num,
        paginationClickable: true,
        spaceBetween: 10,
        freeMode: true
    });
      
    },

    goinfoprodotto: function(e) {
      e.preventDefault();
      var pid = $(e.currentTarget).data("id");
     
      Backbone.history.navigate("infoprodotto?pid="+pid, {
        trigger: true
      });
    }
  });


  return Home;

});