Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
	setStatus("nothing");

	if (Meteor.user()) {
		initSession();
	} else {
		finSession();
	}
	Session.set('curMenu', "home");
	this.render('home');
});

Router.route('/about', function () {
	setStatus("nothing");

	Session.set('curMenu', "about");
	this.render('about');
});

Router.route('/team', function () {
	setStatus("nothing");

	if (Meteor.user()) {
		Session.set('curMenu', "admin");
		initSession();
		if (Session.get("session.gestor"))
			this.render('team');
		else
			this.render('home');
	} else {
		Session.set('curMenu', "home");
		finSession();
		this.render('home');
	}
});

Router.route('/report', function () {
	setStatus("nothing");

	if (Meteor.user()) {
		Session.set('curMenu', "admin");
		initSession();
		if (Session.get("session.gestor"))
			this.render('report');
		else
			this.render('home');
	} else {
		Session.set('curMenu', "home");
		finSession();
		this.render('home');
	}
});
