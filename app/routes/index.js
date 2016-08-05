'use strict';

//var access = {token: "", secret: ""};
//var user = {name: "", id: ""};
var pollID = "";

module.exports = function (app, db) {
	var ObjectId = require("mongodb").ObjectId;
	var passport = require("passport");
    
	app.route("/")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/index.html");	
		});
		
		
	app.get('/auth', passport.authenticate('twitter'));
	
	
	app.post("/savepoll", function (req, res) {
		pollID = req.body.id;	
		res.send("ok");
	});
	
	
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/' }), function (req, res) {
		if (pollID !== "") {
			res.redirect("/poll/" + pollID);
		}
		else {
			res.redirect("/user");
		}
	});
		
		
	
	app.post("/cred", function (req, res) {
		console.log(req.user);
		res.send(req.user);	
	});
		
		
	app.route("/logout")
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
	
	
	app.route("/user")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/user.html");
		})
		.post(function (req, res) {
			var polls = db.collection("polls");
			polls.find({createdby: {$exists: true}}).toArray(function (err, docs) {
				if (err) throw err;
				res.send(docs);
			});
		});
		
		
	app.route("/mypolls")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/mypolls.html");	
		})
		.post(function (req, res) {
			var polls = db.collection("polls");
			polls.find({createdby: req.body.id}).toArray(function (err, docs) {
				if (err) throw err;
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
			var votes = req.body.votes;
			votes = JSON.parse(votes);
			

			var polls = db.collection("polls");
			polls.insert({title: title, choices: choices, createdby: author, votes: votes});
			var id;
			polls.find().sort({_id: -1}).limit(1).toArray(function (err, docs) {
				if (err) throw err;
				id = JSON.stringify(docs[0]["_id"]);
				res.send(id);
			});
		});
		
		
	app.route("/poll/:ID")
		.get(function (req, res) {
			var ID = req.params.ID;
			var polls = db.collection("polls");
			polls.find({"_id": ObjectId(ID)}).toArray(function (err, docs) {
				if (err) throw err;
				if (docs.length !== 0) {
					res.sendFile(process.cwd() + "/public/poll.html");
				}
				else {
					if (req.user) {
						if (req.user.twitterid) {
							res.send("Not a valid poll, please use <a href='https://votingapp-bartowski20.c9users.io/user'>this</a> button to get out of uncharted territory!");
						}
						else {
							res.send("Not a valid poll, please use <a href='https://votingapp-bartowski20.c9users.io/'>this</a> button to get out of uncharted territory!");
						}
					}
					else {
						res.send("Not a valid poll, please use <a href='https://votingapp-bartowski20.c9users.io/'>this</a> button to get out of uncharted territory!");
					}
				}
			});
		})
		.post(function (req, res) {
			var ID = req.params.ID;
			var polls = db.collection("polls");
			polls.find({"_id": ObjectId(ID)}).toArray(function (err, docs) {
				if (err) throw err;
				var obj = {title: docs[0].title, choices: docs[0].choices, votes: docs[0].votes, loggedIn: "no"};
				obj["createdby"] = docs[0].createdby;
				obj["user"] = req.user;
				res.send(obj);
			});
		});
		
		
	app.route("/vote") 
		.post(function (req,res) {
			var vote = req.body.vote;
			console.log(req.body);
			var pollID = req.body.id;
			var polls = db.collection("polls");
			if (req.body.choice) {
				polls.update({"_id": ObjectId(pollID)}, {$push: {choices: req.body.choice}});
				var hack = {};
				hack['votes.' + vote] = 1;
				polls.update({"_id": ObjectId(pollID)}, {$inc: hack});
				res.send(vote);
			}
			else {
				var hack = {};
				hack['votes.' + vote] = 1;
				polls.update({"_id": ObjectId(pollID)}, {$inc: hack});
				res.send(vote);
			}
			
		});
		
		
	app.route("/deletePoll")
		.post(function (req, res) {
			var id = req.body.id;
			var polls = db.collection("polls");
			polls.remove({"_id": ObjectId(id)}, true);
			res.send("removed");
		});
		
	
	app.get("/badbad", function (req, res) {
		var clients = db.collection("clients");
		clients.drop();
		res.send("ok");
	});
};

