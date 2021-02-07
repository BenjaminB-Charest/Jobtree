let jobTypeInput = document.getElementsByClassName('position-input');
let searchInput = document.getElementsByClassName('searchTerm');



function chargerDisplayJobs() {
  fetch("jobs_data.json")
    .then(response => response.json())
    .then(json => {
      for (const companies of json) {
        if ((jobTypeInput[0].value == companies.Type || jobTypeInput[0].value == "invalid") && textFund(companies))
          creerJobDisplay(companies);
      }
    });
}

function textFund(companie) {
  if (searchInput[0].value == "") return true;
  if (companie.CompanyName.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  if (companie.Position.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  if (companie.Salary.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  if (companie.Adresse.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  if (companie.Type.toLowerCase().search(searchInput[0].value.toLowerCase()) > -1) return true;
  return false;
}

function onSearch() {
  let searchInput = document.getElementsByClassName('searchTerm');
  let cityFilterInput = document.getElementsByClassName('city-input');
  let jobTypeInput = document.getElementsByClassName('position-input');
  console.log(searchInput[0].value);
  console.log(cityFilterInput[0].value);
  console.log(jobTypeInput[0].value);
  let displayMapsAndINdex = document.getElementById("jobsHandler");
  displayMapsAndINdex.innerHTML = "";
  chargerDisplayJobs()
}

function creerJobDisplay(objetJson) {



  let displayMapsAndINdex = document.getElementById("jobsHandler");

  let displayJobContainer = document.createElement('button');
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