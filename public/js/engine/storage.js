define(function () {
    var scores = getJSON("scores");

    if (scores == null) {
        scores = [];
    }

    function sortScores(){
        scores.sort(function(a,b){
            return b.score - a.score;
        });
    }

    function setJSON(key, value) {
        var jsonArray = JSON.stringify(value);
        localStorage.setItem(key, jsonArray);
    }

    function getJSON(key) {
        var value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    return {
        getAll: function() {
            sortScores();
            return scores;
        },

        put: function(score) {
            scores.push(score);
            setJSON("scores", scores);
        },

        clear: function(score) {
            localStorage.clear();
            scores = [];
        }

    };
});
