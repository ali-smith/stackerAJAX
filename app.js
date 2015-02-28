
//UQ --> Applies to Unanswered Questions Form & Functions
//TA --> Applies to Top Answerers Form & Functions
//UQTA --> Applies to both 

$(document).ready( function() {
	
	// (UQ) this function takes the value of the user search 
	// in Unanswered Questions
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});


	// (TA) this function takes the value of the user search 
	// in Top Answerers 
	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tag the user submitted
		var answererTag = $(this).find("input[name='answererTag']").val();
		 (answererTag);
		 console.log($("input[name='answererTag']").val());
    getAnswerer(answererTag);
	});
});

// (UQ) this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

// (TA) this function takes the user object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(object) {

	// clone our result template code
	var result = $('.templates .user').clone();

	// Set the user profile in result
	var userProfile = result.find('.user-profile a');
	userProfile.attr('href', object.user.link);
  	var displayName = result.find('.display-name');
	userProfile.text(object.user.display_name);

	// set the user reputation property in result
	var userReputation = result.find('.user-reputation');
	userReputation.text(object.user.reputation);

	// set the acceptance rate property in result
	var acceptRate = result.find('.acceptance-rate');
	acceptRate.text(object.user.accept_rate);

	// set score property in result
	var score = result.find('.score');
 	score.text(object.score);

	return result;
	
};

// (UQTA) this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// (UQTA) takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// (UQ) takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {			tagged: tags,
							site: 'stackoverflow',
							order: 'desc',
							sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// (TA) takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getAnswerer = function(answererTags) {
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {				
    					site: 'stackoverflow'};
	// 					period: 'all_time'}; <-- instead of here, add to endpoint url: 
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + answererTags + "/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET"
		})
  	// success will trigger this
	.done(function(result){
		// this part calls original function line 49: 
		// var searchResults = showSearchResults(query, resultNum);
    	var searchResults = showSearchResults(answererTags, result.items.length);
   
		// puts the whole chunk of objects returned by StackOverflow into DOM
		$('.search-results').html(searchResults);

		// sorts the objects into cloned <dl> as in showAnswerer function (line 18) 
		$.each(result.items, function(i, item) { 
      		var answerer = showAnswerer(item);
			$('.results').append(answerer);
		});
	})
  	// failure (such as invalid search term) will trigger this. 
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



