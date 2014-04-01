function Enemy(ctx, imgSprite) {
    this.ctx = ctx;
    this.imgSprite = imgSprite;
    this.srcX = 350;
    this.srcY = 650;
    this.width = 70;
    this.height = 90;
    this.drawX = randomRange(0, 800 - this.width);
    this.drawY = randomRange(0, 600 - this.height);
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
    this.targetX = this.centerX;
    this.targetY = this.centerY;
    this.randomMoveTime = randomRange(500, 2000);
    this.speed = 0.5;
    var that = this;
    this.animationCounter = 0;
    this.animationFrameIndex = 0;
    this.moveInterval = setInterval(function() {that.setTargetLocation();}, that.randomMoveTime);
    this.isDead = false;
}

Enemy.prototype.update = function () {
    this.checkDirection();
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
};

Enemy.prototype.draw = function () {
    this.ctx.drawImage(this.imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};


Enemy.prototype.setTargetLocation = function () {
    this.randomMoveTime = randomRange(2000, 4000);
    var minX = this.centerX - 200,
        maxX = this.centerX + 200,
        minY = this.centerY - 200,
        maxY = this.centerY + 200;
    if (minX < 0) {
        minX = 0;
    }
    if (maxX > 800) {
        maxX = 800;
    }
    if (minY < 0) {
        minY = 0;
    }
    if (maxY > 600) {
        maxY = 600;
    }
    this.targetX = randomRange(minX, maxX);
    this.targetY = randomRange(minY, maxY);
};

Enemy.prototype.checkDirection = function () {
    if (!this.isDead) {
        this.animationCounter++;
        if (this.animationCounter % 5 == 0) {
            this.animationFrameIndex++;
            if (this.animationFrameIndex > 4) {
                this.animationFrameIndex = 0;
            }
        }
        if (this.isStay) {
            this.srcX = 350;
        }
        if (this.centerX < this.targetX) {
            this.drawX += this.speed;
            this.srcY = 930;
            this.srcX = 350 + this.animationFrameIndex * 70;
        } else if (this.centerX > this.targetX) {
            this.drawX -= this.speed;
            this.srcY = 740;
            this.srcX = 350 + this.animationFrameIndex * 70;
        }
        if (this.centerY < this.targetY) {
            this.drawY += this.speed;
            this.srcY = 650;
            this.srcX = 350 + this.animationFrameIndex * 70;
        } else if (this.centerY > this.targetY) {
            this.drawY -= this.speed;
            this.srcY = 840;
            this.srcX = 350 + this.animationFrameIndex * 70;
        }
    }
};

Enemy.prototype.die = function () {
    var soundEffect = new Audio("audio/dying.wav");
    soundEffect.play();

    clearInterval(this.moveInterval);
    this.srcX = 700;
    this.isDead = true;
};


function randomRange(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}