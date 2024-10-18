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
    isMoving: false, // Flag to indicate if player is moving
};

// Controls
const keys = {};

// Keydown event for PC controls
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

// Keyup event for PC controls
window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Variables for touch movement
let startTouchX, startTouchY;
const swipeThreshold = 10; // Minimum distance to consider as a swipe

// Touch events for movement
canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    startTouchX = touch.clientX;
    startTouchY = touch.clientY;

    // Reset isMoving
    player.isMoving = false;
});

canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - startTouchX;
    const deltaY = touch.clientY - startTouchY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if the distance exceeds the swipe threshold
    if (distance > swipeThreshold) {
        player.targetX += deltaX;
        player.targetY += deltaY;

        // Update starting position for next move
        startTouchX = touch.clientX;
        startTouchY = touch.clientY;

        // Start moving towards the target
        player.isMoving = true;
    }
});

canvas.addEventListener('touchend', () => {
    // Stop moving when the touch ends
    player.isMoving = false;
});

// Game loop
function update() {
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
        
        // If the distance is greater than 1, move towards the target
        if (distance > 1) {
            player.x += (dx / distance) * player.speed;
            player.y += (dy / distance) * player.speed;
        }
    }

    // Prevent player from going out of bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
}

// Start the game loop
resizeCanvas();
update();
window.addEventListener('resize', resizeCanvas);
