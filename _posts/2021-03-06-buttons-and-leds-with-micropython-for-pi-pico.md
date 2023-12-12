---
layout: post
title:  "Buttons and LEDs with MicroPython for the Raspberry Pi Pico"
categories: [Python, Raspberry Pi, IoT, Coding ]
image: assets/images/pi_pico_main.jpg
author: simon
---
Raspberry Pi recently released the Pico, their first microcontoller.  This is a bit of a departure from their previous single board computers that cost a bit more, and run a full operating system.  Think of the Pico more like an Arduino... you can program it in C or MicroPython and it runs your code and nothing else.  

The [Pi Pico](https://www.raspberrypi.org/products/raspberry-pi-pico/) has several GPIO ports that you can connect things to.  Here, I'll have a go at hooking up some buttons and LEDs to one and control them from [MicroPython](http://micropython.org/).

Here's what the Pi Pico looks like:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_pico_pi_pico_board.jpg" class="figure-img img-fluid" alt="The Raspberry Pi Pico Microcontroller Board">
  <figcaption class="figure-caption text-center">The Raspberry Pi Pico Microcontroller Board.</figcaption>
</figure>

Programming is done by attaching the board to a computer using a micro USB cable.  [Thonny](https://thonny.org/) is the recommended editor - it can detect the Pi Pico and save code to it, as well as interface to the Python REPL on the board.  Here's what it looks like running on a Mac:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_pico_thonny.png" class="figure-img img-fluid" alt="Thonny running on a Mac">
  <figcaption class="figure-caption text-center">Thonny running on a Mac.</figcaption>
</figure>

Thonny's OK, but very basic.  I'll do some research into how to use an editor with more features in future... I'd prefer to use Microsoft's [VSCode](https://code.visualstudio.com/) which is my editor of choice at the moment.

{% include coffee-cta.html %}

I decided it would be useful to learn how to control LEDs and detect button presses in MicroPython... this is the basis of a lot of projects you could use the Pi Pico for.  I still love the Adafruit LED arcade buttons that are an input and output in one, so I got a couple of those and set out to write software that toggles the LED each time the button is pressed.  Here's what the buttons look like:

<div class="text-center">
  <figure class="figure">
    <img src="{{ site.baseurl }}/assets/images/pi_pico_button_flash.gif" class="figure-img img-fluid" alt="Adafruit LED arcade button">
    <figcaption class="figure-caption text-center">Adafruit LED arcade button.</figcaption>
  </figure>
</div>

Note that the Pi Pico runs 3.3v GPIO, so you'll want the blue and green buttons.  The red and yellow ones need 5v and I keep forgetting that then wondering why they don't work on Pi projects! (They work great on Arduino though).

And here's what the finished project looks like, mounted in a cardboard box that I had to hand :)

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/peegzA0oAnk" allowfullscreen></iframe>
</div><br/>

# Shopping List

Here's everything I used to build this project:

* 1 x Raspberry Pi Pico ([buy in UK](https://shop.pimoroni.com/products/raspberry-pi-pico) / [buy in USA](https://www.adafruit.com/product/4864)).
* 1 x Adafruit 24mm LED arcade button green ([buy in UK](https://thepihut.com/products/mini-led-arcade-button-24mm-green) / [buy in USA](https://www.adafruit.com/product/3433)).
* 1 x Adafruit 24mm LED arcade button blue ([buy in UK](https://thepihut.com/products/mini-led-arcade-button-24mm-translucent-blue) / [buy in USA](https://www.adafruit.com/product/3432)).
* 4 x Adafruit arcade button quick connect wires ([buy in UK](https://thepihut.com/products/arcade-button-quick-connect-wire-pairs-0-11-10-pack) / [buy in USA](https://www.adafruit.com/product/1152)) - optional, just means a little less soldering but you could use the wire below for all connections.  I used these for the button and LED connections on each button.
* Hook up wires, I like using single core ones (easier to poke through holes in circuit boards) but anything will do.  I used these for the ground connections for each button. ([buy in UK](https://thepihut.com/products/hook-up-wire-spool-set-22awg-solid-core-6-x-25-ft) / [buy in USA](https://www.adafruit.com/product/1311)).
* Soldering iron ([buy in UK](https://shop.pimoroni.com/products/antex-xs25-soldering-iron-uk-plug) / [buy in USA](https://www.adafruit.com/product/3685).
* USB A to micro USB cable (for programming, then powering the finished project) ([buy in UK](https://shop.pimoroni.com/products/usb-a-to-microb-cable-black) / [buy in USA](https://www.adafruit.com/product/2185)).
* Cardboard box (you don't need an enclosure, but it keeps everything together!  I also find plastic take out food containers work well for this stuff).

# Hardware

The buttons each have four connections... one is for the button feature, one powers the LED and the other two are ground.  I needed to connect the button and LED connections to GPIO pins on the Pi Pico, and both grounds can be connected together than to the same ground pin on the Pico.  Something like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_pico_button_wiring.png" class="figure-img img-fluid" alt="LED Button wiring diagram">
  <figcaption class="figure-caption text-center">LED Button wiring diagram.</figcaption>
</figure>

The overall wiring diagram looks like this... my choice of GPIO pins is pretty arbitrary, just remember to note down what's wired to which pin as you'll need that to make the code work :)

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_pico_wiring_diagram.png" class="figure-img img-fluid" alt="Project wiring diagram">
  <figcaption class="figure-caption text-center">Project wiring diagram.</figcaption>
</figure>

I'm always a bit nervous soldering these things up, as you've no idea if they're going to work until the code's written and installed on the board :)  So, let's get on with that...

# MicroPython on the Raspberry Pi Pico

MicroPython needs installing on the Pico so that it can actually understand Python... This is relatively straightforwards and involves downloading a binary of the interpreter and loading it onto the Pico using the USB cable.  If you need help with this, [check out this guide](https://www.electronicshub.org/raspberry-pi-pico-micropython-tutorial/).

# Software

This was my first time writing anything with MicroPython, so I'm not going to hold this up as best practice but it works :)

The code to work with the GPIO pins is pretty similar to what I'd expect to use with Python on a regular Raspberry Pi, so I start by delcaring Pin objects for each LED and button.  The LEDs are outputs `machine.Pin.OUT` and the buttons inputs - `machine.Pin.IN`.  I set the pull up resistor on each of the button pins, to avoid false positive readings.

In the code beginning at line 26 I turn off each LED to begin with by setting the pin value to 0 (low), and assign the `button_handler` function to be triggered whenever the buttons are pressed.

The `button_handler` function runs whenever the buttons are pressed, and is passed the pin object representing the pin that detected the press.  It checks which of the two buttons this is, and works out if enough time has passed (500 milliseconds) since the last time there was a button press detected.  If so, this counts as a new button press.  This mechanism acts as a rudimentary debouncer to make sure we don't count the same press multiple times.  If a new button press is deemed to have occurred, I toggle the LED pin's state, which will switch the LED on or off.

Here's the complete code:

<script src="https://gist.github.com/simonprickett/8f6fa9648fb199089a287fe31e05912e.js"></script>

Thonny provides an OK editor for coding, and makes saving the code to the Pico easy too.

# Make Your Own?

This project doesn't really do a heck of a lot, but it could be used as the basis of a game or something else... if you enjoyed this article and decide to do something with a Pico yourself, I'd love to hear about it.  Feel free to take my code and use is as you please, it's [available from GitHub](https://github.com/simonprickett/buttons-and-leds-with-raspberry-pi-pico).  If you're looking for a more step by step guide to getting up and running with MicroPython on the Pico, I found [this one](https://www.electronicshub.org/raspberry-pi-pico-micropython-tutorial/) at electronicshub.org very useful.

---

*(Main Photo by [cottonbro](https://www.pexels.com/@cottonbro) from Pexels).*