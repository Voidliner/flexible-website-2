<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galactic Defender</title>
    <style>
        canvas { background: black; display: block; margin: 0 auto; }
        #titleScreen {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
            font-size: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .controls {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        .control-button {
            background: rgba(255, 255, 255, 0.5);
            border: none;
            padding: 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
        }

        /* Hide controls for PC view */
        @media (min-width: 768px) {
            .controls {
                display: none; /* Hide controls on larger screens */
            }
        }
    </style>
</head>
<body>
    <div id="titleScreen">
        <h1>Galactic Defender</h1>
        <p>Press Spacebar or Click Anywhere to Start</p>
    </div>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <div class="controls">
        <button class="control-button" id="upButton">↑</button>
        <button class="control-button" id="leftButton">←</button>
        <button class="control-button" id="downButton">↓</button>
        <button class="control-button" id="rightButton">→</button>
        <button class="control-button" id="shootButton">Shoot</button>
    </div>
    <script src="game.js"></script>
</body>
</html>
