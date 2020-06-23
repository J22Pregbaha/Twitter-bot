console.log("working");
/* ******************

 Fixes for Heroku
 See http://stackoverflow.com/a/31094668

 ******************* */

 const express = require('express');
 const app = express();
 app.set('port', (process.env.PORT || 5000));
 app.get('/', function (request, response) {
 	var result = 'App is running'
 	response.send(result);
 }).listen(app.get('port'), function () {
 	console.log('App is running, server is listening on port ', app.get('port'));
 });


/* ******************

 The Setup

 ******************* */
const T = require('./config'); //import statement
const Twitter = require('./twitter'); //import statement

/* ******************

 Key variables

 ******************* */
 const me = {
 	id: 2725238596,
 	screen_name: 'JPregbaha'
 };

 const botofaweirdo = {
 	id: 1265455946442117000,
 	screen_name: 'botofaweirdo'
 };

 const emojis = ['👊', '🙌', '👍', '👌', '👯', '🥰', '😁'];

/* ******************

 General Functions

 ******************* */
 function shouldSendReply() {
 	const randomNumber = Math.random();
 	if (randomNumber > 0.2) return true;
 	return false;
 }

 function getEmoji() {
 	return emojis[Math.floor(Math.random() * emojis.length)];
 }

 function getTweet(tweet) {
 	const text = `You are appreciated ${ getEmoji() }`;
 	return text;
 }

 function getPromotionTweet(tweet) {
 	const text = `Hi there,${ getEmoji() }. Want to read some cool stories and maybe some weird thoughts? Visit joshuapregbaha.wordpress.com`;
 	return text;
 }

 function getReplyToMeTweet(tweet) {
 	const text = 'Leave me alone';
 	return text;
 }

// Setting up a tweet stream
const stream = T.stream('statuses/filter', { track: ['joshuapregbaha.wordpress.com', '@botofaweirdo'] });

// Anytime someone tweets about my blog
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {
	if ( tweet.user.id === botofaweirdo.id ) {
		console.log("This is me");
		return;
		console.log("I'm talking to myself");
	}

	Twitter.like(tweet);

	if ( tweet.user.id === me.id ) {
		if ( tweet.text.toLowerCase().includes('@botofaweirdo') && !(tweet.text.toLowerCase().includes('via')) ) {
			if ( shouldSendReply() ) {
				Twitter.reply(tweet, getReplyToMeTweet(tweet));
			}
			return;
		}		
		Twitter.retweet(tweet);
		return;
	}

	if ( tweet.retweeted_status ) return;

	if ( tweet.text.toLowerCase().includes('@botofaweirdo') && !(tweet.text.toLowerCase().includes('via')) ) {
		if ( shouldSendReply() ) {
			Twitter.reply(tweet, getPromotionTweet(tweet));
		}
		return;
	}

	Twitter.reply(tweet, getTweet(tweet));
}



//Tweet once everyday
var htmlToJson = require('html-to-json');
var posts = require('./posts.json');
var url = process.env.blog_url;

var linkParser = htmlToJson.createParser(['a[title]', {
	'text': function ($a) {
		return $a.attr('title');
	},
	'href': function ($a) {
		return $a.attr('href');
	}
}]);

linkParser.request(url).done(function (links) {
	//Do stuff with links
	console.log(links);
	var fs = require('fs');
	links = JSON.stringify(links);
	fs.writeFile('posts.json', links, (err) => {
		if (err) throw err;
	  	console.log('The file has been saved!');
	});
});

function random_from_array(posts){
	return posts[Math.floor(Math.random() * posts.length)];
}

var post = random_from_array(posts);

if (post.text != 'To the top') {
	setInterval(function tweetSomething() {
		var tweet = {status : post.text + ' ' + post.href}

		T.post('statuses/update', tweet, tweeted);

		function tweeted(err, data, response) {
			if (err) {
				console.log(err);
			} else {
				console.log('It worked!');
			}  
		}
	}, 1000*60*60*24);
}