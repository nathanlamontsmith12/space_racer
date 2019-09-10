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
}

class CPU {
    constructor(){

    }
}

const game = {
    ctx: document.querySelector("canvas").getContext("2d"),
    animation: null,
    player: null,
    lives: 5,
    cpu: null,
    active: false,
    clearDisplay(){
        this.ctx.clearRect(-200, -200, 1000, 1000);
    },
    makeDisplay(){

    },
    checkCollisions(){

    },
    handleDeath(){
        // do other stuff 
        this.lives--;
        this.displayLives();
    },
    displayLives(){
        const livesDisplay = document.getElementById("lives-display");
        if (livesDisplay) {
            bottom.removeChild(livesDisplay);
        }
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
        this.displayLives();
        animate();
    }
}


// global animate function: 

function animate(){
    game.clearDisplay();
    game.makeDisplay();
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