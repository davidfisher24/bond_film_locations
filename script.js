/*
SCRIPT FOR JAMES BOND MAP
GOOGLEMAPS ONLOAD SCRIPT CONTENTS
	a. Googlemaps styling Features
	b. Map Initilization
	c. Map functions
		1. Set Points and markers
		2. Remove markers
		3. Add Info Windows
		4. Draw animated polylines (currently in development)
JQUERY FUNCTIONS
	1. Scrolls page up (currently disabled)
	2. scroll page down (currently disabled)
	3. Close information slider
GLOBAL SCOPR FUNCTIONS
	1. Ajax request to turn markers on and off
	2. Ajax request for film location (polylines)
	3. Ajax request for film information (information slider)
	4. URL decoding function for clicked info window links
*/

window.onload = function() {

	
// GOOGLEMAPS STYLING FEATURES
	var styleArray = [
	{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#ffd700"},{"lightness":40}]},
	{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},
	{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
	{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},
	{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},
	{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},
	{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},
	{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"3"},{"weight":"1.48"}]},
	{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},
	{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},
	{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},
	{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},
	{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},
	{"featureType":"water","elementType":"geometry","stylers":[{"color":"#CCCCCC"},{"lightness":12}]}
	]


// MAP INITIALIZATION
	function initMap() {

	  var mapProp = {
	    center:new google.maps.LatLng(36.03,5.21),
	    zoom:3,
	    mapTypeId:google.maps.MapTypeId.TERRAIN,
	    styles:styleArray,
	    disableDefaultUI: true
	  };

// MAP FUNCTIONS

// 1. Function to set the points of the map. Requires the point of the map, the icon needed, the remove array for later use, and the object from the sql database
	  setPoints = function(point,icon,removeArrayIndex,set) {
	  	var icon = icon;  
	  		var marker = new google.maps.Marker({
	   			position: point,
	    		map: map,
	    		icon: icon
	  		});
	 	 	marker.setMap(map); // sets the markers on the map
	 	 	removeArrays[removeArrayIndex].push(marker); // Pushes the markers into a remove array for later removal
	 	 	addInfoWindow(set,marker);  // Adds an info-window using the function below
	  };

// 2. Function to remove the points on the map. Required the array of markers reference
	  removeMarkers = function(markerSet) {
	  	  for(i=0; i < markerSet.length; i++){
    		  markerSet[i].setMap(null);
		  }
		  console.log(markerSet);
		  markerSet.length = 0;
	  }

// 3. Function to add infowindows to the points on the map
	currentWindow = null;  // this is needed to store the current open window so it can be close when another is selected.
	function addInfoWindow(set,marker) {
		  	var boxText = document.createElement("div");
		    boxText.style.cssText = "border:1px solid black; solid black; margin-top:0px;background-color:rgb(155,155,155); color:rgb(0,0,0); padding:4px;box-shadow:2px 2px 2px black;";
		    // Inner html includes the route name and text, taken from the array, and a link made by the route name.
		    boxText.innerHTML = "<h6 class='mapbox'>"+set.setting+"</h6><p class='mapbox'>"+set.film+"</p><a class='mapbox' id='openmodalboxlink' onclick='event.preventDefault(); ajax_call_form_filming_location(this);' href='?"+set.id+"'>Filming Location</a><a class='mapbox' id='openmodalboxlink' onclick='event.preventDefault(); ajax_call_form_film_info(this);' href='?"+set.id+"'>Setting Information</a>";
		    // Sets the options
		  	var myOptions = {
					content: boxText,
					maxWidth: 0,
					pixelOffset: new google.maps.Size(-140, 0),
					zIndex: null,
					boxStyle: { 
						width: "300px",
					},
					closeBoxMargin: "6px 6px 2px 2px",
					closeBoxURL: "img/closecaption.png",
					infoBoxClearance: new google.maps.Size(1, 1),
					isHidden: false,
					pane: "floatPane",
					enableEventPropagation: false
				};
			// Creates the Infobox
		    var infobox = new InfoBox(myOptions);
			// Sets the event listener using the method .open()
			google.maps.event.addListener(marker, 'click', function() {
				if(currentWindow) {
					currentWindow.close(); // if there is a window open, this will close it.
				}
		       	infobox.open(map, marker); // open the current infobox
		       	currentWindow = infobox;  // set the current infobox to the currentwindow variable so it is close when the next is opened
		   	});	
	}
        
// 4. Function to draw an animated polyline
        
        
        // CLICK INTERVAl TO DRAW THE LINE
        drawLine = function(lineStart, lineFinish, dataObject) {
        	currentWindow.close();  //  Closes the current infowindow

        	// NEW VARIABlES NEEDED TO PLOT THE POLYLINE
	        var numberSteps = 1000;  // Number of steps needed to calculate speed
	        var latChange = (lineFinish.lat - lineStart.lat) / numberSteps;  // Change in latitude calcuated by step division
	        var lngChange = (lineFinish.lng - lineStart.lng) / numberSteps;  // Change in longitude calcuated by step division
	        var linePointA = lineStart;  // Definition of starting point to be updated
	        var linePointB = {lat: (linePointA.lat + latChange), lng: (linePointA.lng + lngChange)};  // Defintion of point B which is continuously changed
	        var lineTrip=[linePointA, linePointB];  // Definition of the trip of the polyline which is continuously changed
	        var step = 0;  // The starting point of the step to add to
	        var lineDrawState = setInterval(drawingLine, 1);  // The interval function so that the interval can later be removed
	        var newMapLat = lineStart.lat + ((lineFinish.lat - lineStart.lat) / 2);  // Caluculation of the new map center
	        var newMapLng = lineStart.lng + ((lineFinish.lng - lineStart.lng) / 2);  // Caluculation of the new map center
	        var newMapZoom;  // variable to hold the new map zoom level

	        // SWITCH STATEMENT TO DEFINE THE NEW MAP ZOOM LEVEL BASED ON THE POLYLINE COORDINATES
	        switch(true) {
			    case (Math.abs((lineFinish.lat - lineStart.lat)) < 1):
			        newMapZoom = 7;
			        break;
			    case (Math.abs((lineFinish.lat - lineStart.lat)) < 6):
			        newMapZoom = 6;
			        break;
			    case (Math.abs((lineFinish.lat - lineStart.lat)) < 15):
			        newMapZoom = 5;
			        break;
			    default:
        			newMapZoom = 4;
			}

			// NEW MAP CENTER AND ZOOM LEVELS
	        map.setCenter({
				lat : newMapLat,
				lng : newMapLng,
			});

			map.setZoom (newMapZoom);

			// DRAWING LINE FUNCTION
            function drawingLine(){   
                if (step < numberSteps) {
                    // DEFINES THE POLYLINE
                    linePath = new google.maps.Polyline({
                        path: lineTrip,
                        geodesic: true,
                        strokeColor: '#FFd700',
                        strokeOpacity: 1.0,
                        strokeWeight: 1
                      });
                    animatedPolylines.push(linePath)
                    // SETS THE POLYLINE TO THE MAP
                    linePath.setMap(map);
                    // SETS THE NEW POINTS INTO THE ARRAY
                    linePointA = linePointB;
                    linePointB = {lat: (linePointB.lat + latChange), lng: (linePointB.lng + lngChange)};
                    var path = linePath.getPath().getArray();
                    lineTrip.push(new google.maps.LatLng(linePointA, linePointB));

                    step++;
                } else {
                    clearInterval(lineDrawState);
                    setPoints(lineFinish,'img/mapicongold.png',100,dataObject);  // SETS MARKER TO ARRAY NUMBER 100 (needs to be changed)
                    $('html').one('click', function(){
                   		removeMarkers(removeArrays[15]);
                   		for (i=0; i<animatedPolylines.length; i++) {                           
						  animatedPolylines[i].setMap(null); //or line[i].setVisible(false);
						}
                    });
                }
            };
        };
        
        

	  var map = new google.maps.Map(document.getElementById("map"),mapProp);
	};
	initMap();







// JQUERY EFFECTS 

// HIDE SECTIONS TWO THREE AND FOUR FOR DEVELOPMENT PURPOSES
	$('#sectiontwo').hide();
	$('#sectionthree').hide();
	$('#sectionfour').hide();

// PAGE SCROLL LOCATIONS
	var sectionOne = $('#sectionone').offset().top;
	var sectionTwo = $('#sectiontwo').offset().top;
	var sectionThree = $('#sectionthree').offset().top;
	var sectionFour = $('#sectionfour').offset().top;
// 1. scroll up functions
	$('.up').eq(0).on('click', function() {
		$('body,html').animate({scrollTop:sectionOne},1000);
	});
	$('.up').eq(1).on('click', function() {
		$('body,html').animate({scrollTop:sectionTwo},1000);
	});
	$('.up').eq(2).on('click', function() {
		$('body,html').animate({scrollTop:sectionThree},1000);
	});
// 2. scroll down functions
	$('.down').eq(0).on('click', function() {
		$('body,html').animate({scrollTop:sectionTwo},1000);
	});
	$('.down').eq(1).on('click', function() {
		$('body,html').animate({scrollTop:sectionThree},1000);
	});
	$('.down').eq(2).on('click', function() {
		$('body,html').animate({scrollTop:sectionFour},1000);
	});

// 3. Close the information slider
	$('#closemodalwindow').on('click', function(){
		$('#informationslider').animate({left: "-22.5%"},1000);
	});

} // End of the onload function











// GLOBAL SCOPE //




// AJAX REQUEST TO TURN THE MARKERS ON AND OFF FOR EACG SET
// checks to see of the film title is in the turned on array 
// if it is off, adds a marker to say that this film is turned on, calls ajax to get the data.
// success function calls the setpoints function in the map and sends the map point, the icon, the array index for remove markers, and the object from SQL
// if if is off it calls the remove markers function to take off the markers, and splices the films from the off or on index
    function ajax_request_to_turn_markers_on_and_off(film,trigger) {
    	if (filmsTurnedOn.indexOf(film) == -1) {  // Asks if the film is not in the on/off array
    		trigger.style.color = "rgb(231,174,24)";  // Takes the trigger link and changes the color to gold
    		filmsTurnedOn.push(film); // pushes the film to the on array
    		arrayIndex = filmsTurnedOn.indexOf(film); // Takes the index for the remove array
	        $.ajax({
	        	type:"POST",
	        	url: "ajax_call_for_all_locations_of_film.php", 
	        	data: {'film':film},
	        	success: function(result){ 
	        		result = JSON.parse(result);
	        		for (i = 0; i < result.length; i++) {
	        			var point = new google.maps.LatLng(result[i].setting_lat, result[i].setting_lng);
	        			setPoints(point,'img/mapicon.png', arrayIndex, result[i]); // Calls the set points function
	        		}
		    }});
    	} else if (filmsTurnedOn.indexOf(film) != -1) {  // Asks if the film is not in the on/off array
    		trigger.style.color = "rgb(70,75,71)";  // Takes the trigger link and changes the color to black
    		arrayIndex = filmsTurnedOn.indexOf(film);  // Takes the index for the remove array
    		removeMarkers(removeArrays[arrayIndex]);  // Calls the remove markers function
    		filmsTurnedOn[arrayIndex] = null;  // Turns the film index to null
    	}
    	
    } 

// ARRAYS TO STORE ON/OFF AND REMOVE MARKER DETAILS
	filmsTurnedOn = [];  // Empty set of arrays to store whether the films are on or off
	removeArrays = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
					[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
					[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
					[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
					[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];  // Empty set of arrays to store the markers that need to be removed
	animatedPolylines = [];



	function ajax_call_form_filming_location(id) {
		id = decode_id_from_click_links(id);
		$.ajax({
        	type:"POST",
        	url: "ajax_call_for_film_by_id.php", 
        	data: {'id':id},
        	success: function(result){ 
        		result = JSON.parse(result);
        		valOne = Number(result[0].setting_lat)
        		valTwo = Number(result[0].setting_lng)
        		valThree = Number(result[0].filming_lat)
        		valFour = Number(result[0].filming_lng)
        		var lineStart = {lat: valOne, lng: valTwo}
        		var lineFinish = {lat: valThree, lng: valFour}
	        	drawLine(lineStart,lineFinish,result[0]);
	    }});
	}

	function ajax_call_form_film_info(id) {
		id = decode_id_from_click_links(id);
		$.ajax({
        	type:"POST",
        	url: "ajax_call_for_film_by_id.php", 
        	data: {'id':id},
        	success: function(result){ 
        		result = JSON.parse(result);
        		$("#info1").html(result[0].setting);
        		$("#info2").html("Film: " + result[0].film);
        		$("#info3").html("Latitude: " + result[0].setting_lat);
        		$("#info4").html("Longitude: " + result[0].setting_lng);
        		$("#info5").html(result[0].setting_details);
        		$("#info6").html("Filmed In " + result[0].filming);
        		$('#informationslider').animate({left: "0"},1000);
        		$('#map').one('click', function(){
        			$('#informationslider').animate({left: "-22.5%"},1000);
        		})
	    }});
	}


	function decode_id_from_click_links(link) {
		var id = decodeURIComponent(link);
		id = id.split("?",2);
		id = id[1];
		return id;
	}




	  







