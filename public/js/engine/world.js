function World() {
    // Свойство
    this.map = new Array();

    // Метод
    this.createWorld = function(mapArray, ctx) {
        //console.log(mapArray.length);
        img = null;
        for (var i = 0; i < mapArray.length; i++) {
            tempMap = mapArray[i];
            //console.log(tempMap[0]);
            obj = new Wall(tempMap[0], tempMap[1], tempMap[2], tempMap[3]);
            //img = obj.createImg(ctx);
            this.map.push(obj);
        };

        //return img;
    }

    this.getItem = function(i) {
        return this.map[i];
    }
    this.getSize = function() {
        return this.map.length;
    }

}