/*
An exploration of Crockford's picture of ideal JavaScript usage ... functional, not OO.
and of course an exploration into object-based drawing
*/
// Crockford
/*
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
*/

/*
if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		var F = function() {};
		F.prototype = o;
		return new F();
	};
}
*/

// THESE NEED TO SET this
if (!Array.prototype.each) {
	Array.prototype.each = function(callback) {
		for (var i = 0; i < this.length; i++) {
			callback( this[i], i);
		}
	};
}
if (!Array.prototype.map) {
	Array.prototype.map = function(callback) {
		var a = [];
		for (var i = 0; i < this.length; i++) {
			a.push( callback( this[i], i) );
		}
		return a;
	};
}

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

/*
slots might not work ... anchor positions might be better.
- note anchors it's y-center to the y coord staff gives it for the note name
- stem anchors to 
	note.anchor('stem', 'right', 'top', 0, 4); // notes know that stem objects are anchored to top-right, but down 4 pixels
*/
var Drawing = {

	drawable: function(spec, my) {
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
		that.draw = function() {
		};
	
		// privileges methods to that
	
		return that;
	}
};






var Music = {

	// ALMOST AS IF staff() need be the only -- or one of very few -- publicly available methods
	
	// staff group
	group: function(spec, callback) {
		// copy in boilerplate
		
		callback.apply(that, []);
		return that;
	},
	
	// if staff called directly, creates a simple staff group
	staff: function(type, my) {
		var that = {}, // and other private inst vars;
		my = my || Drawing.drawable(),
		
		positions = {},
	
		// sanitize, copy and protect values from spec
		clef = (type == 'treble' ? 'treble' : 'treble'), // default to treble ... need an object for each clef type, since they have their own drawing offsets
		measures = [] // measure objects ... each has voices
		;
		
		// initialize measure position coordinates
		positions['measure'] = {x: 0, y: 0};

		// base on spec (clef), set up slots
		if (clef == 'treble') {
			// what is treble clef range?
			// loop over possible notes, skipping space where staff lines will be
			var a = 'g,f,e,d,b,c,a'.split(',');
			var i = 0;
			for (var key in a) {
				var value = a[key];
				// closure?
				positions[value] = {
					// x value should come from measure
					y1: i,
					y2: i+10
				};
				// 10 for each space and 1 for line?
				i += 11;
				i += 1;
			}
		}
		
		// returns coordinates
		that.position = function(name) {
			return positions[name];
		};
	
		that.draw = function(coords) {
			var i,x,y;
			coords = coords || {};
			x = coords.x || 0;
			y = coords.y || 0;
			
			console.log('Drawing staff at ' + x + ',' + y);
			// draw lines
			// for each measure, extend the lines
			measures.each(function(measure) {
				var width = measure.needWidth(); // how much width does this measure need
				// extend the lines to that width
				// pass in a way for measure to use staff to map a position name to a coordinate
				measure.draw(that.position('measure'), that);
				
				// draw measure lines
				
				// what about lines for a specific note above or below the stave?
				// advance x AND/OR y how?
				x += width;
				// measure start/end lines
				x += 1;
				
				// advance positions
				positions['measure'].x += width + 1;
			});
		};
		
		
		that.measure = function(m) {
			measures.push(m);
			return that;
		};

		return that;
	},
	
	/*
	{
		beats: 4,
		beatNote: 4 (quarter), // maybe use text?
		number: 123, // not sure why
		showNumber: true,
		voices: ['piano','piano2'] // not sure how voices are usually used
	}
	*/
	measure: function(spec, my) {
		var that = {}, // and other private inst vars;
		my = Drawing.drawable(),
		spec = spec || {},
	
		beats = spec.beats || 4,
		beatNote = spec.beatNote || 4,
	
		showNumber = !!(spec.showNumber || false),
		number = spec.number || 1, // necessary if we want to draw numbers
		//voiceNames = [], // object or array?
		//voices = {},
		notes = [],
		
		// temp
		i, value
		;
		
		/*
		if (spec.voices) {
			for (i = 0; i < spec.voices.length; i++) {
				var value = spec.voices[i];
				voiceNames.push(value);
				voices[ value ] = [];
			}
		} else {
			voiceNames.push('default');
			voices['default'] = [];
		}
		*/
	
		that.needWidth = function() {
			var width = 0;
			notes.each(function(value) {
				width += value.needWidth();
			});
			return width;
		};
		/*
		measure needs to somehow inherit the Y position assignment functionality from staff
		*/
		that.draw = function(coords) {
			var i,x,y;
			coords = coords || {};
			x = coords.x || 0;
			y = coords.y || 0;
			// draw lines
			console.log('Drawing measure at ' + x + ',' + y);
			notes.each(function(value) {
				// get note name
				// get draw position from staff
				// is this coordinate to be used as top-left, center, what?
				// would be easier for staff to report x value and y1,y2 range?
				var width = value.needWidth();
				var name = value.name(); // get note name
				// get y1 and y2 from staff
				var coord = my.position(name);
				// need to get note x position from measure itself
				value.draw();
			});
		};
		
		
		// add a note ... note durations needs to fill the measure, but don't care about that now
		that.note = function(note) {
			notes.push( note );
			return that;
		};
	

		return that;
	},

/*
	voice: function(spec, my) {
		var that = {}, // and other private inst vars;
		my = my || {},
	
		notes = [] // note objects ... how coordinate these with the staff slow they're in?
		;
	
		// share variables and function to my
		that.needWidth = function() {
			var width = 0;
			notes.each(function(value) {
				width = Math.max(width, value.needWidth());
			});
			return width;
		};
	
		that.draw = function() {
			var i,
				inBeam = 0;
		
			for (i = 0; i < notes.length; i++) {
				var note = notes[i];
				if (note.beam) {
					inBeam = note.beam;
					// need to backpatch beams to drawn note stems
					// maybe notes have a "stem" slot
				}
			}
		};
		// privileges methods to that

		return that;
	},
*/

	note: function(spec, my) {
		var that = {}, // and other private inst vars;
		my = my || Drawing.drawable(),

		stem, // 0:no, 1:up, 2:down
		beamed = false, // beam type determined by note duration
		tuplet = 0 // 0:no, 1:start, 2:stop
		;
		
		// from spec
		spec.name = spec.name || 'c'; // might not need this here ... it's also used when a note is added to a slot
		spec.duration = spec.duration || 1; // fraction of a beat?
		spec.up = spec.up || false;
	
		// share variables and function to my
		if (spec.duration > 1) {
			stem = (spec.up ? 1 : 2);
		}
	
		// a stem slot so we can anchor beams to it somehow
		if (stem) {
			my.slot('stem', {
				direction: (stem == 1 ? 'up' : 'down')
			});
		}
		// privileges methods to that
		
		
		that.needWidth = function() {
			// depends on the font
			return 20;
		};
		
		// note-specific methods
		that.name() {
			return spec.name;
		};
	
		return that;
	},

	stem: function(spec, my) {
		var that = {}, // and other private inst vars;
		my = my || Drawing.drawable();
	
		// share variables and function to my
	
	
		// privileges methods to that
		that.needWidth = function() {
			return 1;
		};
	
		return that;
	},

	beam: function(spec, my) {
		var that = Drawing.drawable(), // and other private inst vars;
		my = my || {},
		lines = 1 // passed into spec, determined by note duration (and probably other things)
		;
	
		// share variables and function to my
	
		// privileges methods to that
		
	
		return that;
	}
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
