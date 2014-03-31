
define([
'views/gameOver',
'views/game' 
],  
function(
    GameOver, 
    gameView) {

    function StartGame() {

        //gameView.hide();

        gameOverFrom = new GameOver();
        gameOverFrom.show(10);

        //gameView.hide();
        //$('#endGame').on("submit" , showFrom);

    }

    return StartGame;
});