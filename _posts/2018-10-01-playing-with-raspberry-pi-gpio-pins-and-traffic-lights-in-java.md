---
layout: post
title:  "Playing with Raspberry Pi: GPIO Pins and Traffic Lights in Java"
categories: [ Raspberry Pi, Technology, IoT, Java ]
image: assets/images/pi_traffic_lights_java_main.jpg
author: simon
---
Having written guides describing how to use the [Low Voltage Labs](http://lowvoltagelabs.com/products/pi-traffic/) traffic lights with the Raspberry Pi for Python ([read Python article]({{site.baseurl}}/playing-with-raspberry-pi-traffic-lights)), Node.js ([read Node.js article]({{ site.baseurl }}/raspberry-pi-coding-with-node-js-traffic-lights)), Node RED ([read Node RED article]({{ site.baseurl }}/raspberry-pi-coding-with-node-red-traffic-lights/)), C ([read C article]({{ site.baseurl }}/gpio-access-in-c-with-raspberry-pi-traffic-lights)), Bash scripting ([read Bash article]({{ site.baseurl }}/controlling-raspberry-pi-gpio-pins-from-bash-scripts-traffic-lights)), Swift ([read Swift article]({{ site.baseurl }}/raspberry-pi-coding-in-swift-traffic-lights)), Go ([read Go article]({{site.baseurl}}/raspberry-pi-coding-in-go-traffic-lights)), [Rust]({{ site.baseurl }}/raspberry-pi-coding-with-rust-traffic-lights/), [.NET/C#]({{ site.baseurl }}/raspberry-pi-coding-with-dotnet-traffic-lights/) and even [Arduino]({{ site.baseurl}}/traffic-lights-with-arduino/), it’s definitely time to check out how to access the GPIO pins from the Java programming language.

To make this a standalone guide, there will be some re-use of content from the prior articles in this one.

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
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_java_lights_stock.jpg" class="figure-img img-fluid" alt="Low Voltage Labs Traffic Lights">
  <figcaption class="figure-caption text-center">Low Voltage Labs Traffic Lights.</figcaption>
</figure>

Before powering up the Pi, attach the traffic lights so that the pins connect to the GPIO pins highlighted in red:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_java_gpio_diagram.png" class="figure-img img-fluid" alt="GPIO Pin Diagram">
  <figcaption class="figure-caption text-center">GPIO Pin Diagram.</figcaption>
</figure>

When you're done it's going to look something like this... (an easy way to make sure you have it right is to locate the lights on the left hand row of pins as you look at the Pi with the USB ports to the bottom, then count 8 pins up and attach the lights there).

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_java_lights_attached_1.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_java_lights_attached_2.jpg" class="figure-img img-fluid" alt="GPIO pins with lights attached.">
  <figcaption class="figure-caption text-center">GPIO pins with lights attached.</figcaption>
</figure>

Don't turn the Pi on yet, you'll need to prepare an operating system image for it first...

## Operating System Setup

Install the Raspbian OS which can be [downloaded from the official Raspberry Pi site](https://www.raspberrypi.org/downloads/raspbian/). You can also find an excellent [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) there should you need help.

Once you've got the operating system installed, make sure you can login, and have a working wired or wifi internet connection.

Now you can go ahead and start turning lights on and off!

## Installing Dependencies

As we used the minimal Stretch Lite OS, there’s no Java runtime or compiler installed by default. Oracle’s Java 8 can be added very easily:

```
$ sudo apt-get update
$ sudo apt-get install oracle-java8-jdk
```

Confirm that you do indeed wish to add Java to your system then wait while `apt-get` fetches and installs it for you.

When `apt-get` is done, check that we have a Java runtime and compiler installed:

```
$ java -version
java version "1.8.0_65"
Java(TM) SE Runtime Environment (build 1.8.0_65-b17)
Java HotSpot(TM) Client VM (build 25.65-b01, mixed mode)

$ javac -version
javac 1.8.0_65
```

We also need to install git so we can download the sample code from GitHub:

```
$ sudo apt-get install git
$ git --version
git version 2.11.0
```

## Downloading the Sample Code

I’ve written some sample Java code to demonstrate running the traffic lights in the UK light sequence (red, red + amber, green, amber, red):

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_java_lights_working.gif" class="figure-img img-fluid" alt="Lights installed and working.">
  <figcaption class="figure-caption text-center">Lights installed and working.</figcaption>
</figure>

To get the example source code from GitHub:

```
$ git clone https://github.com/simonprickett/javapitrafficlights.git

```
For convenience, set an environment variable to contain the path to the source code repo:

```
$ cd javapitrafficlights
$ PROJECTDIR=`pwd`
```

We’ll use that later…

## Java Programming with Pi4J

[Pi4J](https://pi4j.com/1.2/index.html) is a library for working with GPIO pins on the Raspberry Pi from Java. Using this allows us to get straight down to the business of controlling the lights without having to worry about lower level concerns. In turn, Pi4J depends on the [WiringPi C library](http://wiringpi.com/). WiringPi isn’t installed with the "lite" Raspbian operating system, but it’s easy to fix that:

```
$ git clone git://git.drogon.net/wiringPi
$ cd wiringPi
$ ./build
```

Having completed that step, we can then install Pi4J:

```
$ curl -s get.pi4j.com | sudo bash
```

This will produce a lot of output as it installs Pi4J, we’re looking for something like this to indicate that this process completed successfully:

```
====================================================
Pi4J INSTALLATION COMPLETE
====================================================
The Pi4J JAR files are located at:
/opt/pi4j/lib
Example Java programs are located at:
/opt/pi4j/examples
You can compile the examples using this script:
sudo /opt/pi4j/examples/build
Please see http://www.pi4j.com for more information.
```

We can now go ahead and compile the Java code using a script included in the GitHub repo:

<script src="https://gist.github.com/simonprickett/4c92e2e7d7153fa42c5a5b051ee395ed.js"></script>

Before running `build.sh` we need to `cd` back to the folder that we cloned the GitHub repo into:

```
$ cd $PROJECTDIR
$ ./build.sh
```

The `build.sh` script will create a folder named `classes` and place the compiled Java `.class` files in there.

Running the code is as simple as invoking a second script included in the GitHub repo:

<script src="https://gist.github.com/simonprickett/efcb12ad106a5bf146bf01323f34fd31.js"></script>

```
$ ./run.sh
```

If the lights are connected to the correct GPIO pins, they should start to flash on and off. If you don’t see anything, make sure that you have the lights connected to the right pins. To exit, press Ctrl + C. This will cause all of the lights to turn off, and the program will terminate.

## Problems!

When I first tried this, I was unable to get the code to run properly, as something in WiringPi was failing when run on the Raspberry Pi 3. The program would quit and output the following:

```
Unable to determine hardware version. I see: 
Hardware   : BCM2835 - expecting BCM2708 or BCM2709.
If this is a genuine Raspberry Pi then please report this
to projects@drogon.net. If this is not a Raspberry Pi then you
are on your own as wiringPi is designed to support the
Raspberry Pi ONLY.
```

After some Googling, I found out that this is due to Pi4J shipping with an older version of WiringPi that dates from before the BCM2835 hardware in newer Raspberry Pi models was available. There’s a [GitHub issue](https://github.com/Pi4J/pi4j/issues/319) against the Pi4J project that describes this problem, and suggests a workaround. That involves configuring Pi4J to disregard the WiringPi version that it comes with and instead use the newer version that we installed earlier.

This workaround is implemented in `run.sh` through the addition of:

```
-Dpi4j.linking.dynamic
```

which is an additional flag when starting the Java runtime.

## How it Works

Here’s the code, contained in `src/TrafficLights.java` in the GitHub repo:

<script src="https://gist.github.com/simonprickett/a8f826dc5e673ea73dee31c0e7d106ba.js"></script>

* Lines 1–5 import the Pi4J library classes that we need to manage GPIO pins.
* Lines 8–11 declare variables that we’ll use to control the GPIO pins and to represent each LED in the traffic lights.
* Lines 14–24 implement a shutdown hook: this is run when the user wants to exit the program by pressing Ctrl-C.
* The code here ensures that all three of the traffic light LEDs are turned off before quitting back to the operating system.
* At line 26, we create a `GpioFactory` instance, that we’ll use to gain access to the pins that we need.
* Lines 28–30 associated our `red`, `yellow`, and `green` variables with pins 13, 12 and 14 respectively as well as setting their initial states to `low` (off). Note because Pi4J uses WiringPi underneath, we are using WiringPi’s pin numbering scheme rather than the more common BCM one. This means that GPIO 9 (Red) becomes pin 13 for example. [This mapping diagram](https://pinout.xyz/pinout/wiringpi) shows the WiringPi pin numbers and their corresponding BCM mode pin numbers that are used in my other Pi Traffic Light articles for other programming languages.
* Lines 32–50 create an infinite `while` loop that turns the red light on, sleeps for 3 seconds, turns the yellow light on then after 1 second turns off red and yellow, illuminating green. It then cycles through the remainder of the traffic light sequence until returning to the original red light only when it starts again. This will continue indefinitely until the user presses Ctrl-C, invoking the shutdown hook (code at line 14–24).

The source code for this project is [freely available on GitHub](https://github.com/simonprickett/javapitrafficlights).

---

I’d love to hear what you’re up to with the Raspberry Pi — [find me on Twitter](https://twitter.com/simon_prickett). If you enjoyed this article, please share it far and wide!

---

*(Main photo: Nighthawks — Edward Hopper, 1942)*