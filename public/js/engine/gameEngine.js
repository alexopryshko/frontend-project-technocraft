
define(function() {
    var canvas;
    var ctx;

    var Background = new Image();

    var wallImg = new Image();
    var humanImg = new Image();

    var wallObj = null;
    var humanObj = null;
    var worldObj = null;

    /*var map = [
        [0, 0, 30, 30],
        [0, 30, 30, 30],
        [0, 60, 30, 30],
        [0, 90, 30, 30],
        [450, 150, 30, 30],

    ];*/

    var map = [
        [150, 120, 30, 30],
        [480, 150, 30, 30],
        [180, 180, 30, 30],
        [360, 180, 30, 30],
        [390, 180, 30, 30],
        [420, 180, 30, 30],
        [450, 180, 30, 30],
        [480, 180, 30, 30],
        [510, 180, 30, 30],
        [150, 210, 30, 30],
        [180, 210, 30, 30],
        [510, 210, 30, 30],
        [540, 210, 30, 30],
        [570, 210, 30, 30],
        [600, 210, 30, 30],
        [150, 240, 30, 30],
        [270, 240, 30, 30],
        [300, 240, 30, 30],
        [570, 240, 30, 30],
        [150, 270, 30, 30],
        [180, 270, 30, 30],
        [210, 270, 30, 30],
        [240, 270, 30, 30],
        [270, 270, 30, 30],
        [300, 270, 30, 30],
    ];

    function LineDistance_sqr(x, y, p1x, p1y, p2x, p2y) {
       dx = p2x-p1x;
       dy = p2y-p1y;      
       t = (dx*(x - p1x) + dy*(y - p1y)) / (dx*dx + dy*dy);
       t = Math.min(Math.max(t,0),1);
       px = dx * t + p1x;
       py = dy * t + p1y;
       return (x-px)*(x-px) + (y-py)*(y-py);
    }
 
    function CircleIntersect(x, y, r, p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
       d = LineDistance_sqr(x,y,p1x,p1y,p2x,p2y);
       d = Math.min(d,LineDistance_sqr(x,y,p2x,p2y,p3x,p3y));
       d = Math.min(d,LineDistance_sqr(x,y,p3x,p3y,p4x,p4y));
       d = Math.min(d,LineDistance_sqr(x,y,p4x,p4y,p1x,p1y));
       return d < r * r;
    }

    function StartGame() {
        canvas = document.getElementById("myCanvas");
        
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.rect(0, 0, 810, 600);
        ctx.fill();

        Background = ctx.getImageData(0, 0, 810, 600);

        humanObj = new Human(100, 100);
        humanImg = humanObj.createImg(ctx);

        worldObj = new World();
        wallImg = worldObj.createWorld(map, ctx);

        wallObj = new Wall(0, 0, 30, 30);
        wallImg = wallObj.createImg(ctx);  
        
        gameLoop = setInterval(doGameLoop, 16);
        window.addEventListener('keydown', whatKey, true);
    }

    function doGameLoop() {
        ctx.putImageData(Background, 0, 0);

        for (var i = 0; i < worldObj.getSize(); i++) {
            wallObj = worldObj.getItem(i);
            getX = wallObj.getX();
            getY = wallObj.getY();
            ctx.putImageData(wallImg, getX, getY);
        };
        
        ctx.putImageData(humanImg, humanObj.getX(), humanObj.getY());
    }

    function whatKey(evt) {
        var flag = 0;

        var humanX = humanObj.getX();
        var humanY = humanObj.getY();

        switch (evt.keyCode) {
            case 37:
                humanX = humanX - 5;
                if (humanX < 0) {
                    humanX = 0;
                    flag = 1;
                }
                
                break;

            case 39:
                humanX = humanX + 5;
                if (humanX > 770) {
                    humanX = 770;
                    flag = 1;
                }
                break;

            case 40:
                humanY = humanY + 5;
                if (humanY > 570) {
                    humanY = 570;
                    flag = 1;
                }
                break;

            case 38:
                humanY = humanY - 5;
                if (humanY < 0) {
                    humanY = 0;
                    flag = 1;
                }
                break;
        }

        for (var i = 0; i < worldObj.getSize(); i++) {
            wallObj = worldObj.getItem(i);

            h = wallObj.getHeight();
            w = wallObj.getWidth();
            x = wallObj.getX();
            y = wallObj.getY();
            r = humanObj.getR();

            if (CircleIntersect(humanX + r, humanY + r, r, x, (y + h), x, y, (x + w), y, (x + w), (y + h))) {
                flag = 1;
                break;
            }
        }

        if (!flag) {
            humanObj.setX(humanX);
            humanObj.setY(humanY);
        }
    }

    return StartGame;
});