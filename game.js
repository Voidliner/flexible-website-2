const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
    color: 'blue'
};

// Controls
const keys = {};
const touchControls = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Keydown event
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

// Keyup event
window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Touch events for mobile
canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const { clientX, clientY } = touch;

    touchControls.up = clientY < canvas.height / 2;
    touchControls.down = clientY >= canvas.height / 2;
    touchControls.left = clientX < canvas.width / 2;
    touchControls.right = clientX >= canvas.width / 2;
});

canvas.addEventListener('touchend', () => {
    touchControls.up = false;
    touchControls.down = false;
    touchControls.left = false;
    touchControls.right = false;
});

// Resize the canvas initially and on window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game loop
function update() {
    // Handle player movement
    if (keys['ArrowUp'] || touchControls.up) player.y -= player.speed;
    if (keys['ArrowDown'] || touchControls.down) player.y += player.speed;
    if (keys['ArrowLeft'] || touchControls.left) player.x -= player.speed;
    if (keys['ArrowRight'] || touchControls.right) player.x += player.speed;

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
update();
