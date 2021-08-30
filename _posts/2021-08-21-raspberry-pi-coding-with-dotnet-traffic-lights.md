---
layout: post
title:  "Raspberry Pi Coding with .NET: Traffic Lights"
categories: [ Raspberry Pi, Technology, .NET, C# ]
image: assets/images/pi_traffic_lights_dotnet_main.jpg
author: simon
---
It's been a long time coming, but I finally decided to produce a C#/.NET version of my original Raspberry Pi / Low Voltage Labs traffic lights Python article ([read here]({{ site.baseurl }}/playing-with-raspberry-pi-traffic-lights/)).  

To make this a standalone guide, there will be some re-use of content from the prior article here. Since writing this article, I've also written up the same exercise using Swift ([Swift version]({{ site.baseurl }}/raspberry-pi-coding-in-swift-traffic-lights)), Node.js ([read about that here]({{ site.baseurl }}/raspberry-pi-coding-with-node-js-traffic-lights)), Node RED ([try here]({{ site.baseurl }}/raspberry-pi-coding-with-node-red-traffic-lights/)), Java ([try here]({{ site.baseurl }}/playing-with-raspberry-pi-gpio-pins-and-traffic-lights-in-java)), Bash scripting ([Bash article]({{ site.baseurl}}/controlling-raspberry-pi-gpio-pins-from-bash-scripts-traffic-lights)), C ([check it out here]({{ site.baseurl }}/gpio-access-in-c-with-raspberry-pi-traffic-lights)) and also for [Arduino]({{ site.baseurl}}/traffic-lights-with-arduino/).

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
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_dotnet_lights_stock.jpg" class="figure-img img-fluid" alt="Low Voltage Labs Traffic Lights">
  <figcaption class="figure-caption text-center">Low Voltage Labs Traffic Lights.</figcaption>
</figure>

Before powering up the Pi, attach the traffic lights so that the pins connect to the GPIO pins highlighted in red:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_dotnet_gpio_diagram.png" class="figure-img img-fluid" alt="GPIO Pin Diagram">
  <figcaption class="figure-caption text-center">GPIO Pin Diagram.</figcaption>
</figure>

When you're done it's going to look something like this... (an easy way to make sure you have it right is to locate the lights on the left hand row of pins as you look at the Pi with the USB ports to the bottom, then count 8 pins up and attach the lights there).

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_dotnet_lights_attached_1.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_dotnet_lights_attached_2.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

Don't turn the Pi on yet, you'll need to prepare an operating system image for it first...

## Operating System Setup

Install the Raspbian OS which can be [downloaded from the official Raspberry Pi site](https://www.raspberrypi.org/downloads/raspbian/). You can also find an excellent [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) there should you need help.  As I didn't need a full graphical desktop for this project, I went with the Lite version.

Once you've got the operating system installed, make sure you can login, and have a working wired or wifi internet connection.

Now you can go ahead and start turning lights on and off!

## Installing Dependencies

To get started, we'll need to install some dependencies.  These include [git](https://git-scm.com/), plus some libraries that the .NET runtime requires:

```
$ sudo apt-get install git libunwind8 gettext apt-transport-https
$ git --version
git version 2.20.1
```

## Installing the .NET SDK

Next, we'll want to install the .NET SDK.  I was using a Raspberry Pi, so needed the ARM 32 version of this.  At the time of writing the latest version was 5.0.x, available from Microsoft [here](https://dotnet.microsoft.com/download/dotnet/5.0).  The download command may vary if newer patches are available, but here's what I used:

```bash
$ wget https://download.visualstudio.microsoft.com/download/pr/f456f253-db24-45ea-9c73-f507f93a8cd2/6efe7bed8639344d9c9afb8a46686c99/dotnet-sdk-5.0.302-linux-arm.tar.gz
```

Unzip the SDK (again, file name may vary if there's a more recent release):

```bash
$ gunzip dotnet-sdk-5.0.302-linux-arm.tar.gz
```

Then install it:

```bash
$ sudo mkdir /opt/dotnet-5.0.302
$ sudo tar xf dotnet-sdk-5.0.302-linux-arm.tar -C /opt/dotnet-5.0.302
$ sudo ln -s /opt/dotnet-5.0.302 /opt/dotnet
$ sudo ln  -s /opt/dotnet/dotnet /usr/local/bin/dotnet
```

Check that the SDK was installed correctly:

```bash
$ export DOTNET_ROOT=/opt/dotnet (add to ~/.bashrc if you like)
$ dotnet --version
5.0.302
```

To make sure that the `DOTNET_ROOT` environment variable is always set, you can optionally amend your `.bashrc` file (`~/.bashrc`) to set it:

```bash
$ echo "export DOTNET_ROOT=/opt/dotnet" >> ~/.bashrc
$ . ~/.bashrc
```

## Programming the Traffic Lights

I've already created a .NET project and C# code for you, so we just need to get that from GitHub:

```bash
$ git clone https://github.com/simonprickett/dotnetpitrafficlights.git
$ cd dotnetpitrafficlights
```

Now add the package we need to control the Pi's GPIO pins:

```bash
$ dotnet add package System.Device.Gpio
```

We've now got everything we need to start seeing some action, so let's start it up:

```bash
$ dotnet run
```

If the lights are connected to the correct GPIO pins, they should start to flash on and off in the UK traffic light pattern (red, red + amber, green, amber, red). If you don’t see anything, make sure that you have the lights connected to the right pins.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_dotnet_lights_working.gif" class="figure-img img-fluid" alt="Lights installed and working.">
  <figcaption class="figure-caption text-center">Lights installed and working.</figcaption>
</figure>

To exit, press Ctrl + C. This will cause all of the lights to turn off, and the program will exit.

## TODO How it Works

Here’s a brief walkthrough of the complete source code…

<script src="https://gist.github.com/simonprickett/6d072619672db21dccbe3c7917915c97.js"></script>

TODO replace text below...

The program checks that it can open the Pi’s GPIO pins at line 13. If it can’t, it will exit. Assuming that’s successful lines 19–26 assign GPIO pins 9, 10 and 11 to more meaningful variable names and tell the Pi to use them as output pins.

Lines 28–39 set up a channel for the `SIGTERM` signal... this signal is sent to the program whenever the user gets bored of watching the lights and hits Ctrl+C. The program sets up a [channel](https://gobyexample.com/channels) that will be notified when the termination signal occurs, then runs a [goroutine](https://gobyexample.com/goroutines) at line 31. The goroutine runs concurrently with the rest of the program, and waits for a message to be sent to the channel. When it receives one, the program is attempting to exit because Ctrl+C was pressed. The code in the goroutine then turns off all of the lights and exits cleanly.

As part of cleanup we also free up resources associated with the GPIO pins at line 39, using the [defer](https://gobyexample.com/defer) keyword to ensure that it will happen whenever the program exits.

Each light turns on when its associated pin it set high, and off when set low. Lines 42–44 make sure that all the lights are off to begin with, just in case something else was using the GPIO pins before and left them on.

At line 47, the program enters an infinite loop in which it turns the lights on `.High()` and off `.Low()` in the right sequence for a traffic light. In between phases, “time.Sleep” pauses execution.

I’ve put the [source code on GitHub](https://github.com/simonprickett/dotnetpitrafficlights) for your enjoyment.

---

Main Photo by [Henrikas Mackevicius](https://www.pexels.com/@henrix) from [Pexels](https://pexels.com).

I’d love to hear what you’re up to with the Raspberry Pi — [find me on Twitter](https://twitter.com/simon_prickett). If you enjoyed this article, please share it far and wide!