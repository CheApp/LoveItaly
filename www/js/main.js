// here we put the paths to all the libraries and framework we will use
require.config({
  paths: {
    jquery: '../lib/zepto/zepto.min', // ../lib/jquery/jquery', 
    underscore: '../lib/underscore/underscore',
    backbone: "../lib/backbone/backbone",
    text: '../lib/require/text',
    async: '../lib/require/async',
    handlebars: '../lib/handlebars/handlebars',
    templates: '../templates',
    leaflet: '../lib/leaflet/leaflet',
    spin: '../lib/spin/spin.min',
    swiper: '../lib/swiper/res/js/swiper.min',
    preloader: '../lib/preloader/pre-loader',
    utils: '../lib/utils/utils',
    localstorage: '../lib/localStorage/backbone.localStorage'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'leaflet': {
      exports: 'L'
    }
  }
});

// We launch the App
require(['backbone', 'utils'], function(Backbone, Utils) {
  require(['preloader', 'router'], function(PreLoader, AppRouter) {

    document.addEventListener("deviceready", run, false);

    function run() {

      window.SERVER_PATH = "http://loveitaly.altervista.org/api";
      window.autenticazione = function (xhr) {
        var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; //codifica 64 della API key
        var token = 'Basic '.concat(key64);
        xhr.setRequestHeader('Authorization', token);
      }

      document.addEventListener("offline", wentOff, false);

          function wentOff() {
            localStorage.setItem("connessione", "false");
          }

          document.addEventListener("online", wentOn, false);

          function wentOn() {
            localStorage.setItem("connessione", "true");
          }

          if (navigator.connection.type != Connection.NONE) {
            localStorage.setItem("connessione", true);
          }

      // Here we precompile ALL the templates so that the app will be quickier when switching views
      // see utils.js
      Utils.loadTemplates().once("templatesLoaded", function() {

      var images = []; // here the developer can add the paths to the images that he would like to be preloaded

      if (images.length) {
          new PreLoader(images, {
            onComplete: startRouter
          });
        } else {
          // start the router directly if there are no images to be preloaded
          startRouter();
        }

        function startRouter() {
          // launch the router
          var router = new AppRouter();
          Backbone.history.start();
        }
      });
    }
  });
});