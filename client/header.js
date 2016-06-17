Template.header.helpers({
	menuClass: function (menu) {
		if (Session.get('curMenu') == menu) {
			return "active";
		} else {
			return "";
		}
	},	
	
	getStatus: function () {
		return Session.get('session.statusUsu');
	},	
	
	getLux: function () {
		return Math.floor(Session.get('session.lux'));
	},

	monitorado: function(){
		return (Session.get("session.monitorado"));
	},
	gestor: function(){
		return (Session.get("session.gestor"));
	},
});

Template.header.events({
	"click .js-report": function () {
		console.log("report");
	},
	"click .js-exit": function(event){
        event.preventDefault();
        Meteor.logout();
	},
});