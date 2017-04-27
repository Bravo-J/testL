'use strict';

var express = require('express');  
var app = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io = require('socket.io')(httpServer);
//var readline = require("readline");
var keypress = require("keypress");

keypress(process.stdin);
 
var port = 3000;

let led = null; 
 
//Setting the path to static assets
app.use(express.static(__dirname + '/ui'));

//Serving the static HTML file
app.get('/', function (res) {
    res.sendFile('/index.html')
});

 
httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  
 
var yellowLed;
var greenLed;
var redLed;
var collectAnalogDataBoolean = true;
/*var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
	});*/

//Arduino board connection
var board = new five.Board();

//Part A
//This is a test to make my own function?
//does is it need to be after the var board????

function relayPinConfig(setPin, setDefaultState){
	this.pin = setPin;
	this.currentState = 0; 
	this.defaultState = setDefaultState;
	
	this.toggle = function()
	{
		if(this.currentState == 1){
		//sockets.emit()
			board.digitalWrite(this.pin, 0);
			this.currentState = 0;
		}else{
			//sockets.emit()
			board.digitalWrite(this.pin, 1);
			this.currentState = 1;
		}
	}
}

var relay1 = new relayPinConfig(11, 0);
console.log("Relay 1 Set Pin: ");
console.log(relay1.pin);

var TOOTH = 7;  //button

  
board.on("ready", function() {  
    	console.log('Arduino connected');
   	yellowLed = new five.Led(13);
    	greenLed = new five.Led(12);
    	//redLed = new five.Led(11);
    	board.pinMode(relay1.pin, five.Pin.OUTPUT);
    	//relay = new five.Led(10);
    	
//Part B creating the function
    	var bone = new five.Led(9);
    	var tin = new five.Button(TOOTH);
    	
    	tin.on("hit", function() {
    		bone.on();
    	});
    	tin.on("release", function() {
    		bone.off();
    	});

//Motion Sensor

  // Create a new `motion` hardware instance.
  var motion = new five.Motion(2);
  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated");
  });
  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function() {
    console.log("motionstart");
    io.sockets.emit('motionstart');
  });
  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function() {
    console.log("motionend");
    io.sockets.emit('motionend');
  });
  // "data" events are fired at the interval set in opts.freq
  // or every 25ms. Uncomment the following to see all
  // motion detection readings.
  // motion.on("data", function(data) {
  //   console.log(data);
  // });
    	
  	// Initial state
  		let state = {
    	red: 1, green: 1, blue: 1
  		};
  // Map pins to digital inputs on the board
  led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 3,
      blue: 5
    }
  });
 
  		

	// Helper function to set the colors
	  	let setStateColor = function(state) {
	    	led.color({
	     		red: state.red,
	      	blue: state.blue,
	      	green: state.green
	    	});
	  	};    	
    	
    	/*var speed, commands, servo;
    	servo = new five.Servo(10);
    	commands = null;
    	speed = (0-180);*/
    	
    	/*var servo = new five.Servo(10);
    	
    	//rl.setPrompt("SERVO TEST (0-180)> ");
    	//rl.prompt();
    	
    	rl.on("line", function(line) {
    		servo.to(+line.trim());
    		//rl.prompt();
    	}).on("close", function() {
    		process.exit(0);
    	});*/
    	
    	var temperature = new five.Thermometer({
	    controller: "TMP36",      //TMP36
	    pin: "A0"
	  	});

	  temperature.on("change", function() {
	    //console.log(this.celsius + "°C", this.fahrenheit + "°F");
	    io.sockets.emit('updateAnalogData', this.fahrenheit);
	  });
/*    	
console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  var servo = new five.Servo.Continuous(10);

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {

    if (!key) {
      return;
    }

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      console.log("CW");
      servo.cw();
    } else if (key.name === "down") {
      console.log("CCW");
      servo.ccw();
    } else if (key.name === "space") {
      console.log("Stopping");
      servo.stop();
    }
  });   */ 	
   	
    	/*
    	this.pinMode(0, five.Pin.ANALOG);
  		this.analogRead(0, function(voltage) {
  			results = ((voltage * 1000 / 1023) / 10 - 50);
  			io.sockets.emit('updateAnalogData', results);
  		});*/
				
//Socket connection handler
	io.on('connection', function (socket) {
			console.log("Client Connected");
			socket.emit('click');
			socket.on('click', function () {
	      yellowLed.toggle();
	      console.log('Yellow Led Toggle');
		});
															//for the data to talk back to work need to be added to the uiSocketInteractions.js 
	     	socket.on('click1', function () {   //need to add data inside the () for the talk back
	    	socket.emit('click1');					//console.log("Data from click1: " + data);  //this is how you get it to talk back.
	      greenLed.toggle();
	      console.log('Green Led Toggle');
		});
			
			socket.on('click2', function () {
			socket.emit('click2');
			relay1.toggle();
			//redLed.toggle();
			console.log('Red Led Toggle')
		});
		
			socket.on('house', function () {
			socket.emit('house');
			relay.toggle();
			console.log('Relay Has Fired')
		});
		
			// RGB 
    		socket.on('join', function(handshake) {
      	console.log(handshake);
 		});     	
      	
	    // Set initial state
	    setStateColor(state);

	    socket.on('rgb', function(data) {
	      state.red = data.color === 'red' ? data.value : state.red;
	      state.green = data.color === 'green' ? data.value : state.green;
	      state.blue = data.color === 'blue' ? data.value : state.blue;

	      // Set the new colors
	      setStateColor(state);

	      socket.emit('rgb', data);
	      //socket.broadcast.emit('rgb', data);
	    });

	    // Turn on the RGB LED
	   // led.on();
	  
	
			
		/*	socket.on('start', function() {
			speed = 120;
			servo.(speed);
			socket.emit('start');
			console.log('foward');
		});
			
			socket.on('reverse', function() {
			speed = 70;
			servo.(speed);
			socket.emit('reverse');
			console.log('reverse');
		});
		
			socket.on('stop', function() {
			speed = 90;
			servo.(speed);
			socket.emit('stop');
			console.log('stop');
		});*/				
			
			//Client disconnect event
	      socket.on('disconnect', function(){
	      console.log("Client Disconnected!");
	   }); 
	});
});

console.log('Waiting for connection');