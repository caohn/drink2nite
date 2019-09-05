(function($){
	$.fn.mapmarker = function(options){
		var opts = $.extend({}, $.fn.mapmarker.defaults, options);

		return this.each(function() {
			// Apply plugin functionality to each element
			var map_element = this;
			addMapMarker(map_element, opts.zoom, opts.center, opts.markers);
		});
	};
	
	// Set up default values
	var defaultMarkers = {
		"markers": []
	};

	$.fn.mapmarker.defaults = {
		zoom	: 8,
		center	: 'United States',
		markers	: defaultMarkers
	}
	
	// Main function code here (ref:google map api v3)
	function addMapMarker(map_element, zoom, center, markers){
		//console.log($.fn.mapmarker.defaults['center']);
		
		//Set center of the Map
		var myOptions = {
		  zoom: zoom,
		  scrollwheel: false,
		  scaleControl: false,
		  navigationControl: false,
		  center: center,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  mapTypeControl: false,
		  streetViewControl:false,
		  zoomControl:false,
		  draggable:true,
		  styles: [
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#00573d"
            }
        ]
    },
	{
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "invert_lightness": true
            },
            {
                "weight": "0.73"
            },
            {
                "lightness": "4"
            },
            {
                "gamma": "1.75"
            },
            {
                "color": "#009669"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#f1f1f1"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#00573d"
            }
        ]
    }
]
		}
		var map = new google.maps.Map(map_element, myOptions);
		var geocoder = new google.maps.Geocoder();
		var infowindow = null;
		var baloon_text = "";
		
		//run the marker JSON loop here
		$.each(markers.markers, function(i, the_marker){
			latitude=the_marker.latitude;
			longitude=the_marker.longitude;
			icon=the_marker.icon;
			var baloon_text=the_marker.baloon_text;
			
			if(latitude!="" && longitude!=""){
				var marker = new google.maps.Marker({
					map: map, 
					position: new google.maps.LatLng(latitude,longitude),
					animation: google.maps.Animation.DROP,
					icon: icon
				});
				
				// Set up markers with info windows 
				google.maps.event.addListener(marker, 'click', function() {
					// Close all open infowindows
					if (infowindow) {
						infowindow.close();
					}
					
					infowindow = new google.maps.InfoWindow({
						content: baloon_text
					});
					
					infowindow.open(map,marker);
				});
			}
		});
	}

})(jQuery);
