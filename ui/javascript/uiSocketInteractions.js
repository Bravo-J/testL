//Connect to sockets.io

var socket = io();
//var socket = io.connect('http://localhost:3000');

/*function toggleGreen(test) {				//add (test) and alert for talkback to work
		alert(test);							//add this for a pop up window
      socket.emit('click1', "hello");  //the ('click1, "hello" is how you pop it up in the alert
}*/

function toggleYellow() {
	socket.emit('click');
}

function toggleGreen() {
	socket.emit('click1');
}

function toggleRed() {
	socket.emit('click2');
}

function fireRelay() {
	socket.emit('house');
}


	socket.on('motionstart', function()
	{
		console.log("Movement");
		document.getElementById("relay").innerHTML = "Motion Detected";
	});
	
	socket.on('motionend', function()
	{
		console.log("No movement");
		document.getElementById("relay").innerHTML = "No Motion Detected";
	});

//Updates analog data elements
socket.on('updateAnalogData', function (analogData) {
  document.getElementById("analog").innerHTML = analogData;
  //io.socket.emit('updateAnalogData');
});

(function() {
var red = document.getElementById('red');
var green = document.getElementById('green');
var blue = document.getElementById('blue');

function emitValue(color, e) {
    socket.emit('rgb', {
        color: color,
        value: e.target.value
    });
}

red.addEventListener('change', emitValue.bind(null, 'red'));
blue.addEventListener('change', emitValue.bind(null, 'blue'));
green.addEventListener('change', emitValue.bind(null, 'green'));

socket.on('connect', function(data) {
    socket.emit('join', 'Client is connected!');
});

socket.on('rgb', function(data) {
    var color = data.color;
    document.getElementById(color).value = data.value;
    });
}());

/*
function moveForward() {
	socket.emit('start');
}

function moveReverse() {
	socket.emit('reverse');
}

function stop() {
	socket.emit('stop');
}

document.getElementById('forward').onclick = moveForward;
document.getElementById('reverse').onclick = moveReverse;
document.getElementById('stop').onclick = stop;
*/