---
layout: post
title:  "Making a Single Button Keyboard with the Adafruit Trinket M0"
categories: [ Arduino, C, IoT, Programming ]
image: assets/images/arcade_keyboard_main.jpg
author: simon
---
Recently we've all be spending a lot more of our time on video conference calls from home.  I'm sure that, like me, you find yourself needing to mute your microphone and turn off the camera frequently.  Perhaps something you can't control is going on in the background, or someone needs your attention for a moment.  Perhaps you are having a sneezing fit or whatever.

With the popular video conferencing service Zoom, there's no single "I need privacy now" button that will both mute the microphone and turn off the camera.  You need to become proficient at hitting (on a Macintosh) Command + Shift + A to toggle the microphone and Command + Shift + V to toggle the video camera.  I set out to see if I could build a single button custom keyboard that would do this for me, and to do so in a way that would make it easily customizable for other purposes.  

Let's take a look at how to make one, starting with the hardware...

## Hardware Build

I really enjoy building things that use arcade buttons, as they're very satisfying to press, super durable and some even have LEDs inside them so you can use them as an input and an output.  I've previously built a [weekly task tracker box with Arduino](https://simonprickett.dev/building-a-task-tracker-with-arduino-and-led-arcade-buttons/) using these, as well as a [game with a Raspberry Pi](https://simonprickett.dev/raspberry-pi-arcade-button-led-game/).  For this project I decided that something with a really good click sound when pressed was better than a flashy LED, so I reached for a pile of older arcade buttons that I had kicking around.  These use a microswitch so make a very satistying mechanical noise when pressed.  Here's the one I had on hand:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_button_microswitch.jpg" class="figure-img img-fluid" alt="Arcade button with microswitch">
  <figcaption class="figure-caption text-center">Arcade button with microswitch) - needs a clean!</figcaption>
</figure>

If you don't have one of these, you can get them from eBay or many other online arcade parts stores.  Some places sell the microswitches separately, just be sure to get both the button and a microswitch to slot into it as the button won't function without the switch.  Any type of button switch will work for this project though! I've put a shopping list at the end of this article.

On its own, a microswitch or arcade button isn't going to be understood by a computer as a keypress... we need to trick the computer into thinking it's got an external keyboard attached, then have the button press send the right sequence of key codes to trigger the desired action.  Luckily, we don't need to build our own keyboard logic board type thing, as Adafruit makes something called the [Trinket M0](https://www.adafruit.com/product/3500) which costs $8.95 and can handle all of that for us.  Here's what one looks like (they're very small, this image from Adafruit is magnified):

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_trinket_m0.jpg" class="figure-img img-fluid" alt="Adafruit Trinket M0">
  <figcaption class="figure-caption text-center">Adafruit Trinket M0 (photo: <a href="https://learn.adafruit.com/assets/45708">Adafruit</a>)</figcaption>
</figure>

If you get one of these, be sure to get the "M0" model (Adafruit product 3500) and **not** the regular older Trinket $6.95 (Adafruit product 1501) - this one uses older USB logic and won't work as a keyboard with many computers any more.

The Trinket M0 is a tiny Arduino compatible programmable board that can be programmed with Circuit Python or in C using the Arduino IDE.  I used the latter as I'm more familiar with it, but you could totally do this project in either language.  The features of the Trinket M0 that we'll be relying on for this project are:

* Native USB support - plug it in to any computer and it will be seen as an external device with no drivers needed... we'll use this to make a fake keyboard, allowing us to send special keystrokes when the button is pressed.  To connect to the computer (both to program the board and to use it as a fake keyboard, we'll need a USB to micro USB data cable - like the ones you get with most Android phones).
* GPIO pins - pins on the board that we can solder our arcade button to, and then write software that runs on the Trinket to detect the button being pressed so we can then generate those special keystrokes and send them down the USB cable.
* A built in multi-colored LED... so we can make an attractive display when we mount the board in an enclosure :)

We'll need to wire the arcade button (in my case the microswitch that attaches to the arcade button) to the Trinket.  We'll do this by soldering two wires, one going from the ground pin of the microswitch to the single ground pin on the Trinket and the second going from the other pin on the microswitch to one of the numbered GPIO pins on the Trinket...  I used pin 0 but you can use any of them so long as you remember which one when you write the Arduino sketch later.  Here's my wiring diagram:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_wiring.png" class="figure-img img-fluid" alt="Wiring">
  <figcaption class="figure-caption text-center">Wiring diagram.</figcaption>
</figure>

Soldering this up is a little tricky as the Trinket is very small, but take your time and don't forget you can always remove the solder and try again!  Here's what it looks like when done... I used black for the ground connection and red for the live one, but it's the same single core wire inside both.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_soldered.jpg" class="figure-img img-fluid" alt="Soldering completed">
  <figcaption class="figure-caption text-center">Soldering completed, button in the enclosure...</figcaption>
</figure>

Don't forget to push the wires through the holes in the trinket before soldering them on, then clip any excess wire with pliers.  If you need help with this technique, [Sparkfun has a good tutorial](https://learn.sparkfun.com/tutorials/how-to-solder-through-hole-soldering/all). We'll find out if the circuit works later, when we come to write software for it...

In the image above I have the Trinket connected to a USB power source, just to check that it powered up and worked after soldering, and that I hadn't fried it :)

Finally on the hardware side, we'll want to put the button and the trinket in a sturdy enclosure, so that we can hit that button hard when we need to get out of a situation on Zoom!  As the trinket will connect to the computer using the USB cable, we'll want something that we can make two holes in - one to mount the button, the other to let the USB cable get in.  As we're going to use the Trinket's multi-colored LED too, it'd be nice if the enclosure was somewhat translucent, acting as an LED diffuser and letting some light escape.

Looking around at what I had handy, I figured a reusable Starbucks hot cup (available at any Starbucks) would do.  I drilled a hole in the top with a forstner drill bit, and attached the arcade button using its screw collar.  I then drilled a smaller hole in the bottom to allow the USB cable to enter...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_enclosure.jpg" class="figure-img img-fluid" alt="Completed enclosure">
  <figcaption class="figure-caption text-center">Completed enclosure.</figcaption>
</figure>

Any enclosure that you can make work will do of course!

## Software

To make this a really flexible project, I decided that I would write some software to run on the computer as well as on the Trinket... Why is this necessary, the computer should be able to accept keystrokes and that's all we need right?  

We could build this so that when the arcade button is pressed, the trinket sends the key commands for toggle audio on Zoom (Command + Shift + A) then sends the key commands for toggle video on Zoom (Command + Shift + V).  This way, we don't need any software on the computer (assuming the computer is a Macintosh as we're sending Mac OS key sequences - Windows users you'd need to swap in the equivalent Windows key combinations).  This is a nice simple approach, but there's a few downsides:

* What happens if our application that we want to send the key strokes to isn't running?
* What happens if our application that we want to send the key strokes to is running but doesn't have keyboard focus - say you're on a Zoom call but really bidding on that eBay auction you've had your eye on for ages in the browser... pressing the button would send the key strokes to the browser causing who knows what to happen!
* If we wanted to change the key strokes sent by the Trinket, we'd have to re-flash it with an updated Arduino sketch - not a huge deal, but maybe inconvenient.
* We can't do complex logic as we can just send key presses to the computer and have it interpret them.

What I decided to do was always have the Trinket emit a special and unused key sequence whenever the arcade button was pressed, then build some Mac specific software and configuration that would allow an AppleScript to run whenever this sequence of keys is pressed.  This would buy the flexibility of unlocking the power of AppleScript so that I could add logic there to deal with things like checking an application is running, start it if necessary, do something else if it isn't as well as sending it key presses.

With this in mind, I decided to try and build something whose logic looked something like this:

* When the arcade button is pressed, software on the Trinket detects that and sends a special key sequence to the computer.
* The special key sequence triggers a specific AppleScript.
* Logic in the AppleScript then:
  * Checks to see if the Zoom application is running.
  * If it is, it:
     * Sends it the Command + Shift + A key presses to toggle the audio.
     * Sends it the Command + Shift + V key presses to toggle the audio.
  * If it isn't, use the AppleScript speech capability to say "Zoom is not running."

I decided not to worry about the case where the Zoom application is running, but isn't actively in a video call at the time.

Accomplishing this requires two different pieces of software: 

* An Arduino sketch runnning on the Trinket.
* An AppleScript on the computer that it's connected to.  

Let's check out both of these now.

### Software for the Trinket Board

TODO what does it need to do? and setup for Arduino IDE.

Here's my final Arduino sketch:

<script src="https://gist.github.com/simonprickett/c56deaab1dadb160ffe61f1ae8577874.js"></script>

TODO how does it do it?

### Software and Setup for Mac OS

There's a couple of distinct pieces here... an AppleScript 
The first thing I worked on was the AppleScript, and it's easy to test this without the hardware side of things as you can just run it from the Mac OS Script Editor application.  The hardest part of this was working out what the "name" for the Zoom application is, turns out it is "zoom.us" which is what it shows up as next to the Apple icon at the top of the screen when it's running:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_zoom_app.png" class="figure-img img-fluid" alt="Finding the Zoom application name">
  <figcaption class="figure-caption text-center">Finding the Zoom application name.</figcaption>
</figure>

Here's the AppleScript:

<script src="https://gist.github.com/simonprickett/640ef62e7bcd0ae1ba68e8f1c5574cf3.js"></script>

This checks if Zoom is running, if not it has the Mac say that it isn't.  If it is, then it activates Zoom and sends it the keypresses to toggle the video and audio.  Sadly Zoom doesn't have specific key presses for turning audio on and off, so toggle is the best we can do here.  A true "panic switch" would always turn them off :)

So, this is run whenever the Mac receives the special key sequence that's generated by the Trinket when someone presses the arcade button.  We need to save this AppleScript as an "Application", so that we can call it from Automator later.  Details for how to do this can be found in a linked article further down...

If we want to use the arcade button to trigger different actions then it's a simple case of changing the contents of the AppleScript to do something else... which could be a very long and complex sequence of events and logic if we wanted it to be.  The rest of the configuration won't need to change.

Next up we want to configure the Mac so that it automatically runs our AppleScript when the special key combination that the Trinket generates is received.  This requires the use of the Mac OS Automator application.  

The steps involved are:

* Save the AppleScript as an application.
* Create an Automator Quick Action to invoke the AppleScript.
* Associate the special key combination from the Trinket with that Quick Action.
* Allow Automator to control the computer via Accessibilty Settings.

This provess could be a whole article of its own - fortunately it's all documented in [this article on addictivetips.com](https://www.addictivetips.com/mac-os/run-an-applescript-with-a-keyboard-shortcut-on-macos/) which walks you through it all, I used this when setting mine up and it's worked great.  The only thing that I would add is that for Mac OS Catalina you may get asked for confirmation by the operating system that you want Automator to have accessibility controls the first time you press the arcade button, so be sure to test it before you need it in that Zoom emergency!

## Demo Time!

Here's a demo of the final setup working its magic...

TODO demo video...

## Stuff You Need to Make One

* [Adafruit Trinket M0](https://www.adafruit.com/product/3500).
* [Microswitch](https://www.adafruit.com/product/818).
* [Buttons that use Microswitches](https://shop.xgaming.com/collections/arcade-parts/products/20-pack-arcade-buttons-no-switches).
* [Other arcade buttons (some may have microswitches built in)](https://www.adafruit.com/category/757).  Some of the fancy ones have LEDs built into them, I've used those in a [previous project](/raspberry-pi-arcade-button-led-game/) and recommend them.
* A [USB to micro USB data cable](https://www.adafruit.com/product/2185) (nothing special about this, you might have one from something else, for example an Android phone).  If the machine you're connecting to uses USB C you might want to get a [USB C to micro USB cable](https://www.adafruit.com/product/3879) instead.  Either way make sure it's both a charge and data cable :)
* Some [wire](https://www.adafruit.com/product/1311) - I used red and black to distinguish ground from live / signal but you can use the same color for both it doesn't matter.  Single core wire makes soldering easier, but anything that fits through the holes in the Trinket board should do!
* A [soldering set](https://www.adafruit.com/product/180) - soldering iron and solder.
* An enclosure - I used a reusable Starbucks hot cup that I had, but anyting sturdy enough to hold the arcade button will do.
* Depending on your enclosure, maybe some [Forstner bits](https://www.harborfreight.com/14-in-1-in-forstner-drill-bit-set-with-38-in-shanks-7-pc-62361.html) to drill tidy circular holes. Make sure there's one that's an appropriate size for your arcade button!
* As the Trinket M0 supports both, you could build this project with either [CircuitPython](https://circuitpython.org/) or Arduino.  I chose Arduino as I am more familiar with it, if you want to do the same then [download the free Arduino IDE](https://www.arduino.cc/en/Main/Software) and consider making an optional donation if possible.

## Thanks!

Thanks for reading, hope you found this fun and maybe try to make something similar for yourself!  I've put my code into a [GitHub repository](https://github.com/simonprickett/arcade-keyboard) that you're free to use as you see fit.

---

Another fun project that uses a lot of the same components and ideas is this [Trinket powered foot switch](https://learn.adafruit.com/usb-foot-switch).  I also found [this article](https://www.hackster.io/laurentr/simple-usb-buttons-using-an-adafruit-trinket-m0-5ad900) very useful.