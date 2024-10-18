const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    speed: 5,
    bullets: []
};

let enemies = [];
let enemySpawnInterval = 1000; // Spawn every second

function update() {
    // Move player based on keys
    if (keys['ArrowLeft'] || keys['a']) {
        player.x = Math.max(player.x - player.speed, 0);
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.x = Math.min(player.x + player.speed, canvas.width - player.width);
    }

    // Update bullets
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });

    // Render
    render();
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
    keys[e.key] = true;
    if (e.key === ' ') {
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
    shoot();
});

setInterval(spawnEnemy, enemySpawnInterval);

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
