define([
    'backbone',
    'tmpl/scoreboard',
    'collections/scores',
    'tmpl/score',
    'views/viewManager'
], function(
    Backbone,
    tmpl,
    scores,
    tmplScore,
    viewManager
){


    var PlayerView = Backbone.View.extend({

        tagName: "li",
        className: "scoreboard__list__item",
        template: tmplScore,

        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },

        render: function () {
            this.el.innerHTML = this.template(this.model.attributes);
            return this;
        },

        destroy: function () {

        }
    });

    var ScoresViews = Backbone.View.extend({
        el: ".scoreboard__list",

        initialize : function() {
            var that = this;
            this._playerViews = [];
            this.collection.sort();
            this.collection.each(function(player) {
                that._playerViews.push(new PlayerView({
                    model : player,
                    tagName : 'li'
                }));
            });
        },

        render : function() {
            var that = this;
            $(this.el).empty();
            _(this._playerViews).each(function(pv) {
                $(that.el).append(pv.render().el);
            });
        }

    });

    var View = Backbone.View.extend({

        el: "#scoreboard",
        template: tmpl,
        _name: "scoreboard",

        initialize: function () {
            this.render();
            this.scoresView = new ScoresViews({
                collection: scores
            });
            this.hide();
        },
        render: function () {
            this.$el.html(this.template());
        },
        show: function () {
            this.$el.show();
            this.scoresView.render();
            $.event.trigger({
                type: "show",
                _name: this._name
            }); 
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});