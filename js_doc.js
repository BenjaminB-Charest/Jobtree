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
let marker;
let currentAddress = "";

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

// Adds the marker to the map
function createMarker() {
  geocoder.geocode({ 'address': currentAddress }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      if (marker)
        marker.setMap(null);
      marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        draggable: true
      });
    }
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
function calculateDistanceMatrix(destination, office_location, mode) {
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
          distanceMatrixArray.push(results[0].duration.value / 60);
        } catch (error) {
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
  createMarker();
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
  let medianHousingPrice = 0.0;
  for (var i = 0; i < medianPriceArray.length; i++) {
    if (neighbourhood === medianPriceArray[i].city)
      medianHousingPrice = medianPriceArray[i].medianPrice;
  }
  return medianHousingPrice;
}

function calculateIndex(neighbourhood) {
  const medianHousingPrice = getMedianPrice(neighbourhood);
  const medianHousingPriceMontreal = 1360.0;
  const livingCosts = 1069.0;
  let medianHousingIndex = medianHousingPriceMontreal / medianHousingPrice;
  console.log("medianHousing: " + medianHousingIndex);
  let salaryIndex = ((currentSalary / 12) - (medianHousingPrice + livingCosts)) / ((currentSalary / 12) * 0.3);
  console.log("salaryIndex: " + salaryIndex);
  let timeToOfficeIndex = 30 / (0.7 * distanceMatrixArray[transportIndex++] + 0.3 * distanceMatrixArray[transportIndex++]);
  console.log("timeToOfficeIndex:" + timeToOfficeIndex);
  var result = medianHousingIndex + salaryIndex + timeToOfficeIndex;
  console.log("total: " + result);
  return (medianHousingIndex + salaryIndex + timeToOfficeIndex);
}

function mapColor(colorIndex) {
  if (colorIndex > 4.3)
    return "rgba(11,156,49,1)" // green
  else if (colorIndex > 3.5)
    return "rgba(255,215,0,1)"; // orange
  else
    return "rgba(255,0,0,1)"; // red
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
  medianPriceArray = parseHousingJSON();
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
  displayJobContainer.className = "display-job";
  displayJobContainer.addEventListener("click", () => {
    for (let i = 0; i < medianPriceArray.length; i++) {
      calculateDistanceMatrix(medianPriceArray[i].city, objetJson.Address, "TRANSIT");
      calculateDistanceMatrix(medianPriceArray[i].city, objetJson.Address, "DRIVING");
    }
    let jobs = document.getElementsByClassName('display-job');
    for (let i = 0; i < jobs.length; i++) {
      jobs[i].style.border = '3px solid black';
    }
    currentSalary = objetJson.Salary;
    displayJobContainer.style.border = '3px solid red'
    currentAddress = objetJson.Address;
    setTimeout(() => { }, 15000);
  });


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
  displayCompanySalary.innerHTML = "Salary : " + objetJson.Salary.toLocaleString('fr-CA', { currency: 'CAD' }) + "$";
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
  displayApply.innerHTML = "Details";
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