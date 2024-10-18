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
    color: 'blue'
};

// Touch event for displaying coordinates
canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    // Update player position to where the touch occurred
    player.x = touchX - player.width / 2;
    player.y = touchY - player.height / 2;

    // Update the label with the touch position
    positionLabel.style.left = `${touchX + 10}px`;
    positionLabel.style.top = `${touchY + 10}px`;
    positionLabel.textContent = `X: ${touchX}, Y: ${touchY}`;
});

// Game loop
function update() {
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
