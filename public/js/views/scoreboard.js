define([
    'backbone',
    'tmpl/scoreboard',
    'collections/scores',
    'tmpl/score',
    'views/viewManager',
    'models/score'
], function(
    Backbone,
    tmpl,
    scores,
    tmplScore,
    viewManager,
    Player
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

        },

        render : function() {
            var that = this;
            $(that.el).empty();
            $.ajax({
                    type: 'GET',
                    url: 'scores',
                    data: {
                        limit: 10
                    },
                    dataType: 'json',
                    success: function(data) {
                        $(that.el).empty();
                        for (var i = 0; i < data.length; ++i) {
                            pv = new PlayerView({
                                model : new Player(data[i]),
                                tagName : 'li'
                            }); 
                            $(that.el).append(pv.render().el);
                        }
                    },
                    error: function(data) {
                        $(that.el).empty();
                        $(that.el).append("Error conection");
                        //тут надо сделать кнопку повторной загрузки
                    }
                }); 
        }

    });

    var View = Backbone.View.extend({

        el: "#scoreboard",
        template: tmpl,
        _name: "scoreboard",

        initialize: function () {
            this.render();
            this.scoresView = new ScoresViews();
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