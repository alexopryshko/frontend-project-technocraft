define([
    'backbone',
    'tmpl/game',
    'engine/game'
], function(
    Backbone,
    tmpl,
    GameStart
){
    var View = Backbone.View.extend({

        el: "#page",
        template: tmpl,
        initialize: function () {
            // TODO
        },
        render: function () {
            this.$el.html(this.template());
            GameStart();
            return this;
        },
        show: function () {
            // TODO
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});