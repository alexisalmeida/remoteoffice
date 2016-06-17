// counter starts at 0

autoInterval = null;
procInterval = null;

Meteor.startup(function () {
});

Meteor.subscribe('usuarios');
Meteor.subscribe('fotostemp');
Meteor.subscribe('chat');

// accounts config
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

verificaStatusGestor = function () {
	var g = Usuarios.findOne({id: Session.get("session.idGestor")});
	
	Session.set("session.gestorOn", (g && g.st == "ON"));
}

initSession = function () {
	if (!Session.get("session.iniciado")) {
		//console.log("nao iniciado");
		
		var usu = Usuarios.findOne({id:Meteor.user().username});
		
		if (usu) {
			//console.log("usu" + usu.id);
			
			Session.set("session.monitorado", usu.gestor != null);
			Session.set("session.gestor", Usuarios.find({gestor:usu.id}).count() > 0);
			Session.set("session.idGestor", usu.gestor);
			Session.set("session.idCurUser",usu._id);
			Session.set("session.gestorOn",false);
			
			Meteor.call("logon");
			Session.set('session.statusUsu','ON');

			if (Session.get("session.monitorado")) {
				initMonit();
				verificaStatusGestor();
			}
						
			Session.set("session.iniciado",true)
		}
	}
}


finSession = function () {
	if (Session.get("session.iniciado")) {
		monitStop();

		Meteor.call("logoff", Session.get("session.idCurUser"));

		Session.set("session.monitorado", false);
		Session.set("session.gestor", false);
		Session.set("session.idGestor", "");
		Session.set("session.idCurUser","");
		Session.set('session.statusUsu','OFF');
		
		Session.set("session.iniciado",false);
	}
}

initMonit = function () {

	iniciaConexaoLocal();
	
	if (procInterval) {
		clearInterval(procInterval);
	}
	
	procInterval = setInterval(function() {
		//console.log("procInterval");
		if (wslocal != null) {
			if (conexaoLocal) {
				wslocal.send("PROC");
			}
			
		} else {
			//console.log("reiniciando conexao");
			iniciaConexaoLocal();
		}
	}, 1000);
	
	if (autoInterval) {
		clearInterval(autoInterval);
	}
	
	if (canvas) {
		autoInterval = setInterval(function() {
			//console.log("autoInterval");
			takepicture();
			verificaStatusGestor();
		}, 1000);
	}
}

function monitStop() {
	if (procInterval) {
		clearInterval(procInterval);
	}

	if (autoInterval)
		clearInterval(autoInterval);

	closeWebcamConnection();
	
	finalizaConexaoLocal();
}

setStatus = function(msg, interv) {
	Session.set("msg", msg);
	if (interv > 0) {
		var msgInterv = setInterval(function() {
			Session.set("msg","nothing");
			clearInterval(msgInterv);
		},interv)
	}
}