define([
    'backbone',
    'tmpl/scoreboard',
    'collections/scores',
    'tmpl/score'
], function(
    Backbone,
    tmpl,
    scores,
    tmplScore
){


    var PlayerView = Backbone.View.extend({

        tagName: "li",
        className: "scoreboard__list__item",
        template: tmplScore,

        events: {
            "click .button_delete": "destroy"
        },

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

        el: "#page",
        template: tmpl,
        initialize: function () {
            // TODO
        },
        render: function () {
            this.$el.html(this.template());
            this.scoresView = new ScoresViews({
                collection: scores
            });
            this.scoresView.render();
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