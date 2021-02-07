let map, heatMap;
let servicePlaces;
let geocoder;
let serviceDistanceMatrix;
let infoWindow;
let directionsService;
let directionsRenderer;
let markersArray = [];

let medianPriceArray = parseHousingJSON();
        
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
      map.setCenter(results[0].geometry.location);
    }
  });
}

// Connects the search button to the input
function test_func() {
  deleteMarkers(markersArray);
   var content = document.getElementById("test").value;
   servicePlaces = new google.maps.places.PlacesService(map);
   var request = {
    query: content,
    fields: ['name', 'geometry'],
  };

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
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

// Show the itinerary to the office
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

// Get the data for the time & distance from the office
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

function addHeatMap() {
  // Montreal city borders
  map.data.loadGeoJson("montreal_geojson.geojson");
  map.data.setStyle((feature) => {
  color = mapColor(calculateIndex(feature.getProperty("NOM"))); 
  return /**  @type {google.maps.Data.StyleOptions} */ {
      fillColor: color,
      strokeWeight: 1,
    };
  });
}

function onSearch(){
  let searchInput = document.getElementsByClassName('searchTerm');
  let cityFilterInput = document.getElementsByClassName('city-input');
  let jobTypeInput = document.getElementsByClassName('position-input');
  console.log(searchInput[0].value);
  console.log(cityFilterInput[0].value);
  console.log(jobTypeInput[0].value);
}

function calculateIndex(neighbourhood) {
  let medianHousingPrice = 0;
  for (var i = 0; i < medianPriceArray.length; i++) { 
    if (neighbourhood === medianPriceArray[i].city)
      medianHousingPrice = medianPriceArray[i].medianPrice;
  }
  const medianHousingPriceMontreal = 1360.0;
  let medianHousingIndex = medianHousingPrice / medianHousingPriceMontreal;
  //let timeToOfficeIndex = (0.7 * commuteTimePublicTransport + 0.3 * commuteTimePrivateTransport) / 30;
  //salary
  //cost of utilities
  calculateDistanceMatrix(neighbourhood);
  return (medianHousingIndex); //+ timeToOfficeIndex);
}

function mapColor(colorIndex) {
  if (colorIndex < 0.75)
    return "rgba(11,156,49,1)"
  else if (0.75 <= colorIndex < 1.0) 
    return "rgba(240,239,136,1)";
  else
    return "rgba(255,0,0,1)";
}

function parseHousingJSON() {
  let array = []
  fetch("neighbourhood_housing_price.json").then(response => response.json())
    .then(json => {
      for (const cityJSON of json) {
        array.push(cityJSON);
      }
    });
  return array;
}

