define([
    'backbone', 
    'models/score'
], function(
    Backbone,
    Player
){

    var Collection = Backbone.Collection.extend({
        model: Player,
        comparator: function(player) {
            return -player.get("score");
        },
    });



    return new Collection();

});