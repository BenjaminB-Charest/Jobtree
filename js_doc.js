let map, heatMap;
let servicePlaces;
let geocoder;
let serviceDistanceMatrix;
let infoWindow;
let directionsService;
let directionsRenderer;
let transportIndex = 0;
let markersArray = [];

let medianPriceArray = [];
let distanceMatrixArray = [];
let dataList = [];
let currentSalary = 0;

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
    zoom: 10,
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
function calculateDistanceMatrix(destination,office_location,mode){
geocoder = new google.maps.Geocoder();
serviceDistanceMatrix = new google.maps.DistanceMatrixService()
  serviceDistanceMatrix.getDistanceMatrix(
    {
      origins: [office_location],
      destinations: [destination],
      travelMode: google.maps.TravelMode[mode],
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    },
    (response, status) => {
      if (status !== "OK") {
        alert("Error was: " + status);
      } else {
        const results = response.rows[0].elements;
        try {
          distanceMatrixArray.push( results[0].duration.value / 60);
        } catch(error) {
          distanceMatrixArray.push(60);
        }
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
  initMap();
  dataList = map.data.loadGeoJson("montreal_geojson.geojson");
  map.data.setStyle((feature) => {
    color = mapColor(calculateIndex(feature.getProperty("NOM")));
  return /**  @type {google.maps.Data.StyleOptions} */ {
      fillColor: color,
      strokeWeight: 1,
    };
  });
}
function getMedianPrice(neighbourhood) {
  let medianHousingPrice = 0; 
  for (var i = 0; i < medianPriceArray.length; i++) { 
    if (neighbourhood === medianPriceArray[i].city)
      medianHousingPrice = medianPriceArray[i].medianPrice;
  }
  return medianHousingPrice;
}

function calculateIndex(neighbourhood) {
  console.log(distanceMatrixArray[transportIndex++]);
  const medianHousingPrice = getMedianPrice(neighbourhood);
  const medianHousingPriceMontreal = 1360.0;
  const livingCosts = 1069.0;
  let medianHousingIndex = medianHousingPrice / medianHousingPriceMontreal; 
  console.log("medianHousing" + medianHousingIndex);
  debugger;
  let salaryIndex = ((currentSalary / 12) - (medianHousingPrice + livingCosts)) / ((currentSalary / 12) * 0.3); 
  console.log("salaryINdex" + salaryIndex);
  let timeToOfficeIndex = (0.7 * distanceMatrixArray[transportIndex++] + 0.3 * distanceMatrixArray[transportIndex++]) / 30;
  console.log("timeToOfficeIndex:" + timeToOfficeIndex);
  return (medianHousingIndex + salaryIndex + timeToOfficeIndex);
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

let jobTypeInput = document.getElementsByClassName('position-input');
let searchInput = document.getElementsByClassName('searchTerm');
let minSalryInput = document.getElementsByClassName('min-input');



function chargerDisplayJobs() {
  fetch("jobs_data.json")
    .then(response => response.json())
    .then(json => {
      for (const companies of json) {
        if ((jobTypeInput[0].value == companies.Type || jobTypeInput[0].value == "invalid") && textFound(companies) && companies.Salary >= minSalryInput[0].value)
          creerJobDisplay(companies);
      }
    });
}

function textFound(companie) {
  if (searchInput[0].value == "") return true;
  if (companie.CompanyName.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  if (companie.Position.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  if (companie.Adresse.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  if (companie.Type.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  return false;
}

function onSearch() {
  let displayMapsAndINdex = document.getElementById("jobsHandler");
  displayMapsAndINdex.innerHTML = "";
  chargerDisplayJobs()
}

function creerJobDisplay(objetJson) {
  let displayMapsAndINdex = document.getElementById("jobsHandler");

  let displayJobContainer = document.createElement('button');
  displayJobContainer.addEventListener("click", () => {
    for (let i = 0; i < medianPriceArray.length; i++) {
      calculateDistanceMatrix(medianPriceArray[i].city, objetJson.Address, "TRANSIT");
      calculateDistanceMatrix(medianPriceArray[i].city, objetJson.Address, "DRIVING");
    }
    currentSalary = objetJson.Salary;
  });

  displayJobContainer.className = "display-job";

  let displayJobTitle = document.createElement('div');
  displayJobTitle.className = "jobTitle";

  let displayLogo = document.createElement('div');
  displayLogo.className = "logo";


  let displayImg = document.createElement('img');
  displayImg.src = objetJson.Image;


  let displayDescription = document.createElement('div');
  displayDescription.className = "description";

  let displayDescriptionPlusIndex = document.createElement('div');
  displayDescriptionPlusIndex.className = "displayDescriptionPlusIndex";

  let displayCompanyName = document.createElement('p');
  displayCompanyName.innerHTML = objetJson.CompanyName;
  displayCompanyName.style.marginBottom = "10px";
  displayCompanyName.style.color = "grey";
  displayCompanyName.style.fontWeight = "bold";


  let displayCompanyPosition = document.createElement('p');
  displayCompanyPosition.innerHTML = objetJson.Position;
  displayCompanyPosition.style.marginTop = "5px";
  displayCompanyPosition.style.fontWeight = "bold";

  let displayCompanySalary = document.createElement('p');
  displayCompanySalary.innerHTML = "Salary: " + objetJson.Salary;
  displayCompanySalary.style.color = "grey";
  displayCompanySalary.style.fontSize = "13px";
  displayCompanySalary.style.marginBottom = "7px";
  displayCompanySalary.style.fontWeight = "bold";

  let displayJobType = document.createElement('p');
  displayJobType.innerHTML = objetJson.Type;
  displayJobType.style.color = "grey"
  displayJobType.style.fontSize = "13px";
  displayJobType.style.fontWeight = "bold";

  let displayIndex = document.createElement('div');
  displayIndex.className = "index";

  let displayValeurIndex = document.createElement('div');
  displayValeurIndex.className = "valeurIndex";
  displayValeurIndex.innerHTML = "20";

  let displayApply = document.createElement('a');
  displayApply.className = "apply";
  displayApply.innerHTML = "Appliquer";
  displayApply.href = objetJson.URL;

  displayDescription.appendChild(displayCompanyPosition);
  displayDescription.appendChild(displayCompanyName);
  displayDescription.appendChild(displayJobType);
  displayDescription.appendChild(displayCompanySalary);

  displayLogo.appendChild(displayImg);

  displayJobTitle.appendChild(displayLogo);


  displayIndex.appendChild(displayValeurIndex);
  displayIndex.appendChild(displayApply);
  displayDescriptionPlusIndex.appendChild(displayDescription);
  displayDescriptionPlusIndex.appendChild(displayIndex);
  displayJobTitle.appendChild(displayDescriptionPlusIndex);

  displayJobContainer.appendChild(displayJobTitle);

  displayMapsAndINdex.appendChild(displayJobContainer);
}