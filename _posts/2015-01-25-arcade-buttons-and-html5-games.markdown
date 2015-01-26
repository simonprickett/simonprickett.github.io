---
layout: post
title:  "Arcade Buttons and HTML5 Games"
date:   2015-01-25 21:08:00
categories: games html5 javascript hardware arcade
comments: True
---

Introduction
------------

Over the holiday period, my 12 year old son and I had some spare time so decided to play with 
some arcade cabinet parts we had in the house waiting for reuse.  We used to have a MAME cabinet in 
the office at work which got dismantled and scrapped.  Whilst we were decommissioning it, I kept the buttons, microswitches and an [Ultimarc IPAC device](http://www.ultimarc.com/ipac1.html) (maps buttons / joysticks to keypresses).

We decided to do something basic and have a "race to the top" type game where the first person 
to press their button 10 times wins.  We figured we could do this easily with a small HTML / CSS / 
JavaScript solution, and wire up a couple of the arcade buttons to the IPAC to act as a sort of 
keyboard input controller.

Wiring the iPAC
---------------

The iPAC has two sets of terminals, one side for each player.  You wire up buttons / joysticks or 
whatever to the terminals, daisy chain a ground connection together then connect the unit to a Mac 
or PC via a USB cable.  There's a configuration package that sets which key presses each button maps 
to, once you have configured those, it then acts as a keyboard for any device that uses a USB 
keyboard.

The iPAC wiring diagram for a few buttons looks something like this (source: Ultimarc):

<img src="{{ site.url }}/images/arcade-buttons-and-html5-games/wiring.jpg" class="centeredimg" alt="iPAC Wiring Diagram"/>

Initially we tested this out by wiring one of the arcade buttons to send the keycode for the 
Button wired to the iPAC, using it to send a page reload key command to Chrome.  This is explained 
by Ben...

{% include youtube.html video="IJwqEjLjrq8" %}

The zapper noise you hear when he presses the button comes from the iPAC configuration software to 
tell you it received a key press event - this wouldn't be running once you have the unit 
configured properly.

Before long we had two buttons wired up to the iPAC with some basic JavaScript capturing key events 
and counting how many times each event occurred:

{% include youtube.html video="QQwKmig882I" %}

We used this as the basis for our game.

Building and Testing the Game
-----------------------------

We put our game "screen" inside a div, containing two more divs - one for each player.  
Inside each of these we have 10 divs, one for each button press required to get a step 
closer to winning.

Once we had our layout working, things looked like the following video that shows an 
interim state where we had one div for each player "highlighted" to make sure that the 
CSS worked.  Ben's still finalizing the rules, as he explains...

{% include youtube.html video="WQJW1GmTgk0" %}

From this point, we added code to determine which of the buttons were pressed, and added the 
appropriate CSS classes to the next div in that user's stack until all the divs in one user's 
stack were colored in.

By this point, the core gameplay is complete, and Ben does a demo of the game.  It still needs animation and a proper restart rather than reloading the page, but it works...

{% include youtube.html video="uuW-ze8U67I" %}

To give it a bit more of a game feel, we added animations courtesy of 
[animate.css](http://daneden.github.io/animate.css/) which is a great way of adding effects 
without having to do much work - you just add the appropriate CSS class(es) to the element to 
animate.  After a bit of experimenting, we settled on the rubber band effect for each button 
press, and a victory flip for the winner:

{% include youtube.html video="USdqAjKv9g0" %}

After we were finished, I had Ben help me desolder the rest of the arcade button microswitches 
that we hastily cut out of the cabinet as it was being scrapped.

{% include youtube.html video="sUzdZciXW98" %}

We will probably use the rest of these buttons (and a joystick we salvaged) in a future 
Raspberry Pi Arcade project.

Game HTML
---------

The HTML for the finished game is pretty simple - each player's "board" is a div containing 
10 divs, each of which gets classes added to change the colour and trigger the animation 
when the player presses the button.  Additionally, the JavaScript will add a class to each 
div on page load to give them the "empty box" style that is used at the start of the game.

The id attributes are used to identify each "box" when manipulating the CSS class.

The outer "game" div can be placed in any HTML document.

{% highlight html %}
<div id="game">
	<div id="player1">
		<h2>Player 1</h2>
		<div id="player1-10">10</div>
		<div id="player1-9">9</div>
		<div id="player1-8">8</div>
		<div id="player1-7">7</div>
		<div id="player1-6">6</div>
		<div id="player1-5">5</div>
		<div id="player1-4">4</div>
		<div id="player1-3">3</div>
		<div id="player1-2">2</div>
		<div id="player1-1">1</div>
	</div>
	<div id="player2">
		<h2>Player 2</h2>
		<div id="player2-10">10</div>
		<div id="player2-9">9</div>
		<div id="player2-8">8</div>
		<div id="player2-7">7</div>
		<div id="player2-6">6</div>
		<div id="player2-5">5</div>
		<div id="player2-4">4</div>
		<div id="player2-3">3</div>
		<div id="player2-2">2</div>
		<div id="player2-1">1</div>
	</div>
</div>
{% endhighlight %}

Game CSS
--------

Neither me nor Ben have much CSS experience, but this got us where we needed to be:

{% highlight css %}
#player1 {
	background-color: #CCCCCC;
	width: 450px;
	height: 480px;
	position: absolute;
	float: left;
	padding: 10px;
	border-radius: 5px;
}

#player2 {
	background-color: #CCCCCC;
	width: 450px;
	height: 480px;
	margin-left: 500px;
	padding: 10px;
	position: absolute;
	border-radius: 5px;
}

.meterElement {
	font-size: 2.0em;
	text-align: center;
	border-width: 1px;
	border-style: solid;
	margin-top: 2px;
	border-radius: 5px;
}

.player1Pressed {
	color: #FFFFFF;
	background-color: #00FF00;
}

.player2Pressed {
	color: #FFFFFF;
	background-color: #FF0000;
}
{% endhighlight %}

Game JavaScript
---------------

The JavaScript for the game is deliberately simple, so I could explain it 
to Ben.

* We store how far up the stack each player has advanced, beginning at 0
* We set the "winningScore" to 10 -- the number of boxes in each player's stack
* Our "init" function runs on page load, and at the end of the game.  It does the 
following tasks:
    * Sets each div's class to be "meterElement" (blank box)
    * Unsets any class set in the surrounding "player1" and "player2" div (in case that 
player won any previous game -- there would be a class there for the winning animation)
    * Resets the scores
    * Registers "buttonPressed" as our key handler function
* Nothing happens until a key is pressed - invoking the "buttonPressed" function
* The "buttonPressed" function then:
    * Checks to see if the key pressed had code 49 or 50 (keys 1 and 2 on the keyboard 
-- which is what we programmed the iPAC to "press" when the arcade buttons are depressed)
    * If so, adds extra classes to the next div in the stack for the player who pressed 
the button to change its color and animate it
    * Adds 1 to that player's score
    * Checks if the game has ended (has either player hit the "winningScore" number), and if so
        * Adds classes to the winning player's side of the screen to perform a victory flip animation
        * Displays an alert telling the players which one of them has won
        * Resets the game for the next round

Here's the code:

{% highlight javascript %}
var basicGame = {
	player1Pos: 0,
	player2Pos: 0,
	winningScore: 10,

	init: function() {
		var n = 0;

		for (n = 1; n < 11; n++) {
			document.getElementById('player1-' + n).className 
				= 'meterElement';
			document.getElementById('player2-' + n).className 
				= 'meterElement';
		}

		document.getElementById('player1').className = '';
		document.getElementById('player2').className = '';

		basicGame.player1Pos = 0;
		basicGame.player2Pos = 0;
		window.onkeypress = basicGame.buttonPressed;

	},

	buttonPressed: function(e) {
		// 49 = Green button, or keyboard "1", player 1
		// 50 = Red button, or keyboard "2", player 2
		var elemToUpdate = undefined;

		if (e.keyCode == 49) {
			basicGame.player1Pos += 1;
			elemToUpdate = document.getElementById('player1-' 
				+ basicGame.player1Pos);
			elemToUpdate.className += 
				' player1Pressed animated rubberBand';
		} else if (e.keyCode == 50) {
			basicGame.player2Pos += 1;
			elemToUpdate = document.getElementById('player2-' 
				+ basicGame.player2Pos);
			elemToUpdate.className += 
				' player2Pressed animated rubberBand';
		}

		// Did anybody win?
		if (basicGame.player1Pos == basicGame.winningScore) {
			document.getElementById('player1').className += 
				' animated flip';
			alert('Player 1 Wins!');
			basicGame.init();
		} else if (basicGame.player2Pos == basicGame.winningScore) {
			document.getElementById('player2').className += 
				' animated flip';
			alert('Player 2 Wins!');
			basicGame.init();
		}

	}
};
{% endhighlight %}

Play the Game
-------------

Whether or not you have an IPAC-2 and arcade buttons, you can go ahead 
and try the game out by getting it from the [GitHub repo](https://github.com/simonprickett/bensarcadebuttonchallenge), or playing it here via 
CodePen (use key 1 for player 1, 2 for player 2).  This version has been 
slightly modified to fit the width of a blog post.  You will need to click 
in the grey area below to give it keyboard focus before playing, then 
hammer the 1 and 2 keys until someone wins.  

Enjoy!

{% include codepen.html user="simonprickett" pen="MYJvNV" tab="result" height="650" %}
