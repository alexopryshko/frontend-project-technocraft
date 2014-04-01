define([
    'backbone',
    'tmpl/gameOver',
    'engine/storage',
    'views/viewManager',
    'models/score',
    'collections/scores',
    'views/game'
], function(
    Backbone,
    tmpl,
    storage
){
 
    var View = Backbone.View.extend({
        el: "#gameOver",
        template: tmpl,
        
        initialize: function () {
            _.bindAll(this, "render", "show", "hide");
        },

        render: function (score) {
            this.$el.html(this.template({score: score}));
            var game = this;
            $('#inputScore').on("submit" , this.postScores);
            $('#inputScore').on("success", this.hide);
        },

        show: function (score) {
            this.render(score);
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        postScores: function(event) {
            event.preventDefault();
            var data = $(this).serialize();

            $('.btn').prop("disabled", true);
            $.ajax({
                url : '/scores13',
                type: 'post',
                data: data,
                dataType: 'json',
                success : function(response) {
                    $('.btn').prop("disabled", false);
                    window.location = "/#scoreboard";
                    $('#inputScore').trigger("success");
                },

                error: function(response) {
                    storage.put(data);
                    window.location = "/#scoreboard";
                    $('#inputScore').trigger("success");
                }
            })
        }
 
    });

    return View;
});