---
layout: post
title:  "Raspberry Pi Coding in Swift: Traffic Lights"
categories: [ Raspberry Pi, Technology, IoT, Swift, Coding ]
image: assets/images/pi_traffic_lights_swift_main.jpg
author: simon
---
As long time readers know, I've written a series of articles each describing how to get up and running with controlling the Raspberry Pi GPIO pins using different programming languages.  In each article, I use the same example of a set of traffic light LEDs so that you can compare and contrast the different language implementations.  With the possible exception of a future ARM assembler post (steep learning curve for me there - but I do like working at such a low level!), I thought I'd run out of languages to try.  Recently, I stumbled across [this blog post](https://lickability.com/blog/swift-on-raspberry-pi/) which describes how to install Swift on the Pi so I thought I'd try it out... 

If you're interested in my other articles that show how to write the same code in different languages, please check out the links below:

* [Python]({{ site.baseurl}}/playing-with-raspberry-pi-traffic-lights)
* [Node.js]({{ site.baseurl }}/raspberry-pi-coding-with-node-js-traffic-lights)
* [Node RED]({{ site.baseurl }}/raspberry-pi-coding-with-node-red-traffic-lights/)
* [Java]({{ site.baseurl}}/playing-with-raspberry-pi-gpio-pins-and-traffic-lights-in-java)
* [C]({{ site.baseurl}}/gpio-access-in-c-with-raspberry-pi-traffic-lights)
* [Go]({{ site.baseurl}}/raspberry-pi-coding-in-go-traffic-lights)
* [Bash scripting]({{ site.baseurl}}/controlling-raspberry-pi-gpio-pins-from-bash-scripts-traffic-lights)
* [Rust]({{ site.baseurl }}/raspberry-pi-coding-with-rust-traffic-lights/)
* [.NET/C#]({{ site.baseurl }}/raspberry-pi-coding-with-dotnet-traffic-lights/)
* also... [Arduino]({{ site.baseurl}}/traffic-lights-with-arduino/)
* and, most recently, [Raspberry Pi Pico]({{ site.baseurl }}/coding-on-the-raspberry-pi-pico-traffic-lights/) in C, MicroPython and CircuitPython

To make this a standalone guide, there will be some re-use of content from the prior articles here.

## Shopping List

To try this out, you will need the following (links here mostly go to [Adafruit](https://www.adafruit.com/), UK customers may want to consider [Pimoroni](https://shop.pimoroni.com/) as a UK based alternative, Amazon has most if not all of this stuff too):

* A [Raspberry Pi](https://www.adafruit.com/product/3055) (I'll use the Pi 3 Model B here, but any model with GPIO pins will work — if you want to use the Pi Zero you’ll need to solder some headers onto it). I'm going to assume you have a Pi 2, 3 or 4 with 40 pins
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

Install the Raspberry Pi OS which can be [downloaded from the official Raspberry Pi site](https://www.raspberrypi.com/software/). You can also find an excellent [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) there should you need help.

Once you've got the operating system installed, make sure you can login, and have a working wired or wifi internet connection.

{% include coffee-cta.html %}

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

This will initially take a moment to fetch the dependencies and compile the project.

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

The first thing Pi specific thing to do is at line 3: `import SwiftyGPIO`.  This imports the framework which handles interaction with the Pi’s GPIO pins ([website here](https://github.com/uraimo/SwiftyGPIO)). Lines 6–9 set up references to each of the three lights, identifed by their GPIO pin numbers.  Note at line 6 I am using the mapping for the Pi 3, you may need to change this if you have a different model ([see documentation](https://github.com/uraimo/SwiftyGPIO#gpio)).  Lines 11-13 set those pins to be outputs.

Line 15–19 define a convenience function that will switch all of the lights off.  `0` is used to set the pin low (LED turns off), with `1` setting it to high (LED turns on).

We begin at line 22 by calling `allLightsOff` to ensure that we start from a known state where all three LEDs are off.

Lines 25-47 create an infinite loop that sets the values of the three LEDs to `1` for states where the LED should be on, and `0` for states where it should be off.  At each stage, the `Thread.sleep` function is called to keep the lights in their current state for a period of time (2 = 2 seconds for example).  The loop continues forever until the user presses Ctrl-C to terminate the program.  That's all there is to it!

The source code for this project is [freely available on GitHub](https://github.com/simonprickett/swift-pi-traffic-lights).  One thing I would like to improve here is to add a `SIGINT` handler that catches the signal raised when the user uses Ctrl-C to terminate the program.  This would allow me to write code to call the `allLightsOff` function at this point.  I wasn't able to find a simple, neat solution to do this with Swift on Linux - if you have one I'd love to hear from you!

---

Let me know what you’re up to with the Raspberry Pi — get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!

---

This article was updated on May 23rd 2020 — fixed link to wrong Swift library, thanks to keen eyed [Dmitry](https://twitter.com/DimkoyDimkoy) for bringing this to my attention via Twitter.