define([
    'backbone',
    'tmpl/game',
    'engine/gameEngine',
    'engine/wall',
    'engine/human',
    'engine/world'
], function(
    Backbone,
    tmpl,
    gameStart
){
    var View = Backbone.View.extend({

        el: "#page",
        template: tmpl,
        initialize: function () {
            // TODO
        },
        render: function () {
            this.$el.html(this.template());
            gameStart();
            return this;
        },
        show: function () {
            // TOD
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});