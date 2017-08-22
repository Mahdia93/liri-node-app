// var Twit = require('twit');

// var Keys = require('/Users/mahdia/Class Homework/LIRI-HW/liri-node-app/keys.js');
// console.log(Keys);
// var T = new Twit(Keys);


// T.get("statuses/user_timeline/", { screen_name: 'kittypizza24' },  function (err, data, response) {
//   console.log(data)
// });
//   
var key = require("./keys.js")
var Spotify = require('node-spotify-api');
var request = require("request");
var Twitter = require('twitter');
var fs = require("fs");
var queryUrl;
var songName;
var artistName;
var albumName;
var songPreview;
var songInput = "";
var movieName = "";
var twitterName = "";
var textArr = 0;
var nodeArgs = process.argv;

function myTweets()
{
	var client = new Twitter({
	  consumer_key: key.twitterKeys.consumer_key,
	  consumer_secret: key.twitterKeys.consumer_secret,
	  access_token_key: key.twitterKeys.access_token_key,
	  access_token_secret: key.twitterKeys.access_token_secret
	 });

			for (var i = 3; i < nodeArgs.length; i++) 
			{

				 if (i > 3 && i < nodeArgs.length) 
				 {

				   twitterName = twitterName + " " + nodeArgs[i];

				 }
				 else 
				 {
				  	
				   twitterName += nodeArgs[i];

				 }
			}	
			if(process.argv[3] == null && textArr === 0)
	  		{
	  			twitterName = "kittypizza24";
	  		}		

	//for some reason, only pulls the last 13 tweets. Good enough right?
	client.get('search/tweets', {q: twitterName, count: 20}, function(error, tweets, response) {
		for(var i = 0; i<tweets.statuses.length; i++)
		{
	   console.log("Tweet: " + tweets.statuses[i].text);
	   console.log("Created at: " + tweets.statuses[i].created_at + "\n");
	}

	});

}

function spotifyThisSong()
{
	var spotify = new Spotify({
	  id: key.spotifyKeys.id,
	  secret: key.spotifyKeys.secret
	});

			for (var i = 3; i < nodeArgs.length; i++) 
			{

			  if (i > 3 && i < nodeArgs.length) 
			  {

			    songInput = songInput + " " + nodeArgs[i];

			  }
			
			  else
			  {

			    songInput += nodeArgs[i];

			  }
			}	
			if(process.argv[3] == null && textArr === 0)
			  {
			  	songInput = "Thunder";
			  }

	
		console.log(songInput)
	spotify.search({ type: 'track', query: songInput }, function(err, response) {
	  if (err) 
	  {
	    return console.log('Error occurred: ' + err);
	  }
	  	
		songName = JSON.stringify(response.tracks.items[0].name, null, 2);
		artistName = JSON.stringify(response.tracks.items[0].artists[0].name, null, 2);
		albumName = JSON.stringify(response.tracks.items[0].album.name, null, 2);
		songPreview = JSON.stringify(response.tracks.items[0].preview_url, null, 2);

		console.log("\n Song name: " + songName + "\n Artist name: " + artistName + "\n Album name: " + albumName + "\n Song preview URL: " + songPreview + "\n");

	});
}


function movieThis()
{ 

	
	for (var i = 3; i < nodeArgs.length; i++) 
	{
		if (i > 3 && i < nodeArgs.length) 
		  {

		    movieName = movieName + "+" + nodeArgs[i];

		  }

		  else 
		  {

		    movieName += nodeArgs[i];
		  }	
	}
	if(process.argv[3] == null && textArr === 0)
	  {
	  	movieName = "Guardians of the Galaxy Vol. 2";
	  }
		console.log(movieName)

	queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";


	request(queryUrl, function(error, response, body) {

	  if (!error && response.statusCode === 200) 
	  {
		console.log("\n Title: " + JSON.parse(body).Title + "\n Release Year: " + JSON.parse(body).Year + "\n Rating: " + JSON.parse(body).Rated 
		+ "\n IMDB Rating: " + JSON.parse(body).Ratings[0].Value + "\n Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value 
		+ "\n Produced in: " + JSON.parse(body).Country + "\n Language: " + JSON.parse(body).Language + "\n Plot: " + JSON.parse(body).Plot 
		+ "\n Actors: " + JSON.parse(body).Actors);
	  }
	});
}


function doWhatItSays()
{
	fs.readFile("random.txt", "utf8", function(error, data){
		if(error)
		{
			return console.log(error);
		}
		textArr = data.split(",");
		console.log(textArr)
		
		if(textArr[0] === "spotify-this-song")
		{
			songInput = textArr[1];
			spotifyThisSong();
			
		}
		else if(textArr[0] === "movie-this")
		{
			movieName = textArr[1];
			movieThis();
		}
		
		else if(textArr[0] === "my-tweets")
		{
			twitterName = textArr[1];
			myTweets();
		}	
		else
		{
			console.log("Change text in random.txt in this format: <Enter command name>, <'Enter song name'>");
		}
	});
}

 //"Thunder"
if(process.argv[2] === "spotify-this-song")
{
	console.log("calling spotifyThisSong")
	spotifyThisSong();
}
//"Gaurdians of the galaxy"
else if(process.argv[2] === "movie-this")
{
	console.log("calling movieThis")
	movieThis();
}
else if(process.argv[2] === "my-tweets")
{
	console.log("calling myTweets")
	myTweets();
}

else if(process.argv[2] === "do-what-it-says")
{
	console.log("calling doWhatItSays")
	doWhatItSays();
}
else
{
	console.log("Enter one of the following commands: \n spotify-this-song <Enter song name> \n movie-this <Enter movie name> \n my-tweets <Enter twitter name> \n do-what-it-says (change text in commands.txt to see what happens! COPY THE SAME FORMAT)");
}
