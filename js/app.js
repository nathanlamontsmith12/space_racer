console.log("All linked up!")

class Ship {
    constructor(startX=275, startY=200, w=50, h=50, s=5){
        this.x = startX;
        this.y = startY;
        this.w = w;
        this.h = h;
        this.speed = s;
        this.limitX = game.ctx.canvas.width - w;
        this.limitY = game.ctx.canvas.height - h;
    }
    handleInput(key){
        key = key.toLowerCase()
        if (key === "arrowup" || key === "i" || key === "w") {
            this.move("u")
        }
        if (key === "arrowdown" || key === "k" || key === "s") {
            this.move("d")
        }
        if (key === "arrowleft" || key === "j" || key === "a") {
            this.move("l")
        }
        if (key === "arrowright" || key === "l" || key === "d") {
            this.move("r")
        }
    }
    move=(dir)=>{
        if (dir === "u" && this.y - this.speed > 0) {
                this.y = this.y - this.speed;
        }
        if (dir === "d" && this.y + this.speed < this.limitY){
                this.y = this.y + this.speed;
        }
        if (dir === "l" && this.x - this.speed > 0){
                this.x = this.x - this.speed;
        }
        if (dir === "r" && this.x + this.speed < this.limitX){
                this.x = this.x + this.speed;
        }
    }
    draw(){
        game.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    getHitbox(){
        return({
            xmin: this.x,
            xmax: this.x + this.w,
            ymin: this.y,
            ymax: this.y + this.h
        })
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
        // return true or false
    }
    move(speed){
        // move down by the speed 
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
        this.obstacles = [];
        this.beatenObstacles = 0;
        this.difficulty = 1;
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
        // generate increasing number of obstacles based on difficulty 
        // set timer for this method to be called again 
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
        this.cpu.drawObstacles();
    },
    checkCollisions(){
        const hitbox = this.player.getHitbox();
        if (this.cpu.collided(hitbox)){
            this.handleDeath();
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
        this.active = false;
        window.cancelAnimationFrame(this.animation);
    },
    start(){
        this.ctx.fillStyle = "limegreen";
        this.active = true;
        this.player = new Ship();
        this.cpu = new CPU();
        this.cpu.generateObstacleSet();
        this.updateLivesDisplay();
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