// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.setStartPos();
    this.spriteWidth = 96;
    this.spriteHeight = 65;
    this.fromLeft = 2;
    this.fromTop = 73;
    this.setDirection();
    updateEdgeVals(this);
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if (this.offScreen()) {
        this.setStartPos();
    }
    updateEdgeVals(this);
};
Enemy.prototype.setDirection = function() {
    this.leftToRight = Math.random() < 0.5 ? true : false;
}
Enemy.prototype.setStartPos = function() {
    this.setDirection();
    if (this.leftToRight) {
        this.x = -100;
    } else {
        this.x = -600;
    }
    var row = randomInt(1,3);
    this.y = (80*row) - 20;
    this.speed = randomInt(150,300);
}
Enemy.prototype.offScreen = function() {
    if (this.leftToRight) {
        return (this.x > 500 || this.x < -100) ? true : false;
    } else {
        return (this.x > 100 || this.x < -700) ? true : false;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (this.leftToRight) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    } else {
        ctx.save();
        ctx.scale(-1,1);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.restore();
    }
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

var Score = function() {
    this.val = 0;
    this.x = 490;
    this.y = 100;
    this.fillStyle = 'white';
    this.strokeStyle = 'black';
    this.textAlign = 'right';
    this.font = '30px Comic Sans MS';
}
Score.prototype.update = function(dt) {
    // nothing yet
}
Score.prototype.render = function() {
    ctx.fillStyle = this.fillStyle;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    ctx.fillText(this.val.toString(), this.x, this.y);
}
Score.prototype.addPoints = function(points) {
    this.val += points;
}
Score.prototype.removePoints = function(points) {
    this.val -= points;
    if (this.val < 0) {
        this.val = 0;
    }
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
        this.win();
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
Player.prototype.win = function() {
    this.resetPosition();
    score.addPoints(100);
}
Player.prototype.lose = function() {
    this.resetPosition();
    score.removePoints(300);
}
var randomInt = function(low,hi) {
    return Math.floor(Math.random() * (hi - low + 1)) + low;
};

// Instantiate game objects.
var player = new Player();
var score = new Score();
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
            player.lose();
        }
    });
}

// This is a predicate that takes two game objects as inputs.
// It returns true if the two objects are currently touching.
var collision = function(obj1, obj2) {
    var leftOverlap = obj2.leftEdge <= obj1.leftEdge && obj1.leftEdge <= obj2.rightEdge;
    var rightOverlap = obj2.leftEdge <= obj1.rightEdge && obj1.rightEdge <= obj2.rightEdge;
    var topOverlap = obj2.topEdge <= obj1.topEdge && obj1.topEdge <= obj2.bottomEdge;
    var bottomOverlap = obj2.topEdge <= obj1.bottomEdge && obj1.bottomEdge <= obj2.bottomEdge;
    if ((leftOverlap || rightOverlap) && (topOverlap || bottomOverlap)) {
        return true;
    }
}
