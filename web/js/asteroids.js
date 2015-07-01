/**
 * @title Asteroids
 * @description Asteroids HTML5 game based on 1979 arcade classic.
 * @version 0.0.2
 * @date 2012-07-13
 * @updated 2015-07-01
 * @author Richard Nelson
*/

/**
 **********************************************************
 * PACKAGE OBJECT
 *
 */

var ASTEROIDS = ASTEROIDS || {};

/**
 **********************************************************
 * EVENT DISPATCHER
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
ASTEROIDS.EventDispatcher = function() {

	// ----- PRIVATE VARS ----- //

	this._listeners = {};

};

ASTEROIDS.EventDispatcher.prototype = {

	constructor: ASTEROIDS.EventDispatcher,
	
	// ----- PUBLIC FUNCTIONS ----- //
	
	addEventListener: function( type, listener ) {
		
		if ( typeof this._listeners[type] === "undefined" ) {
		
			this._listeners[type] = [];
			
		}

		this._listeners[type].push( listener );
		
	},

	removeEventListener: function( type, listener ) {
		
		if ( this._listeners[type] instanceof Array ) {
		
			var listeners = this._listeners[type];
			
			for ( var i = 0; i < listeners.length; i++ ) {
			
				if ( listeners[i] === listener ){
				
					listeners.splice( i, 1 );
					break;
					
				}
				
			}
			
		}
		
	},
	
	
	// ----- PRIVATE FUNCTIONS ----- //
	
	dispatchEvent: function( event ) {
		
		if ( typeof event == "string" ) {
		
			event = { type: event };
			
		}
		
		if ( !event.target ) {
		
			event.target = this;
			
		}

		if ( !event.type ) { 
		
			throw new Error("Event must have a type.");
			
		}

		if ( this._listeners[event.type] instanceof Array ) {
		
			var listeners = this._listeners[ event.type ];
			
			for ( var i = 0; i < listeners.length; i++ ) {
			
				listeners[i].call( this, event );
				
			}
			
		}
		
	}
	
};

 /**
 **********************************************************
 * GAME EVENT
 *
 */

// * * * * * CONSTRUCTOR * * * * * //

ASTEROIDS.GameEvent = function(type, target) {

	// ----- PUBLIC VARS ----- //
	
	this.type = type;
	this.target = target;

};

// * * * * * STATIC * * * * ** //

ASTEROIDS.GameEvent.NAME = "GameEvent";
ASTEROIDS.GameEvent.ENTER_FRAME = ASTEROIDS.GameEvent.NAME + "EnterFrame";


/**
 **********************************************************
 * DISPLAY OBJECT
 *
 */
 
// * * * * * CONSTRUCTOR * * * * * //
ASTEROIDS.DisplayObject = function( element, parent ) {
	//log("^ super DisplayObject");
	
	// ----- PUBLIC VARS ----- //
	
	// ----- PRIVATE VARS ----- //
	this._element;
	this._parent = parent;
	this._x = 0;
	this._y = 0;
	this._width;
	this._height;
	this._rotation = 0;
	this._scale = 1;
	this._children =[];
	
	// ----- INIT ----- //
	if ( element ) {
	
		this._element = element;
		
		var style = window.getComputedStyle( this._element, null );
		this._width = parseInt( style.getPropertyValue( "width" ) );
		this._height = parseInt( style.getPropertyValue( "height" ) );		
		
		this.updateTransform();
		
	}
	
};
 
// * * * * * INHERITANCE * * * * * //
ASTEROIDS.DisplayObject.prototype = new ASTEROIDS.EventDispatcher();
ASTEROIDS.DisplayObject.prototype.constructor = ASTEROIDS.DisplayObject;
ASTEROIDS.DisplayObject.prototype.supr = ASTEROIDS.EventDispatcher.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //
ASTEROIDS.DisplayObject.prototype.getElement = function() {
	return this._element;
};

ASTEROIDS.DisplayObject.prototype.getId = function() {
	return this._element.id;
};

ASTEROIDS.DisplayObject.prototype.setId = function(value) {
	this._element.id = value;
};

ASTEROIDS.DisplayObject.prototype.getTransformProperty = function() {

    var properties = [ "WebkitTransform", "msTransform", "MozTransform", "OTransform", "transform" ];
	
    var p;
	
    while ( p = properties.shift() ) {
        if ( typeof this._element.style[p] !== "undefined" ) {
            return p;
        }
    }
	
    return false;
	
};

ASTEROIDS.DisplayObject.prototype.getX = function() {
	return this._x;
};

ASTEROIDS.DisplayObject.prototype.setX = function(value) {
	this._x = value;
	this.updateTransform();
};

ASTEROIDS.DisplayObject.prototype.getY = function() {
	return this._y;
};

ASTEROIDS.DisplayObject.prototype.setY = function(value) {
	this._y = value;
	this.updateTransform();
};

ASTEROIDS.DisplayObject.prototype.getWidth = function() {
	
	/* NOTE: Chrome is unable to get this value when initialized! */
	if ( !this._width ) {

		this._width = parseInt( window.getComputedStyle( this._element, null ).getPropertyValue( "width" ) );	

	}

	return this._width;
	
};

ASTEROIDS.DisplayObject.prototype.getHeight = function() {
	
	/* NOTE: Chrome is unable to get this value when initialized! */
	if ( !this._height ) {

		this._height = parseInt( window.getComputedStyle( this._element, null ).getPropertyValue( "height" ) );	

	}

	return this._height;

};

ASTEROIDS.DisplayObject.prototype.getBounds = function() {
	return { top:0, right:this._width, bottom:this._height, left:0 };
};

ASTEROIDS.DisplayObject.prototype.getRotation = function() {
	return this._rotation;
};

ASTEROIDS.DisplayObject.prototype.setRotation = function(value) {
	this._rotation = value;
	this.updateTransform();
};

ASTEROIDS.DisplayObject.prototype.getScale = function() {
	return this._scale;
};

ASTEROIDS.DisplayObject.prototype.setScale = function(value) {
	this._scale = value;
	this.updateTransform();
};

/*
 * Keep this function as it may be need latter!
 */
/*
ASTEROIDS.DisplayObject.prototype.getTransform = function() {

	var style = window.getComputedStyle( this._element );
	var transform = style[ this.getTransformProperty() ];
	
	var values = transform.split('(')[1];
	values = values.split(')')[0];
	values = values.split(',');
	
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];
	
};
*/

// ----- FUNCTIONS ----- //
ASTEROIDS.DisplayObject.prototype.updateTransform = function() {
	//log("DisplayObject: updateTransform");

	var theta = this._rotation * Math.PI / 180;
	
	var a = this._scale * Math.cos(theta);
	var b = this._scale * -Math.sin(theta);
	var c = this._scale * Math.sin(theta);
	var d = this._scale * Math.cos(theta);

	//this._element.style[ this.getTransformProperty() ] = "matrix(" + a + "," + b + "," + c + "," + d + "," + this._x + "px," + this._y + "px)";
	this._element.style[ this.getTransformProperty() ] = "matrix(" + a + "," + b + "," + c + "," + d + "," + this._x + "," + this._y + ")";
	
};

ASTEROIDS.DisplayObject.prototype.addChild = function(child) {
	//log("DisplayObject: addChild");

	if ( child.getId() == "" )
		child.setId( "instance" + Math.floor( Math.random() * 1000 ) + this._element.childNodes.length );
	
	var i;
	var length = this._element.childNodes.length;
	var isValid = true;
	
	for ( i = 0; i < length; i++ ) {
	
		if ( this._element.childNodes[i].id == child.getId() ) {
		
			isValid = false;
			break;
		
		}
	
	}
	
	if ( isValid ) {

		this._element.appendChild( child.getElement() );
	
	}
	
	this._children.push( child );

};

ASTEROIDS.DisplayObject.prototype.removeChild = function( child ) {
	//log("DisplayObject: removeChild");
	
	var element = child.getElement();
	this._element.removeChild( element );
		
	var i;
	var length = this._children.length;
	
	for ( i = 0; i < length; i++ ) {
	
		if ( this._children[i] == child ) {
		
			this._children.splice( i, 1 );
			break;
		
		}
	
	}

};

/**
 **********************************************************
 * GAME
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
ASTEROIDS.Game = function( element, parent ) {
	//log("new Game");
 
	// ----- SUPER ----- //
	this.supr.constructor.call( this, element, parent );
 
	// ----- PUBLIC VARS ----- //
	
	// ----- PRIVATE VARS ----- //
	this._isUpKeyDown = false;
	this._isRightKeyDown = false;
	this._isLeftKeyDown = false;	
	
	this._currentLevel = 0;
	this._player;
	this._arySounds = new Array();
	
	
	// ----- INIT ----- //

	// Get High Score from Local Storage
	var highScore = localStorage.getItem( "highScore" );
	if ( highScore )
		this.setHighScore( parseInt( highScore ) );
	else
		this.setHighScore( 0 );
	
	// Add Sounds
	this.addSound( "sfx/laser0" );
	this.addSound( "sfx/explosion0" );
	
	// Add Listeners
	// Note: removing event listeners is proving difficult with anonymous functions
	var self = this;
	document.addEventListener( "keydown", function(e) { self.onKeyDown(e); } );
	document.addEventListener( "keyup", function(e) { self.onKeyUp(e); } );

	// Start Animation Loop
	this.requestFrame();
	
	// Start Game
	this.startGame();
	
};

// * * * * * INHERITANCE * * * * * //
ASTEROIDS.Game.prototype = new ASTEROIDS.DisplayObject();
ASTEROIDS.Game.prototype.constructor = ASTEROIDS.Game;
ASTEROIDS.Game.prototype.supr = ASTEROIDS.DisplayObject.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //
ASTEROIDS.Game.prototype.getX = function() {
	return this._x;
};

ASTEROIDS.Game.prototype.getY = function() {
	return this._y;
};

ASTEROIDS.Game.prototype.getWidth = function() {
	return this._width;
};

ASTEROIDS.Game.prototype.getHeight = function() {
	return this._height;
};

ASTEROIDS.Game.prototype.getSoundIndex = function( filename ) {
	
	var i;
	var length = this._arySounds.length;
	
	for ( i = 0; i < length; i++ ) {
	
		if ( this._arySounds[i].name.indexOf( filename ) !== -1 ) {
		
			return i;
		
		}
	
	}
	
	return null;
	
};

ASTEROIDS.Game.prototype.getScore = function() {

	var elem = document.getElementById( "score" );
	var p = elem.getElementsByTagName( "p" )[0];
	return parseInt( p.innerHTML );

};

ASTEROIDS.Game.prototype.setScore = function( value ) {

	var elem = document.getElementById( "score" );
	var p = elem.getElementsByTagName( "p" )[0];	
	p.innerHTML = value.toString();
	
	if ( value > this.getHighScore() )
		this.setHighScore( value );

};

ASTEROIDS.Game.prototype.getHighScore = function() {

	var elem = document.getElementById( "high-score" );
	var p = elem.getElementsByTagName( "p" )[0];
	return parseInt( p.innerHTML );

};

ASTEROIDS.Game.prototype.setHighScore = function( value ) {

	var elem = document.getElementById( "high-score" );
	var p = elem.getElementsByTagName( "p" )[0];	
	p.innerHTML = value.toString();
	
	localStorage.setItem( "highScore", value.toString() );

};

ASTEROIDS.Game.prototype.getLives = function() {

	var elem = document.getElementById( "lives" );
	var img = elem.getElementsByTagName( "img" );
	
	var i;
	var length = img.length;
	
	for ( i = 0; i < length; i++ ) {

		if ( img[i].style.visibility == "hidden" ) {
			
			return i;
		
		}
	
	}
	
	return i;

};

ASTEROIDS.Game.prototype.setLives = function( value ) {
	log("Game: setLives: " + value);
	
	var elem = document.getElementById( "lives" );
	var img = elem.getElementsByTagName( "img" );
	
	var i;
	var length = img.length;
	
	for ( i = 0; i < length; i++ ) {

		img[i].style.visibility = "hidden";
	
	}
	
	length = ( value <= 3 )	? value : 3;
	
	for ( i = 0; i < length; i++ ) {
	
		img[i].style.visibility = "visible";
	
	}

};

// ----- FUNCTIONS ----- //
ASTEROIDS.Game.prototype.showMessage = function( value ) {

	var elem = document.getElementById( "message" );
	var p = elem.getElementsByTagName( "p" )[0];
	
	elem.style.visibility = "visible";
	p.innerHTML = value;

};

ASTEROIDS.Game.prototype.hideMessage = function() {

	var elem = document.getElementById( "message" );
	elem.style.visibility = "hidden";

};

ASTEROIDS.Game.prototype.startGame = function() {

	// Hide Messages
	this.hideMessage();

	// Set Score
	this.setScore( 0 );
	this.setLives( 3 );

	// Add Player
	this.addPlayer();
	
	// New Level
	this.nextLevel();

};

ASTEROIDS.Game.prototype.checkGameEnd = function() {

	if ( this.getLives() > 0 ) {
	
		var self = this;
		setTimeout( function() { self.addPlayer(); }, 1500 );
	
	} else {
	
		this.showMessage( "GAME OVER!" );
	
	}

};

ASTEROIDS.Game.prototype.endGame = function() {

};

ASTEROIDS.Game.prototype.nextLevel = function() {
	log("Game: nextLevel");
	
	this._currentLevel++;
	
	var i;
	var length = 10;
	
	for ( i = 0; i < length; i++ ) {
	
		this.addAsteroid();
	
	}


};

ASTEROIDS.Game.prototype.checkLevelEnd = function() {

	var i;
	var length = this._children.length;
	var numAsteroids = 0;
	
	for( i = 0; i < length; i++ ) {
	
		if ( this._children[i].getElement().className.indexOf("asteroid") !== -1 ) {
			
			numAsteroids++;
			
		}
	
	}
	
	if ( numAsteroids == 0 ) {
	
		var self = this;
		setTimeout( function() { self.nextLevel() }, 1500 );
	
	}
		

};

ASTEROIDS.Game.prototype.addSound = function( filename ) {
	//log("Game: addSound: " + filename);

	var sfx = new Audio();
	var ext = ( sfx.canPlayType( "audio/ogg" ) ) 
		? ".ogg"
		: ".mp3";
		
	sfx.preload = "auto";
	sfx.src = filename + ext;

	this._arySounds.push( { name:filename, audio:sfx } );

};

ASTEROIDS.Game.prototype.playSound = function( index ) {

	var sfx = this._arySounds[ index ].audio;
	sfx.pause();
	sfx.currentTime = 0;
	sfx.play();

};

ASTEROIDS.Game.prototype.addPlayer = function() {
	log("Game: addPlayer");

	// Add Child
	this._player = new ASTEROIDS.Player( undefined, this );
	this._player.setX( this.getX() + this.getWidth() / 2 );
	this._player.setY( this.getY() + this.getHeight() / 2 );
	this._player.setRotation( 179.9 );
	this.addChild( this._player );

};

ASTEROIDS.Game.prototype.removePlayer = function() {
	log("Game: removePlayer");
	
	this.removeChild( this._player );
	this._player = null;
	this._isUpKeyDown = false;
	this._isRightKeyDown = false;
	this._isLeftKeyDown = false;
	this.setLives( this.getLives() - 1 );
	this.playSound( 1 );
	
	this.checkGameEnd();

};

ASTEROIDS.Game.prototype.addProjectile = function() {
	//log("Game: addProjectile");

	var projectile = new ASTEROIDS.Projectile( undefined, this );
	
	var angle = this._player.getRotation();
	var theta = angle * Math.PI / 180;
	var xOffset = this._player.getWidth() / 2 + Math.sin(theta) * this._player.getWidth() / 2;
	var yOffset = this._player.getHeight() / 2 + Math.cos(theta) * this._player.getHeight() / 2;
	
	projectile.setDirection( angle );
	projectile.setInitX( this._player.getX() + xOffset );
	projectile.setInitY( this._player.getY() + yOffset );
	projectile.setX( this._player.getX() + xOffset );
	projectile.setY( this._player.getY() + yOffset );
	this.addChild( projectile );
	
	this.playSound( 0 );

};

ASTEROIDS.Game.prototype.updateProjectiles = function() {

	var i;
	var length = this._children.length;
	var projectile;
	
	for( i = 0; i < length; i++ ) {
	
		// Temp condition check?
		if ( this._children[i] !== undefined ) {
	
			if ( this._children[i].getElement().className.indexOf("projectile") !== -1 ) {
			
				projectile = this._children[i];
				projectile.move();
			
				if ( projectile.getCount() > projectile.getDuration() ) {
				
					this.removeChild( projectile );
					
				} else {
					
					var asteroid = this.hitTestProjectile( projectile );
					
					if ( asteroid ) {
					
						this.removeChild( projectile );
						this.removeChild( asteroid );
						this.playSound( 1 );
						this.setScore( this.getScore() + 100 );
						this.checkLevelEnd();
					
					}
					
				}
				
			}
		
		}
	
	}	

};

ASTEROIDS.Game.prototype.addAsteroid = function() {
	//log("Game: addAsteroid");
	
	var asteroid = new ASTEROIDS.Asteroid( undefined, this );
	
	if ( Math.random() < 0.5 ) {
	
		asteroid.setX( this.getX() );
		asteroid.setY( Math.random() * this.getHeight() + this.getY() );
		
	} else {
	
		asteroid.setX( Math.random() * this.getWidth() + this.getX() );
		asteroid.setY( this.getY() );
		
	}
	
	this.addChild( asteroid );
	
};

ASTEROIDS.Game.prototype.updateAsteroids = function() {
	//log("Game: updateAsteroids");

	var i;
	var length = this._children.length;
	var asteroid;
	
	for( i = 0; i < length; i++ ) {
	
		if ( this._children[i] !== undefined ) {
	
			if ( this._children[i].getElement().className.indexOf("asteroid") !== -1 ) {
				
				asteroid = this._children[i];
				asteroid.move();
				
				if ( this._player && this.hitTest( asteroid, this._player ) ) {
				
					this.removePlayer();
				
				}
				
			}
			
		}
	
	}
	
};

ASTEROIDS.Game.prototype.hitTest = function( object0, object1 ) {

	var x0 = object0.getX() + object0.getWidth() / 2;
	var y0 = object0.getY() + object0.getHeight() / 2;
	var r0 = ( object0.getWidth() > object0.getHeight() )
		? object0.getWidth() / 2
		: object0.getHeight() / 2;
		
	var x1 = object1.getX() + object1.getWidth() / 2;
	var y1 = object1.getY() + object1.getHeight() / 2;
	var r1 = ( object1.getWidth() > object1.getHeight() )
		? object1.getWidth() / 2
		: object1.getHeight() / 2;

	var hyp = Math.sqrt( ( x1 - x0 ) * ( x1 - x0 ) + ( y1 - y0 ) * ( y1 - y0 ) );
	
	return ( hyp <= r0 + r1 );

};

ASTEROIDS.Game.prototype.hitTestProjectile = function( projectile ) {

	var i;
	var length = this._children.length;
	var asteroid;
	
	for ( i = 0; i < length; i++ ) {
	
		if ( this._children[i].getElement().className.indexOf("asteroid") !== -1 ) {
			
			asteroid = this._children[i];
			
			if ( this.hitTest( projectile, asteroid ) ) {
			
				return asteroid;				
			
			}
			
		}	
	
	}
	
	return null;

};

ASTEROIDS.Game.prototype.requestFrame = function() {

	var self = this;
	requestAnimationFrame( function() { self.onFrame(); } );
	
};

// ----- EVENT LISTENERS ----- //
ASTEROIDS.Game.prototype.onFrame = function(e) {
	//log("Game: onFrame");

	if ( this._player ) {
	
		if ( this._isUpKeyDown )
			this._player.move();
			
		if ( this._isRightKeyDown )
			this._player.rotateClockwise();
		else if ( this._isLeftKeyDown )
			this._player.rotateCounterClockwise();
			
	}
	
	this.updateProjectiles();
	this.updateAsteroids();
	
	this.requestFrame();
	
};

ASTEROIDS.Game.prototype.onKeyDown = function(e) {
	//log("Game: onKeyDown");
	
	var codes = "32 37 38 39";

	if ( this._player && codes.indexOf( e.keyCode ) !== -1 ) {

		e.preventDefault();
	
		if ( e.keyCode === 38 ) {
		
			this._isUpKeyDown = true;
			this._player.showThrust();
		
		}
		
		if ( e.keyCode === 39 )
			this._isRightKeyDown = true;
		else if ( e.keyCode === 37 )
			this._isLeftKeyDown = true;
			
	}
	

};

ASTEROIDS.Game.prototype.onKeyUp = function(e) {
	//log("Game: onKeyUp");

	var codes = "32 37 38 39";

	if ( this._player && codes.indexOf( e.keyCode ) !== -1 ) {

		e.preventDefault();
	
		if ( e.keyCode === 38 ) {
		
			this._isUpKeyDown = false;
			this._player.hideThrust();
			
		}
		
		if ( e.keyCode === 39 )
			this._isRightKeyDown = false;
			
		if ( e.keyCode === 37 )
			this._isLeftKeyDown = false;
			
		if ( e.keyCode === 32 )
			this.addProjectile();
			
	}

};
 
/**
 **********************************************************
 * PLAYER
 *
 */
 
// * * * * * CONSTRUCTOR * * * * * //
ASTEROIDS.Player = function( element, parent ) {
	log("new Player");
	
	// ----- SUPER ----- //
	element = document.createElement("div");
	element.id = "player";
	element.className = "player";
	this.supr.constructor.call( this, element, parent );
	
	// ----- PRIVATE VARS ----- //
	this._v = 3;
	
	// ----- INIT ----- //

};
 
// * * * * * INHERITANCE * * * * * //
ASTEROIDS.Player.prototype = new ASTEROIDS.DisplayObject();
ASTEROIDS.Player.prototype.constructor = ASTEROIDS.Player;
ASTEROIDS.Player.prototype.supr = ASTEROIDS.DisplayObject.prototype;


// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //


// ----- FUNCTIONS ----- //
ASTEROIDS.Player.prototype.move = function() {
	//log("Player: move");
	
	var rads = this._rotation * Math.PI / 180;
	var vX = this._v * Math.sin( rads );
	var vY = this._v * Math.cos( rads );
	
	var nX = this._x + vX;
	var nY = this._y + vY;
	
	var minX = this._parent.getX() - this._width / 2;
	var maxX = this._parent.getWidth() - this._width / 2;
	var minY = this._parent.getY() - this._height / 2;
	var maxY = this._parent.getHeight() - this._height / 2;
	
	if ( nX <= minX )
		nX = maxX;
	else if ( nX > maxX )
		nX = minX;
		
	if ( nY <= minY )
		nY = maxY;
	else if ( nY > maxY )
		nY = minY;
		
	this._x = nX;
	this._y = nY;
	
	this.updateTransform();
	
};

ASTEROIDS.Player.prototype.showThrust = function() {

	this._element.className = "thrust";

};

ASTEROIDS.Player.prototype.hideThrust = function() {

	this._element.className = "";

};

ASTEROIDS.Player.prototype.rotateClockwise = function() {

	this.setRotation( this.getRotation() - 5 );
	this.updateTransform();

};

ASTEROIDS.Player.prototype.rotateCounterClockwise = function() {

	this.setRotation( this.getRotation() + 5 );
	this.updateTransform();

};
 
/**
 **********************************************************
 * PROJECTILE
 *
 */
 
 // * * * * * CONSTRUCTOR * * * * * //
ASTEROIDS.Projectile = function( element, parent ) {
	//log("new Projectile");
	
	// ----- SUPER ----- //
	element = document.createElement("div");
	element.className = "projectile";
	this.supr.constructor.call( this, element, parent );
	
	// ----- PRIVATE VARS ----- //
	this._distance = 0;
	this._direction;
	this._initX;
	this._initY;
	this._v = 7.5;
	this._range = 300;
	this._duration = this._range / this._v;
	this._count = 0;
	
	// ----- INIT ----- //
	
};
 
// * * * * * INHERITANCE * * * * * //
ASTEROIDS.Projectile.prototype = new ASTEROIDS.DisplayObject();
ASTEROIDS.Projectile.prototype.constructor = ASTEROIDS.Projectile;
ASTEROIDS.Projectile.prototype.supr = ASTEROIDS.DisplayObject.prototype;


// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //
ASTEROIDS.Projectile.prototype.getCount = function() {
	return this._count;
};

ASTEROIDS.Projectile.prototype.getDirection = function() {
	return this._direciton;
};

ASTEROIDS.Projectile.prototype.setDirection = function(value) {
	this._direction = value;
};

ASTEROIDS.Projectile.prototype.getDuration = function() {
	return this._duration;
};

ASTEROIDS.Projectile.prototype.getInitX = function() {
	return this._initX;
};

ASTEROIDS.Projectile.prototype.setInitX = function(value) {
	this._initX = value;
};

ASTEROIDS.Projectile.prototype.getInitY = function() {
	return this._initY;
};

ASTEROIDS.Projectile.prototype.setInitY = function(value) {
	this._initY = value;
};

ASTEROIDS.Projectile.prototype.getRange = function() {
	return this._range;
};


// ----- FUNCTIONS ----- //
ASTEROIDS.DisplayObject.prototype.move = function() {
	
	var rads = this._direction * Math.PI / 180;
	var vX = this._v * Math.sin( rads );
	var vY = this._v * Math.cos( rads );
	
	var nX = this._x + vX;
	var nY = this._y + vY;
	
	var minX = this._parent.getX() - this._width / 2;
	var maxX = this._parent.getWidth() - this._width / 2;
	var minY = this._parent.getY() - this._height / 2;
	var maxY = this._parent.getHeight() - this._height / 2;
	
	if ( nX < minX )
		nX = maxX;
	else if ( nX > maxX )
		nX = minX;
		
	if ( nY < minY )
		nY = maxY;
	else if ( nY > maxY )
		nY = minY;
		
	this._x = nX;
	this._y = nY;
	
	this.updateTransform();
	this._count++;
	
};
 
/**
 **********************************************************
 * ASTEROID
 *
 */
 
// * * * * * CONSTRUCTOR * * * * * //
ASTEROIDS.Asteroid = function( element, parent ) {
	//log("new Asteroid");
	
	// ----- SUPER ----- //
	element = document.createElement("div");
	element.className = "asteroid";
	this.supr.constructor.call( this, element, parent );
	
	// ----- PUBLIC CONSTANTS ----- //
	this.TYPES = [ "type0", "type1", "type2" ];
	
	// ----- PRIVATE VARS ----- //
	this._direction = Math.random() * 360;
	this._v = 0.3;
	
	// ----- INIT ----- //
	var index = Math.floor( Math.random() * this.TYPES.length );
	this._element.className = "asteroid " + this.TYPES[ index ];
	
};
 
// * * * * * INHERITANCE * * * * * //
ASTEROIDS.Asteroid.prototype = new ASTEROIDS.DisplayObject();
ASTEROIDS.Asteroid.prototype.constructor = ASTEROIDS.Asteroid;
ASTEROIDS.Asteroid.prototype.supr = ASTEROIDS.DisplayObject.prototype;


// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //


// ----- FUNCTIONS ----- //
ASTEROIDS.Asteroid.prototype.move = function() {
	
	var rads = this._direction * Math.PI / 180;
	var vX = this._v * Math.sin( rads );
	var vY = this._v * Math.cos( rads );
	
	var nX = this._x + vX;
	var nY = this._y + vY;
	
	var minX = this._parent.getX() - this._width / 2;
	var maxX = this._parent.getWidth() - this._width / 2;
	var minY = this._parent.getY() - this._height / 2;
	var maxY = this._parent.getHeight() - this._height / 2;
	
	if ( nX < minX )
		nX = maxX;
	else if ( nX > maxX )
		nX = minX;
		
	if ( nY < minY )
		nY = maxY;
	else if ( nY > maxY )
		nY = minY;
		
	this._x = nX;
	this._y = nY;
	
	this.updateTransform();
	
};

 
/**
 **********************************************************
 * UFO
 *
 */
 
 
 
 
 