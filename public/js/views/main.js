define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({

        el: "#page",
        template: tmpl,
        initialize: function () {
            //this.render();
        },
        render: function () {
            this.$el.html(this.template());
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