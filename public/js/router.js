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
        },
        defaultActions: function () {
            //mainView.render();
            viewManager.addView(mainView._name, mainView);
            mainView.show();

        },
        scoreboardAction: function () {
            //scoreBoardView.render();
            viewManager.addView(scoreBoardView._name, scoreBoardView);
            scoreBoardView.show();
        },
        gameAction: function () {
            //gameView.render();
            viewManager.addView(gameView._name, gameView);
            gameView.show();
        }
    });

    return new Router();
});