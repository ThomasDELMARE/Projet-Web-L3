let temps = 0; 
let tailleSerpent = 0;
let horizontalSpeed = 10;
let verticalSpeed = 0;
let xCoord;
let yCoord;
let timerInt;
let snake;
let difficulty;

const LEFT_KEY = 37;
const DOWN_KEY = 40;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const eatSound = new Audio("/assets/sons/snake/eat.wav");

document.addEventListener("keydown", switchDirection);

function initSnakeGame() {

    // On enlève l'affichage d'attente de lancement de partie
    var waitingToStartScreen = document.getElementById('waitingToStartScreen');
    waitingToStartScreen.remove();

    // On réaffiche le canvas de jeu
    snakeCanvas.style.display = "initial";
    
    // On crée le snake
    snake = createSnake();

    // On réinitialise le score et on l'affiche
    tailleSerpent = 0;
    document.getElementById('taille').innerHTML = "Taille du serpent / Score: " + tailleSerpent;
    document.getElementById('scoreCounter').innerHTML = tailleSerpent;    

    // On réinitialise le temps et on l'affiche
    temps = 0;
    document.getElementById('temps').innerHTML = "Temps : " + temps;    

    // On récupere le canvas et son context
    canvas = document.querySelector("#snakeCanvas");
    ctx = canvas.getContext("2d");

    // On initialise le timer qui augmentera toutes les secondes
    var timer = setInterval(function timer(){
        temps += 1;
        document.getElementById('temps').innerHTML = "Temps : " + temps;
    }, 1000);

    // On récupère son ID afin de pouvoir arrêter le timer lors de la fin de partie
    timerInt = timer;

    startGame();
    generateFood();
}

function startGame(){
    // Cas où le serpent s'est mangé lui-même ou a été en contact avec les parois de la zone de jeu
    if (gameEnd()){
        return;
    }

    // On récupère la difficulté sélectionnée par l'utilisateur afin de déterminer la vitesse du serpent
    difficulty = document.getElementById('difficulty_selector').value;
    speed = determinerVitesse(difficulty);

    // On fait une boucle permettant au jeu de s'animer à un intervalle de temps déterminé par la difficulté
    setTimeout(function coursDeJeu() {
        resetCanvas();
        moveSnake();
        drawSnake(snake);
        drawFood();

        startGame();
    }, speed)
}

function resetCanvas(){
    // On réinitialise la zone de jeu
    ctx.save();
    ctx.strokestyle = 'black';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.restore();      
}

function createSnake() {
    // Permet de positionner le snake en trois parties, ce dernier sera centré dans la gris, au commencement.
    let snake = [ {x: 400, y: 400},  {x: 390, y: 400},  {x: 380, y: 400} ];
    return snake;
}

function drawSnake(snakeToDraw) {
    for(let i=0; i < snakeToDraw.length ; i++){
        // Le serpent sera de couleur verte...
        ctx.fillStyle = 'green';  
        // ... et son contour de couleur noir
        ctx.strokestyle = 'black';
        ctx.fillRect(snakeToDraw[i].x, snakeToDraw[i].y, 10, 10);  
        ctx.strokeRect(snakeToDraw[i].x, snakeToDraw[i].y, 10, 10);
        ctx.restore();
    }
}

function moveSnake() { 
    // On crée la tête (avancée d'une case) du serpent
    const head = {x: snake[0].x + horizontalSpeed, y: snake[0].y + verticalSpeed};
    // On ajoute la nouvelle tête au serpent (à la position 0 du tableau car c'est la tête)
    snake.unshift(head);

    // Cas où la tête du serpent a été en contact avec une pomme
    if(checkIfEaten(snake[0])){
        tailleSerpent += 1;
        document.getElementById('taille').innerHTML = "Taille du serpent / Score: " + tailleSerpent;
        document.getElementById('scoreCounter').innerHTML = tailleSerpent;
        generateFood();
    }
    // Supprime le dernier élément et le renvoie (ici, la dernière partie du serpent)
    else{
        snake.pop();
    }
}

// Fonction gérant le changement de direction du serpent
function switchDirection(event) {
    
   let keyPressed = event.keyCode;

   let goingUp = verticalSpeed === -10;
   let goingDown = verticalSpeed === 10;
   let goingRight = horizontalSpeed === 10;  
   let goingLeft = horizontalSpeed === -10;
 
   // La touche pressée est la flèche directionnelle gauche
    if (keyPressed === LEFT_KEY)
    {    // Si le serpent ne vas pas à droite, on empêche que la fenêtre du navigateur puisse bouger pendant le jeu
        event.preventDefault();

        if(!goingRight){
            horizontalSpeed = -10;
            verticalSpeed = 0;
        }  
    }
 
    if (keyPressed === UP_KEY)
    {   
        event.preventDefault();

        if(!goingDown){    
            horizontalSpeed = 0;
            verticalSpeed = -10;
        }
    }
 
    if (keyPressed === RIGHT_KEY)
    {    
        event.preventDefault();

        if(!goingLeft){    
            horizontalSpeed = 10;
            verticalSpeed = 0;
        }
    }
 
    if (keyPressed === DOWN_KEY)
    {   
        event.preventDefault();

        if(!goingUp){    
            horizontalSpeed = 0;
            verticalSpeed = 10;
        }
    }
}

function gameEnd() {
    // On vérifie que le serpent ne se mange pas la queue...
    for (let i = 3; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){

        if(localStorage.getItem(localStorage.getItem("activeUser") + "_snake2") == "false"){
            // On modifie la valeur booléenne déterminant si l'utilisateur a eu le succès en true
            localStorage.setItem((localStorage.getItem("activeUser") + "_snake2"), "true");
    
            // On charge et on change l'image avec celle de succès obtenu 
            let image2 = document.getElementById("snakeAchievement2");
            image2.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");         
        }

        showGameOverScreen();
        return true;
      }
    }

    // On vérifie si le serpent a touché le bord gauche
    if(snake[0].x < 10){
        showGameOverScreen();
        return true;
    }
    // On vérifie si le serpent a touché le bord droit
    else if(snake[0].x > canvas.width - 20){
        showGameOverScreen();
        return true;
    }
    // On vérifie si le serpent a touché le haut du canvas
    else if(snake[0].y < 10){
        showGameOverScreen();
        return true;
    }
    // On vérifie si le serpent n'a pas touché le bas du canvas
    else if(snake[0].y > canvas.height - 20){
        showGameOverScreen();
        return true;
    }

    return false;
  }

function generateFood() {
    // On génère les positions x et y du fruit
    xCoord = generateFoodLocation();
    yCoord = generateFoodLocation();

    // On vérifie que la pomme n'est pas apparue sur le serpent
    for(let i=0; i < snake.length ; i++){
        if(checkIfEaten(snake[i])){
            generateFood();
        }
    }
}
  
function generateFoodLocation() {
    // On génère un entier qui est compris dans la taille du canvas (-30 pour ne pas faire apparaître dans le mur du canvas et pas non plus dans le bord du canvas)
    let canvasLength = canvas.width - 30;
    return Math.round(Math.random()*canvasLength / 10)*10;
}
    
function checkIfEaten(snakePart){
    // On regarde si le serpent a mangé la pomme, si c'est le cas, on émet un son et si ça n'est pas le cas, on sort de la fonction
    if(snakePart.x === xCoord && snakePart.y === yCoord){
        fireSound();
        return true;
    }
    return false;
}

// Fonction permettant de dessiner une "pomme"
function drawFood(){
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'green';
    ctx.fillRect(xCoord, yCoord, 10, 10);
    ctx.strokeRect(xCoord, yCoord, 10, 10);
    ctx.restore();
}

function showGameOverScreen(){
    // Cas où l'utilisateur a obtenu le premier succès
    if(localStorage.getItem(localStorage.getItem("activeUser") + "_snake1") == "false" && tailleSerpent >= 10){
        // On modifie la valeur booléenne déterminant si l'utilisateur a eu le succès en true
        localStorage.setItem((localStorage.getItem("activeUser") + "_snake1"), "true");

        // On charge et on change l'image avec celle de succès obtenu 
        let image1 = document.getElementById("snakeAchievement1");
        image1.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");         
    }

    // On modifie le highscore pour la difficulté choisie par l'utilisateur si l'utilisateur a battu le score le plus haut
    if(tailleSerpent > parseInt(localStorage.getItem("highscore_snake_" + difficulty.toLowerCase()))){
        localStorage.setItem("highscore_snake_" + difficulty.toLowerCase(), tailleSerpent);
        localStorage.setItem("highscore_snake_" + difficulty.toLowerCase() + "_name", localStorage.getItem("activeUser"));
    }

    // On arrête le timer
    clearInterval(timerInt);

    // On enlève le canvas de jeu
    snakeCanvas = document.getElementById("snakeCanvas");
    snakeCanvas.style.display = "none";

    // On sélectionne la zone de jeu et on la change avec un affichage de fin de partie
    var node = document.createElement("div");
    node.id = "waitingToStartScreen";
    node.innerHTML = "<h1 id='gameOver'> GAME OVER </h1> <br> <h1 id='replayZone'> <button type='button' id='replayButton' onclick='initSnakeGame()'>REJOUER</button> </h1>";
    document.getElementById("grille").appendChild(node);

    // On change le texte du bouton lorsque l'utilisateur a fini la partie
    document.getElementById('playButton').innerHTML = "REJOUER";
}

// Fonction permettant de jouer un son lorsque le serpent mange une pomme
function fireSound() {
    eatSound.play();
    eatSound.volume = 1;
}

// Fonction permettant de déterminer la vitesse du serpent selon la difficulté choisie par l'utilisateur
function determinerVitesse(difficulty){
    switch (difficulty) {
        case "FACILE":
            return 100;
            break;

        case "MOYEN":
          return 75;
          break;

        case "DIFFICILE":
          return 50;
          break;

        default:
          return 100;
      }
}
