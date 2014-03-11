function Wall(x, y, height, width) {
    // Свойство
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;

    // Метод
    this.createImg = function(ctx) {

        ctx.fillStyle = "rgb(166, 175, 179)";
        ctx.fillRect(this.x, this.y, this.height, this.width);

        return ctx.getImageData(0, 0, this.height, this.width);
    }

    //get
    this.getX = function() {
        return this.x;
    }
    this.getY = function() {
        return this.y;
    }
    this.getHeight = function() {
        return this.height;
    }
    this.getWidth = function() {
        return this.width;
    }

    //set
    this.setX = function(value) {
        this.x = value;
    }

    this.setY = function(value) {
        this.y = value;
    }


}