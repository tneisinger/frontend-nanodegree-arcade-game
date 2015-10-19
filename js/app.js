// * Constants * //

// The minimum and maximum speeds of the enemies
var ENEMY_LOW_SPEED = 150;
var ENEMY_TOP_SPEED = 300;

// The probability of a gem appearing after reaching the water
var GEM_PROBABILITY = 0.5;

// The base value of the blue gem.  The green gem will be worth 2x this value
// and the orange gem will be worth 3x this value.
var GEM_VALUE = 500;


// * Game Objects * //

// The character that the player controls
var Player = function() {
    this.sprite = 'images/char-boy.png';

    // Start the player at the starting position
    this.toStartPos();

    // Establish the collision box of the player
    this.collisionWidth = 65;
    this.collisionHeight = 15;
    this.fromLeft = 18;
    this.fromTop = 126;

    // Update the edge attributes of the player.  The edge attributes are used
    // for collision detection in the collisions() function.
    updateEdgeVals(this);
};

Player.prototype.update = function(dt) {
    // If the player reaches the water, she wins
    if (this.y < 0) {
        this.win();
    }

    // Update the edge attributes of the player.  The edge attributes are used
    // for collision detection in the collisions() function.
    updateEdgeVals(this);
};

// Move the player to the starting position
Player.prototype.toStartPos = function() {
    this.x = 200;
    this.y = 380;
};

Player.prototype.win = function() {
    this.toStartPos();
    score.addPoints(100);

    // If there isn't already a gem, maybe make one
    if (gem === null && decision(GEM_PROBABILITY)) {
        gem = new Gem();
    }
};

Player.prototype.lose = function() {
    this.toStartPos();
    score.removePoints(300);

    // Reset the gem level after dying
    gemLevel = 1;

    // Remove any gems that might be on the board
    gem = null;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > 0) {
        this.x -= 100;
    } else if (key === 'right' && this.x < 400) {
        this.x += 100;
    } else if (key === 'up' && this.y > 0) {
        this.y -= 80;
    } else if (key === 'down' && this.y < 380) {
        this.y += 80;
    }
};


// Enemies the player must avoid
// Parameter: row, the row which the enemy will occupy
var Enemy = function(row) {
    // set the y value based on the row number given
    this.y = (80*row) - 20;

    // Set the direction in which the enemy will
    // travel, which sprite image to use (normal or reversed),
    // and how fast the enemy will travel.
    this.reset();

    // Set the width and height of the collision area
    this.collisionWidth = 96;
    this.collisionHeight = 65;

    // Set the distances from the edges of the sprite image
    // to the edges of the collision area.
    this.fromLeft = 2;
    this.fromTop = 73;

    // set the leftEdge, rightEdge, topEdge, and bottomEdge
    // attributes, which are used for collision detection.
    updateEdgeVals(this);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.leftToRight) {
        this.x += this.speed*dt;
    } else {
        this.x -= this.speed*dt;
    }

    // Once the enemy is offscreen, reset it.
    if (this.offScreen()) {
        this.reset();
    }

    // Update the edge attributes for collision detection
    updateEdgeVals(this);
};

// Set the direction in which the enemy will travel, which sprite image to use
// (normal or reversed), and how fast the enemy will travel.
Enemy.prototype.reset = function() {
    // Determine if this enemy will move left-to-right or right-to-left
    this.leftToRight = decision(0.5);

    // Assign the corresponding sprite and start position
    if (this.leftToRight) {
        this.sprite = 'images/enemy-bug.png';
        this.x = -100;
    } else {
        this.sprite = 'images/enemy-bug-reversed.png';
        this.x = 500;
    }

    // Assign a random speed value
    this.speed = randomInt(ENEMY_LOW_SPEED, ENEMY_TOP_SPEED);
};

// This is a predicate which returns true if the given enemy
// is currently off screen
Enemy.prototype.offScreen = function() {
    return (this.x > 500 || this.x < -100) ? true : false;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// A Gem which randomly appears on the board.
// Gems are worth extra points.
var Gem = function() {
    // Select a random position to place the gem.
    var row = randomInt(1,3);
    var column = randomInt(0,4);

    // Place the gem at that random position
    this.x = 100*column;
    this.y = (80*row) - 20;

    // Set up the collision box for the gem
    this.collisionWidth = 96;
    this.collisionHeight = 65;
    this.fromLeft = 2;
    this.fromTop = 73;

    // Select the sprite image based on the current gem level
    if (gemLevel === 1) {
        this.sprite = 'images/gem-blue-small.png';
    } else if (gemLevel === 2) {
        this.sprite = 'images/gem-green-small.png';
    } else if (gemLevel === 3) {
        this.sprite = 'images/gem-orange-small.png';
    }
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update = function() {
    updateEdgeVals(this);
};


// The player's score in the game
var Score = function() {
    this.value = 0;
    this.x = 490;
    this.y = 100;

    // The visual attributes of the score text
    // These are used in the score's render function.
    this.fillStyle = 'white';
    this.strokeStyle = 'black';
    this.textAlign = 'right';
    this.font = '30px Comic Sans MS';
};

// Render the score onto the screen
Score.prototype.render = function() {
    // Use the attributes from the score object for styling
    ctx.fillStyle = this.fillStyle;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    ctx.fillText(this.value.toString(), this.x, this.y);
};

// Add points to the player's score
Score.prototype.addPoints = function(points) {
    this.value += points;
};

// Remove points from the player's score
// If the score ever falls below zero, set it equal to zero.
Score.prototype.removePoints = function(points) {
    this.value -= points;
    if (this.value < 0) {
        this.value = 0;
    }
};


// * General Functions * //

// This handles all collisions in the game
var checkCollisions = function() {
    // Check for collisions between the player and the enemies
    allEnemies.forEach(function(enemy) {
        if (collision(player, enemy)) {
            player.lose();
        }
    });

    // Check for collisions between the player and the gem
    if (gem && collision(player, gem)) {
        score.addPoints(GEM_VALUE * gemLevel);
        gem = null;
        gemLevel += (gemLevel < 3) ? 1 : 0;
    }
};

// This is a predicate that takes two game objects as inputs.
// It returns true if the two objects are currently touching.
var collision = function(obj1, obj2) {
    // The following 'Overlap' vars are true if the named edge of obj1 lies
    // between the two axis-relevant edges of obj2. For example, leftOverlap is
    // true if the leftEdge of obj1 lies between the left and right edges of
    // obj2.
    var leftOverlap = obj2.leftEdge <= obj1.leftEdge && obj1.leftEdge <= obj2.rightEdge;
    var rightOverlap = obj2.leftEdge <= obj1.rightEdge && obj1.rightEdge <= obj2.rightEdge;
    var topOverlap = obj2.topEdge <= obj1.topEdge && obj1.topEdge <= obj2.bottomEdge;
    var bottomOverlap = obj2.topEdge <= obj1.bottomEdge && obj1.bottomEdge <= obj2.bottomEdge;

    // For a collision to occur, the two objects must overlap
    // vertically (left or right overlap) AND horizontally (top or bottom
    // overlap).
    if ((leftOverlap || rightOverlap) && (topOverlap || bottomOverlap)) {
        return true;
    }
    return false;
};

// return true or false, based on the given probability
var decision = function(probability) {
    return Math.random() < probability;
};

// Given an Enemy, Player, or Gem object, update the objects edge attributes.
// The edge attributes are used for collision detection in the collision()
// function.
var updateEdgeVals = function(object) {
    object.leftEdge = object.x + object.fromLeft;
    object.rightEdge = object.x + object.fromLeft + object.collisionWidth;
    object.topEdge = object.y + object.fromTop;
    object.bottomEdge = object.y + object.fromTop + object.collisionHeight;
};

// Return a random integer between the two given values, inclusive.
var randomInt = function(low,hi) {
    return Math.floor((Math.random() * hi) + low);
};


// * Instantiation of Game Objects * //

var player = new Player();

// create three enemies, one for each row.
var allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];

// Instantiate the gem variable, but do not create a gem at the start of the
// game.
var gem = null;

// The gem level determines the color and point-value of the gems that appear
// on the board.  It increases when a gem is collected, but is reset to 1
// whenever the player dies.  The valid values are 1,2, and 3.
var gemLevel = 1;

var score = new Score();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

