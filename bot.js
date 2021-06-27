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
const stream = T.stream('statuses/filter', {
	track: ['joshuapregbaha.wordpress.com', '@botofaweirdo']
});

// Anytime someone tweets about my blog
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {
	if (tweet.user.id === botofaweirdo.id) {
		console.log("This is me");
		return;
		console.log("I'm talking to myself");
	}

	Twitter.like(tweet);

	if (tweet.user.id === me.id) {
		if (tweet.text.toLowerCase().includes('@botofaweirdo') && !(tweet.text.toLowerCase().includes('via'))) {
			if (shouldSendReply()) {
				Twitter.reply(tweet, getReplyToMeTweet(tweet));
			}
			return;
		}
		Twitter.retweet(tweet);
		return;
	}

	if (tweet.retweeted_status) return;

	if (tweet.text.toLowerCase().includes('@botofaweirdo') && !(tweet.text.toLowerCase().includes('via'))) {
		if (shouldSendReply()) {
			Twitter.reply(tweet, getPromotionTweet(tweet));
		}
		return;
	}

	Twitter.reply(tweet, getTweet(tweet));
}



//Tweet twice everyday
const htmlToJson = require('html-to-json'); // import module to convert the html home page of my blog to json

const url = process.env.blog_url; // the url of my blog home page
const fs = require('fs');

const linkParser = htmlToJson.createParser(['a[title]', {
	'text': function ($a) {
		return $a.attr('title');
	},
	'href': function ($a) {
		return $a.attr('href');
	}
}]); // get the links with the titles of the posts and the links

const posts = require('./posts.json'); // get the json file created from the html home page of my blog

if (posts.length === 0) {
	linkParser.request(url).done(function (links) {
		//Do stuff with links
		links = JSON.stringify(links);
		fs.writeFile('posts.json', links, (err) => {
			if (err) throw err;
			console.log('The file has been saved!');
		});
	}); // create a json file with the titles and links of the posts
}

function random_from_array(posts){
	return posts[Math.floor(Math.random() * posts.length)]; // pick a random post
}

const post = random_from_array(posts);
postIndex = posts.indexOf(post);
posts.splice(postIndex, 1);

fs.writeFile('posts.json', JSON.stringify(posts), (err) => {
	if (err) throw err;
	console.log('The file has been updated!');
});

if (post.text != 'To the top') {
	setInterval(function tweetSomething() {
		const tweet = {
			status: post.text + ' ' + post.href
		}

		T.post('statuses/update', tweet, tweeted);

		function tweeted(err, data, response) {
			if (err) {
				console.log(err);
			} else {
				console.log('It worked!');
			}
		}
	}, 1000 * 60 * 60 * 12); // tweet a random post every 12 hours
}


///////////////END SARS///////////////

const endSarsTweets = ['Educational and Economy reform', 'National constitution Reform', 'Debt accountability', 'Security Reform', 'Anti-people policies cancellation', 'Restructuring', 'Save cost of governance'];

const endSarsPost = random_from_array(endSarsTweets);

setInterval(() => {
	const tweet = { status: endSarsPost + ' #EndSARS #EndPoliceBrutality' };

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log('It worked!');
		}  
	}
}, 1000*60*60*6);

const endSarsStream = T.stream('statuses/filter', { track: ['#EndSARS', '#EndPoliceBrutality'] });

function shouldInteract() {
	const randomNumber = Math.floor(Math.random() * 10) + 1;
	if (randomNumber > 8) return true;
	return false;
}

// Anytime someone tweets about ending sars or ending police brutality
/*endSarsStream.on("tweet", tweetSarsEvent);

function tweetSarsEvent(tweet) {
	if ( tweet.user.id === botofaweirdo.id ) {
		console.log("This is me");
		return;
		console.log("I'm talking to myself");
	}

	if (shouldInteract()) {
		Twitter.like(tweet);
		Twitter.retweet(tweet);
	}

	if (tweet.retweeted_status) return;
}*/

///////////////BOT HUMOUR///////////////

/* All jokes are gotten from https://sv443.net/jokeapi/v2/ */

setInterval(() => {
	const jokeURL = "https://v2.jokeapi.dev/joke/Programming,Pun,Spooky";
	let data;
	let joke;

	https.get(jokeURL, (resp) => {
		resp.on('data', (chunk) => {
			data = chunk;
			data = JSON.parse(data);
		});

		resp.on('end', () => {
			if (data.type === "single") {
				joke = { status: data.joke + " #BotHumour" };
			} else {
				joke = { status: data.setup + "\n" + data.delivery + " #BotHumour" };
			}

			T.post('statuses/update', joke, tweeted);
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});

	function tweeted(err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log('It worked!');
		}
	}
}, 1000*60*60*14);