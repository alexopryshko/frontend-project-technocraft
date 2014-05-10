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
	ctx.canvas.width  = width;
	ctx.canvas.height = height;
	ctx.scale(ratio, ratio);


	//var centerX = canvas.width / 4;
    //var centerY = canvas.height / 2;
    //var radius = 100;
    var joystickPosX = width / (6 * ratio);
    var joystickPosY = width / (3 * ratio);
    var joystickRadius = height / (15 * ratio);
    var stickRadius = height / (40 * ratio);
    var buttonRadius = height / (30 * ratio);
    var buttonPosX = 2 * width / (3 * ratio);
    var buttonPosY = width / (4 * ratio);
    var joystickAvailable = false;
    var joystickTouch = 0;
    var buttonTouch = 0;

    var server = new Connector({
			server: ['bind'],
			remote: '/player'
		}
	);


	orientationchange = function() {
		if (window.orientation%180===0) {
	        // portrait
	        currentScreen.style.display = 'none';
	        document.getElementById('portrait').style.display = 'block';

	    } else {
	        // landscape
	        currentScreen.style.display = 'block';
	        document.getElementById('portrait').style.display = 'none';
	        //drowJoystick();
	        drowGamepad();
	    }
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
		console.log('___test___');
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

	start = function(guid){
		startLayer.style.display = 'none';
		canvas.style.display = 'block';
		currentScreen = canvas;
		console.log('start player');
		localStorage.setItem('playerguid', guid);
	};

	drowJoystick = function() {
		//ctx.save();
		ctx.beginPath();
	    ctx.arc(joystickPosX, joystickPosY, joystickRadius, 0, 2 * Math.PI, false);
	    ctx.fillStyle = "black";
	    ctx.fill();
		ctx.lineWidth = 5 / ratio;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
		ctx.closePath();

	    ctx.beginPath();
	    ctx.arc(joystickPosX, joystickPosY, stickRadius, 0, 2 * Math.PI, false);
	    ctx.lineWidth = 7 / ratio;
	    ctx.strokeStyle = '#00BFFF';
	    ctx.stroke();
		ctx.closePath();

	}

	drowGamepad = function() {
		ctx.fillStyle = "#DAA520";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		drowJoystick();
		ctx.beginPath();
	    ctx.arc(buttonPosX, buttonPosY, buttonRadius, 0, 2 * Math.PI, false);
	    ctx.fillStyle = "#353535";
	    ctx.fill();
		ctx.lineWidth = 8 / ratio;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
		ctx.closePath();
	}

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
		var width = screen.width * ratio;
		var height = screen.height * ratio;
		ctx.canvas.width  = width;
		ctx.canvas.height = height;

		console.log(width + "+" + height);
	});

	canvas.addEventListener('touchstart', function(event) {
		event.preventDefault();

		for (var i = 0; i < event.touches.length; i++) {
			var x = event.touches[i].pageX / ratio;
			var y = event.touches[i].pageY / ratio;

			var stickLimit = joystickRadius - stickRadius;
			var stickDistance = Math.pow((x - joystickPosX), 2) + Math.pow((y - joystickPosY), 2);

			if (stickDistance < Math.pow(stickLimit, 2)) {

				server.send(Math.pow(stickLimit, 2) + "+" + stickDistance, function(answer){
					console.log(answer);
				});

				joystickAvailable = true;
				joystickTouch = i;
				drowJoystick();
				ctx.beginPath();
				ctx.arc(x, y, stickRadius, 0, 2 * Math.PI, false);
				ctx.closePath();

			}

			var buttonLimit = 3 * buttonRadius / 2;
			var buttonDistance = Math.pow((x - buttonPosX), 2) + Math.pow((y - buttonPosY), 2);

			if (buttonDistance < Math.pow(buttonLimit, 2)) {
				buttonTouch = i;
				ctx.beginPath();
			    ctx.arc(buttonPosX, buttonPosY, buttonRadius, 0, 2 * Math.PI, false);
			    ctx.fillStyle = "#white";
			    ctx.fill();
				ctx.closePath();
			}
		}

	});

	canvas.addEventListener('touchmove', function(event) {
		event.preventDefault();
		if (joystickAvailable == true) {
			var x = event.touches[0].pageX / ratio;
			var y = event.touches[0].pageY / ratio;

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

			drowGamepad();
			ctx.beginPath();
			ctx.arc(x, y, stickRadius, 0, 2 * Math.PI, false);
			ctx.lineWidth = 7 / ratio;
			ctx.strokeStyle = '#00BFFF';
			ctx.stroke();
			ctx.closePath();
		}

	});

	canvas.addEventListener('touchend', function(event) {
		event.preventDefault();
		//drowJoystick();
		drowGamepad();
		joystickAvailable = false;

		server.send(event.touches[0] + "________" + event.touches[0], function(answer){
			console.log(answer);
		});

	});

	init();
	
	drowGamepad();

});