module.exports = Backbone.View.extend({
	tagName: 'tr',

	initialize: function(){
		this.$el.attr("class", "page" + this.model['page']);
	},
						
	events: {
		'click #send': 'Send',
		'click #delete': 'Delete'
	},

	Send: function(data) {
		if (localStorage.rest_posts_amt > 0) {
			var that = this;
					
			VK.api('wall.post',
					{
					   	owner_id: '-' + this.model['comm_id'],
						message: $('#message_text').val(),
						attachments: $('#message_attachments').val()
					},
					function(data){
						if (data.response){
							$.ajax({
								type: 'post',
								url: '/successful_post',
								data: JSON.stringify({'comm_id': that.model['comm_id'], 'post_id': data.response.post_id, 'comm_num': that.model['num']}),
								contentType: "application/json; charset=utf-8",
								success: function(){
									that.$('#send').prop( "disabled", true );
								   	that.$('#send').prop( "class", "btn btn-success" );
									that.$('#delete').prop( "disabled", true );
								   	
									that.$('#post_id').empty();
									that.$('#post_id').append(data.response.post_id);
								   			
								   	that.$('#fail_reason').empty();
									that.$('#fail_reason').append('null');

									localStorage.rest_posts_amt--;
									$('#rest_posts').val(localStorage.rest_posts_amt);
								}
							});
						} else {
							$.ajax({
								type: 'post',
								url: '/fail_post',
								data: JSON.stringify({'comm_id': that.model['comm_id'], 'fail_reason': data.error.error_msg, 'comm_num': that.model['num']}),
								contentType: "application/json; charset=utf-8",
								success: function(){
								   	that.$('#send').prop( "disabled", true );
								   	that.$('#send').prop( "class", "btn btn-danger" );

								   	that.$('#post_id').empty();
								  	that.$('#post_id').append('null');

								   	that.$('#fail_reason').empty();
								   	that.$('#fail_reason').append(data.error.error_msg);
								   	alert(data.error.error_msg);
								}
							});
						}

						var d = new Date();
						var day, month;
						if (d.getDate() < 10) {
							  	day = '0' + d.getDate();
						}else{
						   	day = d.getDate();
						}
						if (d.getMonth() < 9) {
						   	month = '0' + d.getMonth();
						}else{
						   	month = d.getMonth();
						}
						month++;
						that.$('#last_post_dt').empty();
						that.$('#last_post_dt').append(day + "/" + month + "/" + d.getFullYear());
					}
			);
		} else {
			alert('Enough posting today - you can get banned !!!!!!!');
			localStorage.rest_posts_amt = 0;
			//$('#rest_posts').val('0');
			//$('#total_posts').val('0');
		};
	},

	Delete: function(data) {
		var that = this;
		$.ajax({
		    type: 'post',
		    url: '/delete_comm',
		    data: JSON.stringify({'comm_id': that.model['comm_id'], 'comm_num': that.model['num']}),
		    contentType: "application/json; charset=utf-8",
		    success: function(){
		      	that.$('#send').prop( "disabled", true );

		       	that.$('#delete').prop( "disabled", true );
				that.$('#delete').prop( "class", "btn btn-danger" );

		       	that.$('#delete').empty();
				that.$('#delete').append('Удалено');
			}
		});
	},

	render: function () {
		var template = _.template(
		    '<td width="5%" align="left">' +
				this.model['num'] + '.' +
			'</td>' +

			'<td width="15%" align="left">' +
				'<a href="http://vk.com/club' + this.model['comm_id'] + '" target="_blank">vk.com/club' + this.model['comm_id'] + '</a>' +
			'</td>' +

			'<td id="last_post_dt" width="10%" align="left">' +
			    this.model['last_post_dt'] +
			'</td>' +

			'<td width="5%" align="left">' +
			    this.model['members_count'] +
			'</td>' +

			'<td width="20%" align="left">' +
			    this.model['comm_name'] +
			'</td>' +

			'<td id="post_id" width="5%" align="left">' +
			    this.model['city'] +
			'</td>' +

			'<td width="20%" align="left">' +
			    '<button type="button" class="btn btn-primary" id="delete">' +
					'<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Удалить' +
				'</button>' +
			'</td>' +

			'<td width="20%" align="left">' +
			    '<button type="button" class="btn btn-primary" id="send">' +
					'<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Отправить' +
				'</button>' +
			'</td>'
		);
		this.$el.html(template);
		return this;
	}
});