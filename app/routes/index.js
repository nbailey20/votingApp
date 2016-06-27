'use strict';

var Twitter = require("node-twitter-api");
var secret;
var access = {token: "", secret: ""};

module.exports = function (app) {
	 var twitter = new Twitter({
        consumerKey: "E8pmOhv8tos5F2KKzRMj83xiG",
        consumerSecret: "PeKXR6fxDuVmLXANTU3e9d0uTzuKpuK0D3rR2NlsvoU8JBH2RM",
        callback: "https://votingapp-bartowski20.c9users.io/user"
    });
	
	app.route("/")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/index.html");	
		});
		

	app.route("/request-token") 
		.get(function (req, res) {
		   twitter.getRequestToken(function(err, requestToken, requestSecret) {
             if (err)
                res.status(500).send(err);
             else {
                secret = requestSecret;
                res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
             }
           });	
		});
		
		
	app.route("/user")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/user.html");
		});
		
		
	app.route("/access-token") 
		.get(function (req, res) {
			var requestToken = req.query.oauth_token,
        	verifier = req.query.oauth_verifier;
        	if (access.token !== "") {
        		twitter.verifyCredentials(access["token"], access["secret"], function(err, user) {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(user);
                });
        	}
        	
        	else {
        		twitter.getAccessToken(requestToken, secret, verifier, function(err, accessToken, accessSecret) {
	            	if (err) {
	                	res.status(500).send(err);
	            	}
	            	else {
	            		access["token"] = accessToken;
	            		access["secret"] = accessSecret;
	                	twitter.verifyCredentials(access["token"], access["secret"], function(err, user) {
	                    if (err)
	                        res.status(500).send(err);
	                    else
	                        res.send(user);
	                	});
	            	}
	        	});	
        	}
		});
		
		
	app.route("/logout")
		.get(function (req, res) {
			access.secret = "";
			access.token = "";
			res.redirect("https://votingapp-bartowski20.c9users.io/");
		});
	
};