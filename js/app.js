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
            minX: this.x,
            maxX: this.x + this.w,
            minY: this.y,
            maxY: this.y + this.h
        })
    }
}

class Obstacle {
    constructor(x, s){
        this.active = true;
        this.x = x;
        this.y = 5; 
        this.w = 5;
        this.h = 5;
        this.speed = s;
    }
    isOffscreen(){
        // return true or false
        if(this.y > game.ctx.canvas.height + 100) {
            return true;
        } else {
            return false;
        }
    }
    move(speed){
        // move down by the speed 
        this.y += this.speed;
        if (this.isOffscreen()){
            this.active = false;
        }
    }
    draw(){
        game.ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    overlaps(PHB){
        // PHB -> "Player Hit Box" {minX: num, maxX: num, minY: num, maxY: num}
        let overlaps = false;         
        if (
            this.x >= PHB.minX && 
            this.x + this.w <= PHB.maxX &&
            this.y >= PHB.minY &&
            this.y + this.h <= PHB.maxY
            ){
            overlaps = true;
        }
        return overlaps;
    }
}

class CPU {
    constructor(){
        this.obstacles = [];
        this.beatenObstacles = 0;
        this.difficulty = 1;
        this.countdown = 0;
        this.sets = 0;
    }
    collided(playerHitBox){
        let isCollision = false;
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].overlaps(playerHitBox) && this.obstacles[i].active){
                isCollision = true;
                this.obstacles[i].active = false;
            }
        }
        return isCollision;
    }
    drawObstacles(){
        this.obstacles.forEach(obs => {
            if (obs.active) {
                obs.draw()
            }
        })
    }
    moveObstacles(){
        this.obstacles.forEach(obs => obs.move())
    }
    generateObstacleSet(){
        const newObstacleSet = [];
        for (let i = 0; i < game.obstaclesInSet; i++){
            const randX = Math.floor(Math.random()*game.ctx.canvas.width)
            const s = this.getSpeedBasedOnDifficulty();
            const newObs = new Obstacle(randX, s)
            newObstacleSet.push(newObs)
        }
        this.obstacles = newObstacleSet;
        this.sets++;
        this.countdown = (60 * (Math.floor(Math.random()*10) + 1)) + (game.ctx.canvas.height);
    }
    getSpeedBasedOnDifficulty(){
        const randFactor = Math.floor(Math.random()*5) + 1;
        return randFactor * this.difficulty;
    }
    nextFrame(){
        this.moveObstacles();
        if(this.countdown <= 0) {
            this.generateObstacleSet()
        } else {
            this.countdown = this.countdown - 1;
        }
    }
}

const game = {
    ctx: document.querySelector("canvas").getContext("2d"),
    animation: null,
    player: null,
    lives: 5,
    cpu: null,
    active: false,
    obstaclesInSet: 5,
    clearScreen(){
        this.ctx.clearRect(-200, -200, 1000, 1000);
    },
    handleNewFrame(){
        this.player.draw();
        this.cpu.drawObstacles();
        this.checkCollisions();
        this.cpu.nextFrame();
    },
    checkCollisions(){
        const hitbox = this.player.getHitbox();
        if (this.cpu.collided(hitbox)){
            this.handleDeath();
        }
    },
    handleDeath(){
        // do other stuff 
        console.log("HIT")
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
    game.handleNewFrame();
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