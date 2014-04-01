define([
    'engine/player',
    'engine/obstacle',
    'engine/enemy'
], function (Player) {
        var canvasBg,
            ctxBg,
            canvasEntities,
            ctxEntities,
            canvasWidth,
            canvasHeight,
            imageSprite = new Image(),
            player1,
            obstacles = [],
            enemies = [],
            numEnemies = 5;



        function initEnv() {
            canvasBg = document.getElementById("canvasBg");
            ctxBg = canvasBg.getContext("2d");
            canvasEntities = document.getElementById("canvasEntities");
            ctxEntities = canvasEntities.getContext("2d");
            canvasWidth = canvasBg.width;
            canvasHeight = canvasBg.height;
            imageSprite.src = "images/sprite.png";
            numEnemies = 5;
            player1 = new Player(ctxEntities, imageSprite, this);
        }


        function defineObstacles() {
            obstacles = [new Obstacle(300, 0, 230, 170),
                new Obstacle(92, 300, 40, 100),
                new Obstacle(419, 300, 27, 100),
                new Obstacle(638, 92, 25,100)];

            player1.visibleObstacles = obstacles;
        }

        function initEnemies() {
            for (var i = 0; i < numEnemies; i++) {
                enemies[enemies.length] = new Enemy(ctxEntities, imageSprite);
            }
        }

        function getVariables(){
            return {
                canvasBg: canvasBg,
                ctxBg: ctxBg,
                canvasEntities: canvasEntities,
                ctxEntities: ctxEntities,
                canvasWidth: canvasWidth,
                canvasHeight: canvasWidth,
                imageSprite: imageSprite,
                player1: player1,
                obstacles: obstacles,
                enemies: enemies,
                numEnemies: numEnemies
            };
        }

        return {
            defineObstacles: defineObstacles,
            initEnemies: initEnemies,
            initEnv: initEnv,
            getVariables: getVariables
        };

    });