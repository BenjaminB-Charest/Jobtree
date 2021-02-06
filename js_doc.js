let map;
let servicePlaces;
let geocoder;
let serviceDistanceMatrix;
let infoWindow;
let directionsService;
let directionsRenderer;
let markersArray = [];
        
let personal_address = "4226 Ave Marcil, Montreal"

// Initializes the map and associated services
function initMap() {
  geocoder = new google.maps.Geocoder();
  serviceDistanceMatrix = new google.maps.DistanceMatrixService();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  const montreal = new google.maps.LatLng(45.508888, -73.561668);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: montreal,
    zoom: 12,
  });
  const request = {
    query: "Polytechnique Montreal",
    fields: ["name", "geometry"],
  };
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

// Connects the search button to the input
function test_func() {
  deleteMarkers(markersArray);
   var content = document.getElementById("test").value;
   service = new google.maps.places.PlacesService(map);
   var request = {
    query: content,
    fields: ['name', 'geometry'],
  };

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });       
  calculateAndDisplayRoute(directionsService, directionsRenderer, content);
  calculateDistanceMatrix(content);
}

// Adds the marker to the map
function createMarker(place) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  markersArray.push(marker);
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name);
    infowindow.open(map);
  });
}

// This shows the itinerary to the office
function calculateAndDisplayRoute(directionsService, directionsRenderer, place) {
  directionsService.route(
    {
      origin: {
        query: personal_address,
      },
      destination: {
        query: place,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
  directionsRenderer.setMap(map);
}

// This gets the data for the time & distance from the office
function calculateDistanceMatrix(destination){
geocoder = new google.maps.Geocoder();
serviceDistanceMatrix = new google.maps.DistanceMatrixService()
  serviceDistanceMatrix.getDistanceMatrix(
    {
      origins: [personal_address],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    },
    (response, status) => {
      if (status !== "OK") {
        alert("Error was: " + status);
      } else {
          const results = response.rows[0].elements;
          console.log(results[0].distance.text +
            " in " +
            results[0].duration.text +
            "");
      }
    }
  );
}

function deleteMarkers(markersArray) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}
