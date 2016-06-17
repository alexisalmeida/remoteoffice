//Template helpers
Template.home.helpers({
	monitorado: function(){
		return (Session.get("session.monitorado"));
	},
	gestor: function(){
		return (Session.get("session.gestor"));
	},
	
})

Template.home.onRendered(function () {
    //Accounts._loginButtonsSession.set('dropdownVisible', true);

	startupCanvas();
});

Template.needLogon.onRendered(function () {
    Accounts._loginButtonsSession.set('dropdownVisible', true);
});
