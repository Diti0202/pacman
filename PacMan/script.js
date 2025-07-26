//board
let board;
const rowCount=21;
const columnCount=19;
const tileSize=32;
const boardWidth=columnCount*tileSize;
const boardHeight=rowCount*tileSize;
let context;

//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

const walls=new Set();
const foods=new Set();
const ghosts=new Set();
let pacman;

const directions=['U', 'D', 'L', 'R']; 

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];
let score=0;
let lives=3;
let gameOver=false;

window.onload=function() {
    board=document.getElementById("board");
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext("2d");//used for drawing the board
    loadImages();
    loadMap(); 
    //console.log(walls.size);
    //console.log(foods.size);
    //console.log(ghosts.size);
    for(const ghost of ghosts.values()){
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
    update();
    document.addEventListener("keyup", movepacman);

function movepacman(event) {
    if(gameOver) {
        loadMap();
        resetPositions();
        lives=3;
        score=0;
        gameOver=false;
        update();
        return;
    }
    switch(event.key) {
        case "ArrowUp":
            pacman.updateDirection('U');
            break;
        case "ArrowDown":
            pacman.updateDirection('D');
            break;
        case "ArrowLeft":
            pacman.updateDirection('L');
            break;
        case "ArrowRight":
            pacman.updateDirection('R');
            break;
    }
    if(pacman.direction==='U'){
        pacman.image=pacmanUpImage;
    }
    else if(pacman.direction==='D'){
        pacman.image=pacmanDownImage;
    }
    else if(pacman.direction==='L'){
        pacman.image=pacmanLeftImage;
    }
    else if(pacman.direction==='R'){
        pacman.image=pacmanRightImage;
    }
}
}

//load images
function loadImages() {
    wallImage=new Image();
    wallImage.src="wall.png";

    blueGhostImage=new Image();
    blueGhostImage.src="blueGhost.png";
    orangeGhostImage=new Image();
    orangeGhostImage.src="orangeGhost.png";
    pinkGhostImage=new Image();
    pinkGhostImage.src="pinkGhost.png";
    redGhostImage=new Image();
    redGhostImage.src="redGhost.png";

    pacmanUpImage=new Image();
    pacmanUpImage.src="pacmanUp.png";
    pacmanDownImage=new Image();
    pacmanDownImage.src="pacmanDown.png";
    pacmanLeftImage=new Image();
    pacmanLeftImage.src="pacmanLeft.png";
    pacmanRightImage=new Image();
    pacmanRightImage.src="pacmanRight.png";
}

function loadMap(){
    walls.clear();
    foods.clear();
    ghosts.clear();

    for(let r=0; r<rowCount; r++){
        for(let c=0; c<columnCount; c++){
            const row=tileMap[r];
            const tileMapChar=row[c]; 
            const x=c*tileSize;
            const y=r*tileSize;

            if(tileMapChar==="X"){
                const wall=new Block(wallImage,x,y,tileSize,tileSize);
                walls.add(wall);
            }
            else if(tileMapChar==="O"){
                //skip
            }
            else if(tileMapChar==="P"){
                pacman=new Block(pacmanRightImage,x,y,tileSize,tileSize);
            }
            else if(tileMapChar==="b"){
                const ghost=new Block(blueGhostImage,x,y,tileSize,tileSize);
                ghosts.add(ghost);
            }
            else if(tileMapChar==="o"){
                const ghost=new Block(orangeGhostImage,x,y,tileSize,tileSize);
                ghosts.add(ghost);
            }
            else if(tileMapChar==="p"){
                const ghost=new Block(pinkGhostImage,x,y,tileSize,tileSize);
                ghosts.add(ghost);
            }
            else if(tileMapChar==="r"){
                const ghost=new Block(redGhostImage,x,y,tileSize,tileSize);
                ghosts.add(ghost);
            }
            else{
                const food=new Block(null,x+14,y+14,4,4);
                foods.add(food);
            }
        }
    }
}

function update() {//recursive function
    if(gameOver) {
        return; // Stop the game loop if game is over
    }
    move();
    draw();
    setTimeout(update,50);

}

function draw(){
    context.clearRect(0,0,board.width,board.height);
    context.drawImage(pacman.image,pacman.x,pacman.y,pacman.width,pacman.height);
    for(const ghost of ghosts.values()){
        context.drawImage(ghost.image,ghost.x,ghost.y,ghost.width,ghost.height);
    }
    for(const wall of walls.values()){
        context.drawImage(wall.image,wall.x,wall.y,wall.width,wall.height);
    }
    context.fillStyle="white";
    for(const food of foods.values()){
            context.fillRect(food.x,food.y,food.width,food.height);
    }
    context.fillStyle="white";
    context.font="14px sans-serif";
    if(gameOver) {
        context.fillText("GGame Over! Score: " + score, 10, 20);
    }else{
        context.fillText("x" +lives + " "+ score, 10, 20);

    }
}  


function move() 
{
    pacman.x= pacman.x + pacman.velocityX;
    pacman.y= pacman.y + pacman.velocityY;
    //check for collision with walls
    for(const wall of walls.values()){
        if(collision(pacman,wall)){
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break; // Stop checking after the first collision
        }
    }

    for(const ghost of ghosts.values()){
        if(collision(ghost, pacman)) {
            lives--;
            if(lives==0){
                gameOver=true;
                return;
            }
            resetPositions();
        }
        if (ghost.y==tileSize*9 && ghost.direction!='U' && ghost.direction!='D') {
            ghost.updateDirection('U'); // Change direction to 'U' if at the top row
        }

        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        //check for collision with walls
        for(const wall of walls.values()){
            if(collision(ghost, wall)||ghost.x<0||ghost.x+ghost.width>boardWidth){
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection=directions[Math.floor(Math.random() * 4)];
                ghost.updateDirection(newDirection); // Change direction if a collision occurs
            }
        }

        //check for collision with pacman
        //check for collision with food
        for(const food of foods.values()){ 
            if(collision(pacman, food)){
                foods.delete(food); // Remove the food from the set
                score += 10; // Increase score
                console.log("Score: " + score); // Display score in console
            }
        }
    }
    if(foods.size===0){
        loadMap();
        resetPositions();
        update();
    }
}

function collision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetPositions() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    for(const ghost of ghosts.values()){
        ghost.reset();
        const newDirection=directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
    
}

class Block{
    constructor(image,x,y,width,height){
        this.image=image;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.startx=x;
        this.starty=y;

        this.direction='R';
        this.velocityX=0;
        this.velocityY=0;
    }
    updateDirection(direction) {
        const prevDeriction = this.direction;
        this.direction = direction;
        this.updateVelocity();
        this.x+= this.velocityX;
        this.y+= this.velocityY;

        for(const wall of walls.values()){
            if(collision(this, wall)){
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDeriction; // Revert to previous direction
                this.updateVelocity(); // Update velocity based on the previous direction
                return; // Stop checking after the first collision
            }
        }
    }
    updateVelocity() {
        switch (this.direction) {
        case 'U':
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
            break;
        case 'D':
            this.velocityX = 0;
            this.velocityY = tileSize/4;
            break;
        case 'L':
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
            break;
        case 'R':
            this.velocityX = tileSize/4;
            this.velocityY = 0;
            break;
        }
    }
    reset()
    {
        this.x = this.startx;
        this.y = this.starty;
        this.updateDirection('R'); // Reset to default direction
    }
}