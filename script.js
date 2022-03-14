const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;

const DEFAULT_MOVE_INTERVAL = 140;

const COLORS = {
    SNAKE: "#FB26FF",
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
        speed: 20,
        health_point: 3,
    }
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        ... initGameProperty(),
    }
}

let snake1 = initSnake(COLORS.SNAKE);

let apples = [{
    position: initPosition(),
},
{
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
    let scoreCanvas = document.getElementById("score1Board");
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
    speedCtx.font = "15px Arial";
    speedCtx.fillText("km/h", 10, speedCanvas.scrollHeight / 2 + 20);
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

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];

            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        if (heart.flag) {    
            var heartImg = document.getElementById("heart");
            ctx.drawImage(heartImg, heart.position.x * CELL_SIZE, heart.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE); 
        }

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
   
function checkGameOver(snake) {
    return snake.health_point === 0;
}

function checkCollisionWithSelf(snake) {
    for (let k = 1; k < snake.body.length; k++) {
        if (snake.head.x == snake.body[k].x && snake.head.y == snake.body[k].y) {
            return true;
        }
    }
    return false;
}

function checkCollisionWithObstacle(snake) {
    for (let i = 0; i < snake1.level; i++) {
        let obstacle = obstacles[i];

        let isXCollideObstacle = snake.head.x >= obstacle.position.x && 
        snake.head.x < obstacle.position.x + obstacle.size.x;

        let isYCollideObstacle = snake.head.y >= obstacle.position.y &&
        snake.head.y < obstacle.position.y + obstacle.size.y;

        if (isXCollideObstacle && isYCollideObstacle) {
            return true;
        }
    }

    return false;
}

function updateLevel(snake) {
    if (snake.score <= 20) {
        let oldlevel = snake.level;
        snake.level = Math.floor(snake.score / 5) + 1;
        snake.speed = 20 * snake.level;

        if (snake.level > oldlevel) {
            toast("Selamat kamu naik ke level " + snake.level);
            var audio = new Audio('assets/levelUp.mp3');
            audio.play();
        }
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

    if (!checkGameOver(snake)) {
        if (checkCollisionWithObstacle(snake) || checkCollisionWithSelf(snake)) {
            snake.health_point--;
            
            let newSnakeHeadBody = initHeadAndBody();
            snake.head = newSnakeHeadBody.head;
            snake.body = newSnakeHeadBody.body;
            move(snake);
        } else {
            setTimeout(function () {
                move(snake);
                updateLevel(snake);
            }, DEFAULT_MOVE_INTERVAL - snake.speed);
        }

    } else {
        var audio = new Audio('game-over.mp3');
        audio.play();

        alert("Game over");
        snake1 = initSnake(COLORS.SNAKE);
        heart.position = initPosition();
        heart.flag = false;

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
    if (checkPrime(snake1.score)) {
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
})

function initGame() {
    move(snake1);
}

initGame();