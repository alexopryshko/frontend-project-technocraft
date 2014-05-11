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

    

    var input = document.getElementById('inputToken');
    var connect = document.getElementById('connect');
    var canvas = document.getElementById('convasJoystick');
    var startLayer = document.getElementById('startLayer');
    var currentScreen = startLayer;

    ctx = canvas.getContext('2d');
	var ratio = window.devicePixelRatio || 1;
	var width = screen.width * ratio;
	var height = screen.height * ratio;
	canvas.width  = width;
	canvas.height = height;
	canvas.style.width = screen.width;
	canvas.style.height = screen.height;
	var gamepadImg = new Image();

    var joystickPosX = 3 * width / (8 * ratio);
    var joystickPosY = 7 * width / (19 * ratio);
    var joystickRadius = height / (7 * ratio);

    var stickPosX = joystickPosX;
    var stickPosY = joystickPosY;
    var stickRadius = height / (15 * ratio);

    var buttonRadius = height / (15 * ratio);
    var buttonPosX =  569 * width / 1000;
    var buttonPosY = 317 * width / 1000;
    var gamepadImgPosX = 7;
    var gamepadImgPosY = -10;

    var joystickAvailable = false;
    var joystickTouchId = 0;
    var buttonTouchId = 0;

    var server = new Connector({
			server: ['bind'],
			remote: '/player'
		}
	);

    server.on('disconnect', function() {
		console.log('disconnect');
	});

	orientationchange = function() {
		if (window.orientation%180===0) {
	        // portrait
	        currentScreen.style.display = 'none';
	        document.getElementById('portrait').style.display = 'block';

	    } else {
	        // landscape
			currentScreen.style.display = 'block';
			document.getElementById('portrait').style.display = 'none';
	    }
	    drowGamepad();
	}

	init = function(){
		if (!localStorage.getItem('playerguid')){
			startLayer.style.display = 'block';
			currentScreen = startLayer;
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
			else {
				console.log("error token");
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

	start = function(guid){
		startLayer.style.display = 'none';
		canvas.style.display = 'block';
		currentScreen = canvas;
		console.log('start player');
		localStorage.setItem('playerguid', guid);
	};

	drowJoystick = function() {
		ctx.beginPath();
	    ctx.arc(joystickPosX, joystickPosY, joystickRadius, 0, 2 * Math.PI, false);
	    ctx.fillStyle = "black";
	    ctx.fill();
		ctx.lineWidth = 5 / ratio;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
		ctx.closePath();

	    ctx.beginPath();
	    ctx.arc(stickPosX, stickPosY, stickRadius, 0, 2 * Math.PI, false);
	    ctx.lineWidth = 7 / ratio;
	    ctx.strokeStyle = '#00BFFF';
	    ctx.stroke();
		ctx.closePath();
	}

	drowButton = function() {
		ctx.beginPath();
	    ctx.arc(buttonPosX, buttonPosY, buttonRadius, 0, 2 * Math.PI, false);
	    ctx.fillStyle = "#353535";
	    ctx.fill();
		ctx.lineWidth = 8;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
		ctx.closePath();
	}

	drowGamepad = function() {
		ctx.fillStyle = "#DAA520";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		gamepadImg.src = "/images/gamepad.png";
	}

	gamepadImg.onload = function() {
		ctx.drawImage(gamepadImg, 7, -10);
		drowJoystick();
		drowButton();
	};

	window.addEventListener('deviceorientation', function(event) {
		//var alpha = Math.sin(event.alpha);
		var beta = event.beta;
		var gamma = event.gamma;

		stickPosX = joystickPosX + beta / 5;
		stickPosY = joystickPosY - gamma / 5;

		drowJoystick();

	});

    window.addEventListener('orientationchange', orientationchange);

	document.getElementById('inputToken').onblur = function() {
		document.body.scrollTop = 0;
	}

	startLayer.addEventListener('touchmove', function(event) {
		event.preventDefault();
	}, false); 


	$(window).resize(function () { 
		document.body.scrollTop = 0;
		var ratio = window.devicePixelRatio || 1;
		width = screen.width * ratio;
		height = screen.height * ratio;
		ctx.canvas.width  = width;
		ctx.canvas.height = height;

		console.log(width + "+" + height);
	});

	canvas.addEventListener('touchstart', function(event) {
		event.preventDefault();

		for (var i = 0; i < event.touches.length; i++) {
			var x = event.touches[i].pageX;// / ratio;
			var y = event.touches[i].pageY;// / ratio;

			var stickLimit = joystickRadius - stickRadius;
			var stickDistance = Math.pow((x - joystickPosX), 2) + Math.pow((y - joystickPosY), 2);

			if (stickDistance < Math.pow(stickLimit, 2)) {

				joystickAvailable = true;
				joystickTouchId = event.touches[i].identifier;

				//drowJoystick();
				ctx.beginPath();
				ctx.arc(x, y, stickRadius, 0, 2 * Math.PI, false);
				ctx.lineWidth = 7 / ratio;
				ctx.strokeStyle = '#00BFFF';
				ctx.stroke();
				ctx.closePath();

			}

			var buttonLimit = 3 * buttonRadius / 2;
			var buttonDistance = Math.pow((x - buttonPosX), 2) + Math.pow((y - buttonPosY), 2);

			if (buttonDistance < Math.pow(buttonLimit, 2)) {
				buttonTouchId = event.touches[i].identifier;

				ctx.beginPath();
				ctx.arc(buttonPosX, buttonPosY, buttonRadius, 0, 2 * Math.PI, false);
				ctx.fillStyle = "black";
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#0000FF';
				ctx.stroke();
				ctx.closePath();
			}
		}

	});

	canvas.addEventListener('touchmove', function(event) {
		event.preventDefault();
		if (joystickAvailable == true) {
			for (var i = 0; i < event.touches.length; i++) {
				if (event.touches[i].identifier == joystickTouchId) {
					var x = event.touches[i].pageX;// / ratio;
					var y = event.touches[i].pageY;// / ratio;

					drowJoystick();

					var stickLimit = joystickRadius - stickRadius - 7 / ratio;
					var stickDistance = Math.pow((x - joystickPosX), 2) + Math.pow((y - joystickPosY), 2);
					if (stickDistance > Math.pow(stickLimit, 2)) {
					   	console.log("_test_");
					   	x1 = joystickPosX;
						y1 = joystickPosY;
						x2 = x;
						y2 = y;
					   	var sin = (y2 - y1) / Math.sqrt(stickDistance);
					   	var cos = (x2 - x1) / Math.sqrt(stickDistance);
					   	x = stickLimit * cos + x1;
					   	y = stickLimit * sin + y1;
					}

					//drowGamepad();
					ctx.beginPath();
					ctx.arc(x, y, stickRadius, 0, 2 * Math.PI, false);
					ctx.lineWidth = 7 / ratio;
					ctx.strokeStyle = '#00BFFF';
					ctx.stroke();
					ctx.closePath();
				}
			}
		}

	});

	canvas.addEventListener('touchend', function(event) {
		event.preventDefault();
		for (var i = 0; i < event.changedTouches.length; i++) {
		 	var touch = event.changedTouches[i]; 

		 	if (touch.identifier == joystickTouchId) {
		 		drowJoystick();
		 	}
		 	else if (touch.identifier == buttonTouchId) {
		 		drowButton();
		 	}
		};
	});

	init();
	
	drowGamepad();

});