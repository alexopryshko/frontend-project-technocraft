define([
    'backbone', 
    'views/main', 
    'views/game', 
    'views/scoreboard',
    'views/viewManager'
], function(
    Backbone,
    mainView,
    gameView,
    scoreBoardView,
    viewManager
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
        initialize: function() {
            this.viewManager = viewManager;
            viewManager.addView(mainView._name, mainView); 
            viewManager.addView(scoreBoardView._name, scoreBoardView);
            viewManager.addView(gameView._name, gameView);
        },
        defaultActions: function () {
            mainView.show();
        },
        scoreboardAction: function () {
            scoreBoardView.show();
        },
        gameAction: function () {
            gameView.show();
        }
    });

    return new Router();
});