function creerInformationRepas(objetJson, divRepas){
  let conteneurRepas = document.createElement('div');
  conteneurRepas.className = "alimentFrigo";
  
  let divInfoAliments = document.createElement('div');
  divInfoAliments.className = "infoAliments";
  divInfoAliments.id = objetJson.id;
  
  let listeInfosRepasCategorie = document.createElement('li');
  listeInfosRepasCategorie.innerHTML = "<b>Catégories: </b>" + objetJson.categories;
  listeInfosRepasCategorie.setAttribute("align", "left");
  
  let listeInfosRepasQuantite = document.createElement('li');
  listeInfosRepasQuantite.innerHTML = "<b> Quantité: </b>" + objetJson.quantite;
  listeInfosRepasQuantite.setAttribute("align", "left");
  
  let listeInfosRepasDelai = document.createElement('li');
  listeInfosRepasDelai.setAttribute("align", "left");
  listeInfosRepasDelai.innerHTML = "<b> Date de péremption: </b>" + objetJson.delai;

  let listeInfosRepasAllergenes = document.createElement('li');
  listeInfosRepasAllergenes.setAttribute("align", "left");
  listeInfosRepasAllergenes.innerHTML = "<b> Allergènes: </b>" + objetJson.allergenes

  let boutonAjouterRepasPanier = document.createElement('button');
  boutonAjouterRepasPanier.className = "boutonAjouterRepasPanier";
  boutonAjouterRepasPanier.addEventListener(
          "click", function(){
                  boutonAfficheModaleRepasAjouterPanier();
                  ajouterElementAuPanier(objetJson.nomRepas);
                  afficherPanier(false);

          }
  );
  boutonAjouterRepasPanier.innerHTML = "Ajouter l'élément au panier ";
  boutonAjouterRepasPanierPlus = document.createElement('b');
  boutonAjouterRepasPanier.className = "symboleAddition";
  boutonAjouterRepasPanierPlus.innerHTML = "+";
  
  divInfoAliments.appendChild(listeInfosRepasCategorie);
  divInfoAliments.appendChild(listeInfosRepasQuantite);
  divInfoAliments.appendChild(listeInfosRepasDelai);
  divInfoAliments.appendChild(listeInfosRepasAllergenes);
  boutonAjouterRepasPanier.appendChild(boutonAjouterRepasPanierPlus);
  divInfoAliments.appendChild(boutonAjouterRepasPanier);

  divRepas.appendChild(divInfoAliments)
}



function chargerDisplayJobs(){ 
  fetch("jobs_data.json")
  .then(response => response.json())
  .then(json => {
          for(const companies of json){
                  creerJobDisplay(companies);
          } 
  });
}



function creerJobDisplay(objetJson){

  
    
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
  displayDescription. className = "description";

  let displayCompanyName = document.createElement('p');
  displayCompanyName.innerHTML = "Company Name: " + objetJson.CompanyName;
  
  let displayCompanyPosition = document.createElement('p');
  displayCompanyPosition.innerHTML = "Position: " + objetJson.Position;

  let displayCompanySalary = document.createElement('p');
  displayCompanySalary.innerHTML = "Salary: " + objetJson.Salary;
  
  let displayIndex = document.createElement('div');
  displayIndex.className = "index";
  
  
  displayDescription.appendChild(displayCompanyName);
  displayDescription.appendChild(displayCompanySalary);
  displayDescription.appendChild(displayCompanyPosition);
  displayLogo.appendChild(displayImg);
  displayJobTitle.appendChild(displayLogo);
  displayJobTitle.appendChild(displayDescription);
  displayJobTitle.appendChild(displayIndex);
  displayJobContainer.appendChild(displayJobTitle);
  displayMapsAndINdex.appendChild(displayJobContainer);

}