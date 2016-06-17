//Template helpers

bufAnterior={};

Template.monitor.helpers({
	monitorados: function(){
		return FotosTemp.find({"idgestor": Meteor.user().username},
								{imagem: 0, tipo: 0});
	},
	
	exibeFoto: function( userid) {
		
		var ret = FotosTemp.findOne({userid: userid}, {imagem:1});
		var imagem = ret.imagem;
		var lux = ret.lux;
		var tipo = ret.tipo;
		
		Session.set("session.lux", lux);
		
		var temp = descomprime2(imagem, userid, tipo);
		var temp2 = transformaServer(temp);
		exibeImagem(temp2, userid);
		
	}
})


// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var video = null;
var photo = [];
var anterior = [];
var listaBuffer = [];
var tempInterval = null;

// Fill the photo with an indication that none has been
// captured.

function clearPhoto(userid) {
	var context = canvas.getContext('2d');
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var data = canvas.toDataURL('image/png');
	
	$("#photo_" + userid).attr("src", data);
}

function initAnterior(a) {
	for (var i = 0; i < (width * height)/Math.pow(2,taxa-1); i++) {
		a[i] = 0;
	}
}
 

 function descomprime2(a, userid, tipo){
	//if (!Session.get("ant_" + userid) || tipo=="C")
	//	Session.set("ant_" + userid,[]);
	if (!bufAnterior[userid] || tipo == "C") {
		bufAnterior[userid] = [];
		initAnterior(bufAnterior[userid]);
	}
	
	//var anterior = Session.get("ant_" + userid);
	var anterior = bufAnterior[userid];
	
	var p = 0;
	var i =0;
	var k;

	ant =0;
	while (i < a.length) {
		p += a[i++];
		cont = a[i++];

		for (k = 0; k < cont; k++) {
			anterior[p++] = a[i++];
		}
	}

	//Session.set("ant_" + userid, anterior);
	bufAnterior[userid] = anterior;
	
	return anterior;
 }
 

transformaServer = function (a) {
	  var s = [];
	  var m = [0, 0xff, 0xf0, 0xC0, 0x80];
	  var d = [0, 0, 4, 2, 1];
	
	  var p = 0;
	  for (var i=0; i< a.length; i++) {
		  for (var t = 0; t < Math.pow(2,taxa)/2; t++) {
			  s[p++] = (a[i] << (d[taxa] * t)) & m[taxa];
		  }
	  }
	  return s;
 }
 
  
 function exibeImagem(a, userid) {
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
	/*
		context.fillStyle="#000000";
		context.fillRect(23,0,120,15);
		context.font="12px Arial";
		context.fillStyle="#ffffff";
		context.fillText(formatDate(new Date()),26,12);
	*/
	var data = canvas.toDataURL('image/png');

	$("#photo_" + userid).attr("src", data);
 }
  
