class Minesweeper {
    constructor(rows, cols, nbrMines) {
        this.rows = rows;
        this.cols = cols;
        this.grid = $(".grid");
        this.nbrMines = nbrMines;
        this.difficulty = Object.keys(difficulty).find(k => difficulty[k] === this.nbrMines);
        this.cells;
        this.isPlaying = true; // Variable gérant l'état de la partie
        this.hasWin = false;
        this.timer = new easytimer.Timer(); // TODO: Scoring
        this.flagsSetable = this.nbrMines;
        this.moves = 0;

        // Assets audio
        this.sound_pop;
        this.sound_bomb;
        this.sound_flagged;
        this.sound_win;

        this.init();
    }

    create2DArray() { // Fonction retournant un 2D-array de taille (row, col) contenant les objets Cell
        this.cells = new Array(this.rows);
        for (var i = 0; i < this.cols; i++) {
            this.cells[i] = new Array(this.cols);
            for (var j = 0; j < this.rows; j++) {
                this.cells[i][j] = new Cell(i, j, 0, 0, 0);
            }
        }
    }

    getAdjacentCells(x, y) { // Fonction retournant pour une cellule donnée (postion x,y), la liste des cellules qui lui sont adjacentes
        var results = [];
        for(var i = (x > 0 ? -1 : 0); i <= (x < this.rows - 1 ? 1 : 0); i++) {
            for(var j = (y > 0 ? -1 : 0); j <= (y < this.cols - 1 ? 1 : 0); j++) {
                results.push(this.cells[x + i][y + j]);
            }
        }
        return results;
    }

    populateGrid() {
        // Distribution random des bombes
        var assignedMines = 0;
        while(assignedMines < this.nbrMines) {
            var randomRow = Math.floor(Math.random() * this.rows);
            var randomCol = Math.floor(Math.random() * this.cols);

            var cell = this.cells[randomRow][randomCol];

            if (!cell.isMine) {
                cell.isMine = true;
                cell.value = "M";
                assignedMines++;
            }
        }

        // Mise à jour des cases adjacentes
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                if (!this.cells[i][j].isMine) { // On check si c'est pas une mine, sinon pas besoin d'update...
                    var mineCount = 0;
                    var adjacentCells = this.getAdjacentCells(i, j);
                    
                    adjacentCells.forEach((e) => {
                        if (e.isMine) {
                            mineCount++;
                        }
                    });
                    
                    if(mineCount) {
                        this.cells[i][j].value = mineCount.toString();
                    }
                }
            }
        }
    }

    draw() {
        // On génère l'en-tête de la grille
        var tableHead = $("thead tr");
        for(var i = 1; i < 5; i++) {
            var foo = $("<td></td>");
            switch(i) {
                case 1:
                    foo.attr("colspan", "2");
                    foo.append('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16"> <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/> </svg>');
                    foo.appendTo(tableHead);
                    break;
                case 2:
                    foo.attr("colspan", "3");
                    foo.append("<i class='flagsDisplayer'></i>");
                    foo.appendTo(tableHead);
                    break;
                case 3:
                    foo.attr("colspan", "2");
                    foo.append('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/> </svg>');
                    foo.appendTo(tableHead);
                    break;
                case 4:
                    foo.attr("colspan", "3");
                    foo.append("<i class='timerDisplayer'></i>");
                    foo.appendTo(tableHead);
                    break;
            }
        }

        // Génération de la grille
        for(var i = 0; i < this.rows; i++) {
            this.grid.append('<tr></tr>');
            var row = this.grid.children()[i];
            for(var j = 0; j < this.cols; j++) {
                var cell = this.cells[i][j];
                var cellDOM = $("<td></td>"); // Création d'un objet jQuery associé à la Cell

                // Définition des attributs pour traitement
                cellDOM.addClass("cell");
                cellDOM.attr("data-row", i.toString());
                cellDOM.attr("data-col", j.toString());

                // Ajout du listener pour la gestion du right-click/reveal
                cellDOM.click((e) => {
                    var target = $(e.currentTarget); // fix du bug de target undefined, aucune idée du pourquoi du comment cela fonctionne...
                    if (!target.hasClass("revealed")) {
                        var cell = this.cells[target.attr("data-row")][target.attr("data-col")];
                        this.revealCell(cell, target);
                    }
                });

                // Ajout du listener pour la gestion du left-click/flagging
                cellDOM.contextmenu((e) => {
                    e.preventDefault(); // On désactive l'action par défaut
                    var target = $(e.currentTarget); // fix du bug de target undefined, aucune idée du pourquoi du comment cela fonctionne...
                    var cell = this.cells[target.attr("data-row")][target.attr("data-col")];

                    if(!cell.revealed) {
                        this.flagCell(cell, target);
                    }
                });

                cellDOM.appendTo(row); // On ajoute l'élément au DOM
            }
        }
    }

    revealCell(cell, cellElement) { // Fonction gérant le dévoilement des Cells
        if (!cell.revealed && !cell.flagged) {
            this.moves++;
            cell.revealed++;

            cellElement = (cellElement === null ? cellElement = cell.getElement() : cellElement); // Fonction pouvant aussi être appelé de manière récursive
            
            cellElement.addClass("revealed"); // On reveal la case
            if (!isNaN(cell.value)) {
                cellElement.addClass("adj-" + cell.value); // Gestion de couleur pour cases adjacentes
            }

            cellElement.append((!cell.isMine ? cell.value || "" : "")); // Affichage de la valeur


            if(cell.isMine) { // Gestion du GameOver
                cellElement.append('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>');

                if (this.isPlaying) { // Only execute one-time
                    if(localStorage.getItem(localStorage.getItem("activeUser") + "_demineur1") == "false" && this.moves == 1){
                        // On modifie la valeur booléenne déterminant si l'utilisateur a eu le succès en true
                        localStorage.setItem((localStorage.getItem("activeUser") + "_demineur1"), "true");
                
                        // On charge et on change l'image avec celle de succès obtenu 
                        let image1 = document.getElementById("demineurAchievement1");
                        image1.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");
                    }
                    
                    this.sound_bomb.play();
                    this.endGame();
                }
            } else if (!cell.flagged && cell.value == "") { // Dévoilement des cases alentours si pas de bombes adjacentes
                var adjCells = this.getAdjacentCells(cell.row, cell.col);
                for(var i = 0; i < adjCells.length; i++) {
                    this.revealCell(adjCells[i], null);
                }

                if (this.isPlaying) { // Only execute one-time
                    this.sound_pop.play();
                    this.hasWon();
                }
            } else {
                if (this.isPlaying) { // Only execute one-time
                    this.sound_pop.play();
                    this.hasWon();
                }
            }
        }
    }

    updateFlagsCounter() {
        if (this.isPlaying){
            var counter = $(".flagsDisplayer");
            counter.empty();
            counter.append(this.flagsSetable);
        }
    }

    flagCell(cell, cellElement) {
        if(!cell.revealed) {
            if (!cell.flagged) {
                cell.flagged++;

                this.flagsSetable--;
                this.updateFlagsCounter();

                cellElement.addClass("flagged");
                cellElement.append('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16"> <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/> </svg>');
                
                this.sound_flagged.play();
            } else {
                cell.flagged--;

                this.flagsSetable++;
                this.updateFlagsCounter();

                cellElement.removeClass("flagged");
                cellElement.empty();
            }
        }
    }

    hasWon() {
        var cellRevealed = 0;
        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                if(this.cells[i][j].revealed && !this.cells[i][j].isMine) {
                    cellRevealed++;
                }
            }
        }
        if (cellRevealed == (this.cols * this.rows) - this.nbrMines) {
            if(this.timer.getTotalTimeValues().minutes <= 2 && this.difficulty == "DIFFICILE") {
                if(localStorage.getItem(localStorage.getItem("activeUser") + "_demineur2") == "false"){
                    // On modifie la valeur booléenne déterminant si l'utilisateur a eu le succès en true
                    localStorage.setItem((localStorage.getItem("activeUser") + "_demineur2"), "true");
            
                    // On charge et on change l'image avec celle de succès obtenu 
                    let image1 = document.getElementById("demineurAchievement2");
                    image1.setAttribute("src", "/assets/images/achievements/unlockedAchievement.png");
                }
            }
            this.sound_win.play();

            // Ajout du score
            var timerValue = this.timer.getTotalTimeValues().secondTenths;
            console.log(timerValue);
            if(parseInt(localStorage.getItem("highscore_demineur_" + this.difficulty.toLowerCase())) == 0 || timerValue < parseInt(localStorage.getItem("highscore_demineur_" + this.difficulty.toLowerCase()))){
                localStorage.setItem("highscore_demineur_" + this.difficulty.toLowerCase(), timerValue);
                localStorage.setItem("highscore_demineur_" + this.difficulty.toLowerCase() + "_name", localStorage.getItem("activeUser"));
            }

            this.endGame();
            //TODO : Won routine
        }
    }

    endGame() { // Gestion de la fin du jeu
        this.isPlaying--;
        this.timer.stop();
        this.cells.forEach((row) => { // On reveal la grid
            row.forEach((cell) => {
                if(cell.flagged) {
                    this.flagCell(cell, cell.getElement());

                    if(cell.isMine) { // Couleur si bon/mauvais flagging
                        cell.getElement().addClass("g-flag");
                    } else {
                        cell.getElement().addClass("b-flag");
                    }
                }
                this.revealCell(cell, null);
            });
        });
    }
    
    init() { // Fonction d'initialisation du jeu
        console.log("Initialisation du jeu...");
        console.log("Chargement des assets sonore");

        this.sound_pop = new Audio("/assets/sons/demineur/pop.flac");
        this.sound_bomb = new Audio("/assets/sons/demineur/bomb.mp3");
        this.sound_flagged = new Audio("/assets/sons/demineur/flag.wav");
        this.sound_win = new Audio("/assets/sons/demineur/win.wav");
    
        console.log("Création du 2D-array...");
        this.create2DArray();
        console.log("Remplissage de la grille...");
        this.populateGrid();
        console.log("Affichage de la grille...");
        this.draw();
        this.updateFlagsCounter();

        console.log("Démarrage du timer...");
        this.timer.start();
        this.timer.addEventListener('secondsUpdated', (e) => {
            $(".timerDisplayer").html(this.timer.getTimeValues().toString());
            $(".scoreCounter").html(this.timer.getTotalTimeValues().secondTenths.toString());
        });

        console.log("Loading complete !");
    }
}

class Cell {
    constructor(row, col, isMine, flagged, revealed) {
        this.row = row;
        this.col = col;
        this.value = "";
        this.isMine = isMine;
        this.flagged = flagged;
        this.revealed = revealed;
    }

    // Retourne l'élément DOM associé à la cellule
    getElement() {
        return $("td[data-row=" + this.row.toString() + "][data-col=" + this.col.toString() + "]");
    }
}

const difficulty = {
    FACILE: 15,
    MOYEN: 25,
    DIFFICILE: 35,
}

var game = new Minesweeper(10, 10, difficulty.MOYEN);

function restart() {
    game.grid.empty();
    $("thead tr").empty();
    game.timer.stop;
    delete game.timer;
    delete game;
    switch($(".difficultySelector").val()) {
        case "FACILE":
            game = new Minesweeper(10, 10, difficulty.FACILE);
            break;
        case "MOYEN":
            game = new Minesweeper(10, 10, difficulty.MOYEN);
            break;
        case "DIFFICILE":
            game = new Minesweeper(10, 10, difficulty.DIFFICILE);
            break;
    };
}



