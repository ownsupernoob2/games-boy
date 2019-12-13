class Snake {
    constructor() {
        this.isMoving = false;
        this.elongate = false;
        this.dx = 0;
        this.dy = 0;
        this.STARTSIZE = 3;
        this.STARTX = 200;
        this.STARTY = 200;
        this.BLOCKSIZE = 13;
        this.movement = 5;
        this.snakePoints = new Array();
        this.score = 0;
        for (let i = 0; i < this.STARTSIZE; i++) {
            this.snakePoints.push(new Point(this.STARTX - (i*this.BLOCKSIZE), this.STARTY));
        }
    }

    draw(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.snakePoints[0].getx(), this.snakePoints[0].gety(), this.BLOCKSIZE, this.BLOCKSIZE);
        ctx.fillStyle = "pink";
        for (let i = 1; i < this.snakePoints.length; i++) {
            ctx.fillRect(this.snakePoints[i].getx(), this.snakePoints[i].gety(), this.BLOCKSIZE, this.BLOCKSIZE);
        }
        ctx.font = "20px Consolas";
        ctx.fillStyle = "yellow";
        ctx.fillText(this.score, canvas.width - 50, 50);
    }

    update() {
        if (this.isMoving) {
            let first = this.snakePoints[0];
            let last = this.snakePoints[this.snakePoints.length-1];
            let newFirst = new Point(first.getx() + (this.dx*this.BLOCKSIZE), first.gety() + (this.dy*this.BLOCKSIZE));
            for (let i = this.snakePoints.length-1; i > 0; i--) {
                this.snakePoints[i].setx(this.snakePoints[i-1].getx());
                this.snakePoints[i].sety(this.snakePoints[i-1].gety());
            }
            this.snakePoints[0] = newFirst;
            
            if (this.elongate) {
                this.snakePoints.push(new Point(last.getx() + (this.dx*this.BLOCKSIZE), last.gety() + (this.dy*this.BLOCKSIZE)))
                this.elongate = false;
            }

            // Move through walls.
            if (this.snakePoints[0].getx() >= canvas.width-this.BLOCKSIZE && this.dx == 1) {
                // this.snakePoints[0].setx(-this.BLOCKSIZE);
                this.snakePoints[0].setx(0);
            }
            if (this.snakePoints[0].getx() <= 0 && this.dx == -1) {
                this.snakePoints[0].setx(canvas.width);
            }
            if (this.snakePoints[0].gety() >= canvas.height-this.BLOCKSIZE && this.dy == 1) {
                // this.snakePoints[0].sety(-this.BLOCKSIZE);
                this.snakePoints[0].sety(0);
            }
            if (this.snakePoints[0].gety() <= 0 && this.dy == -1) {
                this.snakePoints[0].sety(canvas.height);
            }

            if (this.suicide()) {
                toggleFullscreen();
                show_game_over_toast();
                _score.innerHTML = this.score;
                gameover = true;
                canvas.style.display = "none";
                game_over.style.display = "block";
                if (play_sound) {
                    dead.play();
                }
                dead.loop = true;
                this.isMoving = false;
            }
        }
    }

    reset() {
        this.score = 0;
        this.snakePoints = [];
        for (let i = 0; i < this.STARTSIZE; i++) {
            this.snakePoints.push(new Point(this.STARTX - (i*this.BLOCKSIZE), this.STARTY));
        }
    }

    // The snake stops moving if it bites itself.
    suicide() {
        var headx = this.snakePoints[0].getx() + (this.BLOCKSIZE / 2);
        var heady = this.snakePoints[0].gety() + (this.BLOCKSIZE / 2);
        for (let i = 2; i < this.snakePoints.length; i++) {
            if (headx > this.snakePoints[i].getx() && headx < this.snakePoints[i].getx() + this.BLOCKSIZE) {
                if (heady > this.snakePoints[i].gety() && heady < this.snakePoints[i].gety() + this.BLOCKSIZE) {
                    return true;
                }
            }
        }
        return false;
    }
}

class Food {
    constructor() {
        this.x = Math.random() * (canvas.width-100) + 70;
        this.y = Math.random() * (canvas.height-100) + 70;
        this.BLOCKSIZE = 10;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        // ctx.fillRect(this.x, this.y, this.BLOCKSIZE, this.BLOCKSIZE);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.BLOCKSIZE, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x = Math.random() * (canvas.width-100) + 50;
        this.y = Math.random() * (canvas.height-100) + 50;
    }

    reset() {
        this.x = Math.random() * (canvas.width-100) + 70;
        this.y = Math.random() * (canvas.height-100) + 70;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    setx(input) {
        this.x = input;
    }
    getx() {
        return this.x;
    }
    sety(input) {
        this.y = input;
    }
    gety() {
        return this.y;
    }
}

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let snake = new Snake();
let food = new Food();
let pause = false;

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();
let key_press = new Audio();

dead.src = "sounds/game_over.wav";
eat.src = "sounds/eat.mp3";
up.src = "sounds/up.mp3";
right.src = "sounds/right.mp3";
left.src = "sounds/left.mp3";
down.src = "sounds/down.mp3";
key_press.src = "sounds/keypress.wav";

function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
}


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keydown", events, false);

function events(e) {
    if (!gameover) {
        switch (e.keyCode) {
            case 13: // Enter key
                if (!snake.isMoving && !pause) {
                    stopAudio(dead);
                    if (play_sound) {
                        key_press.play();
                    }
                    snake.dx = 1;
                    snake.dy = 0;
                    snake.isMoving = true;
                    snake.reset();
                    food.reset();
                }
                break;
            case 37: // Left arrow key
                if (snake.isMoving && snake.dx != 1) {
                    if (play_sound) {
                        left.play();
                    }
                    snake.dx = -1;
                    snake.dy = 0;
                }
                break;
            case 38: // Up arrow key
                if (snake.isMoving && snake.dy != 1) {
                    if (play_sound) {
                        up.play();
                    }
                    snake.dy = -1;
                    snake.dx = 0;
                }
                break;
            case 39: // Right arrow key
                if (snake.isMoving && snake.dx != -1) {
                    if (play_sound) {
                        right.play();
                    }
                    snake.dx = 1;
                    snake.dy = 0;
                }
                break;
            case 40: // Down arrow key
                if (snake.isMoving && snake.dy != -1) {
                    if (play_sound) {
                        down.play();
                    }
                    snake.dy = 1;
                    snake.dx = 0;
                }
                break;
            case 32: // Spacebar
                if (snake.isMoving && !pause) {
                    if (play_sound) {
                        key_press.play();
                    }
                    dead.loop = true;
                    snake.isMoving = false;
                    pause = true;
                } else if (!snake.isMoving && pause) {
                    if (play_sound) {
                        key_press.play();
                    }
                    pause = false;
                    snake.isMoving = true;
                    stopAudio(dead);
                }
        }
    }
}