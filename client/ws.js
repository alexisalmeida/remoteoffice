wslocal = null;
conexaoLocal = false;

finalizaConexaoLocal = function () {
	if (conexaoLocal == true) {
		clearInterval(procInterval);
		wslocal.send("END");
		//wslocal.close(1000, "");
		conexaolocal = false;
	}
}

function gravaProc(texto) {
	Meteor.call("addProcs", texto);
}

////////////////////////////////////////////////////////////////////
// ws local
////////////////////////////////////////////////////////////////////
iniciaConexaoLocal = function () {
	console.log("start local conection");
	
	if (wslocal != null)
		return;
	
	wslocal = new WebSocket("wss://localhost:11165/");

	if (wslocal) {
		wslocal.onopen = function(ev) { // connection is open 
			$('#message_box').append("<div class=\"system_msg\">Conexao local!</div>"); //notify user
			console.log("wslocal open");
			conexaoLocal = true;
		}
		
		wslocal.onmessage = function(ev) {
			if (typeof ev.data == 'string') {
				var coded = decodeBase64(ev.data);
				var msg = coded.split("|");
				var cod = msg[0]; 

				if(cod == 'PROC')	{
					if (msg[1]=="")
						msg[1] = ".";
					console.log(msg[1]);
					gravaProc(msg[1]);
				}

			}
		}
	}
	

	
	decodeBase64 = function(s) {
		var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
		var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		for(i=0;i<64;i++){e[A.charAt(i)]=i;}
		for(x=0;x<L;x++){
			c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
			while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
		}
		return r;
	};
	
	wslocal.onerror	= function(ev){
		//$('#message_box').append("<div class=\"system_error\">Ocorreu um erro na conexao local - "+ev.data+"</div>");
		conexaoLocal = false;
		wslocal = null;
		console.log("wslocal error: " + ev);
	}; 
	
	wslocal.onclose 	= function(ev){
		//$('#message_box').append("<div class=\"system_msg\">Conexao local fechada.</div>");
		conexaoLocal = false;
		wslocal = null;
	};
}
