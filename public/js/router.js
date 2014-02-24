define(['backbone', 'views/main', 'views/game', 'views/scoreboard'
], function(
    Backbone,
    mainView,
    gameView,
    scoreBoardView
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
        defaultActions: function () {
            mainView.render();

        },
        scoreboardAction: function () {
            gameView.render();
        },
        gameAction: function () {
            scoreBoardView.render();
        }
    });

    return new Router();
});