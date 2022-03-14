const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;

const DEFAULT_MOVE_INTERVAL = 140;

const COLORS = {
    SNAKE: "#FB26FF",
    COLLIDEDSNAKE: "#FBF5F4",
    OBSTACLE: "#1F1A1A",
    SPEEDBOARD: "#FF26264D",
};

const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initObstacleSize() {
    let isVerticalObstacle = Math.floor(Math.random() * 2);

    if (isVerticalObstacle) {
        return {
            x: 1,
            y: Math.floor(Math.random() * CANVAS_SIZE / CELL_SIZE / 2) + 1,
        }
    } 
    return {
        x: Math.floor(Math.random() * CANVAS_SIZE / CELL_SIZE / 2) + 1,
        y: 1, 
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initGameProperty() {
    return {
        score: 0,
        level: 1,
        speed: 20.
    }
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        health_point: 3,
        ... initGameProperty(),
    }
}

let snake1 = initSnake(COLORS.SNAKE);
let snake2 = initSnake("blue");
let snake3 = initSnake("black");

let apples = [{
    color: "red",
    position: initPosition(),
},
{
    color: "green",
    position: initPosition(),
}]

let heart = {
    position: initPosition(),
    flag: false,
}
let obstacles = [{
    size: initObstacleSize(),
    position: initPosition(),
},
{
    size: initObstacleSize(),
    position: initPosition(),
},
{
    size: initObstacleSize(),
    position: initPosition(),
},
{
    size: initObstacleSize(),
    position: initPosition(),
},
{
    size: initObstacleSize(),
    position: initPosition(),
}];

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    } else if (snake.color == snake2.color) {
        scoreCanvas = document.getElementById("score2Board");
    } else {
        scoreCanvas = document.getElementById("score3Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
    scoreCtx.font = "15px Arial";
    scoreCtx.fillText("hp : " + snake.health_point, 10, scoreCanvas.scrollHeight / 2 + 20);
}

function drawSpeed(snake) {
    let speedCanvas = document.getElementById("speedBoard");
    let speedCtx = speedCanvas.getContext("2d");

    speedCanvas.style.background = COLORS.SPEEDBOARD;
    speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    speedCtx.font = "30px Arial";
    speedCtx.fillText(snake.speed, 10, speedCanvas.scrollHeight / 2);
}

function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }

        drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color);
        for (let i = 1; i < snake2.body.length; i++) {
            drawCell(ctx, snake2.body[i].x, snake2.body[i].y, snake2.color);
        }

        drawCell(ctx, snake3.head.x, snake3.head.y, snake3.color);
        for (let i = 1; i < snake3.body.length; i++) {
            drawCell(ctx, snake3.body[i].x, snake3.body[i].y, snake3.color);
        }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];

            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        if (heart.flag) {    
            var heartImg = document.getElementById("heart");
            ctx.drawImage(heartImg, heart.position.x * CELL_SIZE, heart.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);         
        for (let i = 0; i < snake1.level; i++) {
            let obstacle = obstacles[i];
            
            if (obstacle.size.x === 1) {
                for (let y = 0; y < obstacle.size.y; y++) {
                    drawCell(ctx, obstacle.position.x, obstacle.position.y + y, COLORS.OBSTACLE);
                }
            } else {
                for (let x = 0; x < obstacle.size.x; x++) {
                    drawCell(ctx, obstacle.position.x + x, obstacle.position.y, COLORS.OBSTACLE);
                }
            }
        }

        drawScore(snake1);
        drawScore(snake2);
        drawScore(snake3);
        drawSpeed(snake1);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            apple.position = initPosition();
            snake.score++;
            snake.body.push({ x: snake.head.x, y: snake.head.y });
            checkPrimalitySnakeScore();
        }
    }
}

function eatHeart(snake) {
    if (heart.flag) {    
        if (snake.head.x == heart.position.x && snake.head.y == heart.position.y) {
            heart.position = initPosition();
            snake.health_point++;
            snake.score++;
            snake.body.push({ x: snake.head.x, y: snake.head.y });
            checkPrimalitySnakeScore();
        }
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
    eatHeart(snake);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
    eatHeart(snake);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
    eatHeart(snake);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
    eatHeart(snake);
}


function checkGameOver(snakes) {
    let isGameOver = false;
   
function checkCollision(snakes) {
    let isCollide = false;

    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    snakes[i].health_point--;
                    snakes[j].health_point--;
                    
                    if(snakes[i].health_point == 0 || snakes[j].health_point == 0){
                        isGameOver = true;
                    }
                }
            }
        }
    }
  if (isGameOver) {
    if (isCollide) {
        var audio = new Audio('game-over.mp3');
        audio.play();

        alert("Game over");
        snake1 = initSnake("purple");
        snake2 = initSnake("blue");
        snake3 = initSnake("black");
        heart.position = initPosition();
        heart.flag = false;
    }
    return isGameOver;
}

function checkCollisionWithObstacle(snake) {
    for (let i = 0; i < snake1.level; i++) {
        let obstacle = obstacles[i];

        let isXCollideObstacle = snake.head.x >= obstacle.position.x && 
        snake.head.x < obstacle.position.x + obstacle.size.x;

        let isYCollideObstacle = snake.head.y >= obstacle.position.y &&
        snake.head.y < obstacle.position.y + obstacle.size.y;

        if (isXCollideObstacle && isYCollideObstacle) {
            snake.color = COLORS.COLLIDEDSNAKE;
            return true;
        }
    }

    return false;
}

function updateLevel(snake) {
    if (snake.score <= 20) {
        snake.level = Math.floor(snake.score / 5) + 1;
        snake.speed = 20 * snake.level;
    }
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);

  if (!checkGameOver([snake1, snake2, snake3])) {

    if (checkCollisionWithObstacle(snake)) {
        setTimeout(function(){
            snake.color = COLORS.SNAKE;
        }, 300);
    }

    if (!checkCollision([snake1, snake2, snake3])) {
        setTimeout(function () {
            move(snake);
            updateLevel(snake);
        }, DEFAULT_MOVE_INTERVAL - snake.speed);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

function checkPrime(number) {
    if (number < 2) {
        return false;
    }
    for (let i = 2; i * i <= number; i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

function checkPrimalitySnakeScore() {
    if (checkPrime(snake1.score) || checkPrime(snake2.score) || checkPrime(snake3.score)) {
        heart.flag = true;
    } else {
        heart.flag = false;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }

    if (event.key === "a") {
        turn(snake2, DIRECTION.LEFT);
    } else if (event.key === "d") {
        turn(snake2, DIRECTION.RIGHT);
    } else if (event.key === "w") {
        turn(snake2, DIRECTION.UP);
    } else if (event.key === "s") {
        turn(snake2, DIRECTION.DOWN);
    }

    // Soal no 6: Add navigation snake3:
    if (event.key === "j") {
        turn(snake3, DIRECTION.LEFT);
    } else if (event.key === "l") {
        turn(snake3, DIRECTION.RIGHT);
    } else if (event.key === "i") {
        turn(snake3, DIRECTION.UP);
    } else if (event.key === "k") {
        turn(snake3, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake1);
    // move(snake2);
    // move(snake3);
}

initGame();