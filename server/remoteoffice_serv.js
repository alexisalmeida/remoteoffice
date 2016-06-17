
Meteor.startup(function () {
	SSLProxy({
		host: 'df5405nb203',
		port: 8443, //or 443 (normal port/requires sudo)
		ssl : {
            //key: Assets.getText("privateKey.key"),
            //cert: Assets.getText("certificate.crt"),
            key: Assets.getText("privateKeyDF.key"),
            cert: Assets.getText("certificateDF.crt"),
            //key: Assets.getText("privateKeyServ.key"),
            //cert: Assets.getText("certificateServ.crt"),            
			//Optional CA
            //Assets.getText("ca.pem")
       }
    });
	
	
	//Usuarios.remove({});
	
	if (!Usuarios.findOne()){
		Usuarios.insert({"id": "usuario1",
						"gestor": "gestor",
						"st": "OFF"});
		Usuarios.insert({"id": "usuario2",
						"gestor": "gestor",
						"st": "OFF"});
		Usuarios.insert({"id": "usuario3",
						"gestor": "gestor",
						"st": "OFF"});
		Usuarios.insert({"id": "usuario4",
						"gestor": "gestor",
						"st": "OFF"});	
		Usuarios.insert({"id": "usuario5",
						"gestor": "gestor2",
						"st": "OFF"});
		Usuarios.insert({"id": "usuario6",
						"gestor": "gestor2",
						"st": "OFF"});
		Usuarios.insert({"id": "usuario7",
						"gestor": "gestor2",
						"st": "OFF"});
		Usuarios.insert({"id": "usuario8",
						"gestor": "gestor2",
						"st": "OFF"});
						
		Usuarios.insert({"id": "gestor",
						"gestor": null,
						"st": "OFF"});
		Usuarios.insert({"id": "gestor2",
						"gestor": null,
						"st": "OFF"});
	}
	
	// server code: deleta fotostemp com mais de 2 segundos
	/*
	console.log("init interval");
	Meteor.setInterval(function () {
		var now = (new Date()).getTime();
		console.log("interval: " + now + " " + FotosTemp.find({createdOn: {$lt: (now - 60 * 1000)}}).count());
		FotosTemp.find({createdOn: {$lt: (now - 2 * 1000)}}).forEach(function (photo) {
			console.log("removendo " + photo.username);
			FotosTemp.remove({_id: photo._id});
			Usuarios.update({id: photo.username},{$set:{st:"OFF"}});
		});
	},10000);
	*/
	
});


function getFilter(user, searchText) {

	var filter = {idgestor:user.username};
	_.extend(filter, JSON.parse(searchText));
	
	if (filter.createdOn && filter.createdOn.$lte)
		filter.createdOn.$lte = new Date(filter.createdOn.$lte);
	
	if (filter.createdOn && filter.createdOn.$gte)
		filter.createdOn.$gte = new Date(filter.createdOn.$gte);
	
	return filter;
}

Meteor.publish('usuarios', function() {
  return Usuarios.find();
});

Meteor.publish('chat', function() {
	if(this.userId) {
		var user = Meteor.users.findOne(this.userId);
		
		var filter = {$or:[{username:user.username}, 
						   {receiver: user.username}]};
		
		return Chat.find(filter);  
	}
});

Meteor.publish('fotos', function(query, options) {
	if (options) {
		check(options, {
		  sort: Match.Optional(Object),
		  limit: Match.Optional(Number),
		  fields: Match.Optional(Object)
		});
	}

	var user = Meteor.users.findOne(this.userId);
	if (user) {
		var filter = getFilter(user, query);

		//console.log("filtro: " + query);
		//console.log("filter: " + JSON.stringify(filter));
		//console.log("options: " + JSON.stringify(options));
		//console.log("count: " + Procs.find(filter,options).count());
		//var ret = Procs.find(filter,options);
		//console.log("count2: " + ret.count());
		return Fotos.find(filter,options);
	}
});

Meteor.publish('procs', function(query, options) {
	if (options) {
		check(options, {
		  sort: Match.Optional(Object),
		  limit: Match.Optional(Number),
		  fields: Match.Optional(Object)
		});
	}

	var user = Meteor.users.findOne(this.userId);
	
	if (user) {
		var filter = getFilter(user, query);

		//console.log("filtro: " + query);
		//console.log("filter: " + JSON.stringify(filter));
		//console.log("options: " + JSON.stringify(options));
		//console.log("count: " + Procs.find(filter,options).count());
		//var ret = Procs.find(filter,options);
		//console.log("count2: " + ret.count());
		
		
		return Procs.find(filter,options);
	}
});

Meteor.publish('fotostemp', function() {
 
   	if(this.userId) {
		var user = Meteor.users.findOne(this.userId);
		
		var filter = {$or:[{username:user.username}, 
						   {idgestor: user.username}]};
						   
		return FotosTemp.find(filter);  
	}
});


//Methods
Meteor.methods({
	////////////////// CHAT
	addChat: function (texto, rcv) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}
	 
		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}

		Chat.insert({userid: Meteor.userId(), 
			username: Meteor.user().username,
			texto: texto, 
			status: usu.st,
			createdOn: new Date(),
			idgestor: usu.gestor,
			receiver: rcv,
		});
	},
	////////////////////////  FOTOSTEMP
	addFotosTemp: function (imagem) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}

		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}
		/*
		var filter = {userid:usu._id};
		var foto = FotosTemp.findOne(filter);
		var fotoId = null;
		if (foto) {
			fotoId = foto._id;
		}		
		*/
		FotosTemp.upsert({userid:usu._id},{imagem:imagem,
						userid:usu._id, 
						username:Meteor.user().username,
						cont:0,
						status: usu.st,
						createdOn:new Date().getTime(),
						tipo: "T",
						idgestor: usu.gestor,
		});
		
		//console.log("insert temp");
	},

	updateFotosTemp: function (fotoId, imagem, cont, lux, tipo) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}

		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}
		
		FotosTemp.update({_id:fotoId},
						{$set:{imagem: imagem, 
								cont: cont, 
								status: usu.st,
								lux: lux,
								createdOn: new Date().getTime(),
								tipo: tipo,
								}	
		});
		//console.log("update temp");
	},
  
	//delFotosTemp: function (userid) {
	//	var photo = FotosTemp.remove({userid: userid});
	//},

	////////////////////////  FOTOS
		getFoto: function (id) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}

		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}

		var foto = Fotos.findOne({_id:id,
						idgestor: Meteor.user().username});
		return foto;
	},
	addFotos: function (imagem) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}

		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}

		Fotos.insert({imagem:imagem,
						userid:usu._id, 
						username:Meteor.user().username,
						status: usu.st,
						createdOn:new Date(),
						idgestor: usu.gestor,
		});
	},
	////////////////////////  PROCS
	addProcs: function (proc) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}

		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}

		Procs.insert({userid: usu._id, 
					username: Meteor.user().username,
					texto: proc, 
					status: usu.st,
					createdOn: new Date(),
					idgestor: usu.gestor,
		});

	},

	////////////////////////  USUARIOS
	
	logon: function () {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}

		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}
		//console.log("logon: " + usu.id);
		
		Usuarios.update({_id: usu._id},{$set:{st:"ON"}});
	},
	
	logoff: function (id) {
		//console.log("logoff" + Meteor.userId());
		
		Usuarios.update({_id: id},{$set:{st:"OFF"}});
		var ret = FotosTemp.remove({userid: id});
		//console.log("remove temp");

	},

	updateStatus: function (status) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
		  throw new Meteor.Error("not-authorized");
		}

		var usu = Usuarios.findOne({id:Meteor.user().username});
		if (!usu) {
		  throw new Meteor.Error("not-authorized");
		}
		
		Usuarios.update({_id: usu._id},{$set:{st:status}});
	},
	
	getProcs: function (filtro) {
		var user = Meteor.users.findOne(this.userId);
		var filter = getFilter(user, filtro);
		console.log("filtro: " + filtro);
		console.log("filter: " + JSON.stringify(filter));
		var ret = Procs.find(filter, {sort:{createdOn:-1},limit:50}).fetch();;
		console.log("count: " + ret.length);
		return ret;
	}
});
/*
UserStatus.events.on("connectionLogin", function(fields) {
	//console.log("user",Meteor.user().username);
	//console.log("user",Meteor.userId());
	//console.log("login", fields);
})
*/

UserStatus.events.on("connectionLogout", function(fields) {
	console.log("connectionLogout");
	var user = Meteor.users.findOne({_id:fields.userId});
	Usuarios.update({id: user.username},{$set:{st:"OFF"}});

	var ret = FotosTemp.remove({username: user.username});
	
	//console.log("remove temp logout");

})


UserStatus.events.on("connectionIdle", function(fields) {
	//console.log("connectionIdle");
	var user = Meteor.users.findOne({_id:fields.userId});
	Usuarios.update({id: user.username},{$set:{st:"OFF"}});

	var ret = FotosTemp.remove({username: user.username});
	//console.log("remove temp idle");
})


/*
Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});
*/