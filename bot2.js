/*Save the details of anybody that tweets things containing my blog website*/
/*function viewUserDetails(tweet) {
	var fs = require('fs');
	var json = JSON.stringify(tweet, null, 2);
	fs.writeFile('tweet.json', json, (err) => {
	  if (err) throw err;
	  console.log('The file has been saved!');
	});
}



function tweetSomething(txt) {
	var tweet = {status : txt}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log('Something went wrong');
		} else {
			console.log('It worked!');
		}  
	}
}

var params = { 
	q: 'rainbow', 
	count: 2 
}

T.get('search/tweets', params, gotData); //tells Twitter to search for tweets

function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	}
}*/