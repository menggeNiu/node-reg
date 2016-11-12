var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var server = http.createServer(handle).listen(3000);

function handle(req, res) {
	var filepath = '';
	if (req.url == '/') {
		filepath = './public/html/login.html';
		fs.readFile(filepath, 'utf-8', function(err, data) {
			if (err) {
				return
			}
			res.end(data);
		})
	} else if (req.method == 'POST') {
		if (req.url.indexOf('form') != -1) {

			var postData = '';
			req.on('data', function(chunk) {
				postData += chunk;
			})
			req.on('end', function() {
				postData = querystring.parse(postData);
				var username = postData.username;
				var password = postData.password;
				fs.readFile('./data.json', 'utf-8', function(err, data) {
					if (err) {
						return
					}
					var data = JSON.parse(data);
					var users = data.users;
					if (users.length == 0) {
						filepath = './public/html/reg.html';
					} else {
						for (var i = 0; i < users.length; i++) {
							if (users[i].username == username && users[i].password == password) {
								// 有账户 登录
								filepath = './public/html/logined.html';
							} else {
								filepath = './public/html/reg.html';
							}
						}
					}
					fs.exists(filepath, function(exists) {
						if (exists) {
							fs.readFile(filepath, 'utf-8', function(err, data) {
								if (err) {
									return
								}
								res.end(data);
							})
						}
					})
				})
			})
		} else if (req.url.indexOf('reg') != -1) {
			var postData = '';
			req.on('data', function(chunk) {
				postData += chunk;
			})
			req.on('end', function() {
				postData = querystring.parse(postData);
				var username = postData.username;
				var email = postData.email;
				var qq = postData.number;
				var password = postData.password;
				if (username == '' || email == '' || qq == '' || password == '') {
					return
				} else {
					var obj = {};
					obj.username = username;
					obj.password = password;
					obj.qq = qq;
					obj.email = email;
					fs.readFile('./data.json', 'utf-8', function(err, data) {
						if (err) {
							return
						}
						var data = JSON.parse(data);
						var users = data.users;
						data.users.push(obj);
						fs.writeFile('./data.json', JSON.stringify(data), function() {
							fs.readFile('./public/html/login.html', function(err, data) {
									if (err) {
										return
									}
									res.end(data);
								})
								// filepath = './public/html/login.html';
						})
					})
					fs.exists(filepath, function(exists) {
						if (exists) {
							fs.readFile(filepath, 'utf-8', function(err, data) {
								if (err) {
									return
								}
								res.end(data);
							})
						}
					})
				}
			})
		}
	} else if (req.url == '/reg.html') {
		filepath = './public/html/reg.html';
		fs.readFile(filepath, 'utf-8', function(err, data) {
			if (err) {
				return
			}
			res.end(data);
		})
	} else {
		filepath = './public' + req.url;
		fs.exists(filepath, function(exists) {
			if (exists) {
				fs.readFile(filepath, function(err, data) {
					if (err) {
						return
					}
					res.end(data)
				})
			} else {
				send404(res);
			}
		})
	}
}

function send404(res) {
	fs.readFile('./public/html/404.html', 'utf-8', function(err, data) {
		if (err) {
			return
		}
		res.end(data);
	})
}