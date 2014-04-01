define([
    'engine/environment',
    'views/gameOver',
    'engine/player',
    'engine/obstacle',
    'engine/enemy'
], function(
    environment,
    GameOver
) {
    var isPlaying,
        requestAnimFrame,
        envVariables;

    function Game() {

        environment.initEnv();
        isPlaying = false;
        requestAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        envVariables = environment.getVariables();

        envVariables.imageSprite.src = "images/sprite.png";

        envVariables.imageSprite.addEventListener("load", init, false);

    }
    
    function init() {
        document.addEventListener("keydown", function(e) {checkKey(e, true);}, false);
        document.addEventListener("keyup", function(e) {checkKey(e, false);}, false);
        environment.defineObstacles();
        environment.initEnemies();
        envVariables = environment.getVariables();
        startGame();

    }

    function startGame() {
        envVariables.ctxBg.drawImage(envVariables.imageSprite, 0, 0, envVariables.canvasWidth, envVariables.canvasHeight,
            0, 0, envVariables.canvasWidth, envVariables.canvasHeight);
        isPlaying = true;
        requestAnimFrame(gameLoop);
    }

    function update() {
        clearCtx(envVariables.ctxEntities);
        updateAllEnemies();
        envVariables.player1.update();
    }

    function draw() {
        drawAllEnemies();
        envVariables.player1.draw();
    }

    function gameLoop() {
        if (isPlaying) {
            update();
            draw();
            isPlaying = envVariables.player1.isLive;
            requestAnimFrame(gameLoop);
        } else {
            console.log('go');
            var gameOver  = new GameOver();
            gameOver.show(30);

        }
    }

    function clearCtx(ctx) {
        ctx.clearRect(0, 0, envVariables.canvasWidth, envVariables.canvasHeight);
    }

    function checkKey(e, value) {
        var keyID = e.keyCode || e.which;
        if (keyID === 38) { // Up arrow
            envVariables.player1.isUpKey = value;
            e.preventDefault();
        }
        if (keyID === 39) { // Right arrow
            envVariables.player1.isRightKey = value;
            e.preventDefault();
        }
        if (keyID === 40) { // Down arrow
            envVariables.player1.isDownKey = value;
            e.preventDefault();
        }
        if (keyID === 37) { // Left arrow
            envVariables.player1.isLeftKey = value;
            e.preventDefault();
        }
        if (keyID === 32) { // Spacebar
            envVariables.player1.isSpacebar = value;
            e.preventDefault();
        }
        envVariables.player1.isStay = !value;
    }


    function updateAllEnemies() {
        for (var i = 0; i < envVariables.enemies.length; i++) {
            envVariables.enemies[i].update();
        }
    }

    function drawAllEnemies() {
        for (var i = 0; i < envVariables.enemies.length; i++) {
            envVariables.enemies[i].draw();
        }
    }

    return Game;
});