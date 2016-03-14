var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var interval;

var snake;
var snakeLength;
var snakeWidth = 20;

var nx = 0;
var ny = 0;

var score = 0;
localStorage.setItem("highScore", 0);

var foodx;
var foody;
var foodWidth = 20;

var head;
var tail;

var right = true;
var left = false;
var up = false;
var down = false;

var eaten = false;

function initialize() {
    right = true;
    left = false;
    up = false;
    down = false;
    snake = [];
    snakeLength = 5;
    score = 0;

}

function createSnake() {
    for (var k = 0; k < snakeLength; k++) {
        snake[k] = ({x: k, y: 0});
    }
    console.log(snake[1]);
    head = snake[snakeLength-1];
    tail = snake[0];
}

function drawSnake() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawFood();
    for (k = 0; k < snake.length; k++) {
        ctx.beginPath();
        ctx.rect(snakeWidth * (snake[k].x) + 30, snakeWidth * (snake[k].y) + 30, snakeWidth, snakeWidth);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.strokeRect(snakeWidth * (snake[k].x) + 30, snakeWidth * (snake[k].y) + 30, snakeWidth, snakeWidth);
        ctx.closePath();
    }
}

function updateSnake() {
    nx = head.x;
    ny = head.y;
    if (right) {
        nx++;
    }
    if (left) {
        nx--;
    }
    if (up) {
        ny--;
    }
    if (down) {
        ny++;
    }
    if ((snakeWidth * nx) === foodx && (snakeWidth * ny) === foody) {
        eaten = true;
    }
    if (nx < -2 || ny < -2 || (nx * snakeWidth) + snakeWidth > canvas.width || (ny * snakeWidth) + snakeWidth > canvas.height || hitItself()) {
        snakeLength = 5;
        postScore(score);
        clearInterval(interval);
        main();

    }

    if (eaten) {
        snake.push({x: nx, y: ny});
        snakeLength++;
        eaten = false;
        score++;
        createNewFood();
    }
    else {
        snake.shift();    
        snake.push({x: nx,y: ny});

    }
    head = snake[snakeLength-1];
    drawSnake();
    drawScore();
}

function keyDownListener(e) {
    if(e.keyCode == 39 && !left) {
        right = true;
        down = false;
        up = false;
    }
    else if(e.keyCode == 37 && !right) {
        left = true;
        down = false;
        up = false;
    }

    else if(e.keyCode == 38 && !down) {
        up = true;
        right = false;
        left = false;
    }
    else if (e.keyCode == 40 && !up) {
        down = true;
        right = false;
        left = false;
    }

}

function createNewFood() {
    foodx = Math.round(Math.random() * (canvas.width - snakeWidth - 30));
    while (foodx % 20 !== 0) {
        foodx = Math.round(Math.random() * (canvas.width - snakeWidth - 30));
    }
    foody = Math.round(Math.random() * (canvas.height - snakeWidth - 30));
    while (foody % 20 !== 0) {
        foody = Math.round(Math.random() * (canvas.height - snakeWidth - 30));
    }

}

function drawFood() {
    ctx.beginPath();
    ctx.rect(foodx + 30, foody + 30, foodWidth, foodWidth);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score,5,20);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("High Score: " + localStorage.getItem("highScore"),canvas.width - 140,20);
    if (score > localStorage.getItem("highScore")) {
        highScore = localStorage.setItem("highScore", score);
    }
    console.log(localStorage.getItem("highScore"));
}

function postScore(myScore) {
    console.log("POST score");
    $.ajax ({
        type: 'POST', 
        url: 'http://localhost:3000/',
        data: {
            score: myScore,
        },
        error: function(xhr, msg) {
            console.error('AJAX error', xhr.status, msg);
        }
    });
}


function hitItself() {
    for (var i = 0; i < snakeLength; i++) {
        if (nx == snake[i].x && ny == snake[i].y) {
            return true;
        }
    return false;
    }
}

function main() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    initialize();
    createSnake();
    createNewFood();
    drawFood();
    drawSnake();
    updateSnake();
    interval = setInterval(updateSnake, 100);
}

document.addEventListener("keydown", keyDownListener, false);
document.body.style.overflow = "hidden"; //prevents movement of window when arrow keys pressed
main();