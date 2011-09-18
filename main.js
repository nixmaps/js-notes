/*
An exploration of Crockford's picture of ideal JavaScriptusge ...
and of course an exploration into object-based drawing
*/
// Crockford
Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};
Object.method('superior', function(name) {
	var that = this,
		method = that[name];
	return function() {
		return method.apply(that, arguments);
	};
	
});
/*
if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		var F = function() {};
		F.prototype = o;
		return new F();
	};
}
*/

// drawable capabilities

/*
- hierarchy of drawables
- holds position information
- draws object on canvas
*/
var drawable = function(spec, my) {
	var that = {};
	my = my || {};
	// Private
	var offsetX = 0,
		offsetY = 0,
		zIndex = 0,
		parent = par || null,
		children = [];
	// Public
	that.draw = function(canvas) {
		// x, y, zIndex
		var pos = (parent ? parent.position() : [0,0,0]);
		var x = pos[0] + offsetX;
		var y = pos[1] + offsetY;
		var z = pos[2] + zIndex;
		// draw on the canvas
	};
	that.position = function() {
		return [offsetX, offsetY, zIndex];
	};
	return that;
};

// a collection of objects that use collision detection (boundaries, margins, offsets) to modify their placement
var pushies = function() {
	var that = drawable();
	that.items = [];
	// needs canvas, starting x,y,z
	that.draw = function(canvas) {
	};
	return that;
};

var pushy = function(spec) {
	var that = drawable();
	spec = spec || {};
	// expand this to 4 margins
	spec.margin = spec.margin || 0; // ensure numeric
	that.draw = function() {
	};
	return that;
};

// gives pushiness capability
var pushiness = function(that) {
};
// 
var anchorings = function(that) {
	var fors = [];
	var ats = [];
	that.forAt = function(type, at) {
	};
};

// Music classes ... extend the appropriate drawing classes

/*
Staff needs to know:
- where it needs to start drawing the first line
- how wide the line should be
- what its height is, based on the needs of its contents, so it can push the staff below it

Can I:
- tell it to wrap according to canvas width
- have it keep all measures the same width (max needed)
- tell it to draw 4 measures per line
*/
var staff = function(clefType) {
	var that = drawable();
	that.add( clef(clefType) );

	// staff has anchorings for each note name, according to clef type
	var anchorMap = {
		treble: -50 // middle C is 50 down from top staff line
	};
	return that;
};
var clef = function(type) {
	var that = drawable();
	var widths = {
		treble: 50
	};
	that.width = widths[type];

	return that;
};

Staff = function() {
	var leftCap;
	var rightCap;
	var clef = [];
	var notes = [];
};
Staff.prototype = new Drawable();

Clef = function() {
};
Clef.prototype = new Drawable();

// This might actually be several notes, in the case of a chord
Note = function() {
	var name; // midi numbers
};

// API
/*
Gotta translate C1 into the correct note on the correct staff, so we need a bit of general music knowledge
*/

// gar, i keep going back to OO style
var staff1 = staff('treble'); // internally does this.add(clef('treble'));
staff1.add(time(4,4));
note('c1', 16)
	.staff(staff1)
	.stemUp() // default
	.beam(true) // default ... beams until beam(false)
	.accent()
	.crescendo(true) // default ... crescendos until crescendo(false) or decrescendo(true) or dynamic()
	.dynamic('mp')
	.text('R', 'below');

staff1.draw(canvas);
