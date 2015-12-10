//GROUP PROJECT SERVER

//SET UP FOUNDATIONS OF THE SERVER

// Express initialization
var express = require('express');
// set up app, bodyParser & validator to allow HTTP query or post parameters
var app = express();
var bodyParser = require('body-parser');
var io = require('socket.io');
//used to validate strings as different kinds of objects
var validator = require('validator');
//middleware allows parsing of post data
app.use(bodyParser.json());
//extended bodyParser option
app.use(bodyParser.urlencoded({extended:true}));

//SET UP DATABASE

//set up mongoURI to initially try process.env.MONGOLAB_URI, then if that does
//not work, fall back on process.env.MONGOHQ_URL or the database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';

//'mongodb://heroku_hlhd6759:3xTszgfcf@ds053794.mongolab.com:45054/heroku_z000x4p1'; 
//MongoDB client that allows connection pooling (allows sharing of cached
//data in the database)
var mongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = mongoClient.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

//global variable that will create new groups based on this inreasing counter, users in group 0 count as unmatched 
var group_counter = 1;


const MIN_GROUP = 2;
//DEFINE API's

app.post('/inDatabase', function(request, response) {

	// allow cross-origin resource sharing
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	// pull out sent information
	var fName = request.body.fName;
	var userId = request.body.userId;
	// creates an object to enter into the database
	var toInsert = {
		"user":fName,
		"fId":userId,
		"music":null,
		"lat": null,
		"lng":null,
		"skill":null,
		"group":0
		//group 0 represents unmatched groups 
	};
	db.collection('users', function(error, coll) {
		coll.find({fId:userId}).toArray(function(error, results) {
			//are you in the database?
			if(results.length==0) {
				var id = coll.insert(toInsert, function(error, saved){
					response.send('{"settings":"false"}');
				});
			} else {
				//have you filled out settings?
				if(results[0].music==undefined) {
					response.send('{"settings":"false, choose instrument"}');
				} else {
					response.send('{"settings":"true"}');
				}
			}
			
		});

	});

});


// defines the reaction when someone tries to post information to the server
app.post('/match', function(request, response) {

	// allow cross-origin resource sharing
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	// pull out sent information
	var userId = request.body.userId; // will have to use a cookie to store and get this.
	var instrument = request.body.instrument;
	var skill = request.body.skill;
	var lng = request.body.lng;
	var lat = request.body.lat;

	// puts data in the database if it is all defined and not blank and if the integers aren't random strings 
	if ((lat != undefined) || (lat != "") || (lng != undefined)  || (lng != "")|| (instrument != "") ||(instrument != undefined) || (skill != undefined) || (skill != "") || (isNaN(lat)==true) || (isNaN(lng)==true) || (isNaN(skill)==true))	 {

		// parses the passed lat and lng so they can be used as numbers
		//var lat = parseInt(lat, 10);
		//var lng = parseInt(lng, 10);	
		//var skill = parseInt(skill, 10);


		db.collection('users', function(error, collection){

			//update the users information on their skill, instrument, and location
			collection.update(
				{fId:userId}, // it finds the account using the facebook id
				{$set : {
					// updates these fields in the user's account 
					music:instrument, 
					lat:lat,
					lng:lng,
					skill:skill,
				}},
				{upsert:true} // does not create a new entry if it cannot find one
				);

			/* returns your new information. TEST ONLY 
			collection.find({fId:userId}).toArray(function(error, results){
				response.send(JSON.stringify(results));
			});   */

		});
		// calls the match function everytime a new user is inputted into the database
		match(userId,instrument,lat, lng, skill);
		response.status(200).send(JSON.stringify({"success":"no issues with your data"}));
	// sends error message if the data passed was incorrect
	} else {

		response.status(500).send('{"error":"Whoops, something is wrong with your data!"}');	
	}


});

/*this function will run whenever a new user is added. It will attempt to match the user with other non grouped members in groups of three. If it can't find 3 matches, then it will just not match you */
function match(userId, instrument, lat, lng, skill, response){

var matches = [];

db.collection('users', function(error, collection){


	collection.find({group:0}).toArray(function(error, results){
	//use mongo to find those in group 0
		if(results.length>0){

			// loops through all of the unmatched users in the database to determine if they are a match
			for (var i = 0; i < results.length; i++) {
				if ((results[i].music != instrument) && (how_far(lat, lng, results[i].lat, results[i].lng) < 10) && (Math.abs(skill - results[i].skill) < 3)) {
					// adds the user to the matched array if theymeet the 
					matches.push(results[i]);
					
				}
			}
			if (matches.length>=MIN_GROUP){ // if it passes the minimum requirement 

				//add the initial user into the group of matches as well
				collection.find({fId:userId}).toArray(function(error,results){
					matches.push(results[0]);

					// loop through the matched group and update their group number so that they are connected 
					for (var i = 0;i<matches.length;i++){
						collection.update(
							{fId:matches[i].fId},
							{$set: {
							group:group_counter
							}},
						{upsert:false}
						);
				}
				group_counter++; // group counter increasing because that group was already created

				/*
					collection.find({group:results[0]}).toArray(function(error, matches){
						response.send(JSON.stringify(matches));

					}); */
				}); 

			}
			else{
				console.log("not enough people to make a group");
			}
		}
		else{
			console.log("there was an error in matching");
		}
	});

	
});
}

// uses the haversine formula to calculate the distance between two users.
// this distance is calculated in miles
function how_far (lat, lng, lat2, lng2) {

	var R = 3959;
	var latF1 = lat * Math.PI/180;
	var latF2 = lat2 * Math.PI/180;
	var deltaLat = (lat2 - lat) * Math.PI/180;
	var deltaLng = (lng2 - lng) * Math.PI/180;
	var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.cos(latF1) * Math.cos(latF2) * Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	//Returned in miles 
	return d;
}

app.listen(process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Node app is running');
});






// function is used to make sure the user is not being matched with the same other user who inserted their data multiple times
// the user should be matched with each other applicable user once
function already_matched (person, array) {
	
	var index = array.indexOf(person);
	if(index == -1) return false;
	else return true;


}

//CODE FOR ORIGINAL /MATCH FUNCTION 
	/*
		// works with the collection 'biscuit' to store data
		db.collection('biscuit', function(error, coll) {
	
			// tries to insert the user's data into the collection
			// as a new document
			var id = coll.insert(toInsert, function(error, saved) {
				
				// sends error if information not properly inserted into database
				if (error) {

					var error = '{"error":"Whoops, something is wrong with your data!"}';
					response.status(500).send(error);
			
				// sends data if information properly inserted
				} else {

					// at this point, we can assume the data has been properly inserted into the collection biscuit
					// this finds all of the entries in the database and returns them
					coll.find({}).toArray(function(error, results) {

						if(error) {
							var error = '{"error"}';
							response.status(500).send(error);

						// this should look for someone in the results array who is within 10 miles 
						// of the current user and who does not play the same instrument and who is 
						// a similar skill level 
						} else {

							var matches = [];
			
							// loops through all of the users in the database to determine if they are a match
							for (i = 0; i < results.length; i++) {

								if ((results[i].instrument != instrument) && 
									(how_far(lat, lng, results[i].lat, results[i].lng) < 10) &&
									(Math.abs(skill - results[i].skill) < 3) &&
									(already_matched(results[i].user, matches) == false)) {

									// adds the user to the matched array if they meet the 
									// proper criteria
									matches[matches.length] = results[i].user;
								}
							}

							// returns JSON format of matched array
							var to_return = "'" + matches + "'";
							response.status(200).send(to_return);	
						}

					});
		
				}
			});

		}); */





//ORIGINAL DB FUNCTION
	// works with the collection 'biscuit' to store data
/*	db.collection('test', function(error, coll) {

		var id = coll.insert(toInsert, function(error, saved) {
				
			// sends error if information not properly inserted into database
			if (error) {

				var error = '{"error":"Whoops, something is wrong with your data!"}';
				response.status(500).send(error);
			
			// sends data if information properly inserted
			} else {

				// at this point, we can assume the data has been properly inserted into the collection biscuit
				// this finds all of the entries in the database and returns them
				coll.find({"id":id}).toArray(function(error, results) {

					if(error) {
						response.status(200).send('{false}');
					} else {
						response.status(200).send('{true}');
					}
			
				});

			}

		});

	});		*/			

//});



//SOCKET IO CODE - TO BE IMPLEMENTED LATER 
/*
var io = require('socket.io');

io.sockets.on('connection', function(socket){

	//create a global array of users who are connected to the socket.io userserver   

	socket.on('newuser', function(userInfo){
		
		//set the value for this socket's room
		socket.room = userInfo[0];

		//join the desired room 
		socket.join(userInfo[0]);

		//add them to the global array of connected users. 

		// get the cursor for the chat history of the room and then return it to the client 
		db.collection(socket.room, function(error, collection){
			collection.find().toArray()(function(error, cursor){
				socket.emit('updatechat', cursor);
			});

		});

	});


	socket.on('sendmessage', function(data){

		//open up mongodb 
		db.collection(socket.room, function(error,collection){

			//insert their message, data, into the mongodb collection for their specific oom 
			var id = collection.insert(data, function(error, saved){

				if (error){
				
					//send back an error message if not done properly 
					errorData = {"error":"Whoops! Your message could not be sent"};
					socket.emit('error', errorData);
				}
			});

			//then put the newly updated collection into an array and send the cursor back to the client to update the messages 
			collection.find().toArray()(function(error,cursor){
				io.sockets.in(socket.room).emit('updatechat', cursor);
			});
 

		}); 

	});
	socket.on('disconnect', function(){
		//remove the client from the array of connected users 


		//echo that the client has left. this does not need to be addressed in the client side just yet, but rather for us developers to know that this client has left 
		//io.sockets.emit('updateusers', /*array of usernames*/ /*);

		//leave the room 	
		socket.leave(socket.room);
	});

});	*/
