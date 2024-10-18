const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('startOverlay');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    speed: 5,
    bullets: [],
    health: 3 // Initialize player health
};

let enemies = [];
let enemySpawnInterval = 1000; // Spawn every second
let score = 0; // Initialize score
let gameStarted = false; // Track if the game has started

function update() {
    // Move player based on keys
    if (keys['ArrowLeft'] || keys['a']) {
        player.x = Math.max(player.x - player.speed, 0);
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.x = Math.min(player.x + player.speed, canvas.width - player.width);
    }

    // Update bullets
    player.bullets.forEach((bullet, bulletIndex) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            player.bullets.splice(bulletIndex, 1);
        }
    });

    // Update enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(enemyIndex, 1);
        }

        // Check for collision with bullets
        player.bullets.forEach((bullet, bulletIndex) => {
            if (isColliding(bullet, enemy)) {
                // Remove bullet and enemy on collision
                player.bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score++; // Increment score
            }
        });

        // Check for collision with player (health loss)
        if (isColliding(player, enemy)) {
            player.health--; // Decrease health
            enemies.splice(enemyIndex, 1); // Remove the enemy on collision
            if (player.health <= 0) {
                alert("Game Over! Your score: " + score);
                resetGame(); // Reset game
            }
        }
    });

    // Render
    render();
}

function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = 'yellow';
    player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30); // Display score in the top-left corner

    // Draw health
    ctx.fillText(`Health: ${player.health}`, canvas.width - 100, 30); // Display health
}

function spawnEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 2
    };
    enemies.push(enemy);
}

function shoot() {
    const bullet = {
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 5,
        height: 10,
        speed: 10
    };
    player.bullets.push(bullet);
}

const keys = {};

// Keyboard controls
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !gameStarted) {
        startGame(); // Start the game if not already started
    }
    keys[e.key] = true;
    if (gameStarted && e.key === ' ') {
        shoot();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Touch controls
document.getElementById('leftBtn').addEventListener('touchstart', () => {
    keys['ArrowLeft'] = true;
});
document.getElementById('leftBtn').addEventListener('touchend', () => {
    keys['ArrowLeft'] = false;
});
document.getElementById('rightBtn').addEventListener('touchstart', () => {
    keys['ArrowRight'] = true;
});
document.getElementById('rightBtn').addEventListener('touchend', () => {
    keys['ArrowRight'] = false;
});
document.getElementById('shootBtn').addEventListener('touchstart', () => {
    if (gameStarted) shoot();
});

// Start the game when clicking anywhere
document.body.addEventListener('click', () => {
    startGame();
});

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startOverlay.style.display = 'none'; // Hide start overlay
        gameLoop(); // Start the game loop
    }
}

// Reset game
function resetGame() {
    player.health = 3; // Reset health
    score = 0; // Reset score
    enemies = []; // Clear enemies
    gameStarted = false; // Reset game state
    startOverlay.style.display = 'block'; // Show start overlay
}

// Show the start overlay when the page loads
startOverlay.style.display = 'block';

setInterval(spawnEnemy, enemySpawnInterval);

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
