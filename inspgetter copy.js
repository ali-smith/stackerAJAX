$(document).ready( function() {
	
	// this function takes the value of the user search 
	// in Top Answerers (TA)
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

// (TA) this function takes the user object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(object) {//yes

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



// (TA) This function takes the search term you input, and the length of the results and adds it below the search box. 
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;//so query here would be replaced with answerTags and resultNum replaced with result.items.length. and the names here dont matter, as long as they match. works the same. 
	return results;
};

// (UQTA) takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};
// There are different ways to handle 'promises', this is one way. AJAX will return an answer,
// either success/done or error. This function is called in the error/fail method. 

// takes a string of semi-colon separated tags to be searched
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










