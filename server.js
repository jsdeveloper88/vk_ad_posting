var express = require('express'),
	mysql = require('mysql'),
	bodyParser = require('body-parser');

var app = express();

var https = require('https'),
	fs = require('fs');

app.set('views', __dirname + '/prod/views');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/prod/public')); //libs

app.use(bodyParser.json());

app.get('/',function(req, res){
	console.log('APP.GET(/):');
	res.render("vk_ad_posting.html");
	console.log(req.body);
});

app.post('/get_comms',
		 function(req,res){
			console.log('APP.POST(/GET_COMMS):');

			var mysql_connection = mysql.createConnection(
				{
					host     : process.argv[4],
					user     : process.argv[5],
					password : process.argv[6]
				}
			);

			mysql_connection.connect();
				var city_arr = req.body.city.split(',');
				var req_part = "WHERE UPPER(city) IN (";
				for (var i = 0; i < city_arr.length - 1; i++){
					req_part += "UPPER('" + city_arr[i] + "'), ";
				}
				req_part += "UPPER('" + city_arr[city_arr.length - 1] + "')) AND members_count >= ? AND members_count <= ? AND type_req = ? AND country_id = ?";
				mysql_connection.query(
					"SELECT comm_id, DATE_FORMAT(last_post_dt,'%d/%m/%Y') last_post_dt, post_id, fail_reason, members_count, type_req, country_id, comm_name, city " +
					"FROM " + process.argv[3] + "." + process.argv[2] + " " +
					req_part +
					" ORDER BY members_count DESC",
					[req.body.min_members_amt, req.body.max_members_amt, req.body.req_type, req.body.country_id],
					function(err, result) {
						if (err) throw err;
						res.send(result);
						console.log("SELECT * FROM " + process.argv[3] + '.' + process.argv[2] + "\n" + req_part + "\nORDER BY members_count DESC;");
						console.log(result);
					}
				);
			mysql_connection.end();
		 }
);

app.post('/successful_post',
		 function(req,res){
			console.log('APP.POST(/SUCCESSFUL_POST):');

			var mysql_connection = mysql.createConnection(
				{
					host     : process.argv[4],
					user     : process.argv[5],
					password : process.argv[6]
				}
			);

			mysql_connection.connect();
				mysql_connection.query(
					'UPDATE ' + process.argv[3] + '.' + process.argv[2] +
					' SET last_post_dt = now(), post_id = ?, fail_reason = null ' +
					'WHERE comm_id = ?',
					[req.body.post_id, req.body.comm_id],
					function(err, result) {
						if (err) throw err;
						res.send('');
					}
				);
			 	console.log(req.body.comm_num + ') - UPDATE ' + process.argv[3] + '.' + process.argv[2] + '\nSET last_post_dt = now(), post_id = ' + req.body.post_id + ', fail_reason = null\nWHERE comm_id = ' + req.body.comm_id + ';');
			mysql_connection.end();
		 }
);

app.post('/fail_post',
		 function(req,res){
			console.log('APP.POST(/FAIL_POST):');

			var mysql_connection = mysql.createConnection(
				{
					host     : process.argv[4],
					user     : process.argv[5],
					password : process.argv[6]
				}
			);

			mysql_connection.connect();
				mysql_connection.query(
					'UPDATE ' + process.argv[3] + '.' + process.argv[2] + ' ' +
					'SET last_post_dt = now(), post_id = null, fail_reason = ?' +
					' WHERE comm_id = ?',
					[req.body.fail_reason, req.body.comm_id]
				);
				console.log(req.body.comm_num + ") - UPDATE " + process.argv[3] + "." + process.argv[2] + "\nSET last_post_dt = now(), post_id = null, fail_reason = '" + req.body.fail_reason + "'\nWHERE comm_id = " + req.body.comm_id + ";");
			mysql_connection.end();
			res.send();
		 }
);

app.post('/delete_comm',
		 function(req,res){
			console.log('APP.POST(/DELETE_COMM):');

			var mysql_connection = mysql.createConnection(
				{
					host     : process.argv[4],
					user     : process.argv[5],
					password : process.argv[6]
				}
			);

			mysql_connection.connect();
				mysql_connection.query(
					'DELETE FROM ' + process.argv[3] + '.' + process.argv[2] + ' ' +
					'WHERE comm_id = ?',
					[req.body.comm_id]
				);
				console.log(req.body.comm_num + ") - DELETE FROM  " + process.argv[3] + "." + process.argv[2] + "\nWHERE comm_id = " + req.body.comm_id + ";");
			mysql_connection.end();
			res.send('');
		 }
);

var privateKey = fs.readFileSync('keys/server.key');
var certificate = fs.readFileSync('keys/server.crt');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(8000, function(){
  	console.log("Express server listening to port 8000");
});