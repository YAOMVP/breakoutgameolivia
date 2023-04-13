// canvas variables
const breakOut = document.querySelector("#breakOut");
const ctx = breakOut.getContext("2d");
const breakOutWidth = breakOut.width; //400
const breakOutHeight = breakOut.height; //500
const sound = document.querySelector("#soundBtn");
const gameOverPattern = document.querySelector(".gameOverPattern");
const youWin = document.querySelector("#youWin");
const youLose = document.querySelector("#youLose");
const restart = document.querySelector("#restart");

// paddle variables:
const paddleWidth = 100;
const paddleHeight = 20;
const paddleMarginBottom = 50;

//paddle:
const paddle = {
    x: breakOutWidth / 2 - paddleWidth / 2,
    y: breakOutHeight - paddleMarginBottom - paddleHeight,
    width: paddleWidth,
    height: paddleHeight,
    dx: 5 //Amount of pixels the paddle will move to the right or left.
};



//Create the ball:
const ballRadius = 10;

const ball = {
    x: breakOutWidth / 2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 5,
    dx: 3, //总是一个方向 后边会改
    dy: -3
}

// Create the bricks:
const brick = {
    row: 3,
    column: 5,
    width: 55,
    height: 20,
    offsetLeft: 20,
    offsetTop: 25,
    marginTop: 40,
    fillColor: "#256D85",
    strokeColor: "#FEC260"
}


const scoreUnit = 10;
const maxLevel = 3;

//Move paddle left and right
let leftArrow = false;
let rightArrow = false;

let life = 3; //Player has 3 lives.
let bricks = [];

let score = 0;
let level = 1;
let gameOver = false;



window.addEventListener("keydown", keyPressed);
window.addEventListener("keyup", keyEnter);




function keyPressed(e) {
    if (e.keyCode == 37) {
        leftArrow = true;
    } else if (e.keyCode == 39) {
        rightArrow = true;
    }
};


//Stop moving when user release the key
function keyEnter(e) {
    if (e.keyCode == 37) {
        leftArrow = false;
    } else if (e.keyCode == 39) {
        rightArrow = false;
    }
};


//Move the paddle and do not let paddle out of bounds.
function movePaddle() {
    if (leftArrow && paddle.x > 0) {
        paddle.x = paddle.x - paddle.dx; //paddle.x -=paddle.dx;
    } else if (rightArrow && paddle.x + paddle.width < breakOutWidth) {
        paddle.x = paddle.x + paddle.dx; //paddle.x +=paddle.dx;
    }
};



function drawPaddle() {
    ctx.fillStyle = "#607EAA";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.lineWidth = 3; //border of the paddle
    ctx.strokeStyle = "#1C3879";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
};



function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FFF9CA";
    ctx.stroke();
    ctx.fillStyle = "#5A8F7B";
    ctx.fill();
    ctx.closePath();
};



function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
                y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
                status: true
            }
        }
    }
};
createBricks();



function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            //If the brick isn't brocken
            if (bricks[r][c].status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
            }
        }
    }
};



function drawItem() {
    ctx.drawImage(backgroundImg, 0, 0);
    drawPaddle();
    drawBall();
    drawBricks();
    showGameStatus(score, 35, 25, scoreImg, 5, 5);
    showGameStatus(life, breakOutWidth - 25, 25, lifeImg, breakOutWidth - 55, 5);
    showGameStatus(level, breakOutWidth / 2, 25, levelImg, breakOutWidth / 2 - 30, 5);
};



function moveBall() {
    ball.x = ball.x + ball.dx; //dx:3
    ball.y = ball.y + ball.dy; //dy:-3

};



function movementUpdate() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    checkGameOver();
    levelUp();
};



// Ball and wall collision detection
function ballWallCollision() {
    if (ball.x + ball.radius > breakOutWidth || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
        wallSound.play();

    } else if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        wallSound.play();
    } else if (ball.y + ball.radius > breakOutHeight) {
        life--;
        lifeLostSound.play();
        resetBall();
    }
};



//Ball and paddle collision:
function ballPaddleCollision() {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y > paddle.y && ball.y < paddle.y + paddle.height) {
        paddleHit.play();
        let collidePoint = ball.x - (paddle.x + paddle.width / 2); //得到-paddle.width/2   0  还有   paddle.width/2; 也就是-1  0  1 
        collidePoint = collidePoint / (paddle.width / 2);
        let angle = collidePoint * (Math.PI / 4);
        // ball.dx =ball.speed*Math.sin(45°)  sin(45°)=0.79;
        // ball.dy =ball.speed*Math.cos(45°)  cos(45°)=0.79;
        // 要把ball.dy = -负的 ，这样的话就是往上走不是往下走了;
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
};



function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            if (bricks[r][c].status) {
                if (ball.x + ball.radius > bricks[r][c].x && ball.x - ball.radius < bricks[r][c].x + brick.width && ball.y + ball.radius > bricks[r][c].y && ball.y - ball.radius < bricks[r][c].y + brick.height) {
                    bricksHit.play();
                    bricks[r][c].status = false; //The brick is broken;
                    // ball.dy = -ball.dy;
                    score = score + scoreUnit; //score += scoreUnit;
                }
            }
        }
    }
};



function showGameStatus(text, textX, textY, img, imgX, imgY) {
    ctx.fillStyle = "#495C83";
    ctx.font = "20px Lobster ";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
};


// resetBall: 
function resetBall() {
    ball.x = breakOutWidth / 2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2 - 1) //0-2 , -1 至 1 再*3， -3 至3
    ball.dy = -3;
};



function checkGameOver() {
    //1. life minus 1;  2.The ball goes beyond the canvas.
    if (life <= 0) {
        // showYouLose();
        gameOver = true;
    }
};



function levelUp() {
    let isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status; //打上一个brick就是false，这里要的是true，意思就是所有的bricks[r][c]全都达不到也就是都没了
        }
    }
    if (isLevelDone) {
        if (level > maxLevel) {
            gameOver = true;
            // showYouWin();
            return //不往下走了
        }
        winSound.play();
        brick.row++;
        createBricks();
        level++;
        ball.speed++;
        resetBall();

    }
};


soundBtn.addEventListener("click", audioManager);

function audioManager() {
    let imgSrc = soundBtn.getAttribute("src");
    let soundImg = imgSrc == "./img/SOUND_ON.png" ? "./img/SOUND_OFF.png" : "./img/SOUND_ON.png";

    soundBtn.setAttribute("src", soundImg);
    //mute and unmuted the sound
    wallSound.muted = wallSound.muted ? false : true;
    paddleHit.muted = paddleHit.muted ? false : true;
    bricksHit.muted = bricksHit.muted ? false : true;
    winSound.muted = winSound.muted ? false : true;
    lifeLostSound.muted = lifeLostSound.muted ? false : true;


};


restart.addEventListener("click", function() {
    location.reload();

})

function showYouWin() {
    gameOverPattern.style.display = "block";
    youWin.style.display = "block";
};

function showYouLose() {
    gameOverPattern.style.display = "block";
    youLose.style.display = "block";
};


function itemControl() {
    drawItem();
    movementUpdate();

    if (!gameOver) {
        requestAnimationFrame(itemControl); //可以让浏览器优化并行的动画动作，更流畅。
    }

};
itemControl();