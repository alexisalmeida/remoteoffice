Session.set("msg","")
var selectedUser = "";

if (Meteor.user()) {
	Chat.find({or:{username:Meteor.user().username, receiver: Meteor.user().username}}).observeChanges({
		added: function(id, fields) {
			Session.set("hist",Session.get("hist") + fields.texto);
		}
	});
}

Template.userList.helpers ({
	usuarios: function() {
		return Usuarios.find({gestor:Meteor.user().username});
	},
});

Template.userList.events ({
	"click .js-char-usu": function(event) {
		//event.preventDefault();
		$("#selection").text(event.target.id);
		var x = $('.dropdown-toggle');
		//x.collapse();
		selectedUser = event.target.id;
	},
})

Template.chat.helpers ({
	usuarios: function() {
		return Usuarios.find({gestor:Meteor.user().username});
	},
	gestor: function(){
		return (Session.get("gestor"));
	},
	messages: function() {
		setStatus("msg006", -1);
		return (Chat.find({$or:[{username:Meteor.user().username}, 
								{receiver: Meteor.user().username}]},
							{sort:{createdOn:-1}, limit: 10}
							));
	},
	getTextcolor:function(username){
      if (username == Meteor.user().username){
        return "alert-info";
      }
      else {
        return "alert-warning";
      }
    },
	
	getMsgStatus:function() {
		return Session.get("msg");
	}
});

Template.chat.events ({
	"click .js-send": function(event) {
		event.preventDefault();
		if (Session.get("gestor")) {
			if (selectedUser == "") {
				//ssion.se("msg","msg004")
				setStatus("msg004", 2000);
				return false;
			} else {
				rcv = $("#selection").text();
			}
		} else {
			rcv = Session.get("idGestor");
		};
		
		if ($("#message").val() != "") {
			Meteor.call("addChat", $("#message").val(), rcv);
			$("#message").val("");
			
		} else {
			setStatus("msg005", 2000);
		}
		return false;
	},
	"click .js-clear": function (event) {
		event.preventDefault();
		$("#message").val("");
	},
});

