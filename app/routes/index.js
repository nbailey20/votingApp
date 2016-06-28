'use strict';

var Twitter = require("node-twitter-api");
var secret;
var access = {token: "", secret: ""};
var ObjectId = require("mongodb").ObjectId;

module.exports = function (app, db) {
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
		   //twitter.getRequestToken(function(err, requestToken, requestSecret) {
     //        if (err)
     //           res.status(500).send(err);
     //        else {
     //           secret = requestSecret;
     //           res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
     //        }
     //      });
    		res.redirect("https://votingapp-bartowski20.c9users.io/user");
		});
		
		
	app.route("/access-token") 
		.get(function (req, res) {
			var requestToken = req.query.oauth_token,
        	verifier = req.query.oauth_verifier;
        	// if (access.token !== "") {
        	// 	twitter.verifyCredentials(access["token"], access["secret"], function(err, user) {
         //           if (err)
         //               res.status(500).send(err);
         //           else
         //           	console.log(user);
         //               res.send(user);
         //       });
        	// }
        	
        	// else {
        	// 	twitter.getAccessToken(requestToken, secret, verifier, function(err, accessToken, accessSecret) {
	        //     	if (err) {
	        //         	res.status(500).send(err);
	        //     	}
	        //     	else {
	        //     		access["token"] = accessToken;
	        //     		access["secret"] = accessSecret;
	        //         	twitter.verifyCredentials(access["token"], access["secret"], function(err, user) {
	        //             if (err)
	        //                 res.status(500).send(err);
	        //             else
	        //                 res.send(user);
	        //         	});
	        //     	}
	        // 	});	
        	// }
        	res.send("Nathan");
		});
		
		
	app.route("/logout")
		.get(function (req, res) {
			access.secret = "";
			access.token = "";
			res.redirect("https://votingapp-bartowski20.c9users.io/");
		});
	
	
	app.route("/user")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/user.html");
		});
		
		
	app.route("/mypolls")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/mypolls.html");	
		})
		.post(function (req, res) {
			var polls = db.collection("polls");
			polls.find({createdby: req.body.id}).toArray(function (err, docs) {
				if (err) throw err;
				console.log(docs);
				res.send(docs);
			});
				
		});
		
		
	app.route("/newpoll")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/newpoll.html");	
		});
		
		
	app.route("/make-poll")
		.post(function (req, res) {
			var title = req.body.title;
			var choices = req.body.choices;
			choices = choices.substr(1, choices.length-2).split(",");
			var author = req.body.author;
			
			var polls = db.collection("polls");
			polls.insert({title: title, choices: choices, createdby: author});
			var id;
			polls.find().sort({_id: -1}).limit(1).toArray(function (err, docs) {
				if (err) throw err;
				id = JSON.stringify(docs[0]["_id"]);
				res.send(id);
			});
		});
		
		
	app.route("/poll/:ID")
		.get(function (req, res) {
			var pageID = req.params.ID;	
			console.log(pageID);
			var polls = db.collection("polls");
			polls.find({"_id": ObjectId(pageID)}).toArray(function (err, docs) {
				if (err) throw err;
				res.send(JSON.stringify(docs));
			});
		});
};