//Template events
Template.camera.events({
	'change .js-status-sel': function (event) {
		event.preventDefault();
		Session.set('session.statusUsu',event.target.value);
		
		Meteor.call("updateStatus", event.target.value);
	}
});

Template.camera.helpers({
	getGestor: function () {
		return Session.get("session.idGestor");
	},
	
	getStatusUsu: function (st) {
		if (st == Session.get('session.statusUsu')) {
			return "selected";
		} else {
			return "";
		}
	}
});

width = 160;    // Largura da foto
height = 0;     // Altura da foto
taxa = 2;

var contador = 0;
var CONT_ARQ_FOTO_BD = 60;

var streaming = false;

canvas = null;
	
var anterior = [];

var video = null;
var photo = [];
var audio;
var localStream = null;
var localStreamTrack = null;
var contInativCli = 0;
var statusUsuCli = "";
var iniciaEnvio = true;

var TOLERANCIA = 30;


startupCanvas = function() {
	canvas = document.getElementById('canvas');

	if (isNaN(height) || height == 0) {
		height = width / (4/3);
	}

	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
}

function gotSources(sourceInfos)
{
	var constraints = {};
	
	for (var i = 0; i < sourceInfos.length; i++)
	{
		var sourceInfo = sourceInfos[i];

		if (sourceInfo.kind == 'video')
		{
	        constraints.video = {
                optional: [{
                    sourceId: sourceInfo.id
                }]
            };		
			//console.log(sourceInfo);
			// invoke getUserMedia to capture this device
			navigator.getMedia(constraints, function (stream) {
				//console.log(stream.id, stream);
				localStream = stream;
				
				if (navigator.mozGetUserMedia) {
					video.mozSrcObject = stream;
				} else {
					var vendorURL = window.URL || window.webkitURL;
					video.src = vendorURL.createObjectURL(stream);
				}
				video.play();
			}, console.error);
		}
	}
}						

startupCamera = function () {
	//audio = new Audio('resource/aplauso.mp3');
	
	video = document.getElementById('video');

	if (!video)
		return;
	
	navigator.getMedia = ( navigator.getUserMedia ||
	                       navigator.webkitGetUserMedia ||
	                       navigator.mozGetUserMedia ||
	                       navigator.msGetUserMedia);

	//////////////////// FUNCIONA COM O CHROME
	/*
	if (navigator.getMedia)
	{
		if (typeof MediaStreamTrack.getSources !== 'undefined')
		{
			MediaStreamTrack.getSources(gotSources);
		}
	}
	*/

	////////////////////
	
	navigator.getMedia(
		{
			video: true,
			audio: false
		},
		function(stream) {
			if (false /*navigator.mozGetUserMedia*/) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			video.play();
			
			localStream = stream;
		},
		function(err) {
	    	console.log("An error occured! " + err);
	  	}
	);
	

	video.addEventListener('canplay', function(ev){
		if (!streaming) {
	  
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			streaming = true;
		}
	}, false);
	
	anterior = [];
}

  
function transforma(a) {
	var s = [];
	var m = [0, 0xff, 0xf0, 0xC0, 0x80];
	var d = [0, 0, 4, 2, 1];
	var p = 0;
	var soma = 0;
	
    for (var i=0; i< a.length; i+= (Math.pow(2,taxa-1) * 4)) {
		car = 0;
		for (var t = 0; t < Math.pow(2,taxa)/2 && (t * 4 + i) < a.length; t++) {
			//aux = (a[t * 4 + i]) + (a[t * 4 + i + 1]) + (a[t * 4 + i + 2]);
			//car |= (((Math.floor(aux/3)) & m[taxa]) >> (d[taxa] * t));
			aux = (a[t * 4 + i] * 0.2989) + (a[t * 4 + i + 1] * 0.5870) + (a[t * 4 + i + 2] * 0.1140);
			
			soma += aux;
			
			car |= (((Math.floor(aux)) & m[taxa]) >> (d[taxa] * t));		
		}
		
		s[p++] = car;
	}
    
	 var num1 = (soma / (a.length/4));
	 var lux = 3 * Math.pow(1.02752, num1);
	 
	 //console.log("Soma: " + soma + " num1: " + num1 + " Lux: " + lux);
	 $("#txt_lux").val(Math.floor(lux));
	 
	 Session.set("session.lux", Math.floor(lux));
	
	//console.log(p );

	return s;
}

  
 function igual(b1, b2, ini, n) {
	  var cont = 0;
	  for (var i=ini; cont < n && i< b1.length; i++) {
		  if (b1[i] != b2[i])
			  return 0;
		  cont++;
	  }
	  return cont;
 }
  
 function comprime2(atual) {
	  var p = 0;
	  var i =0;
	  var s = [];
	  var maior = 0;
	  var maiorDist = 0;
	  var blocos = 0;
	  var cont;
	
	  ant =0;
	  while (i < atual.length) {
		  n = 3;
		  cont = 0;
		  ant = i;
		  while ((r = igual(atual, anterior, i, n))!=0 && i < atual.length && cont < 255) {
			  i += r;
			  n = 1;
			  cont += r;
		  }
		
		  dist = i - ant;
		  if (dist > maiorDist)
			  maiorDist = dist;

		  blocos++;
		  s[p++] = dist;
		  sp = p++;
		
		  cont = 0;
		  while ((igual(atual, anterior, i, 3) == 0) && cont < 255  && i < atual.length) {
			  cont++;
			  s[p++] = atual[i];
			  i++;
		  }
		  if (cont > maior)
			  maior = cont;
			
		  s[sp] = cont;
	  }
	  //console.log(p + ", " + taxa );
	  return s;
 }
  

function detectaMov(img1, img2){
	 var r = mostModified(img1, img2, width, height, 5, 32);
	 
	 if (r.contBlock == 0) {
		 contInativCli++;

		 //console.log("Cont: " + contInativCli);
		 if (contInativCli > TOLERANCIA) {
			statusUsuCli = "INAT";
			console.log("User inactive.");
			//$('#status_sel option[value="INAT"]').prop('selected', true);
			
			Session.set('session.statusUsu','INAT');
			Meteor.call("updateStatus", 'INAT');
		 }
	 } else {
		 contInativCli = 0;
		 
		 //if (statusUsuCli == "INAT" || statusUsuCli == "") {
		 if (Session.get('session.statusUsu') == 'INAT' || Session.get('session.statusUsu') == 'ON') {
			statusUsuCli = "ATIV";

			//$('#status_sel option[value="ATIV"]').prop('selected', true);

			Session.set('session.statusUsu','ATIV');

			Meteor.call("updateStatus", 'ATIV');
		 }
	 }
}

 function enviaImagem(compr) {
	var filter = {userid:Session.get("session.idCurUser")};
	var foto = FotosTemp.findOne(filter);
	
    if (!foto){// no chat matching the filter - need to insert a new one
		Meteor.call("addFotosTemp", compr);
    } else {
		fotoId = foto._id;
		
		if (iniciaEnvio) {
			tipo = "C"
		} else {
			tipo = "T";
		}
		
		Meteor.call("updateFotosTemp", fotoId, compr, foto.cont + 1, Session.get("session.lux"), tipo);
	}
 }

  
// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

takepicture = function() {
  
	if (!Meteor.user() || !Session.get("session.monitorado"))
		return;
	
	if (!video)
		startupCamera();

	if (anterior.length == 0) {
		iniciaEnvio = true;
		initAnterior();
	}

	var context = canvas.getContext('2d');

	if (width && height) {
		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);
		
		context.fillStyle="#ffffff";
		context.fillRect(23,0,120,15);
		context.font="12px Arial";
		context.fillStyle="#000000";
		context.fillText(formatDate(new Date()),26,12);
				
		var idata = context.getImageData(0, 0, width, height);
		
		var atual = transforma(idata.data);
		
		//if (Session.get("session.gestorOn")) {
		//	var teste = transformaServer(atual);
		//	exibeImagem(teste);
		//}

		detectaMov(anterior, atual);
		
		if (Session.get("session.gestorOn") && iniciaEnvio) {
			initAnterior();
		}

		var compr = comprime2(atual);
		anterior = atual.slice();
		/*
		if (Session.get("session.gestorOn")) {
			var at = descomprime2(compr)
			var teste = transformaServer(at);
			exibeImagem(teste);
		}
		*/
		contador++;
		if (contador > CONT_ARQ_FOTO_BD) {
			contador = 0;
			
			Meteor.call("addFotos", atual);
		}
		
		if (Session.get("session.gestorOn")) {
			enviaImagem(compr);
			iniciaEnvio = false;
		} else {
			iniciaEnvio = true;
		}
	} 
}

var canvas = null;

function initAnterior() {
	for (var i = 0; i < (width * height)/Math.pow(2,taxa-1); i++) {
		anterior[i] = 0;
	}
}
 
exibeImagem = function(a) {
	if (!canvas) {
		startupCanvas();
	}
	var context = canvas.getContext('2d');

	var imgData=context.createImageData(width,height);
	for (var i=0;i<imgData.data.length;i+=4)
	{
		aux = a[i/4];
		imgData.data[i+0]=aux;
		imgData.data[i+1]=aux;
		imgData.data[i+2]=aux;
		imgData.data[i+3]=255;
	}
	context.putImageData(imgData,0,0);

	var data = canvas.toDataURL('image/png');

	$("#photo").attr("src", data);
}


closeWebcamConnection = function(){
	
	if (Session.get("session.monitorado")) {
		//video.pause();
		if (localStream) {
			try {
				localStream.stop();
			} catch(err) {
				localStream.getTracks()[0].stop();
			}
			localStream = null; 
		}
		video = null;
	}
}


formatDate = function(date) {
    var year = date.getFullYear(),
        month = date.getMonth() + 1, // months are zero indexed
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),

		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		hour = hour < 10 ? "0" + hour : hour;
        minute = minute < 10 ? "0" + minute : minute;
		second = second < 10 ? "0" + second : second;

    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
}


function descomprime2(a){
	var p = 0;
	var i =0;
	var k;

	ant = anterior.slice();
	while (i < a.length) {
		p += a[i++];
		cont = a[i++];

		for (k = 0; k < cont; k++) {
			ant[p++] = a[i++];
		}
	}

	return ant;
 }
 