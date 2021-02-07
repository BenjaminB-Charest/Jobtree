let jobTypeInput = document.getElementsByClassName('position-input');



function chargerDisplayJobs() {
  fetch("jobs_data.json")
    .then(response => response.json())
    .then(json => {
      for (const companies of json) {
        if (jobTypeInput[0].value == companies.Type || jobTypeInput[0].value == "invalid")
          creerJobDisplay(companies);
      }
    });
}

function onSearch() {
  let searchInput = document.getElementsByClassName('searchTerm');
  let cityFilterInput = document.getElementsByClassName('city-input');
  let jobTypeInput = document.getElementsByClassName('position-input');
  console.log(searchInput[0].value);
  console.log(cityFilterInput[0].value);
  console.log(jobTypeInput[0].value);
  chargerDisplayJobs()
}

function creerJobDisplay(objetJson) {



  let displayMapsAndINdex = document.getElementById("jobsHandler");

  let displayJobContainer = document.createElement('div');
  displayJobContainer.className = "display-job";

  let displayJobTitle = document.createElement('div');
  displayJobTitle.className = "jobTitle";

  let displayLogo = document.createElement('div');
  displayLogo.className = "logo";


  let displayImg = document.createElement('img');
  displayImg.src = objetJson.Image;


  let displayDescription = document.createElement('div');
  displayDescription.className = "description";

  let displayCompanyName = document.createElement('p');
  displayCompanyName.innerHTML = "Company Name: " + objetJson.CompanyName;

  let displayCompanyPosition = document.createElement('p');
  displayCompanyPosition.innerHTML = "Position: " + objetJson.Position;

  let displayCompanySalary = document.createElement('p');
  displayCompanySalary.innerHTML = "Salary: " + objetJson.Salary;

  let displayIndex = document.createElement('div');
  displayIndex.className = "index";

  let displayValeurIndex = document.createElement('div');
  displayValeurIndex.className = "valeurIndex";
  displayValeurIndex.innerHTML = "20";

  let displayApply = document.createElement('a');
  displayApply.className = "apply";
  displayApply.innerHTML = "Appliquer";
  displayApply.href = objetJson.URL;



  displayDescription.appendChild(displayCompanyName);
  displayDescription.appendChild(displayCompanySalary);
  displayDescription.appendChild(displayCompanyPosition);
  displayLogo.appendChild(displayImg);
  displayJobTitle.appendChild(displayLogo);
  displayJobTitle.appendChild(displayDescription);
  displayIndex.appendChild(displayValeurIndex);
  displayIndex.appendChild(displayApply);
  displayJobTitle.appendChild(displayIndex);
  displayJobContainer.appendChild(displayJobTitle);
  displayMapsAndINdex.appendChild(displayJobContainer);

}