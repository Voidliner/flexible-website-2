const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const titleScreen = document.getElementById('titleScreen');

let player;
let bullets = [];
let enemies = [];
let powerUps = [];
let score = 0;
let health = 100;
let gameStarted = false;
let keys = {};

// Player Object
function createPlayer() {
    return { x: canvas.width / 2, y: canvas.height / 2, size: 20, speed: 5 };
}

// Bullet Object
function createBullet(x, y) {
    return { x, y, size: 5, speed: 5 };
}

// Enemy Object
function createEnemy() {
    return { x: Math.random() * (canvas.width - 20), y: 0, size: 20, speed: 2 };
}

// Power-Up Object
function createPowerUp() {
    return { x: Math.random() * (canvas.width - 10), y: Math.random() * (canvas.height - 10), size: 10, type: Math.random() > 0.5 ? 'health' : 'score' };
}

// Start Game
function startGame() {
    titleScreen.style.display = 'none'; // Hide title screen
    player = createPlayer();
    score = 0;
    health = 100;
    gameStarted = true;
    mainLoop(); // Start the game loop
}

// Main Game Loop
function mainLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move Player
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.size) player.y += player.speed;
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.size) player.x += player.speed;

    // Draw Player
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Handle Bullets
    bullets.forEach((bullet, bulletIndex) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
        
        // Remove bullets off-screen
        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }
        
        // Check for collisions with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (isColliding(bullet, enemy)) {
                score += 100; // Increase score
                bullets.splice(bulletIndex, 1); // Remove bullet
                enemies.splice(enemyIndex, 1); // Remove enemy
            }
        });
    });

    // Handle Enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
        
        // Remove off-screen enemies
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
        
        // Check if enemy hits the player
        if (isColliding(player, enemy)) {
            health -= 10; // Decrease health
            enemies.splice(index, 1); // Remove enemy
            if (health <= 0) {
                alert("Game Over! Your Score: " + score);
                document.location.reload(); // Restart game
            }
        }
    });

    // Handle Power-Ups
    powerUps.forEach((powerUp, index) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.size, powerUp.size);
        
        // Check for collision with player
        if (isColliding(player, powerUp)) {
            if (powerUp.type === 'health') {
                health = Math.min(100, health + 20); // Restore health
            } else if (powerUp.type === 'score') {
                score += 200; // Increase score
            }
            powerUps.splice(index, 1); // Remove power-up
        }
        
        // Remove off-screen power-ups
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });

    // Update Score and Health
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Health: ${health}`, 10, 40);

    requestAnimationFrame(mainLoop);
}

// Collision Detection Function
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.size &&
           rect1.x + rect1.size > rect2.x &&
           rect1.y < rect2.y + rect2.size &&
           rect1.y + rect1.size > rect2.y;
}

// Input Handling for Keyboard
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.code === 'Space' && !gameStarted) {
        startGame(); // Start the game when Space is pressed
    }
    if (gameStarted && e.code === 'Space') {
        fireBullet(); // Fire bullet
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Input Handling for Mobile Buttons
document.getElementById('upButton').addEventListener('click', () => { if (player.y > 0) player.y -= player.speed; });
document.getElementById('downButton').addEventListener('click', () => { if (player.y < canvas.height - player.size) player.y += player.speed; });
document.getElementById('leftButton').addEventListener('click', () => { if (player.x > 0) player.x -= player.speed; });
document.getElementById('rightButton').addEventListener('click', () => { if (player.x < canvas.width - player.size) player.x += player.speed; });
document.getElementById('shootButton').addEventListener('click', () => {
    if (gameStarted) {
        fireBullet(); // Fire bullet on button click
    }
});

// Fire Bullet Function
function fireBullet() {
    bullets.push(createBullet(player.x + player.size / 2 - 2.5, player.y));
}

// Start Game on Click
canvas.addEventListener('click', () => {
    if (!gameStarted) {
        startGame(); // Start the game when canvas is clicked
    }
});

// Spawning enemies and power-ups
setInterval(() => {
    if (gameStarted) {
        enemies.push(createEnemy());
        if (Math.random() < 0.5) {
            powerUps.push(createPowerUp());
        }
    }
}, 2000);
