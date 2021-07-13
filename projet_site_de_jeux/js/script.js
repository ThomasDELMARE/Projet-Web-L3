window.onload = init();

function init(){
    localStorageBuild();
    afficherTrophees();
    implementerScoreboard();
    afficherScoreboard();
}

function localStorageBuild() {
    // Cas où il y a un utilisateur connecté
    if(localStorage.getItem("activeUser") != "null"){
        if(document.getElementById('connexion')){
            document.getElementById('connexion').innerHTML = "Connecté : " + localStorage.getItem("activeUser");
        }
    }

    // On génère un utilisateur de base si il n'est pas déjà déclaré
    if(!localStorage.getItem("DELMARE")){
        localStorage.setItem("DELMARE", "delmare2021");
        affecterSucces("DELMARE");
    }

    // On génère un utilisateur de base si il n'est pas déjà déclaré
    if(!localStorage.getItem("CHAINTREUIL")){
        localStorage.setItem("CHAINTREUIL", "chaintreuil2021");
        affecterSucces("CHAINTREUIL");
    }

    // Au démarrage, on paramètre un activeUser null
    if(!localStorage.getItem("activeUser")){
        localStorage.setItem("activeUser", "null");
    }
}

function connexion(){
    var id = document.getElementById('connexionId').value;
    var password = document.getElementById('password').value;    

    // Cas où le formulaire de connexion envoyée est vide dans les deux champs
    if(id == "" || password == "" ){
        alert("Veuillez entrer un mot de passe et un nom d'utilisateur.")
        return;
    }

    // Cas où le formulaire de connexion envoyée permet de connecter l'utilisateur
    if(localStorage.getItem(id) && localStorage.getItem(id) == password){
        localStorage.setItem("activeUser", id);
        window.location.href = "/vues/accueil.html";
        return false;
    }

    // Cas où le formulaire de connexion envoyée a un Id présent dans la base de données mais un mauvais mot de passe
    if(localStorage.getItem(id) && localStorage.getItem(id) != password){
        alert("Connexion échouée, votre mot de passe est incorrect.");
        return;
    }

    // Cas où l'identifiant n'est pas présent dans la base de données
    else{
        alert("Connexion échouée, votre identifiant n'est pas présent dans la base de données.");
        return true;
    }
}

function creerCompte(){    

    var id = document.getElementById('connexionId').value;
    var password = document.getElementById('password').value;

    // Cas où l'utilisateur veut créer un compte est déjà présent dans la base de données
    if(localStorage.getItem(id) && id != "" & password != ""){
        alert("Compte déja créee.")
    }

    // Cas où l'utilisateur veut créer un compte vide
    if(id == "" || password == "" ){
        alert("Veuillez entrer un mot de passe et un nom d'utilisateur.")
    }

    // Cas où l'utilisateur a correctement créer son compte
    if(!localStorage.getItem(id) && password != "" && id != ""){
        localStorage.setItem(id, password);
        alert("Votre compte a correctement été créee, vous pouvez vous connecter !");
        affecterSucces(id);
    }

    // On réinitialise les valeurs dans le formulaire de connexion
    document.getElementById('connexionId').value = "";
    document.getElementById('password').value = "";
}

function affecterSucces(nom){
    // On affecte la valeur des succès de chaque jeu pour chaque utilisateur
    localStorage.setItem(nom + "_snake1", false);
    localStorage.setItem(nom + "_snake2", false);
    localStorage.setItem(nom + "_demineur1", false);
    localStorage.setItem(nom + "_demineur2", false);
    localStorage.setItem(nom + "_candyCrush1", false);
    localStorage.setItem(nom + "_candyCrush2", false);
}

function redirect(input){
    // Switch case utilisé par la zone de recherche des jeux
    switch (input.value) {
        case "Snake":
            document.location.href="/vues/games/snake/snake.html"
            break;
        case "Démineur":
            document.location.href="/vues/games/demineur/demineur.html"
            break;
        case "Candy Crush":
            document.location.href="/vues/games/candyCrush/candyCrush.html"
            break;
        default :
            break;
    }
}

function deconnexion(){
    // Lors de la déconnexion, on est redirigé vers la page de connexion et on supprime la valeur de l'utilisateur actuel
    document.location.href="/index.html";
    localStorage.setItem("activeUser", "null");
}

function afficherTrophees(){
    // Snake - Succes 1
    if(localStorage.getItem(localStorage.getItem("activeUser") + "_snake1") == "true" && document.getElementById("snakeAchievement1")){
        let image = document.getElementById("snakeAchievement1");
        image.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");        
    }

    // Snake - Succes 2
    if(localStorage.getItem(localStorage.getItem("activeUser") + "_snake2") == "true" && document.getElementById("snakeAchievement2")){
        let image = document.getElementById("snakeAchievement2");
        image.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");        
    }

    // Demineur - Succes 1
    if(localStorage.getItem(localStorage.getItem("activeUser") + "_demineur1") == "true" && document.getElementById("demineurAchievement1")){
        let image = document.getElementById("demineurAchievement1");
        image.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");        
    }

    // Demineur - Succes 2
    if(localStorage.getItem(localStorage.getItem("activeUser") + "_demineur2") == "true" && document.getElementById("demineurAchievement2")){
        let image = document.getElementById("demineurAchievement2");
        image.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");        
    }

    // Candy Crush - Succes 1
    if(localStorage.getItem(localStorage.getItem("activeUser") + "_candyCrush1") == "true" && document.getElementById("candyCrushAchievement1")){
        let image = document.getElementById("candyCrushAchievement1");
        image.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");        
    }

    // Demineur - Succes 2
    if(localStorage.getItem(localStorage.getItem("activeUser") + "_candyCrush2") == "true" && document.getElementById("candyCrushAchievement1")){
        let image = document.getElementById("candyCrushAchievement1");
        image.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");        
    }

}

function implementerScoreboard(){
    // Highscore Snake
    if(!localStorage.getItem("highscore_snake_facile") && !localStorage.getItem("highscore_snake_facile_name")) {
        localStorage.setItem("highscore_snake_facile_name", "null");
        localStorage.setItem("highscore_snake_facile", "0");
    }
    if(!localStorage.getItem("highscore_snake_moyen") && !localStorage.getItem("highscore_snake_moyen_name")) {
        localStorage.setItem("highscore_snake_moyen_name", "null");
        localStorage.setItem("highscore_snake_moyen", "0");
    }
    if(!localStorage.getItem("highscore_snake_difficile") && !localStorage.getItem("highscore_snake_difficile_name")) {
        localStorage.setItem("highscore_snake_difficile_name", "null");
        localStorage.setItem("highscore_snake_difficile", "0");
    }

    // Highscore Démineur
    if(!localStorage.getItem("highscore_demineur_facile") || !localStorage.getItem("highscore_demineur_facile_name")) {
        localStorage.setItem("highscore_demineur_facile_name", "null");
        localStorage.setItem("highscore_demineur_facile", "0");
    }
    if(!localStorage.getItem("highscore_demineur_moyen") || !localStorage.getItem("highscore_demineur_moyen_name")) {
        localStorage.setItem("highscore_demineur_moyen_name", "null");
        localStorage.setItem("highscore_demineur_moyen", "0");
    }
    if(!localStorage.getItem("highscore_demineur_difficile") || !localStorage.getItem("highscore_demineur_difficile_name")) {
        localStorage.setItem("highscore_demineur_difficile_name", "null");
        localStorage.setItem("highscore_demineur_difficile", "0");
    }

    // Highscore Candy Crush
    if(!localStorage.getItem("highscore_candyCrush_facile") || !localStorage.getItem("highscore_candyCrush_facile_name")) {
        localStorage.setItem("highscore_candyCrush_facile_name", "null");
        localStorage.setItem("highscore_candyCrush_facile", "0");
    }
    if(!localStorage.getItem("highscore_candyCrush_moyen") || !localStorage.getItem("highscore_candyCrush_moyen_name")) {
        localStorage.setItem("highscore_candyCrush_moyen_name", "null");
        localStorage.setItem("highscore_candyCrush_moyen", "0");
    }
    if(!localStorage.getItem("highscore_candyCrush_difficile") || !localStorage.getItem("highscore_candyCrush_difficile_name")) {
        localStorage.setItem("highscore_candyCrush_difficile_name", "null");
        localStorage.setItem("highscore_candyCrush_difficile", "0");
    }
}

function afficherScoreboard(){
    // Affichage scoreboard CandyCrush
    if(localStorage.getItem("highscore_candyCrush_facile") != "0" && localStorage.getItem("highscore_candyCrush_facile_name") != "null"  && document.getElementById('candyCrushFacile')) {
        document.getElementById('candyCrushFacile').innerHTML = "Nom : " + localStorage.getItem("highscore_candyCrush_facile_name") + "<br>" + " Score : " + localStorage.getItem("highscore_candyCrush_facile");
    }
    if(localStorage.getItem("highscore_candyCrush_moyen") != "0" && localStorage.getItem("highscore_candyCrush_moyen_name") != "null"  && document.getElementById('candyCrushMoyen')) {
        document.getElementById('candyCrushMoyen').innerHTML = "Nom : " + localStorage.getItem("highscore_candyCrush_moyen_name") + "<br>" + " Score : " + localStorage.getItem("highscore_candyCrush_moyen");
    }
    if(localStorage.getItem("highscore_candyCrush_difficile") != "0" && localStorage.getItem("highscore_candyCrush_difficile_name") != "null"  && document.getElementById('candyCrushDifficile')) {
        document.getElementById('candyCrushDifficile').innerHTML = "Nom : " + localStorage.getItem("highscore_candyCrush_difficile_name") + "<br>" + " Score : " + localStorage.getItem("highscore_candyCrush_difficile");
    }

    // Affichage scoreboard Snake
    if(localStorage.getItem("highscore_snake_facile") != "0" && localStorage.getItem("highscore_snake_facile_name") != "null" && document.getElementById('snakeFacile')) {
        document.getElementById('snakeFacile').innerHTML = "Nom : " + localStorage.getItem("highscore_snake_facile_name") + "<br>" + "Score : " + localStorage.getItem("highscore_snake_facile");
    }
    if(localStorage.getItem("highscore_snake_moyen") != "0" && localStorage.getItem("highscore_snake_moyen_name") != "null"  && document.getElementById('snakeMoyen')) {
        document.getElementById('snakeMoyen').innerHTML = "Nom : " + localStorage.getItem("highscore_snake_moyen_name") + "<br>" + " Score : " + localStorage.getItem("highscore_snake_moyen");
    }
    if(localStorage.getItem("highscore_snake_difficile") != "0" && localStorage.getItem("highscore_snake_difficile_name") != "null"  && document.getElementById('snakeDifficile')) {
        document.getElementById('snakeDifficile').innerHTML = "Nom : " + localStorage.getItem("highscore_snake_difficile_name") + "<br>" + " Score : " + localStorage.getItem("highscore_snake_difficile");
    }

    // Affichage scoreboard Demineur
    if(localStorage.getItem("highscore_demineur_facile") != "0" && localStorage.getItem("highscore_demineur_facile_name") != "null"  && document.getElementById('demineurFacile')) {
        document.getElementById('demineurFacile').innerHTML = "Nom : " + localStorage.getItem("highscore_demineur_facile_name") + "<br>" + " Score : " + localStorage.getItem("highscore_demineur_facile");
    }
    if(localStorage.getItem("highscore_demineur_moyen") != "0" && localStorage.getItem("highscore_demineur_moyen_name") != "null" && document.getElementById('demineurMoyen')) {
        document.getElementById('demineurMoyen').innerHTML = "Nom : " + localStorage.getItem("highscore_demineur_moyen_name") + "<br>" + " Score : " + localStorage.getItem("highscore_demineur_moyen");
    }
    if(localStorage.getItem("highscore_demineur_difficile") != "0" && localStorage.getItem("highscore_demineur_difficile_name") != "null"  && document.getElementById('demineurDifficile')) {
        document.getElementById('demineurDifficile').innerHTML = "Nom : " + localStorage.getItem("highscore_demineur_difficile_name") + "<br>" + " Score : " + localStorage.getItem("highscore_demineur_difficile");
    }

}