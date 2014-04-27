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


require(['js/lib/Connector.js'/*, 'lib/deviceapi-normaliser'*/], function(Connector) {

    $('#send').click(function() {

    	console.log("_test_");
        
        server.send('message_asdfjhgkajshdf', function(answer){
			console.log(answer);
		});

        return false;
    });


    var input = document.getElementById('token');
    // Создаем связь с сервером
	var server = new Connector({
			server: ['bind'],
			remote: '/player'
		}
	);

	// Инициализация
	init = function(){
		//message.innerHTML = 'ready';
		// Если id нет
		if (!localStorage.getItem('playerguid')){
			// Ждем ввода токена
			input.parentNode.addEventListener('submit', function(e){
				e.preventDefault();
				console.log('asfd');
				// И отправляем его на сервер
				server.bind({token: input.value}, function(data){
					if (data.status == 'success'){ //  В случае успеха
						// Стартуем джостик
						start(data.guid);
					}
				});
			}, false);

		} else { // иначе
			// переподключаемся к уже созданной связке
			reconnect();
		}
	};

	// Переподключение
	// Используем сохранненный id связки
	reconnect = function(){
		server.bind({guid: localStorage.getItem('playerguid')}, function(data){
			// Если все ок
			if (data.status == 'success'){
				// Стартуем
				start(data.guid);
			// Если связки уже нет
			} else if (data.status == 'undefined guid'){
				// Начинаем все заново
				localStorage.removeItem('playerguid');
				init();
			}
		});
	};

	// Старт игры
	start = function(guid){
		console.log('start player');
		// Сохраняем id связки
		localStorage.setItem('playerguid', guid);
		//message.innerHTML = 'game';
	};

	server.on('reconnect', reconnect);

	init();



});