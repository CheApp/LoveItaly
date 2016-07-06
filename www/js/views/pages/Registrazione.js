define(function(require) {

  var Backbone = require("backbone");
  var Utils = require("utils");
  var Jquery = require("jquery");


  var Registrazione = Utils.Page.extend({

    constructorName: "Registrazione",

    

    initialize: function(options) {

      this.template = Utils.templates.registrazione;
      this.listenTo(this, "inTheDOM", this.script);
      
    },

    id: "registrazione",

    events: {
      "click #end_reg2"  : "put_reg"
    },


    render: function() {
       $(this.el).html(this.template); 
    },

    script: function(){
    	$(document).ready(function() {
    		var indietro = document.getElementById("indietro");
    		indietro.style.display = "inline-block";
    		var header = document.getElementsByTagName("header");
    		header[0].style.display = "none";
    		var nav = document.getElementsByTagName("nav");
    		nav[0].style.display = "none";
    	})

    	function validateEmail(email) {
		  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		  return re.test(email);
		}

    	function validate(step) {
    	  var annunci = document.getElementById("reg_step" + step).getElementsByClassName("annunci");
		  if (step == 0) {
		      var x = $("#email").val();
		      var y = $("#pass").val();
		      var z = $("#conf_pass").val();
		      if (y == null || y == "" || z == null || z == "" || x == null || x == "") {
		        annunci[0].style.display = "inline-block";
		        annunci[0].innerHTML = "Compila i campi richiesti!";
		        return false;
		    } else if(!validateEmail(x)) {
		      annunci[0].style.display = "inline-block";
		      annunci[0].innerHTML = "E-mail non valida!";
		      return false;
		    } else {
		    	return true;
		    }
		  } else if (step == 1) {
		      var x = $("#nome").val();
		      var y = $("#cognome").val();
		      if (y == null || y == "" || x == null || x == "") {
		        annunci[0].style.display = "inline-block";
		        annunci[0].innerHTML = "Compila i campi richiesti!";
		        return false;
		    } else {
		      return true;
		    }
		  } else {
		  	return true;
		  }
		}

		$("#end_reg1").click(function() {
		  var end_reg1 = document.getElementById("end_reg2");
		  end_reg1.style.display = "inline-block";
	      var end_reg2 = document.getElementById("end_reg1");
		  end_reg2.style.display = "none";
		})

		$(".btn").click(function() {
		  var content_steps = document.getElementById("reg_steps");
		  var lista = content_steps.getElementsByClassName("progress-indicator");
		  var steps = lista[0].getElementsByTagName("li");
		  var index, newStep;
		  for (index = 0; index < steps.length; index++) {
		    if (!(steps[index].hasAttribute("class"))) {
		        newStep = index;
		        break;
		    }
		  }
		  if (validate(newStep-1)) {
		    steps[index].setAttribute("class", "completed");
		    NchangeStep(newStep);
		  }
		});

		function NchangeStep(newStep) {
		  var nOldStep = "reg_step" + (newStep - 1);
		  var divOldStep = document.getElementById(nOldStep);
		  divOldStep.style.animation = "toLeft 0.3s";
		  divOldStep.style.WebkitAnimation = "toLeft 0.3s";
		  setTimeout( function() {
		    var annunci = divOldStep.getElementsByClassName("annunci");
		    annunci[0].style.display = "none";
		    divOldStep.style.display = "none";
		    var nNewStep = "reg_step" + newStep;
		    var divNewStep = document.getElementById(nNewStep);
		    divNewStep.style.display = "inline-block";
		    divNewStep.style.animation = "fromRight 0.3s";
		    divNewStep.style.WebkitAnimation = "fromRight 0.3s";
		    $('#' + nNewStep).insertBefore('#' + nOldStep);
		  }, 300);

		}

		$("#indietro").click(function () {
		  var content_steps = document.getElementById("reg_steps");
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
		  } else {
		  	document.getElementsByTagName("header")[0].removeAttribute("style");
			document.getElementsByTagName("nav")[0].style.display = "inline-block";
		    document.getElementById("content").style.overflowY = "auto"; 
		  	apriLogin();
		  	
		  	function apriLogin() {
	          var login = document.getElementById("login");
	          login.style.visibility = "visible";
	          login.style.animation = "up 0.3s";
	          login.style.WebkitAnimation =   "up 0.3s";
	          var header = document.getElementsByTagName("header");
	          header[0].style.animation = "leave 0.3s";
	          header[0].style.WebkitAnimation = "leave 0.3s";
	          var nav = document.getElementsByTagName("nav");
	          nav[0].style.animation = "leave 0.3s";
	          nav[0].style.WebkitAnimation = "leave 0.3s";
	          setTimeout(impostaLogin, 300);
	        }

	        function impostaLogin() {
	          var header = document.getElementsByTagName("header");
	          var nav = document.getElementsByTagName("nav");
	          var content = document.getElementById("content");
	          nav[0].style.visibility = "hidden";
	          header[0].style.visibility = "hidden";
	          content.style.display = "none";
	        }
		  	Backbone.history.navigate("home", {
			  trigger: true
			});
		  }
		});

		function OchangeStep(oldStep) {
		  var nNewStep = "reg_step" + (oldStep + 1);
		  var divNewStep = document.getElementById(nNewStep);
		  divNewStep.style.animation = "toRight 0.3s";
		  divNewStep.style.WebkitAnimation = "toRight 0.3s";
		  setTimeout( function() {
		    divNewStep.style.display = "none";
		    var nOldStep = "reg_step" + oldStep;
		    var divOldStep = document.getElementById(nOldStep);
		    divOldStep.style.display = "inline-block";
		    divOldStep.style.animation = "fromLeft 0.3s";
		    divOldStep.style.WebkitAnimation = "fromLeft 0.3s";
		    $('#' + nOldStep).insertBefore('#' + nNewStep);
		  }, 300);
		}
    
    },

    put_reg: function() {
    	insertUtente(); 

    	function autenticazione (xhr) {
		  var key64 = 'SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'; 
		  var token = 'Basic '.concat(key64);
		  xhr.setRequestHeader('Authorization', token);
		}


		function insertUtente () {
		 var email = $("#email").val();

	     $.ajax({
          url: 'http://192.168.56.101/loveitaly/api/customers/?filter[email]='+email,
          async: true,
          type: "GET",
          dataType: 'xml',
          beforeSend: autenticazione,

          success: function (result) {
            var customer = result.getElementsByTagName("customer")[0];
            if (customer == null) {
	            $.ajax({
			    url: 'http://192.168.56.101/loveitaly/api/customers/?io_format=XML&schema=blank',
			    async: true,
			    type: "GET",
			    dataType: 'xml',
			    beforeSend: autenticazione,

			    success: function (result) {
			      putUtente(result);
			    }
			  });
             } else {
             	putUtente(null);
             }
	        }
	      });
		}


		function putUtente(xml) {
		  if (xml != null) {
			  var email = $("#email").val();			
			  var nome = $("#nome").val();
			  var cognome = $("#cognome").val()
			  var password = $("#pass").val();
			  var dd = $("#dd").val();
			  var mm =  $("#mm").val();
			  var aaaa = $("#aaaa").val();
			  var data = "0000-00-00";
			  if (dd+mm+aaaa) {
			  	data = aaaa + "-" + mm + "-" + dd;
			  }
			  var genere = $("#genere").val();
			  if (!(genere>0)) {
			    genere = 0;
			  }
			  var $xml = $(xml);
			  $xml.find('firstname').text(nome);
			  $xml.find('lastname').text(cognome);
			  $xml.find('email').text(email);
			  $xml.find('passwd').text(password);
			  $xml.find('birthday').text(data);
			  $xml.find('id_gender').text(genere);
			  var contact = '<prestashop>' + $xml.find('prestashop').html() + '</prestashop>';

			  $.ajax({
			    url: 'http://192.168.56.101/loveitaly/api/customers/?io_format=XML',
			    async: true,
			    type: "POST",
			    dataType: 'xml',
			    contentType: "text/xml",
			    beforeSend: autenticazione,
			    data: contact,
			    success: function (result) {
			      var annunci = document.getElementById("reg_step3").getElementsByClassName("annunci");
			      annunci[0].style.display = "inline-block";
			      annunci[0].innerHTML = "Registrazione effettuata!";
			      setTimeout(function() {
		  			  document.getElementsByTagName("header")[0].removeAttribute("style");
					  document.getElementsByTagName("nav")[0].style.display = "inline-block";
			      	  var cdata = result.getElementsByTagName("id")[0].innerHTML;
			      	  var maxL = cdata.length-3;
				      localStorage.setItem("ID", cdata.substring(9, maxL));
				      Backbone.history.navigate("home", {
				        trigger: true
				      });
				  }, 3000);
			    },
			    error: function (XMLHttpRequest, textStatus, errorThrown) {
			      console.log('Errore chiamata ajax!' +
			                  '\nReponseText: ' + XMLHttpRequest.responseText +
			                  '\nStatus: ' + textStatus +
			                  '\nError: ' + errorThrown);
			    }
			  });
			 } else {
			   var annunci = document.getElementById("reg_step3").getElementsByClassName("annunci");
			   annunci[0].style.display = "inline-block";
			   annunci[0].innerHTML = "E-mail già in uso!";		 	
		 	}
		}

    }
  });


  return Registrazione;

});