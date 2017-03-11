define([
    'backbone',
    'tmpl/game',
    'engine/game',
    'views/viewManager',
    'views/gameOver'
], function(
    Backbone,
    tmpl,
    GameStart
){
    var View = Backbone.View.extend({
        _name: "game",
        el: "#game",
        template: tmpl,
        initialize: function () {
            this.render();
            this.hide();
        },
        render: function () {
            this.$el.html(this.template());
        },
        show: function () {
            $.event.trigger({
                type: "show",
                _name: this._name
            }); 
            this.$el.show();
            GameStart();
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});