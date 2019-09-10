console.log("All linked up!")

class Ship {
    constructor(){

    }
    handleInput(key){

    }
    move(){

    }
    draw(){

    }
    getHitbox(){
        
    }
}

class Obstacle {
    constructor(x, y, w, h){
        active: true;
        this.x = x;
        this.y = y; 
        this.width = w;
        this.height = h
    }
    isOffscreen(){
        
    }
    move(speed){

    }
    draw(){

    }
    overlaps(playerHitBox){
        let overlaps = false; 
        // LOGIC 
        return overlaps;
    }
}

class CPU {
    constructor(){
        this.obstacles = [],
        this.timer = 0,
        this.countdown = 100,
        this.difficulty = 1
    }
    collided(playerHitBox){
        let isCollision = false;
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].overlaps(playerHitBox)){
                isCollision = true;
                break;
            }
        }
        return isCollision;
    }
    drawObstacles(){
        this.obstacles.forEach(obs => obs.draw())
    }
    moveObstacles(){
        const speed = this.difficulty;
        this.obstacles.forEach(obs => obs.move(speed))
    }
    generateObstacleSet(){

    }
    removeObstacles(){
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].isOffscreen()){
                this.obstacles[i].active = false;
            }
        }
        const newObstacleSet = this.obstacles.filter(obs => obs.active)
        this.obstacles = newObstacleSet;
    }
}

const game = {
    ctx: document.querySelector("canvas").getContext("2d"),
    animation: null,
    player: null,
    lives: 5,
    cpu: null,
    active: false,
    clearScreen(){
        this.ctx.clearRect(-200, -200, 1000, 1000);
    },
    fillScreen(){
        this.player.draw();
        this.cpu.draw();
    },
    checkCollisions(){
        const hitbox = this.player.getHitbox();
        if (this.cpu.collided(hitbox)){

        }
    },
    handleDeath(){
        // do other stuff 
        this.lives--;
        this.updateLivesDisplay();
    },
    clearLivesDisplay(){
        const livesDisplay = document.getElementById("lives-display");
        if (livesDisplay) {
            bottom.removeChild(livesDisplay);
        }
    },
    updateLivesDisplay(){
        this.clearLivesDisplay();
        const newDisplay = document.createElement("div")
        newDisplay.id = "lives-display"
        for (let i = 1; i <= this.lives; i++) {
            const newLife = document.createElement("div");
            newLife.classList.add("life")
            newDisplay.appendChild(newLife)            
        }
        bottom.appendChild(newDisplay)
    },
    stop(){
        window.cancelAnimationFrame(this.animation);
    },
    start(){
        this.ctx.fillStyle = "limegreen";
        this.active = true;
        this.player = new Ship();
        this.cpu = new CPU();
        this.cpu.generateObstacleSet();
        this.displayLives();
        animate();
    }
}


// global animate function: 

function animate(){
    game.clearScreen();
    game.fillScreen();
    game.checkCollisions();
    game.animation = window.requestAnimationFrame(animate)
}


// cached elements: 

const bottom = document.getElementById("bottom")
const score = document.getElementById("score")
const screen = document.getElementById("screen")


// event listeners: 

document.body.addEventListener("keydown", (evt)=>{
    if (game.active){
        game.player.handleInput(evt.key)
    }
})