define([
    'backbone', 'models/score'
], function(
    Backbone,
    Player
){

    var Collection = Backbone.Collection.extend({
        model: Player,
        comparator: function(player) {
            return -player.get("score");
        }
    });

    return new Collection([
        {"name": "Hugo", "score": 1},
        {"name": "Dima", "score": 2},
        {"name": "Alex", "score": 22},
        {"name": "McLovin43", "score": 99},
        {"name": "Hugo", "score": 14},
        {"name": "Dima", "score": 23},
        {"name": "Alex", "score": 1},
        {"name": "McLovin43", "score": 109},
        {"name": "Hugo", "score": 1},
        {"name": "Dima", "score": 2}
    ]);
});