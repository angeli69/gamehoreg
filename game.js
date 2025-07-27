// Game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart');

// Set canvas size
canvas.width = 320;
canvas.height = 480;

// Game state
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameRunning = true;

// Player
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    color: '#3498db'
};

// Coins
let coins = [];
const coinSize = 20;
const coinSpeed = 3;

// Enemies
let enemies = [];
const enemySize = 30;
const enemySpeed = 2;

// Controls
let rightPressed = false;
let leftPressed = false;

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
restartButton.addEventListener('click', restartGame);

// Touch controls for mobile
let touchX = null;

canvas.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
}, false);

canvas.addEventListener('touchmove', (e) => {
    if (touchX === null) return;
    const x = e.touches[0].clientX;
    const dx = x - touchX;
    
    if (dx > 5) {
        rightPressed = true;
        leftPressed = false;
    } else if (dx < -5) {
        leftPressed = true;
        rightPressed = false;
    }
    
    touchX = x;
}, false);

canvas.addEventListener('touchend', () => {
    rightPressed = false;
    leftPressed = false;
    touchX = null;
}, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
}

function createCoin() {
    if (Math.random() < 0.02) {
        coins.push({
            x: Math.random() * (canvas.width - coinSize),
            y: -coinSize,
            width: coinSize,
            height: coinSize,
            color: '#f1c40f'
        });
    }
}

function drawCoins() {
    coins.forEach(coin => {
        ctx.fillStyle = coin.color;
        ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
    });
}

function updateCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].y += coinSpeed;
        
        // Check collision with player
        if (
            player.x < coins[i].x + coins[i].width &&
            player.x + player.width > coins[i].x &&
            player.y < coins[i].y + coins[i].height &&
            player.y + player.height > coins[i].y
        ) {
            coins.splice(i, 1);
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            continue;
        }
        
        // Remove if off screen
        if (coins[i].y > canvas.height) {
            coins.splice(i, 1);
        }
    }
}

function createEnemy() {
    if (Math.random() < 0.01) {
        enemies.push({
            x: Math.random() * (canvas.width - enemySize),
            y: -enemySize,
            width: enemySize,
            height: enemySize,
            color: '#e74c3c'
        });
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemySpeed;
        
        // Check collision with player
        if (
            player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y
        ) {
            gameOver();
            return;
        }
        
        // Remove if off screen
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
        }
    }
}

function gameOver() {
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
    gameOverElement.style.display = 'flex';
}

function restartGame() {
    score = 0;
    coins = [];
    enemies = [];
    gameRunning = true;
    scoreElement.textContent = `Score: ${score}`;
    gameOverElement.style.display = 'none';
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw game elements
    updatePlayer();
    drawPlayer();
    
    createCoin();
    updateCoins();
    drawCoins();
    
    createEnemy();
    updateEnemies();
    drawEnemies();
    
    requestAnimationFrame(gameLoop);
}

// Initialize game
highScoreElement.textContent = `High Score: ${highScore}`;
scoreElement.textContent = `Score: ${score}`;
gameLoop();