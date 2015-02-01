var painterCanvas_;
var painterCanvasCtx_;

var method;
var methodObjects = {};
var currentMethodType = "rectangle";

function painterInit(canvas) {
	painterCanvas_ = canvas;
	painterCanvasCtx_ = canvas.getContext('2d');

	console.log("paintInit()!");

	methodObjects.fgPen = new methods["fgPen"]();
	methodObjects.bgPen = new methods["bgPen"]();
	methodObjects.rectangle = new methods["rectangle"]();


	//method = new methods[currentMethodType]();
	method = methodObjects[currentMethodType];
	painterCanvas_.addEventListener('mousedown', handleCanvasEventProxy, false);
	painterCanvas_.addEventListener('mousemove', handleCanvasEventProxy, false);
	painterCanvas_.addEventListener('mouseup', handleCanvasEventProxy, false);
}

function changeMethod(methodType) {
	console.log("changeMethod(): methodType = " + methodType);
	currentMethodType = methodType;
	method = methodObjects[currentMethodType];
}

function setEventCallback(methodType, eventType, callback) {
	console.log("methodType = " + methodType);
	console.log("eventType = " + eventType);
	var $1 = methodObjects[methodType];
	var $2 = $1[eventType];
	$2.callback = callback;
}

// A proxy to handle the canvas event;
// Determine the mouse position relative to the canvas element.
// Than, dispatch this event to the current drawing method.
function handleCanvasEventProxy(evt) {

	if (evt.layerX || evt.layerY == 0) { // Firefox
		evt._x = evt.layerX - painterCanvas_.offsetLeft;
		// evt._y = evt.layerY - painterCanvas_.offsetTop;
		evt._y = evt.layerY;
	}
	else if (evt.offsetX || evt.offsetY == 0) { //Opera
		evt._x = evt.offsetX - painterCanvas_.offsetLeft;
		evt._y = evt.offsetY - painterCanvas_.offsetTop;
	}

	// dispatch to the current drawing method
	var methodFunc = method[evt.type];
	if (methodFunc) {
		methodFunc(evt);
	}
	else {
		console.log("No drawing method: " + currentMethodType);
	}
}

// This object holds the implementation of each drawing method.
var methods = {};

// A drawing method: foreground pen
methods.fgPen = function() {
	var penMethod = this;
	penMethod.started = false;

	this.mousedown = function (evt) {

		this.callback = null;

		painterCanvasCtx_.beginPath();
		painterCanvasCtx_.moveTo(evt._x, evt._y);
		penMethod.started = true;

		// call callback
		if (penMethod.mousedown.callback) {
			penMethod.mousedown.callback(evt._x, evt._y);
		}

		console.log("pen.mousedown: " + evt._x + ", " + evt._y);
	};

	this.mousemove = function (evt) {

		this.callback = null;

		if (penMethod.started) {
			painterCanvasCtx_.lineTo(evt._x, evt._y);
			painterCanvasCtx_.strokeStyle = "#00F";
			painterCanvasCtx_.stroke();

			// call callback
			if (penMethod.mousemove.callback) {
				penMethod.mousemove.callback(evt._x, evt._y);
			}

			console.log("pen.mousemove _ work: " + evt._x + ", " + evt._y);
		}
		else {
			console.log("pen.mousemove");
		}
	};

	this.mouseup = function (evt) {

		this.callback = null;

		if (penMethod.started) {
			penMethod.mousemove(evt);
			penMethod.started = false;

			// call callback
			if (penMethod.mouseup.callback) {
				penMethod.mouseup.callback(evt._x, evt._y);
			}
		}
		console.log("pen.mouseup: " + evt._x + ", " + evt._y);
	};
};

// A drawing method: background pen
methods.bgPen = function() {
	var penMethod = this;
	penMethod.started = false;

	this.mousedown = function (evt) {

		this.callback = null;

		painterCanvasCtx_.beginPath();
		painterCanvasCtx_.moveTo(evt._x, evt._y);
		penMethod.started = true;

		// call callback
		if (penMethod.mousedown.callback) {
			penMethod.mousedown.callback(evt._x, evt._y);
		}

		console.log("pen.mousedown: " + evt._x + ", " + evt._y);
	};

	this.mousemove = function (evt) {

		this.callback = null;

		if (penMethod.started) {
			painterCanvasCtx_.lineTo(evt._x, evt._y);
			painterCanvasCtx_.strokeStyle = "#0F0";
			painterCanvasCtx_.stroke();

			// call callback
			if (penMethod.mousemove.callback) {
				penMethod.mousemove.callback(evt._x, evt._y);
			}

			console.log("pen.mousemove _ work: " + evt._x + ", " + evt._y);
		}
		else {
			console.log("pen.mousemove");
		}
	};

	this.mouseup = function (evt) {

		this.callback = null;

		if (penMethod.started) {
			penMethod.mousemove(evt);
			penMethod.started = false;

			// call callback
			if (penMethod.mouseup.callback) {
				penMethod.mouseup.callback(evt._x, evt._y);
			}
		}
		console.log("pen.mouseup: " + evt._x + ", " + evt._y);
	};
};

// A drawing method: rectangle
methods.rectangle = function() {
	var rectMethod = this;
	rectMethod.started = false;

	// saved rectangle data
	rectMethod.rect = {x:-1, y:-1, w:-1, h:-1};

	this.mousedown = function (evt) {

		this.callback = null;

		rectMethod.x0 = evt._x;
		rectMethod.y0 = evt._y;
		rectMethod.started = true;

		// call callback
		if (rectMethod.mousedown.callback) {
			rectMethod.mousedown.callback(evt._x, evt._y);
		}

		console.log("rect.mousedown: " + evt._x + ", " + evt._y);
	};

	this.mousemove = function (evt) {

		this.callback = null;

		if (rectMethod.started) {
			var x = Math.min(evt._x, rectMethod.x0);
			var y = Math.min(evt._y, rectMethod.y0);
			var w = Math.abs(evt._x - rectMethod.x0);
			var h = Math.abs(evt._y - rectMethod.y0);

			rectMethod.rect.x = x;
			rectMethod.rect.y = y;
			rectMethod.rect.w = w;
			rectMethod.rect.h = h;

			painterCanvasCtx_.clearRect(0, 0, painterCanvas_.width, painterCanvas_.height);
			if (!w || !h) return;
			painterCanvasCtx_.strokeRect(x, y, w, h);

			// call callback
			if (rectMethod.mousemove.callback) {
				rectMethod.mousemove.callback(evt._x, evt._y);
			}

			console.log("rect.mousemove _ work: " + evt._x + ", " + evt._y);
		}
		else {
			console.log("rect.mousemove");
		}
	};

	this.mouseup = function (evt) {

		this.callback = null;

		if (rectMethod.started) {
			rectMethod.mousemove(evt);

			// call callback
			if (rectMethod.mouseup.callback) {
				rectMethod.mouseup.callback(evt._x, evt._y);
			}

			// finish this drawing
			rectMethod.started = false;
		}
		console.log("rect.mouseup: " + evt._x + ", " + evt._y);
	};
};







