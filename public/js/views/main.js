define([
    'backbone',
    'tmpl/main',
    'views/viewManager'
], function(
    Backbone,
    tmpl,
    viewManager
){

    var View = Backbone.View.extend({
        _name: "main",
        el: "#main",
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
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});