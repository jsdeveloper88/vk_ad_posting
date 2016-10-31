var CommunityTableRow = require('community_table_row');

module.exports = Backbone.View.extend({
	el: '#send_messages_div',

	events: {
		'click #get_communities': 'GetCommunities'
	},

	initialize: function(){
		var that = this;
		this.$( "#strs_per_pg" ).change(function() {
			if (that.$('#min_members_amt').val() > 0 && that.$('#max_members_amt').val() > 0 && that.$('#city').val().length > 0) {
				var obj  = {
					'city': that.$('#city').val(),
					'req_type': that.$('#req_type').val(),
					'min_members_amt': that.$('#min_members_amt').val(),
					'max_members_amt': that.$('#max_members_amt').val()
				};
				$('#comm_table').find('tr :gt(7)').remove();
				$('.pagination li').remove();
				$.ajax({
					type: 'post',
					url: '/get_comms',
					data: JSON.stringify(obj),
					contentType: "application/json; charset=utf-8",
					traditional: true,
					success: function (res) {
						if (res.length == 0){
							alert('В базе данных нет сообществ, удовлетворяющих таким параметрам!');
						}else{
							var page_amt = Math.floor(res.length/that.$('#strs_per_pg').val()) == (res.length/that.$('#strs_per_pg').val()) ? Math.floor(res.length/that.$('#strs_per_pg').val()) : Math.floor(res.length/that.$('#strs_per_pg').val()) + 1;
							for(var i in res) {
								for(var j = 1; j <= page_amt; j++){
								   if ((j - 1)*that.$('#strs_per_pg').val() <= i && i < that.$('#strs_per_pg').val()*j){
										res[i]['page'] = j;
										break;
								   }
								}
								res[i]['num'] = i;
								res[i]['num']++;
								var item_table_row  = new CommunityTableRow({model: res[i]})
								$('#comm_table').append(item_table_row.render().$el.hide());
							}

							for(var i = 1; i <= page_amt; i++){
								that.$('.pagination').append('<li><a href="#page/' + i + '">' + i + '</a></li>')
							}

							that.$('#comm_table .page1').show();
						}
					}
				});
			}
		});
	},

	GetCommunities: function() {
		var that = this;
		var obj  = {
			'city': this.$('#city').val(),
			'req_type': this.$('#req_type').val(),
			'min_members_amt': this.$('#min_members_amt').val(),
			'max_members_amt': this.$('#max_members_amt').val(),
			'country_id': this.$('#country_id').val()
		};
		$('#comm_table').find('tr :gt(7)').remove();
		$('.pagination li').remove();
		if (isNaN(Number($('#min_members_amt').val()))) {
			alert("В поле 'Мин. кол-во уч-ков' должно быть введено число > 0!");
			return;
		}
		if (isNaN(Number($('#max_members_amt').val()))) {
			alert("В поле 'Макс. кол-во уч-ков' должно быть введено число > 0!");
			return;
		}
		$.ajax({
			type: 'post',
			url: '/get_comms',
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			traditional: true,
			success: function (res) {
				if (res.length == 0){
					alert('В базе данных нет сообществ, удовлетворяющих таким параметрам!');
				}else{
					var page_amt = Math.floor(res.length/that.$('#strs_per_pg').val()) == (res.length/that.$('#strs_per_pg').val()) ? Math.floor(res.length/that.$('#strs_per_pg').val()) : Math.floor(res.length/that.$('#strs_per_pg').val()) + 1;
					for(var i in res) {
						for(var j = 1; j <= page_amt; j++){
			   				if ((j - 1)*that.$('#strs_per_pg').val() <= i && i < that.$('#strs_per_pg').val()*j){
						   		res[i]['page'] = j;
						   		break;
						   	}
			   			}
						res[i]['num'] = i;
						res[i]['num']++;
						var item_table_row  = new CommunityTableRow({model: res[i]})
						$('#comm_table').append(item_table_row.render().$el.hide());
					}

					for(var i = 1; i <= page_amt; i++){
						$('.pagination').append('<li><a href="#page/' + i + '">' + i + '</a></li>')
					}
					$('.pagination').find('li').eq(0).attr( "class", "active");
					$('#comm_table .page1').show();
				}
			}
		});
	},

	render: function() {
    	this.$el.html();
	}
});