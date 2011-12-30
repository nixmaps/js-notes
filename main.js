/*
An exploration of Crockford's picture of ideal JavaScript usage ... functional, not OO.
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
- each object has slots
	- named: above, below, note-c, note-d, etc
	- and each slot has alignment properties
	- each slot might need to support aditional slots
	- a slot might group objects of a certain type (accents and tuplets align together above beams)
	- objects get either X or Y from an object, and the other from another object
	
	- don't want the concept of children and parents ... bet i can do it with pubsub or another pattern
*/

var draw = function(spec, my) {
	var that = {}, // and other private inst vars;
	my = my || {},
	slots = {},
	target, // drawing target coordinates ... our "parent" tells us where
	// need to keep these, right?
	x = 0,
	y = 0
	;
	
	// share variables and function to my
	
	//that = // a new object
	that.slot = function(name, spec) {
		slots[name] = spec;
	};
	
	// someone will ask us how much space we need
	// we may recurse to children, or not
	// needs to be implemented by the object extending draw
	that.needWidth = function() {
	};
	that.needHeight = function() {
	};
	
	// draw at
	// in some cases should this also have x2 and y2? ... like beams, ties, tuplets, etc
	/*
	coords = {
		x: 1,
		y: 1
	}
	*/
	that.drawAt = function(coords) {
	};
	// main draw that needs to be implemented
	that.draw = function(coords) {
	};
	
	// privileges methods to that
	
	return that;
};





var staff = function(spec, my) {
	var that = draw(), // and other private inst vars;
	my = my || {},
	
	measures = [] // measure objects ... each has voices
	;

	// base on spec (clef), set up slots
	that.slot('c', {});
	
	that.draw = function() {
		// draw lines
		// for each measure, extend the lines
		measures.each(function(value, key) {
			var width = value.needWidth(); // how much width does this measure need
			// extend the lines to that width
			value.drawAt({
				x: x,
				y: y
			});
			// what about lines for a specific note above or below the stave?
			// advance x AND/OR y how?
		});
	};

	return that;
};
/*
{
	number: 123, // not sure why
	voices: ['piano','piano2'] // not sure how voices are usually used
}
*/
var measure = function(spec, my) {
	var that = draw(), // and other private inst vars;
	my = my || {},
	
	number = spec.number,
	voiceNames = [], // object or array?
	voices = []
	;
	
	if (spec.voices) {
		spec.voices.each(function(value, key) {
			voices[ key ] = [];
		});
	}

	// base on spec (clef), set up slots
	that.slot('c', {});
	
	that.draw = function() {
		// draw lines
	};
	
	that.note = function(note, voice) {
		voice = voice || 0;
		voices[ voice ].push( note );
	};

	return that;
};

var voice = function(spec, my) {
	var that, // and other private inst vars;
	my = my || {},
	
	notes = [] // note objects
	;
	
	// share variables and function to my
	
	that = // a new object
	
	// privileges methods to that
	
	return that;
};


var note = function(spec, my) {
	var that = draw(), // and other private inst vars;
	my = my || {},
	
	duration = 1, // fraction of a beat?
	stem = 0, // 0:no, 1:up, 2:down
	beamed = false, // beam type determined by note duration
	name = 'c', // might not need this here ... it's also used when a note is added to a slot
	tuplet = 0 // 0:no, 1:start, 2:stop
	;
	
	// share variables and function to my
	
	that = // a new object
	
	// privileges methods to that
	
	return that;
};

var stem = function(spec, my) {
	var that = draw(), // and other private inst vars;
	my = my || {};
	
	// share variables and function to my
	
	that = // a new object
	
	// privileges methods to that
	
	return that;
};

var beam = function(spec, my) {
	var that = draw(), // and other private inst vars;
	my = my || {},
	lines = 1 // passed into spec, determined by note duration (and probably other things)
	;
	
	// share variables and function to my
	
	that = // a new object
	
	// privileges methods to that
	
	return that;
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

var note = function() {
	var that = drawable();
	// Valid objects that can be relative to this note
	// Objects ask this note where they can be anchored to
	that.anchorAt = function(o, aboveOrBelow) {
	};
	return that;
};

/*
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
*/

// This might actually be several notes, in the case of a chord
/*
Note = function() {
	var name; // midi numbers
};
*/

// API
/*
Gotta translate C1 into the correct note on the correct staff, so we need a bit of general music knowledge
*/

// gar, i keep going back to OO style
/*
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

var staff1 = staff().clef('treble').label('Snare');
var note1 = note('c1', 16);
var text1 = text('l');
text1.below(staff1, note1).alignX(note1);
staff1.add(note1);
.time(4,4);
*/
