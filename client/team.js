Template.team.helpers ({
	membros:function() {
		return Usuarios.find({gestor:Meteor.user().username});
	},
})

Template.team.events ({
	"submit .js-save": function(event) {
		//console.log(event.target.username.value);
		
		if (Meteor.user()){
			var user = Usuarios.findOne({id:event.target.username.value});
			
			if (user) {
				$("#status").html("ERRO: usuário já cadastrado na equipe de " + user.gestor);
			} else {
				Usuarios.insert({"id": event.target.username.value,
						"gestor": Meteor.user().username,
						"st": "OFF"});

				$("#status").html("Usuário adicionado com sucesso!");
			}
		} else {
			$("#status").html("Você precisa logar antes.");
		}
				
		return false;
	},
	"click .js-del-usu": function(event) {
		var id = event.target.id;
		
		Usuarios.remove({_id:id});
		
	}
});
