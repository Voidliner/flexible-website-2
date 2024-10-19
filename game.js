const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const positionLabel = document.getElementById('positionLabel');

// Resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reset player position
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
}

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    speed: 5,
    color: 'blue',
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    isMoving: false,
};

// Bullet object
const bullets = [];
const bulletSpeed = 30;
const firingInterval = 250; // Firing interval in milliseconds
let lastFiredTime = 0; // Last time a bullet was fired

// Controls
const keys = {};
let shooting = false;

// Keydown event for PC controls
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    if (event.key === ' ') shooting = true; // Start shooting when spacebar is pressed
});

// Keyup event for PC controls
window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
    if (event.key === ' ') shooting = false; // Stop shooting when spacebar is released
});

// Touch events for movement and shooting
canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    startTouchX = touch.clientX;
    startTouchY = touch.clientY;

    // Reset isMoving
    player.isMoving = false;

    // Start shooting when touching the canvas
    shooting = true;
});

canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - startTouchX;
    const deltaY = touch.clientY - startTouchY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if the distance exceeds the swipe threshold
    if (distance > swipeThreshold) {
        player.targetX = touch.clientX - player.width / 2;
        player.targetY = touch.clientY - player.height / 2;
        player.isMoving = true;
    }
});

canvas.addEventListener('touchend', () => {
    player.isMoving = false;
    shooting = false; // Stop shooting when touch ends
});

// Function to shoot bullets
function shootBullet() {
    const bullet = {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        radius: 5,
        angle: Math.atan2(player.targetY - player.y, player.targetX - player.x),
    };
    bullets.push(bullet);
}

// Game loop
function update() {
    const currentTime = Date.now();

    // Handle PC controls
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

    // Smoothly move the player towards the target if isMoving is true
    if (player.isMoving) {
        const dx = player.targetX - player.x;
        const dy = player.targetY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            player.x += (dx / distance) * player.speed;
            player.y += (dy / distance) * player.speed;
        }
    }

    // Prevent player from going out of bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Handle shooting with firing interval
    if (shooting && currentTime - lastFiredTime > firingInterval) {
        shootBullet();
        lastFiredTime = currentTime; // Update the last fired time
    }

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.y += Math.sin(bullet.angle) * bulletSpeed; // Move bullet in y direction

        // Remove bullets that are off-screen
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(update);
}

// Start the game loop
resizeCanvas();
update();
window.addEventListener('resize', resizeCanvas);
