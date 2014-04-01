define([
    'backbone',
    'models/score',
    'engine/storage'
], function (
    Backbone,
    Player,
    Storage
) {

    var thatCollection;

    var Collection = Backbone.Collection.extend({
        model: Player,
        comparator: function (player) {
            return -player.get("score");
        },

        url: "/scores",

        initialize: function () {
            thatCollection = this;
            var failedDownload = function () {
                var data = Storage.getAll();
                for (var i = 0; i < data.length; ++i) {
                    var parsedData = JSON.parse('{"' + decodeURI(data[i].replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
                    thatCollection.models.push(new Player(parsedData));
                }
            };

            var successDownload = function () {
                var data = Storage.getAll();
                for (var i = 0; i < data.length; ++i) {
                    var parsedData = JSON.parse('{"' + decodeURI(data[i].replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
                    var player = new Player(parsedData);
                    player.save();
                }
                Storage.clear();
            }

            this.fetch({data: {limit: 10},
                    error: failedDownload,
                    success: successDownload}
            );

        }
    });

    return new Collection();
});