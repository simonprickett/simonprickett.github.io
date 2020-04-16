---
layout: post
title:  "Raspberry Pi Coding in Swift: Traffic Lights"
categories: [ Raspberry Pi, Technology, IoT, Swift ]
image: assets/images/pi_traffic_lights_swift_main.jpg
author: simon
---
As long time readers know, I've written a series of articles that each describe how to get up and running with controlling the Raspberry Pi GPIO pins using different programming languages.  In each article, I use the same example of a set of traffic light LEDs so that you can compare and contrast the different language implementations.  With the possible exception of a future ARM assembler post (steep learning curve for me there), I thought I'd run out of languages to try.  Then recently, I stumbled across [this blog post](https://lickability.com/blog/swift-on-raspberry-pi/) which describes how to install Swift on the Pi so I thought I'd try it out... 

If you're interested in my other articles that show how to write the same code in different languages, please check out the links below:

* [Python]({{ site.baseurl}}/playing-with-raspberry-pi-traffic-lights)
* [Node.js]({{ site.baseurl }}/raspberry-pi-coding-with-node-js-traffic-lights)
* [Node RED]({{ site.baseurl }}/raspberry-pi-coding-with-node-red-traffic-lights/)
* [Java]({{ site.baseurl}}/playing-with-raspberry-pi-gpio-pins-and-traffic-lights-in-java)
* [C]({{ site.baseurl}}/gpio-access-in-c-with-raspberry-pi-traffic-lights)
* [Go]({{ site.baseurl}}/raspberry-pi-coding-in-go-traffic-lights)
* [Bash scripting]({{ site.baseurl}}/controlling-raspberry-pi-gpio-pins-from-bash-scripts-traffic-lights)

To make this a standalone guide, there will be some re-use of content from the prior articles here.

## Shopping List

To try this out, you will need the following (links here mostly go to [Adafruit](https://www.adafruit.com/), UK customers may want to consider [Pimoroni](https://shop.pimoroni.com/) as a UK based alternative, Amazon has most if not all of this stuff too):

* A [Raspberry Pi](https://www.adafruit.com/product/3055) (I'll use the Pi 3 Model B here, but any model with GPIO pins will work — if you want to use the Pi Zero you’ll need to solder some headers onto it). I'm going to assume you have a Pi 2 or 3 with 40 pins
* A [power supply](https://www.adafruit.com/product/1995) for your Pi (Raspberry Pi 4 requires a different [USB C power supply](https://www.adafruit.com/product/4298))
* Some sort of [case](https://www.adafruit.com/product/2256) is probably a good idea to protect the Pi (but you’ll need to leave the lid off to expose the GPIO pins to connect your lights to)
* A [Micro SD card](https://www.adafruit.com/product/1294) to install your operating system on (or [get one with the OS pre-installed](https://www.adafruit.com/product/3259)). If you want to install the operating system yourself, you'll need a Mac, PC, Linux machine with an SD card reader
* A set of [traffic lights from Low Voltage Labs](http://lowvoltagelabs.com/products/pi-traffic/) (the two pack is good value)
* Any USB keyboard to type on the Pi, you might want a mouse too
* Any HDMI display to show output from the Pi

## Attaching the Traffic Lights

The Low Voltage Labs traffic lights connect to the Pi using four pins. One of these needs to be ground, the other three being actual GPIO pins used to control each of the individual LEDs.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_swift_lights_stock.jpg" class="figure-img img-fluid" alt="Low Voltage Labs Traffic Lights">
  <figcaption class="figure-caption text-center">Low Voltage Labs Traffic Lights.</figcaption>
</figure>

Before powering up the Pi, attach the traffic lights so that the pins connect to the GPIO pins highlighted in red:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_swift_gpio_diagram.png" class="figure-img img-fluid" alt="GPIO Pin Diagram">
  <figcaption class="figure-caption text-center">GPIO Pin Diagram.</figcaption>
</figure>

When you're done it's going to look something like this... (an easy way to make sure you have it right is to locate the lights on the left hand row of pins as you look at the Pi with the USB ports to the bottom, then count 8 pins up and attach the lights there).

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_swift_lights_attached_1.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_swift_lights_attached_2.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

Don't turn the Pi on yet, you'll need to prepare an operating system image for it first...

## Operating System Setup

Install the Raspbian OS which can be [downloaded from the official Raspberry Pi site](https://www.raspberrypi.org/downloads/raspbian/). You can also find an excellent [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) there should you need help.

Once you've got the operating system installed, make sure you can login, and have a working wired or wifi internet connection.

Now you can go ahead and start turning lights on and off!

## Installing Swift

Swift doesn't come pre-installed, so let's install it by adding its repo to `apt` then installing with `apt-get`.  Note, these commands may take some time to execute.

```
$ curl -s https://packagecloud.io/install/repositories/swift-arm/release/script.deb.sh | sudo bash
$ sudo apt-get update
$ sudo apt-get install swift5
$ swift --version
Swift version 5.1.5 (swift-5.1.5-RELEASE)
Target: armv6-unknown-linux-gnueabihf
```

## Installing Dependencies

We’ll also need git, which isn’t installed with Raspbian Lite but is simple to add:

```
$ sudo apt-get install git
$ git --version

git version 2.20.1
```

## Programming the Traffic Lights

To get going, grab my example code from GitHub, and build and run it:

```
$ git clone https://github.com/simonprickett/swift-pi-traffic-lights.git
$ cd swift-pi-traffic-lights
$ swift run
```

This will initially take a moment to fetch the dependencies and compiler the project.

The program will then start running.  If the lights are connected to the correct GPIO pins, they should start to flash on and off in the UK traffic light pattern (red, red + amber, green, amber, red). If you don’t see anything, make sure that you have the lights connected to the right pins.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_swift_lights_working.gif" class="figure-img img-fluid" alt="Lights installed and working.">
  <figcaption class="figure-caption text-center">Lights installed and working.</figcaption>
</figure>

To exit, press Ctrl + C.

Because Swift is a compiled language, the result of executing `swift run` is a standalone binary file that you can place anywhere on the Pi, and run it without the source code present.  You can find that in `.build/armv6-unknown-linux-gnueabihf/debug` as a file called `trafficlights`.

## How it Works

Here’s a brief walkthrough of the complete source code...

<script src="https://gist.github.com/simonprickett/bd6f787ac6308814fbef806fb0c8e5f2.js"></script>

TODO UPDATE THE FOLLOWING:

The first thing to do is `require` the [onoff module](https://www.npmjs.com/package/onoff), which handles interaction with the Pi’s GPIO pins. Lines 3–5 set up objects for each of the three lights, telling `onoff` which pin to use, and that they are to be used as outputs.

In order to make Node.js wait around for a configurable time before changing the state of the lines, we define a `sleep` function at line 7 that takes the desired sleep time in milliseconds as its parameter. This function returns a promise that is resolved after an appropriate wait period has expired.

Lines 13–37 defines an `async` function that loops forever and uses the onoff module’s `writeSync` function to turn each light on (`1`) or off (`0`) according to the desired stage of the traffic light sequence. At each stage, the `sleep` function is called to keep the lights in their current state for a period of time (2000 milliseconds = 2 seconds for example). `sleep` returns a promise, so we await its resolution.

Line 39–43 define a convenience function that will switch all of the lights off.

Lines 45–49 register a handler function to intercept the `SIGINT` signal... this signal is sent to the program whenever the user gets bored of watching the lights and hits Ctrl+C. The handler function turns all of the lights off and cleanly exits Node.js.

Finally line 51 ensures that we always start in the right state by switching all of the lights off, then invoking runLights which will run in a continuous loop until the user presses Ctrl+C, invoking the `SIGINT` handler.

The source code for this project is [freely available on GitHub](https://github.com/simonprickett/swift-pi-traffic-lights).  One thing I would like to improve here is to add a `SIGINT` handler that catches the signal raised when the user uses Ctrl-C to terminate the program.  This would allow me to write code to turn all of the lights off at this point.  I wasn't able to find a simple, neat solution to do this with Swift on Linux - if you have one I'd love to hear from you!

---

Let me know what you’re up to with the Raspberry Pi — [find me on Twitter](https://twitter.com/simon_prickett) or via the comments here. If you enjoyed this article, please share it far and wide!