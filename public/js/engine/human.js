function Human(x, y) {
    // Свойство
    this.x = x;
    this.y = y;
    this.radius = 10;

    // Метод
    this.createImg = function(ctx) {
        ctx.beginPath();
        ctx.arc(10, 10, this.radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = "rgb(222, 103, 0)";
        ctx.fill();

        return ctx.getImageData(10 - this.radius, 10 - this.radius , 10 + this.radius, 10 + this.radius);
    }

    this.getX = function() {
        return this.x;
    }

    this.getY = function() {
        return this.y;
    }

    this.getR = function() {
        return this.radius;
    }

    this.setX = function(value) {
        this.x = value;
    }

    this.setY = function(value) {
        this.y = value;
    }
}