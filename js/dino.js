let board;
let boardWidth = 750;
let boardHeight = 250;
let context;
let animationId;

let dinoWidth = 70;
let dinoHeight = 70;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
    img: dinoImg,
    isJumping: false,
    isDucking: false
};

let cactusArray = [];

let cactus1Width = 35;
let cactus2Width = 70;
let cactus3Width = 105;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let runningImages = [new Image(), new Image()];
let duckingImages = [new Image(), new Image()];
let jumpImage = new Image();
let deadImage = new Image();
let currentFrame = 0;

let resetButton = new Image();
resetButton.src = 'images/reset.png';

let gameStarted = false;

window.onload = function () {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;

    context = board.getContext('2d');

    dinoImg = new Image();
    dinoImg.src = 'images/dino.png';
    dino.img = dinoImg;

    runningImages[0].src = 'images/dino-run1.png';
    runningImages[1].src = 'images/dino-run2.png';
    duckingImages[0].src = 'images/dino-duck1.png';
    duckingImages[1].src = 'images/dino-duck2.png';
    jumpImage.src = 'images/dino-jump.png';
    deadImage.src = 'images/dino-dead.png';

    cactus1Img = new Image();
    cactus1Img.src = 'images/cactus1.png';

    cactus2Img = new Image();
    cactus2Img.src = 'images/cactus2.png';

    cactus3Img = new Image();
    cactus3Img.src = 'images/cactus3.png';

    context.drawImage(dino.img, dino.x, dino.y, dino.width, dino.height);

    board.addEventListener('click', function () {
        if (!gameStarted) {
            gameStarted = true;
            requestAnimationFrame(update);
            setInterval(placeCactus, 1000);
        }
    });

    document.addEventListener('keydown', moveDino);
    document.addEventListener('keyup', stopDino);
};

function update() {
    animationId = requestAnimationFrame(update);

    if (!gameStarted || gameOver) {
        context.drawImage(resetButton, boardWidth / 2 - 25, boardHeight / 2 - 25, 50, 50);
        if (gameOver) return;
    }
    

    context.clearRect(0, 0, boardWidth, boardHeight);

    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);

    if (dino.y >= dinoY) {
        dino.isJumping = false;
    }

    if (dino.isJumping) {
        dino.img = jumpImage;
    } else if (dino.isDucking) {
        dino.img = duckingImages[Math.floor(currentFrame / 10) % 2];
        dino.height = dinoHeight*0.7;
        dino.width = dinoWidth*1.2
        dino.y = dino.y*1.125;
    } else {
        dino.img = runningImages[Math.floor(currentFrame / 10) % 2];
        dino.height = dinoHeight;
        dino.width = dinoWidth
    }

    context.drawImage(dino.img, dino.x, dino.y, dino.width, dino.height);
    currentFrame++;

    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];

        cactus.x += velocityX;

        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dino.img = deadImage;
            context.drawImage(dino.img, dino.x, dino.y, dino.width, dino.height);

        }
    }

    context.fillStyle = "black";
    context.font = "bold 20px Courier New";
    score++;
    context.fillText(score, 10, 30);
}

function moveDino(event) {
    if (gameOver) {
        return;
    }

    if ((event.code == 'Space' || event.code == 'ArrowUp') && dino.y == dinoY) {
        velocityY = -10;
        dino.isJumping = true;
    } else if (event.code == 'ArrowDown') {
        dino.isDucking = true;
    }
}

function stopDino(event) {
    if (event.code == 'ArrowDown') {
        dino.isDucking = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight,
    };

    let placeCactusChance = Math.random();

    if (placeCactusChance > 0.9) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.7) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.3) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function startGame() {
    if (animationId) {
        cancelAnimationFrame(animationId); 
    }

    dino.y = dinoY;
    dino.img = runningImages[0];
    dino.isJumping = false;
    dino.isDucking = false;
    velocityY = 0;
    velocityX = -8;
    cactusArray = [];
    score = 0;
    currentFrame = 0;
    gameOver = false;
    gameStarted = true;

    animationId = requestAnimationFrame(update);
}

document.addEventListener('click', function (event) {
    if (gameOver &&
        event.offsetX >= boardWidth / 2 - 25 && event.offsetX <= boardWidth / 2 + 25 &&
        event.offsetY >= boardHeight / 2 - 25 && event.offsetY <= boardHeight / 2 + 25) {
        startGame();
    }
});

