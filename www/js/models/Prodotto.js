define(function(require) {

	var Backbone = require("backbone");

	

	var Prodotto = Backbone.Model.extend({

	  constructorName: "Prodotto",

	  initialize : function(options) {
        
        this.id_prodotto         =  options.id;
		this.nome_prodotto       =  options.name;
		this.nome_prodotto_short =  this.excerpt(options.name);
	    this.nome_azienda        =  options.manufacturer_name; 
	    this.nome_azienda_short  =  this.excerpt(options.manufacturer_name);
		this.id_azienda          =  options.id_manufacturer;
	    this.descr               =  this.remove_tags(options.description);
	    this.shortD              =  this.remove_tags(options.description_short);
	    this.prezzo              =  (Math.round(options.price*100)/100).toFixed(2);
	    this.img                 =  "http://192.168.56.101/loveitaly/api/images/products/"+options.id+"/"+options.id_default_image+"?ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H"
	    this.immagini            =  options.associations.images;           //images[n].id  to get img ID
	    this.categorie           =  options.associations.categories;       //category[n].id to get category ID
	    this.quantita            =  options.quantity;
	    this.nuovo               =  false;
    },

    //Funzione di estrazione stringa
    excerpt : function(str) {
    if(str.length > 20){
    return str.substr(0,20)+"..";
    }
    else {
    return str; 
  }
  },

    //Funzione di rimozione di tag html nel testo
    remove_tags : function(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html; 
    return tmp.textContent||tmp.innerText; 
  }
    });
    
	return Prodotto;
});




