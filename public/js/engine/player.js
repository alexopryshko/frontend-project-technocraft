define(function () {
    function Player(ctx, imgSprite, environment) {
        this.ctx = ctx;
        this.imgSprite = imgSprite;
        this.srcX = 0;
        this.srcY = 845;
        this.width = 70;
        this.height = 95;
        this.drawX = 500;
        this.drawY = 300;
        this.animationCounter = 0;
        this.animationFrameIndex = 0;
        this.centerX = this.drawX + (this.width / 2);
        this.centerY = this.drawY + (this.height / 2);
        this.speed = 2.2;
        this.isUpKey = false;
        this.isRightKey = false;
        this.isDownKey = false;
        this.isLeftKey = false;
        this.isSpacebar = false;
        this.isShooting = false;
        var numBullets = 10;
        this.bullets = [];
        this.currentBullet = 0;
        this.isLive = true;
        this.isStay = true;
        this.environment = environment;
        for (var i = 0; i < numBullets; i++) {
            this.bullets[this.bullets.length] = new Bullet(this, environment);
        }
    }

    Player.prototype.update = function () {
        this.centerX = this.drawX + (this.width / 2);
        this.centerY = this.drawY + (this.height / 2);
        this.checkDirection();
        this.checkShooting();
        this.updateAllBullets();
    };


    Player.prototype.draw = function () {
        this.drawAllBullets();
        this.ctx.drawImage(this.imgSprite, this.srcX, this.srcY, this.width, this.height,
            this.drawX, this.drawY, this.width / 1.2, this.height / 1.2)
    };

    Player.prototype.checkDirection = function () {
        var newDrawX = this.drawX,
            newDrawY = this.drawY,
            obstacleCollision = false;

        this.animationCounter++;
        if (this.animationCounter % 5 == 0) {
            this.animationFrameIndex++;
            if (this.animationFrameIndex > 4) {
                this.animationFrameIndex = 0;
            }
        }
        if (this.isStay) {
            this.srcX = 0;
        }
        if (this.isUpKey) {
            newDrawY -= this.speed;
            this.srcX = 0 + this.animationFrameIndex * 70;
            this.srcY = 840;
        } else if (this.isDownKey) {
            newDrawY += this.speed;
            this.srcX = 0 + this.animationFrameIndex * 70;
            this.srcY = 655;
        } else if (this.isRightKey) {
            newDrawX += this.speed;
            this.srcX = 0 + this.animationFrameIndex * 70;
            this.srcY = 935;
        } else if (this.isLeftKey) {
            newDrawX -= this.speed;
            this.srcX = 0 + this.animationFrameIndex * 70;
            this.srcY = 745;
        }

        obstacleCollision = this.checkObstacleCollide(newDrawX, newDrawY);

        if (!obstacleCollision && !outOfBounds(this, newDrawX, newDrawY)) {
            this.drawX = newDrawX;
            this.drawY = newDrawY;

        }


        this.checkEnemyContact();

    };

    Player.prototype.checkObstacleCollide = function (newDrawX, newDrawY) {
        var obstacleCounter = 0,
            newCenterX = newDrawX + (this.width / 2),
            newCenterY = newDrawY + (this.height / 2);
        for (var i = 0; i < this.visibleObstacles.length; i++) {
            if (this.visibleObstacles[i].leftX < newCenterX && newCenterX < this.visibleObstacles[i].rightX
                && this.visibleObstacles[i].topY - 20 < newCenterY && newCenterY < this.visibleObstacles[i].bottomY - 20) {
                obstacleCounter = 0;
            } else {
                obstacleCounter++;
            }
        }

        if (obstacleCounter === this.visibleObstacles.length) {
            return false;
        } else {
            return true;
        }

    };


    Player.prototype.checkShooting = function () {
        if (this.isSpacebar && !this.isShooting) {
            this.isShooting = true;
            this.bullets[this.currentBullet].fire(this.centerX, this.centerY);
            this.currentBullet++;
            if (this.currentBullet >= this.bullets.length) {
                this.currentBullet = 0;
            }
        } else if (!this.isSpacebar) {
            this.isShooting = false;
        }
    };

    Player.prototype.updateAllBullets = function () {
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].isFlying) {
                this.bullets[i].update();
            }
        }
    };

    Player.prototype.drawAllBullets = function () {
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].isFlying) {
                this.bullets[i].draw();
            }
        }
    };

    Player.prototype.checkEnemyContact = function() {
        for (var i = 0; i < this.environment.getVariables().enemies.length; i++) {
            if (collision(this, this.environment.getVariables().enemies[i]) && !this.environment.getVariables().enemies[i].isDead) {
                this.isLive = false;
            }
        }
    }


    function outOfBounds(object, x, y) {
        var newBottomY = y + object.height,
            newTopY = y,
            newRightX = x + object.width,
            newLeftX = x,
            treeLineTop = 5,
            treeLineBottom = 570,
            treeLineRight = 750,
            treeLineLeft = 65;
        return newBottomY > treeLineBottom ||
            newTopY < treeLineTop ||
            newRightX > treeLineRight ||
            newLeftX < treeLineLeft;
    }


    function Bullet(holder, environment) {
        this.holder = holder;
        this.env = environment;
        this.radius = 2;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.drawX = 0;
        this.drawY = 0;
        this.isFlying = false;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 6;
    }

    Bullet.prototype.update = function () {
        this.drawX += this.xVel;
        this.drawY += this.yVel;
        this.checkHitEnemy();
        this.checkHitObstacle();
        this.checkOutOfBounds();
    };

    Bullet.prototype.draw = function () {
        this.env.getVariables().ctxEntities.fillStyle = "white";
        this.env.getVariables().ctxEntities.beginPath();
        this.env.getVariables().ctxEntities.arc(this.drawX, this.drawY, this.radius, 0, Math.PI * 2, false);
        this.env.getVariables().ctxEntities.closePath();
        this.env.getVariables().ctxEntities.fill();
    };

    Bullet.prototype.fire = function (startX, startY) {
        this.drawX = startX;
        this.drawY = startY;
        if (this.holder.srcY === 655) {
            this.xVel = 0;
            this.yVel = this.speed;
        } else if (this.holder.srcY === 840) {
            this.xVel = 0;
            this.yVel = -this.speed;
        } else if (this.holder.srcY === 745) { // Facing west
            this.xVel = -this.speed;
            this.yVel = 0;
        } else if (this.holder.srcY === 935) { // Facing east
            this.xVel = this.speed;
            this.yVel = 0;
        }
        this.isFlying = true;
    };

    Bullet.prototype.recycle = function () {
        this.isFlying = false;
    };

    Bullet.prototype.checkHitEnemy = function () {
        for (var i = 0; i < this.env.getVariables().enemies.length; i++) {
            if (collision(this, this.env.getVariables().enemies[i]) && !this.env.getVariables().enemies[i].isDead) {
                this.recycle();
                this.env.getVariables().enemies[i].die();
            }
        }
    };

    Bullet.prototype.checkHitObstacle = function () {
        for (var i = 0; i < this.holder.visibleObstacles.length; i++) {
            if (collision(this, this.holder.visibleObstacles[i])) {
                this.recycle();
            }
        }
    };

    Bullet.prototype.checkOutOfBounds = function () {
        if (outOfBounds(this, this.drawX, this.drawY)) {
            this.recycle();
        }
    };



    function collision(a, b) {
        return a.drawX <= b.drawX + b.width &&
            a.drawX >= b.drawX &&
            a.drawY <= b.drawY + b.height &&
            a.drawY >= b.drawY;
    }

    return Player;
});