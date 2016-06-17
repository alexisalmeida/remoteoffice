//canvas = null;
Session.set("curTab", "photos");

var fixed = null;

Template.report.rendered=function() {
	
	this.$('.datetimepicker').datetimepicker();
	
	this.$('#username').val(Session.get ("filter-username"));
	this.$('#dtini').val(Session.get ("filter-dtini"));
	this.$('#dtfim').val(Session.get ("filter-dtfim"));
	
	$("#photos").parent().removeClass("active");
	$("#" + Session.get("curTab")).parent().addClass("active");
}

Template.report.helpers ({
	curTab: function (tab) {
		return (Session.get("curTab") == tab);
	},
	getStatusMsg:function() {
		return Session.get("msg");
	}

});

Template.report.events ({
	"submit .js-query": function(event) {
		Session.set ("filter-username", event.target.username.value);
		Session.set ("filter-dtini", event.target.dtini.value);
		Session.set ("filter-dtfim", event.target.dtfim.value);
		//console.log(event.target.username.value);

		//this.stop();
		Meteor.subscribe('fotos',
		  JSON.stringify(getFilter()), 
		  {
			sort: {"createdOn": -1},
			limit:50,
			fields: {imagem: 0}
		  }
		);
		

		Meteor.subscribe('procs',
		  JSON.stringify(getFilter()), 
		  {
			sort: {"createdOn": -1},
			limit:50
		  }
		);
		
		return false;
	},
	"click .nav-pills": function(event) {
		//console.log(event.target.id);
		$("#" + Session.get("curTab")).parent().removeClass("active");
		
		Session.set("curTab", event.target.id)
		$("#" + Session.get("curTab")).parent().addClass("active");
		
	},
});

Template.showPhotos.helpers ({
	photos:function() {
		setStatus("msg006", -1);
		var ret = Fotos.find(getFilter(),{sort:{createdOn:-1},limit: 50});
		return ret;
	},

})

Template.showPhotos.events ({
	"mouseover .js-show-foto": function(event) {
		//$(".js-show-foto").clearQueue();
		event.preventDefault();
		if (!fixed) {
			showPhoto(event);
		}
	},
	"mouseout .js-show-foto": function(event) {
		event.preventDefault();
		
		if (!fixed) {
			unloadPopupBox();	
		}
		
	},
	"click .js-show-foto": function(event) {
		event.preventDefault();
		
		if (!fixed || fixed != event.target.id) {
			showPhoto(event);
			fixed = event.target.id;
		} else {
			unloadPopupBox();
			fixed = null;
		}
	},
});
function showPhoto(event) {
	if (!canvas) {
		startupCanvas();
	}
	Meteor.call('getFoto', event.target.id, function(error, result) {
		if (error) {
			// handle error
		}
		else {
			var foto = result;
			var img = transformaServer(foto.imagem);
			exibeImagem(img);
			var x = event.clientX + 50;
			if (x + 160 > window.innerWidth)
				x = 50;
			
			var y = event.clientY;
			if (y + 120 > window.innerHeight)
				y = window.innerHeight - 130;
			
			loadPopupBox(x, y);
		}
	});

}
	
function unloadPopupBox() {    // TO Unload the Popupbox
	$('#popup_box').fadeOut("fast");
	/*
	$("#container").css({ // this is just for style        
		"opacity": "1"  
	}); 
	*/
}    

function loadPopupBox(x, y) {    // To Load the Popupbox
	$("#popup_box").css({ // this is just for style
		"left": x + "px",
		"top": y + "px",
	}); 	
	$('#popup_box').fadeIn("fast");
	/*
	$("#container").css({ // this is just for style
		"opacity": "0.3",
		"left": x + "px",
		"top": y + "px",
	});
	*/
		
}      

Template.showProcs.helpers ({
	procs:function() {
		setStatus("msg006", -1);
		var ret = Procs.find(getFilter(), {sort:{createdOn:-1},limit:50}); 
		//console.log (Procs.find({}).count()); 
		return ret;
	},
})

function getFilter() {
	var filter = {};
	
	var start = new Date(Session.get("filter-dtini"));
	var end = new Date(Session.get("filter-dtfim"));
	

	if (Session.get("filter-username") != "") {
		_.extend(filter, {username: Session.get("filter-username")});
	};		
	
	if (Session.get("filter-dtini") != "") {
		if (Session.get("filter-dtfim") != "") {
			_.extend(filter, {createdOn:{ '$gte': start,
								  '$lte': end}});
		} else {
			_.extend(filter, {createdOn:{ '$gte': start}});		
		}
	} else if (Session.get("filter-dtfim") != "") {
		_.extend(filter, {createdOn:{ '$lte': end}});
	}

	return filter;

}

