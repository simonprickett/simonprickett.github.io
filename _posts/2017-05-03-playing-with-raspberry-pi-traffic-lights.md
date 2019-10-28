---
layout: post
title:  "Playing with Raspberry Pi and Python: Traffic lights"
categories: [ Raspberry Pi, Technology, IoT, Python ]
image: assets/images/pi_traffic_lights_python_main.jpg
author: simon
---
I’ve recently been doing some simple Python programming with the Raspberry Pi and a set of traffic light LEDs that connect to it. In this post I’ll look at setting up a Pi to drive the lights. In future posts, I’ll explore some other programming / devops concepts using the base setup described here.

I subsequently wrote versions of this article describing the same process using the Go programming language (here), Java (here), C (here), Bash scripting (here) and also Node.js (here).

Let’s go...

## Shopping List

To try this out, you will need the following (links here mostly go to [Adafruit](https://www.adafruit.com/), UK customers may want to consider [Pimoroni](https://shop.pimoroni.com/) as a UK based alternative, Amazon has most if not all of this stuff too):

* A [Raspberry Pi](https://www.adafruit.com/product/3055) (I’ll use the Pi 3 Model B here, but any model with GPIO pins will work — if you want to use the Pi Zero you’ll need to solder some headers onto it). I’m going to assume you have a Pi 2 or 3 with 40 pins
* A [power supply](https://www.adafruit.com/product/1995) for your Pi
* Some sort of [case](https://www.adafruit.com/product/2256) is probably a good idea to protect the Pi (but you’ll need to leave the lid off to expose the GPIO pins to connect your lights to)
* A [Micro SD card](https://www.adafruit.com/product/1294) to install your operating system on (or [get one with the OS pre-installed](https://www.adafruit.com/product/3259)). If you want to install the operating system yourself, you’ll need a Mac, PC, Linux machine with an SD card reader
* A set of [traffic lights from Low Voltage Labs](http://lowvoltagelabs.com/products/pi-traffic/) (the two pack is good value)
* Any USB keyboard to type on the Pi, you might want a mouse too
* Any HDMI display to show output from the Pi

## Attaching the Traffic Lights

The Low Voltage Labs traffic lights connect to the Pi using four pins. One of these needs to be ground, the other three being actual GPIO pins used to control each of the individual LEDs.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_python_lights_stock.jpg" class="figure-img img-fluid" alt="Low Voltage Labs Traffic Lights">
  <figcaption class="figure-caption text-center">Low Voltage Labs Traffic Lights.</figcaption>
</figure>

Before powering up the Pi, attach the traffic lights so that the pins connect to the GPIO pins highlighted in red:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_python_gpio_diagram.png" class="figure-img img-fluid" alt="GPIO Pin Diagram">
  <figcaption class="figure-caption text-center">GPIO Pin Diagram.</figcaption>
</figure>

When you’re done it’s going to look something like this... (an easy way to make sure you have it right is to locate the lights on the left hand row of pins as you look at the Pi with the USB ports to the bottom, then count 8 pins up and attach the lights there).

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_python_lights_attached_1.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_python_lights_attached_2.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

Don’t turn the Pi on yet, you’ll need to prepare an operating system image for it first...

## Operating System Setup

Install the Raspbian OS which can be [downloaded from the official Raspberry Pi site](https://www.raspberrypi.org/downloads/raspbian/). You can also find an excellent [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) there should you need help.

Once you’ve got the operating system installed, make sure you can login, and have a working wired or wifi internet connection.

Now you can go ahead and start turning lights on and off!

## Programming the Traffic Lights

We’ll use the [Python](https://www.python.org/) programming language to make the lights work. First, you need to install a couple of extra software packages needed to allow you to download my sample code, and to give Python access to the GPIO pins on the Pi. Enter the following at the command line:

```
$ sudo apt-get install python-dev python-rpi.gpio git
```

Answer “Y” when asked if you want to install additional packages.

Now get the code from my [GitHub repo](https://github.com/simonprickett/pitrafficlights):

```
$ git clone https://github.com/simonprickett/pitrafficlights.git
$ cd pitrafficlights
```

You should now be able to test the lights:

```
$ python basicdemo.py
```

And if they are connected to the correct GPIO pins, they should start to flash on and off in the UK traffic light pattern (red, red + amber, green, amber, red). If you don’t see anything, you might need to make sure that you have the lights connected to the right pins.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_python_working.gif" class="figure-img img-fluid" alt="Lights installed and working.">
  <figcaption class="figure-caption text-center">Lights installed and working.</figcaption>
</figure>

## How it Works

The [code for this](https://github.com/simonprickett/pitrafficlights/blob/master/basicdemo.py) is very simple. It starts by importing the `RPi.GPIO` library, plus `time` which gives us a timed wait function, `signal` that allows us to trap the signal sent when the user tries to quit the program and `sys` so we can send an appropriate exit signal back to the operating system before terminating.

```
import RPi.GPIO as GPIO
import time
import signal
import sys
```

Next we put the GPIO library into "BCM" or "Broadcom" mode (so we can refer to pins by the same numbers as are labeled with in GPIO pin diagrams), and sets pins 9 (red LED), 10 (amber LED) and 11 (green LED) to be used as outputs:

```
# Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(9, GPIO.OUT)
GPIO.setup(10, GPIO.OUT)
GPIO.setup(11, GPIO.OUT)
```

The main part of the program will run in an infinite loop until the user exits it by stopping Python with `Ctrl-C`. It’s a good idea to add a handler function that will run whenever this happens, so that we can turn off all the lights prior to exiting (thus ensuring they’ll also be in the state we expect them to start in the next time the program is run):

```
# Turn off all lights when user ends demo
def allLightsOff(signal, frame):
    GPIO.output(9, False)
    GPIO.output(10, False)
    GPIO.output(11, False)
    GPIO.cleanup()
    sys.exit(0)
signal.signal(signal.SIGINT, allLightsOff)
```

The main body of the code then consists of an infinite `while` loop that turns on the red light (pin 9), waits, turns on the amber light (pin 10), waits, then cycles through the rest of the traffic light pattern by turning the appropriate LEDs on and off:

```
# Loop forever
while True: 
    # Red 
    GPIO.output(9, True) 
    time.sleep(3)  
    # Red and amber 
    GPIO.output(10, True) 
    time.sleep(1)  
    # Green 
    GPIO.output(9, False) 
    GPIO.output(10, False) 
    GPIO.output(11, True) 
    time.sleep(5)  
    # Amber 
    GPIO.output(11, False) 
    GPIO.output(10, True) 
    time.sleep(2)  
    # Amber off (red comes on at top of loop) 
    GPIO.output(10, False)
```

When `Control-C` is pressed an interrupt signal `signal.SIGINT` is sent. This is handled by the `allLightsOff` function that switches all the lights off, tidies up the GPIO library state and exits cleanly back to the operating system.

## Next Steps

In the [next post in this series]({{ site.baseurl }}/playing-with-raspberry-pi-traffic-lights-part-2), I’ll look at how to drive the lights in either the UK or USA patterns of operation then we’ll move on to other ways to structure and deploy the code.

---

I’d love to hear what you’re up to with the Raspberry Pi — [find me on Twitter](https://twitter.com/simon_prickett) or via the comments here. If you enjoyed this article, please share it far and wide!