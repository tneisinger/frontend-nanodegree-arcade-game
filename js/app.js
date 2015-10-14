// Enemies our player must avoid
//
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = randomInt(100,300) * -1;
    var row = randomInt(1,3);
    this.y = (80*row) - 20;
    this.speed = randomInt(150,300);
    this.spriteWidth = 96;
    this.spriteHeight = 65;
    this.fromLeft = 2;
    this.fromTop = 73;
    updateEdgeVals(this);
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if (this.x > 500 || this.x < -300) {
        this.reset();
    }
    updateEdgeVals(this);
};

Enemy.prototype.reset = function() {
    this.x = randomInt(100,300) * -1;
    var row = randomInt(1,3);
    this.y = (80*row) - 20;
    this.speed = randomInt(150,300);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var updateEdgeVals = function(object) {
    object.leftEdge = object.x + object.fromLeft;
    object.rightEdge = object.x + object.fromLeft + object.spriteWidth;
    object.topEdge = object.y + object.fromTop;
    object.bottomEdge = object.y + object.fromTop + object.spriteHeight;
}

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 380;
    this.spriteWidth = 65;
    this.spriteHeight = 15;
    this.fromLeft = 18;
    this.fromTop = 126;
    updateEdgeVals(this);
};
Player.prototype.update = function(dt) {
    if (this.y < 0) {
        this.resetPosition();
    }
    updateEdgeVals(this);
}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
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
}
Player.prototype.resetPosition = function() {
    this.x = 200;
    this.y = 380;
}

var randomInt = function(low,hi) {
    return Math.floor((Math.random() * hi) + low);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var checkCollisions = function() {
    allEnemies.forEach(function(enemy) {
        if (collision(player, enemy)) {
            player.resetPosition();
        }
    });
}

var collision = function(object1, object2) {
    var leftOverlap = object2.leftEdge <= object1.leftEdge && object1.leftEdge <= object2.rightEdge;
    var rightOverlap = object2.leftEdge <= object1.rightEdge && object1.rightEdge <= object2.rightEdge;
    var topOverlap = object2.topEdge <= object1.topEdge && object1.topEdge <= object2.bottomEdge;
    var bottomOverlap = object2.topEdge <= object1.bottomEdge && object1.bottomEdge <= object2.bottomEdge;
    if ((leftOverlap || rightOverlap) && (topOverlap || bottomOverlap)) {
        return true;
    }
}
