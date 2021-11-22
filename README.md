# Jobtree - Hackatown 2021 Submission

EN
This project was created with the intention of helping job seekers find companies that best fit their needs. We used salary, commute time and neighbourhood rent prices to best match a job seeker with a company. 

Technologies used:
- Firebase
- Google Maps APIs - Distance Matrix, Geocoding, Maps embedded
- Javascript
- HTML / CSS
- JSON & GeoJSON

FR

L'idée que nous avons eu pour ce hackatown c'était de déterminer à l'aide de 3 indices : le salaire, la distance et le loyer en fonction
de l'emploi sélectionné. 

Ces indices étaient calculés pour tous les quartiers de Montréal

Par exemple : Si une personne sélectionnais un emploi pour l'emploi X qui offrait 50 000$/an par exemple, les indices de salaire, la distance pour s'y rendre
en moyenne ainsi que le calcul du loyer était calculer.

Ensuite, en fonction de chaque quartier, une heatmap démontrait une moyenne pondérée de chaque indice pour chaque quartier

La carte a été implémentée avec Google Maps APIS. 

To add key:
Add Google API key in the inline script section right below the div with ID as "map". *NOTE: During the hackathon, the key will remain active for the judges this step is not necessary. 

To compile : 
1. Open using VSCode
2. Right-click the HTML file
3. Run with Live server (If this extension is not downloaded, you can add it by searching in VSCode extension marketplace.)
4. The website should open on your default browser :)

