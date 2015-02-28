$(document).ready( function() {
	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tag the user submitted
		var answererTag = $(this).find("input[name='answererTag']").val();
		 (answererTag);
		 console.log($("input[name='answererTag']").val());
	});
});

// this function takes the user object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(user) {

	// clone our result template code
	var result = $('.templates .user').clone();

	// Set the user profile in result
	var userProfile = result.find('.user-profile a');
	userProfile.attr('href', user.link);
	userProfile.text(user.display_name);

	// set the user reputation property in result
	var userReputation = result.find('.user-reputation');
	userReputation.text(user.reputation);

	// set the acceptance rate property in result
	var acceptRate = result.find('.acceptance-rate');
	acceptRate.text(user.accept_rate);

	// set score property in result
	var score = result.find('.score');
	score.text(user.score);

	return result;
	
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};



// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getAnswerer = function(answererTags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {				tag: tags,
								site: 'stackoverflow',
								period: 'all_time'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/{tag}/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tag, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var user = showAnswerer(item);
			$('.results').append(user);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



