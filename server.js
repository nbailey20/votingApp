'use strict';

var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var routes = require("./app/routes/index.js");
var mongo = require("mongodb").MongoClient;
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var app = express();

mongo.connect("mongodb://localhost:27017/clementinejs", function (err, db) {
    if (err) throw err;
    app.use("/public", express.static(process.cwd() + "/public"));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
    app.use(session({ secret: "ineedtocutthewatermelon" }));
	app.use(passport.initialize());
	app.use(passport.session());
    routes(app, db);
    
    passport.use('twitter', new TwitterStrategy({
	    consumerKey: "E8pmOhv8tos5F2KKzRMj83xiG",              
		consumerSecret: "PeKXR6fxDuVmLXANTU3e9d0uTzuKpuK0D3rR2NlsvoU8JBH2RM",					
	    callbackURL: "https://votingapp-bartowski20.c9users.io/auth/twitter/callback"
	  },
	  function(token, tokenSecret, profile, done) {
	  	var Users = db.collection("clients");
	    Users.findOne({ twitterid: profile.id }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                user = {
                	twitterid: profile.id,
                    name: profile.displayName
                };
                Users.insert({twitterid: user.twitterid, name: user.name});
                return done(err, user);
                }
            else {
                return done(err, user);
            }
        });
	  }
	));
	
	passport.serializeUser(function(user, done) {  
    	done(null, user.twitterid);
	});

	passport.deserializeUser(function(id, done) {  
		var Users = db.collection("clients");
    	Users.findOne({ twitterid: id }, function (err, user) {
    	    //console.log(JSON.stringify(user));
        	done(err, user);
    	});
	});
    
    app.listen(8080, function () {
    	console.log("App listening on port 8080...");	
    });
});