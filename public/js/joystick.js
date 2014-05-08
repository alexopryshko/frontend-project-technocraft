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
        //"socket.io": "/socket.io/socket.io"
        //"socket.io-client": "lib/socket.io/node_modules/socket.io-client",
        "socket.io": "/js/lib/socket.io/socket.io"
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


	document.getElementById('inputToken').onblur = function() {
		document.body.scrollTop = 0;
	}

	document.getElementById('startLayer').addEventListener('touchmove', function(event) {
		event.preventDefault();
	}, false); 


	$(window).resize(function () { 
		document.body.scrollTop = 0;
		var ratio = window.devicePixelRatio || 1;
		var width = screen.width * ratio;
		var height = screen.height * ratio;
		ctx.canvas.width  = width;
		ctx.canvas.height = height;
	});


    var input = document.getElementById('inputToken');
    var connect = document.getElementById('connect');
    var canvas = document.getElementById('convasJoystick');

    ctx = canvas.getContext('2d');
	var ratio = window.devicePixelRatio || 1;
	var width = screen.width * ratio;
	var height = screen.height * ratio;
	ctx.canvas.width  = width;
	ctx.canvas.height = height;

	var centerX = canvas.width / 4;
    var centerY = canvas.height / 2;
    var radius = 100;

    // Создаем связь с сервером
	var server = new Connector({
			server: ['bind'],
			remote: '/player'
		}
	);

	// Инициализация
	init = function(){
		if (!localStorage.getItem('playerguid')){
			document.getElementById('startLayer').style.display = 'block';
			connect.addEventListener('TouchStart', connection, false);
			connect.addEventListener('click', connection, false);
		} else { 
			reconnect();
		}
		return false;
	};

	connection = function(e) {
		e.preventDefault();
		server.bind({token: input.value}, function(data){
			if (data.status == 'success'){ 
				start(data.guid);
			}
		});
	}

	reconnect = function(){
		server.bind({guid: localStorage.getItem('playerguid')}, function(data){
			if (data.status == 'success'){
				start(data.guid);
			} else if (data.status == 'undefined guid'){
				// Начинаем все заново
				localStorage.removeItem('playerguid');
				init();
			}
		});
	};

	// Старт игры
	start = function(guid){
		document.getElementById('startLayer').style.display = 'none';
		canvas.style.display = 'block';
		console.log('start player');
		localStorage.setItem('playerguid', guid);
	};

	canvas.addEventListener('touchmove', function(event) {
		event.preventDefault();
		for (var i = 0; i < event.touches.length; i++) {
			var x = event.touches[i].pageX;
			var y = event.touches[i].pageY;
			ctx.beginPath();
	    	ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
	    	ctx.fillStyle = 'green';
	    	ctx.fill();
	    	ctx.lineWidth = 5;
	    	ctx.strokeStyle = '#003300';
	    	ctx.stroke();
		}
		
	});

	init();

});