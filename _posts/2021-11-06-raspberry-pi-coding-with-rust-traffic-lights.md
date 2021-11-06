---
layout: post
title:  "Raspberry Pi Coding with Rust: Traffic Lights"
categories: [ Raspberry Pi, Technology, Rust ]
image: assets/images/pi_traffic_lights_rust_main.jpg
author: simon
---
It's been a long time coming, but I finally decided to produce a C#/.NET version of my original Raspberry Pi / Low Voltage Labs traffic lights Python article ([read here]({{ site.baseurl }}/playing-with-raspberry-pi-traffic-lights/)).  TODO UPDATE THIS.

To make this a standalone guide, there will be some re-use of content from the prior article here. Since writing this article, I've also written up the same exercise using Swift ([Swift version]({{ site.baseurl }}/raspberry-pi-coding-in-swift-traffic-lights)), Node.js ([read about that here]({{ site.baseurl }}/raspberry-pi-coding-with-node-js-traffic-lights)), Node RED ([try here]({{ site.baseurl }}/raspberry-pi-coding-with-node-red-traffic-lights/)), Java ([try here]({{ site.baseurl }}/playing-with-raspberry-pi-gpio-pins-and-traffic-lights-in-java)), Bash scripting ([Bash article]({{ site.baseurl}}/controlling-raspberry-pi-gpio-pins-from-bash-scripts-traffic-lights)), C ([check it out here]({{ site.baseurl }}/gpio-access-in-c-with-raspberry-pi-traffic-lights)), [Go]({{ site.baseurl}}/raspberry-pi-coding-in-go-traffic-lights/), [.NET/C#]({{ site.baseurl }}/raspberry-pi-coding-with-dotnet-traffic-lights/) and also for [Arduino]({{ site.baseurl}}/traffic-lights-with-arduino/).

## Shopping List

To try this out, you will need the following (links here mostly go to [Adafruit](https://www.adafruit.com/), UK customers may want to consider [Pimoroni](https://shop.pimoroni.com/) as a UK based alternative, Amazon has most if not all of this stuff too):

* A [Raspberry Pi](https://www.adafruit.com/product/3055) (I'll use the Pi 3 Model B here, but any model with GPIO pins will work — if you want to use the Pi Zero you’ll need to solder some headers onto it or buy one with those pre-attached). I'm going to assume you have a Pi 2, 3 or 4 with 40 pins
* A [power supply](https://www.adafruit.com/product/1995) for your Pi (Raspberry Pi 4 requires a different [USB C power supply](https://www.adafruit.com/product/4298))
* Some sort of [case](https://www.adafruit.com/product/2256) is probably a good idea to protect the Pi (but you’ll need to leave the lid off to expose the GPIO pins to connect your lights to)
* A [Micro SD card](https://www.adafruit.com/product/1294) to install your operating system on (or [get one with the OS pre-installed](https://www.adafruit.com/product/3259)). If you want to install the operating system yourself, you'll need a Mac, PC, Linux machine with an SD card reader
* A set of [traffic lights from Low Voltage Labs](http://lowvoltagelabs.com/products/pi-traffic/) (the two pack is good value)
* Any USB keyboard to type on the Pi, you might want a mouse too
* Any HDMI display to show output from the Pi

## Attaching the Traffic Lights

The Low Voltage Labs traffic lights connect to the Pi using four pins. One of these needs to be ground, the other three being actual GPIO pins used to control each of the individual LEDs.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_rust_lights_stock.jpg" class="figure-img img-fluid" alt="Low Voltage Labs Traffic Lights">
  <figcaption class="figure-caption text-center">Low Voltage Labs Traffic Lights.</figcaption>
</figure>

Before powering up the Pi, attach the traffic lights so that the pins connect to the GPIO pins highlighted in red:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_rust_gpio_diagram.png" class="figure-img img-fluid" alt="GPIO Pin Diagram">
  <figcaption class="figure-caption text-center">GPIO Pin Diagram.</figcaption>
</figure>

When you're done it's going to look something like this... (an easy way to make sure you have it right is to locate the lights on the left hand row of pins as you look at the Pi with the USB ports to the bottom, then count 8 pins up and attach the lights there).

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_rust_lights_attached_1.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_rust_lights_attached_2.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

Don't turn the Pi on yet, you'll need to prepare an operating system image for it first...

## Operating System Setup

Install the Raspberry Pi OS which can be [downloaded from the official Raspberry Pi site](https://www.raspberrypi.org/downloads/raspbian/). You can also find an excellent [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) there should you need help.  As I didn't need a full graphical desktop for this project, I went with the Lite version.

Once you've got the operating system installed, make sure you can login, and have a working wired or wifi internet connection.

Now you can go ahead and start turning lights on and off!

## Installing Dependencies

To get started, we'll need to install some dependencies.  These include [git](https://git-scm.com/), plus some libraries that the .NET runtime requires:

```
$ sudo apt-get install git libunwind8 gettext apt-transport-https
$ git --version
git version 2.20.1
```

## Installing Rust

TODO..

```bash
$ TODO
```

TODO check rust and cargo were installed.

## Programming the Traffic Lights

I've already created a project and Rust code for you, so we just need to get that from GitHub:

```bash
$ git clone https://github.com/simonprickett/rustpitrafficlights.git
$ cd rustpitrafficlights
```

Now add the crate (crates for Rust are similar to packages or libraries in other languages) that we need to control the Pi's GPIO pins:

```bash
$ TODO
```

TODO where are the crate(s) listed?

We've now got everything we need to start seeing some action, so let's start it up:

```bash
$ TODO
```

If the lights are connected to the correct GPIO pins, they should start to flash on and off in the UK traffic light pattern (red, red + amber, green, amber, red). If you don’t see anything, make sure that you have the lights connected to the right pins.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_rust_lights_working.gif" class="figure-img img-fluid" alt="Lights installed and working.">
  <figcaption class="figure-caption text-center">Lights installed and working.</figcaption>
</figure>

To exit, press Ctrl + C. This will cause all of the lights to turn off, and the program will exit.

## How it Works

Here’s a brief walkthrough of the complete source code...

TODO GIST

TODO EXPLANATION

I’ve put the [full source code on GitHub](https://github.com/simonprickett/rustpitrafficlights) for your enjoyment.

---

I’d love to hear what you’re up to with the Raspberry Pi — [find me on Twitter](https://twitter.com/simon_prickett). If you enjoyed this article, please share it far and wide!