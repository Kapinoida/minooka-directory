

/*
	This function is for the auto search tab for the staff and room directory based
	on your Staff Directory spreadsheet.  MAKE SURE that the spreadsheet is public.
*/

// I've reformulated the idea to make a json call one for each database we need so we do not have to keep making called each time a key is pressed.

// Ready function
$( document ).ready(function() {
	
	// This function enables tabs and has it fill the space.
	$(function(){
		$("#tabs").tabs({
			heightStyle: "fill"
		});
	});

	// For button switching
	var groupBool = true;

	// On load, focuses the search field
	$('#search-dir').focus();

	// when tab is clicked, focuses the appropriate search field
	$('#tab-1-button').click(function() {
		$('#search-dir').focus();
	});

	// when tab is clicked, checks the groupBool and focuses appropriately.
	$('#tab-2-button').click(function() {
		if (groupBool == true) {
			$('#search-email').focus();
			$('#email-group-button').css({'background-color': '#00357a', 'color' : '#fff'});
		} else {
			$('#search-ind').focus();
			$('#ind-button').css({'background-color': '#00357a', 'color' : '#fff'});
		}
	});

	// button handling with focus and color changes
	$('#email-group-button').click(function() {
		$('#search-ind').hide();
		$('#search-email').show().focus();
		$(this).css({'background-color': '#00357a', 'color' : '#fff'});
		$('#ind-button').css({'background-color': 'transparent', 'color' : '#00357a'});
		groupBool = true;
		$('#update-email').html('');
	});

	// button handling with focus and color changes
	$('#ind-button').click(function() {
		$('#search-email').hide();
		$('#search-ind').show().focus();
		$(this).css({'background-color': '#00357a', 'color' : '#fff'});
		$('#email-group-button').css({'background-color': 'transparent', 'color' : '#00357a'});
		groupBool = false;
		$('#update-email').html('');
	});

	// Function to group things by whatever, can be used for futher tabs if needed.
	const groupBy = key => array =>
		array.reduce((objectsByKeyValue, obj) => {
			const value = obj[key];
			objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
			return objectsByKeyValue;
		}, {});

	


	// Accordion building
	const accordionify = function() {
		var acc = document.getElementsByClassName("accordion");
		var i;

		for (i = 0; i < acc.length; i++) {
			acc[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				if (panel.style.maxHeight) {
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
				}
			});
		}
	}
	
	// Initiating our storage.	
	var directory,
		sortedGroups,
		sortedInd,
		staff;

	var sortByPosition = function(obj1, obj2) {
		return obj1.position - obj2.position;
		};

	// Calling and sorting our email group
	// 'https://sheets.googleapis.com/v4/spreadsheets/1Mnmkafl-_vg73lQ3beWkSBoBWojLW4wT9mcd02J3IkY/values/1?alt=json'
	$.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1Mnmkafl-_vg73lQ3beWkSBoBWojLW4wT9mcd02J3IkY/values/Sheet+1?alt=json&key=AIzaSyA2XrfCRtOvS0KTKDsRMgAfbPCyU5wGMzQ",
	function(data){
		staff = data.values;

		console.log(staff);
		
		var groupByGroup = groupBy(staff[2]);

		// The grouped list
		//sortedGroups = groupByGroup(staff);

		sortedGroups = {}

		for (var i=0; i < staff.length; i+=1) {
			if (!sortedGroups[staff[i][2]]) {
				sortedGroups[staff[i][2]] = [];
			}
			sortedGroups[staff[i][2]].push(staff[i])
		}

		for (var group in sortedGroups) {
			sortedGroups[group] = sortedGroups[group].sort(sortByPosition);
		}

		sortedInd = {}

		for (var i=0; i < staff.length; i+=1) {
			if (!sortedInd[staff[i][1]]) {
				sortedInd[staff[i][1]] = [];
			}
			sortedInd[staff[i][1]].push(staff[i])
		}

		for (var group in sortedInd) {
			sortedInd[group] = sortedInd[group].sort(sortByPosition);
		}

		console.log(sortedInd);
		
	});

	// calling and sorting our individual for email groups
	//$.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1Mnmkafl-_vg73lQ3beWkSBoBWojLW4wT9mcd02J3IkY/values/Sheet+1?alt=json&key=AIzaSyA2XrfCRtOvS0KTKDsRMgAfbPCyU5wGMzQ",
	//function(data){
		//staff = data.values;
		
		//var groupByInd = groupBy('gsx$name');

		// The grouped list
		//sortedInd = groupByInd(staff);
	//});

	// Calling and storing our directory
	// http://spreadsheets.google.com/feeds/list/1Tc2F7V4dCs3Nq_oeXXv4jwveRnqgr7-yiS40FfxA7NM/1/public/values?alt=json
	// https://sheets.googleapis.com/v4/spreadsheets/1Tc2F7V4dCs3Nq_oeXXv4jwveRnqgr7-yiS40FfxA7NM/values/Sheet+1?alt=json&key=AIzaSyA2XrfCRtOvS0KTKDsRMgAfbPCyU5wGMzQ
	$.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1Tc2F7V4dCs3Nq_oeXXv4jwveRnqgr7-yiS40FfxA7NM/values/Sheet1?alt=json&key=AIzaSyA2XrfCRtOvS0KTKDsRMgAfbPCyU5wGMzQ",
	function(data){
		directory = data.values;
	});


	// Directory search
	$("#search-dir").keyup(function(){
		var searchField = $("#search-dir").val();
		var searchQuery = new RegExp(searchField,"i");

		var output = '<ul class="searchresults">';
		$.each(directory,function(key,val){	
			
			if( ((val[0]).search(searchQuery) != -1) || ((val[2]).search(searchQuery) !=-1))  { //allow for searching of the name, phone extension or email address
			
			
				output += '<li>';
				output += '<h3>' + val[2] + '</h3>';
				output += '<p> <strong>Ext</strong>: ' + val[0] + '</p>';
				output += '<p> <strong>Location:</strong> ' + val[1] + '</p>';
				output += '</li>';
				output += '<hr>';
			}
		})
		output += '</ul>'; 
		$('#update-dir').html(output);
	});
	
	// Search for email groups
	$("#search-email").keyup(function(){
		var searchField = $("#search-email").val();
		var searchQuery = new RegExp(searchField,"i");

		var output = '<div class="searchresults">';

		$.each(sortedGroups, function(key, val) {
			if(key.search(searchQuery) != -1) {

				output += '<button class="accordion">' + key + '</button>';

				output += '<div class="panel">';

				val.forEach(element => {
					output += '<p>' + element[1] + ' - ' + element[0] + '</p>';
				});

				output += '</div>';
			}
		});

		output += '</div>'; 
		$('#update-email').html(output);

		accordionify();

	});

	// Search for individuals
	$("#search-ind").keyup(function(){
		var searchField = $("#search-ind").val();
		var searchQuery = new RegExp(searchField,"i");

		var output = '<div class="searchresults">';

		$.each(sortedInd, function(key, val) {
			if(key.search(searchQuery) != -1) {

				var email = val[0][0];
				output += '<button class="accordion">' + key + ' - ' + email +  '</button>';

				output += '<div class="panel">';

				val.forEach(element => {
					output += '<p>' + element[2] + '</p>';
				});
				
				output += '</div>';
				
			}
		});

		output += '</div>'; 
		$('#update-email').html(output);

		accordionify();

	});



/*

	$("#search-ind").keyup(function(){
		var searchField = $("#search-ind").val();
		var searchQuery = new RegExp(searchField,"i");

		var output = '<ul class="searchresults">';

		$.each(sortedInd, function(key, val) {
			if(key.search(searchQuery) != -1) {

				var email = val[0].gsx$email.$t;

				output += '<li>';
				output += '<h3>' + key + ' - ' + email +  '</h3>';

				val.forEach(element => {
					output += '<p>' + element.gsx$groupname.$t + '</p>';
				});

				output += '</li>';
				output += '<hr>';
			}
		});

		output += '</ul>'; 
		$('#update-email').html(output);
	});

	*/
	

});