define([
    'backbone',
    'tmpl/game',
    'views/viewManager',
    'engine/gameEngine',
    'views/gameOver'
    //'engine/wall',
    //'engine/human',
    //'engine/world'
], function(
    Backbone,
    tmpl,
    viewManager,
    gameStart
){
    var View = Backbone.View.extend({
        _name: "game",
        el: "#game",
        template: tmpl,
        initialize: function () {
            this.render();
            this.hide();
            //gameStart();
        },
        render: function () {
            this.$el.html(this.template());
            //$(".game__screen").show();
            //gameStart();
        },
        show: function () {
            $.event.trigger({
                type: "show",
                _name: this._name
            }); 
            this.$el.show();
            gameStart();
        },
        hide: function () {
            this.$el.hide();
            //$(".game__screen").show();
        }

    });

    return new View();
});