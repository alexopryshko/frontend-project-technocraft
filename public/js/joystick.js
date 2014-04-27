require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "/js/lib/jquery",
        underscore: "/js/lib/underscore",
        backbone: "/js/lib/backbone",
        Connector: "/js/lib/Connector",
        FnQuery: "/js/lib/FnQuery",
        //device_orientation: "js/lib/deviceapi-normaliser",
        "socket.io": "/socket.io/socket.io"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "socket.io": {
            exports: "io"
        },
        "device_orientation": {
            exports: "deviceOrientation"
        }
    }
});


require(['js/lib/Connector.js'/*, 'lib/deviceapi-normaliser'*/], function(Connection) {

	var server = new Connection({
			//server: ['bind'],
			remote: '/player'
		}
	);

    $('#submit').click(function() {
    	
        server.bind({
            token: $('#token').val()
        }, function(answer) {
            if (answer.status == 'success') {
                console.log("success");
            } else {
                console.log("error");
            }
        });


        return false;
    });

    $('#send').click(function() {

    	console.log("_test_");
        
        server.send('message_asdfjhgkajshdf', function(answer){
			console.log(answer);
		});

        return false;
    });


    // Инициализация
    var init = function() {
        // Если id нет
        if (!localStorage.getItem('guid')) {
            // Получаем токен
            this.server.getToken(function(token) {
                console.log('token= ' + token);

            });
        } else { // иначе
            // переподключаемся к уже созданной связке
            reconnect.call(this);
        }
    };

    // Переподключение
    var reconnect = function() {
        // Используем сохранненный id связки
        var self = this;
        server.bind({
            guid: localStorage.getItem('guid')
        }, function(data) {
            // Если все ок
            if (data.status == 'success') {
                // Стартуем
                localStorage.setItem('guid', data.guid);

                // Если связки уже нет
            } else if (data.status == 'undefined guid') {
                // Начинаем все заново
                localStorage.removeItem('guid');
                init.call(self);
            }
        });
    };


    //var server = new Connection({
    //    remote: '/player'
    //});
	

    init();

});