const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');

let joystickActive = false;
let joystickCenter = { x: joystick.offsetLeft + joystick.offsetWidth / 2, y: joystick.offsetTop + joystick.offsetHeight / 2 };
let stickPosition = { x: joystickCenter.x, y: joystickCenter.y };

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

// Joystick events
stick.addEventListener('touchstart', (event) => {
    joystickActive = true;
    updateStickPosition(event.touches[0]);
});

stick.addEventListener('touchmove', (event) => {
    if (joystickActive) {
        updateStickPosition(event.touches[0]);
    }
});

stick.addEventListener('touchend', () => {
    joystickActive = false;
    resetStickPosition();
});

// Update stick position based on touch
function updateStickPosition(touch) {
    const touchX = touch.clientX - joystick.offsetLeft;
    const touchY = touch.clientY - joystick.offsetTop;

    const deltaX = touchX - 50; // 50 = half of stick width
    const deltaY = touchY - 50; // 50 = half of stick height
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const maxDistance = 40; // Max distance the stick can move

    if (distance < maxDistance) {
        stickPosition.x = joystickCenter.x + deltaX;
        stickPosition.y = joystickCenter.y + deltaY;
    } else {
        const angle = Math.atan2(deltaY, deltaX);
        stickPosition.x = joystickCenter.x + Math.cos(angle) * maxDistance;
        stickPosition.y = joystickCenter.y + Math.sin(angle) * maxDistance;
    }
}

// Reset stick position when touch ends
function resetStickPosition() {
    stickPosition.x = joystickCenter.x;
    stickPosition.y = joystickCenter.y;
}

// Game loop
function update() {
    // Handle player movement
    if (joystickActive) {
        const dx = stickPosition.x - joystickCenter.x;
        const dy = stickPosition.y - joystickCenter.y;
        
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) { // Minimum movement threshold
            player.x += Math.cos(angle) * player.speed;
            player.y += Math.sin(angle) * player.speed;
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

    // Update stick position
    stick.style.transform = `translate(${stickPosition.x - 50}px, ${stickPosition.y - 50}px)`;

    requestAnimationFrame(update);
}

// Start the game loop
resizeCanvas();
update();
window.addEventListener('resize', resizeCanvas);
