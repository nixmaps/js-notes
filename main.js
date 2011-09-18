// here we go

// Drawing classes

Drawable = function() {
	// Private
	// these can be hard-coded, but may be modified if there are pushy children
	var offsetX = 0;
	var offsetY;
	var zIndex = 0;
	var parent = null;
	var children = [];
	var me = this;
	// Public
	this.relativeTo = function(newParent) {
		parent = newParent;
	};
	this.draw = function(canvas) {
		// x, y, zIndex
		var pos = (parent ? parent.position() : [0,0,0]);
		var x = pos[0] + offsetX;
		var y = pos[1] + offsetY;
		var z = pos[2] + zIndex;

		// draw on the canvas
	};

	// Initialization
	return this;
};

// a collection of objects that use collision detection (boundaries, margins, offsets) to modify their placement
Pushies = function() {
	this.items = [];
	return this;
};

Pushy = function() {
	return this;
};
Pushy.prototype = new Drawable();

// Music classes ... extend the appropriate drawing classes

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
