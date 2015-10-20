frontend-nanodegree-arcade-game
===============================

## Synopsis

This is a simple clone of Frogger, the classic arcade game.  It was built as a
part of Udacity's Front End Nanodegree program.

## Setup

To setup the game, simply clone this repository onto your system and open the
included index.html file with your preferred web browser.

## How To Play

Use the arrow keys to control the hero character.  The goal of the game is to
maximize the score.  There are two ways to add points to the score:

- Reach the water without being hit by an enemy (100 points)
- Collect a gem (500 - 1500 points, depending on the gem color)

If the player is touched by an enemy, 300 points are deducted from the
score and the player is moved back to the bottom of the screen.  The score
cannot fall below zero.

Each time the player reaches the water, there is a 50% chance that a gem will
appear somewhere on the board.  There are three different gem colors, each
having a different point value:

- Blue Gem (500 points)
- Green Gem (1000 points)
- Orange Gem (1500 points)

The type of gem that will appear on the board depends on how many gems the
player has collected since her last death.  If the player has collected no gems
since her last death (or since the beginning of the game), the next gem will be
blue.  If the player has collected one gem since her last death, the next gem
will be green.  If the player has collected 2 or more gems since her last
death, the orange gem will be the next to appear. If the player dies, the
next gem to appear will be blue again, and the process repeats.
