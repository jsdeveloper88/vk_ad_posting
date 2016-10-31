module.exports = Backbone.Router.extend({
	routes: {
	   	"page/:pg": "ShowPage"   // #search/kiwis/p7
	},

	ShowPage: function(pg) {
		$('.pagination').find('li').removeAttr("class");
		$('.pagination').find('li').eq(pg-1).attr( "class", "active");

		//$('.pagination .down').find('li').removeAttr("class");
		//$('.pagination .down').find('li').eq(pg-1).attr( "class", "active");

		$('#comm_table').find("tr:gt(0)").hide();
		$('#comm_table .page' + pg).show();
	}
});
