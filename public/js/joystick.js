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
    //ctx.scale(2, 2);
	var ratio = window.devicePixelRatio || 1;
	var width = screen.width * ratio;
	var height = screen.height * ratio;
	ctx.canvas.width  = width;
	ctx.canvas.height = height;

	//var centerX = canvas.width / 4;
    //var centerY = canvas.height / 2;
    //var radius = 100;
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
		//var ratio = window.devicePixelRatio || 1;
		var width = screen.width;// * ratio;
		var height = screen.height;// * ratio;

		ctx.beginPath();
	    ctx.arc(width / 3, 5 * height / 13, height / 6, 0, 2 * Math.PI, false);
	    ctx.fillStyle = "black";
	    ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
		ctx.closePath();

	    ctx.beginPath();
	    ctx.arc(width / 3, 5 * height / 13, height / 20, 0, 2 * Math.PI, false);
	    ctx.lineWidth = 10;
	    ctx.strokeStyle = '#00BFFF';
	    ctx.stroke();
		ctx.closePath();
	}

	drowGamepad = function() {
		drowJoystick();

		ctx.beginPath();
	    ctx.arc(2 * width / 3, height / 7, height / 25, 0, 2 * Math.PI, false);
	    ctx.fillStyle = "#353535";
	    ctx.fill();
		ctx.lineWidth = 5;
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
			var x = event.touches[i].pageX;
			var y = event.touches[i].pageY;
			var width = screen.width;// * ratio;
			var height = screen.height;// * ratio;

			var stickLimit = (height / 6 - height / 15);
			var stickDistance = Math.pow((x - width / 3),2) + Math.pow(( y - 5 * height / 13), 2);
			if (stickDistance < Math.pow(stickLimit, 2)) {
				joystickAvailable = true;
				joystickTouch = i;
				drowJoystick();
				ctx.beginPath();
				ctx.arc(x, y, height / 20, 0, 2 * Math.PI, false);
				ctx.lineWidth = 10;
				ctx.strokeStyle = '#00BFFF';
				ctx.stroke();
				ctx.closePath();
			}

			var buttonLimit = height / 25;
			var buttonDistance = Math.pow((x - 2 * width / 3),2) + Math.pow((y - height / 7), 2);

			server.send("===================", function(answer){
				console.log(answer);
			});
			server.send(x + "_______" + y, function(answer){
				console.log(answer);
			});
			server.send(2 * width / 3 + "_______" + buttonDistance, function(answer){
				console.log(answer);
			});

			if (buttonDistance < Math.pow(buttonLimit, 2)) {
				buttonTouch = i;
				ctx.beginPath();
			    ctx.arc(2 * width / 3, height / 7, height / 25, 0, 2 * Math.PI, false);
			    ctx.fillStyle = "black";
			    ctx.fill();
				ctx.lineWidth = 5;
				ctx.strokeStyle = '#0000FF';
				ctx.stroke();
				ctx.closePath();
			}
		}

	});

	canvas.addEventListener('touchmove', function(event) {
		event.preventDefault();
		if (joystickAvailable == true) {
			var x = event.touches[joystickTouch].pageX;
			var y = event.touches[joystickTouch].pageY;
			var width = screen.width;// * ratio;
			var height = screen.height;// * ratio;

			drowJoystick();
		    
			var stickLimit = (height / 6 - height / 15);
			var stickDistance = Math.pow((x - width / 3),2) + Math.pow(( y - 5 * height / 13),2)
			if (stickDistance > Math.pow(stickLimit, 2)) {
			   	console.log("_test_");
			   	x1 = width / 3;
				y1 = 5 * height / 13;
				x2 = x;
				y2 = y;
			   	var sin = (y2 - y1) / Math.sqrt(stickDistance);
			   	var cos = (x2 - x1) / Math.sqrt(stickDistance);
			   	x = stickLimit * cos + x1;
			   	y = stickLimit * sin + y1;
			}

			ctx.beginPath();
			ctx.arc(x, y, height / 20, 0, 2 * Math.PI, false);
			ctx.lineWidth = 10;
			ctx.strokeStyle = '#00BFFF';
			ctx.stroke();
			ctx.closePath();
		}
	});

	canvas.addEventListener('touchend', function(event) {
		event.preventDefault();
		drowJoystick();
		joystickAvailable = false;
	});

	init();
	//drowJoystick();
	drowGamepad();

});