let board;
const baseWidth = 750;
let boardWidth = Math.min(window.innerWidth, 750);
let boardHeight = boardWidth * 0.333;
let context;
let animationId;

let dinoWidth = 70 * (boardWidth / baseWidth);
let dinoHeight = 70 * (boardWidth / baseWidth);
let dinoX = 50 * (boardWidth / baseWidth);
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let touchStartTime = 0;
let isLongTouch = false;
let longTouchTimeout;
const LONG_TOUCH_DURATION = 500;

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

let cactus1Width = 35 * (boardWidth / baseWidth);
let cactus2Width = 70 * (boardWidth / baseWidth);
let cactus3Width = 105 * (boardWidth / baseWidth);
let cactusHeight = 70 * (boardWidth / baseWidth);
let cactusX = boardWidth;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let velocityX = -8 * (boardWidth / baseWidth);
let velocityY = 0;
let gravity = 0.4 * (boardWidth / baseWidth);

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

    cactus2Img = new Image();
    cactus2Img.src = 'images/cactus2.png';

    cactus3Img = new Image();
    cactus3Img.src = 'images/cactus3.png';

    context.drawImage(dino.img, dino.x, dino.y, dino.width, dino.height);

     // Eventos para desktop
     document.addEventListener('keydown', moveDino);
     document.addEventListener('keyup', stopDino);
     
     // Eventos para móvil
     board.addEventListener('click', handleClick);
     board.addEventListener('touchstart', handleTouchStart, {passive: false});
     board.addEventListener('touchend', handleTouchEnd, {passive: false});
     board.addEventListener('touchmove', handleTouchMove, {passive: false});
     board.addEventListener('touchcancel', handleTouchEnd, {passive: false});
};

function handleClick(event) {
    if (gameOver) {
        const rect = board.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (x >= boardWidth / 2 - 25 && x <= boardWidth / 2 + 25 &&
            y >= boardHeight / 2 - 25 && y <= boardHeight / 2 + 25) {
            startGame();
        }
    } else if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(update);
        setInterval(placeCactus, 1000);
    }
}

function moveDino(event) {
    if (gameOver) return;

    if ((event.code === 'Space' || event.code === 'ArrowUp') && !dino.isJumping) {
        velocityY = -10 * (boardWidth / baseWidth);
        dino.isJumping = true;
    } else if (event.code === 'ArrowDown') {
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
    if (event.code === 'ArrowDown') {
    if (event.code == 'ArrowDown') {
        dino.isDucking = false;
    }
}
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

function handleTouch(e) {
    e.preventDefault();
    
    if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(update);
        setInterval(placeCactus, 1000);
    }
    
    // Salto en móvil
    if (dino.y == dinoY && !gameOver) {
        velocityY = -10 * (boardWidth / baseWidth);
        dino.isJumping = true;
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    touchStartTime = Date.now();
    isLongTouch = false;
    
    longTouchTimeout = setTimeout(() => {
        isLongTouch = true;
        if (!dino.isJumping && !gameOver && gameStarted) {
            dino.isDucking = true;
        }
    }, LONG_TOUCH_DURATION);
    
    if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(update);
        setInterval(placeCactus, 1000);
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    clearTimeout(longTouchTimeout);
    
    const touchDuration = Date.now() - touchStartTime;
    
    // Toque corto: saltar
    if (touchDuration < LONG_TOUCH_DURATION && dino.y == dinoY && !gameOver && gameStarted) {
        velocityY = -10 * (boardWidth / baseWidth);
        dino.isJumping = true;
    }
    
    // Dejar de agacharse
    if (dino.isDucking) {
        dino.isDucking = false;
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    clearTimeout(longTouchTimeout);
    if (dino.isDucking) {
        dino.isDucking = false;
    }
}

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
        dino.width = dinoWidth;
        //dino.y = dinoY;
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
        }
    }

    context.fillStyle = "black";
    context.font = `bold ${20 * (boardWidth / baseWidth)}px Courier New`;
    score++;
    context.fillText(score, 10 * (boardWidth / baseWidth), 30 * (boardWidth / baseWidth));
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
           a.x + a.width > b.x && 
           a.y < b.y + b.height && 
           a.y + a.height > b.y;
}

function startGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Reiniciar todas las variables del juego
    boardWidth = Math.min(window.innerWidth, 750);
    boardHeight = boardWidth * 0.333;
    board.width = boardWidth;
    board.height = boardHeight;
    
    dinoWidth = 70 * (boardWidth / baseWidth);
    dinoHeight = 70 * (boardWidth / baseWidth);
    dinoX = 50 * (boardWidth / baseWidth);
    dinoY = boardHeight - dinoHeight;
    cactusY = boardHeight - cactusHeight;
    
    dino = {
        x: dinoX,
        y: dinoY,
        width: dinoWidth,
        height: dinoHeight,
        img: dinoImg,
        isJumping: false,
        isDucking: false
    };
    
    velocityX = -8 * (boardWidth / baseWidth);
    velocityY = 0;
    gravity = 0.4 * (boardWidth / baseWidth);
}

window.addEventListener('resize', function() {
    if (!gameStarted || gameOver) {
        boardWidth = Math.min(window.innerWidth, 750);
        boardHeight = boardWidth * 0.333;
        board.width = boardWidth;
        board.height = boardHeight;
        
        // Recalcular dimensiones
        dinoWidth = 70 * (boardWidth / baseWidth);
        dinoHeight = 70 * (boardWidth / baseWidth);
        dinoX = 50 * (boardWidth / baseWidth);
        dinoY = boardHeight - dinoHeight;
        cactusY = boardHeight - (70 * (boardWidth / baseWidth));
        
        dino.x = dinoX;
        dino.y = dinoY;
        dino.width = dinoWidth;
        dino.height = dinoHeight;
        
        velocityX = -8 * (boardWidth / baseWidth);
        gravity = 0.4 * (boardWidth / baseWidth);
    }
});


document.addEventListener('click', function (event) {
    if (gameOver &&
        event.offsetX >= boardWidth / 2 - 25 && event.offsetX <= boardWidth / 2 + 25 &&
        event.offsetY >= boardHeight / 2 - 25 && event.offsetY <= boardHeight / 2 + 25) {
        startGame();
    }
});

