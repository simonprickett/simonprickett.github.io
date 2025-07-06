---
layout: post
title:  "Coding on the Raspberry Pi Pico: Traffic Lights"
categories: [ Raspberry Pi, Technology, C, Python, Coding, IoT ]
image: assets/images/pico_traffic_lights_main.jpg
author: simon
---
TODO this needs all of the things rewriting for the pico!!!

It's time to produce yet another version of my original Raspberry Pi / Low Voltage Labs traffic lights Python article. This time, let's try it with [Rust](https://www.rust-lang.org/) - a compiled language with syntax similar to C++, and which was originally designed at Mozilla.  

If you want to check out the original article, you can ([read it here]({{ site.baseurl }}/playing-with-raspberry-pi-traffic-lights/)). 

To make this a standalone guide, there will be some re-use of content from the prior article here. Since writing this article, I've also written up the same exercise using Swift ([Swift version]({{ site.baseurl }}/raspberry-pi-coding-in-swift-traffic-lights)), Node.js ([read about that here]({{ site.baseurl }}/raspberry-pi-coding-with-node-js-traffic-lights)), Node RED ([try here]({{ site.baseurl }}/raspberry-pi-coding-with-node-red-traffic-lights/)), Java ([try here]({{ site.baseurl }}/playing-with-raspberry-pi-gpio-pins-and-traffic-lights-in-java)), Bash scripting ([Bash article]({{ site.baseurl}}/controlling-raspberry-pi-gpio-pins-from-bash-scripts-traffic-lights)), C ([check it out here]({{ site.baseurl }}/gpio-access-in-c-with-raspberry-pi-traffic-lights)), [Go]({{ site.baseurl}}/raspberry-pi-coding-in-go-traffic-lights/), [.NET/C#]({{ site.baseurl }}/raspberry-pi-coding-with-dotnet-traffic-lights/) and also for [Arduino]({{ site.baseurl}}/traffic-lights-with-arduino/).

## Shopping List

To try this out, you will need the following (links here mostly go to [Adafruit](https://www.adafruit.com/), UK customers may want to consider [Pimoroni](https://shop.pimoroni.com/) as a UK based alternative.  Amazon has most if not all of this stuff too):

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

{% include coffee-cta.html %}

## Operating System Setup

Install the Raspberry Pi OS which can be [downloaded from the official Raspberry Pi site](https://www.raspberrypi.com/software/). You can also find an excellent [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) there should you need help.  As I didn't need a full graphical desktop for this project, I went with the Lite version.

Once you've got the operating system installed, make sure you can login, and have a working wired or wifi internet connection.  You can configure the wireless network settings using the [`raspi-config` tool](https://www.raspberrypi.com/documentation/computers/configuration.html).  If needed, start it as follows:

```bash
$ sudo raspi-config
```

Now you can go ahead and start turning lights on and off!

## Installing Dependencies

To get started, we'll need to install [git](https://git-scm.com/) so that we can get the project code later:

```
$ sudo apt-get install git
$ git --version
git version 2.30.2
```

(Version number was correct at the time of writing).

## Installing Rust

To install Rust and Cargo (Rust's build tool and package manager), [follow the instructions at rust-lang.org](https://www.rust-lang.org/tools/install):

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

When asked to choose an installation option, go with the default:

```bash
...
Current installation options:


   default host triple: armv7-unknown-linux-gnueabihf
     default toolchain: stable (default)
               profile: default
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
```

Once the installer finishes, update your current shell's profile:

```bash
$ source $HOME/.cargo/env
```

Now make sure you have the Rust compiler and Cargo installed (version numbers may vary - these were current at the time of writing):

```bash
$ rustc --version
rustc 1.56.1 (59eed8a2a 2021-11-01)
$ cargo --version
cargo 1.56.0 (4ed5d137b 2021-10-04)
```

## Programming the Traffic Lights

I've already created a project and Rust code for you, so we just need to get that from GitHub:

```bash
$ git clone https://github.com/simonprickett/rustpitrafficlights.git
$ cd rustpitrafficlights
```

The first time you run the project, Cargo will download the required crates (packages) and compile and run the code (the code is in the file `src/main.rs`):

```bash
$ cargo run
    Updating crates.io index
  Downloaded autocfg v1.0.1
  Downloaded bitflags v1.3.2
  Downloaded lazy_static v1.4.0
  Downloaded ctrlc v3.2.1
  Downloaded rppal v0.12.0
  Downloaded memoffset v0.6.4
  Downloaded cfg-if v1.0.0
  Downloaded nix v0.23.0
  Downloaded libc v0.2.107
  Downloaded rust_gpiozero v0.2.1
  Downloaded 10 crates (908.3 KB) in 1.15s
   Compiling lazy_static v1.4.0
   Compiling rppal v0.12.0
   Compiling rust_gpiozero v0.2.1
   Compiling rustpitrafficlights v0.1.0 (/home/pi/rustpitrafficlights)

    Finished dev [unoptimized + debuginfo] target(s) in 2m 46s
     Running `target/debug/rustpitrafficlights`
```

This project makes use of a couple of crates (packages).  One for interfacing with the GPIO pins on the Pi, the other for handling Ctrl-C / `SIGINT` interrupts.  These are specified in the `Cargo.toml` file which looks like this:

```toml
[package]
name = "rustpitrafficlights"
version = "0.1.0"
edition = "2021"

[dependencies]
rust_gpiozero = "0.2.1"
ctrlc = "3.2.1"
```

If the lights are connected to the correct GPIO pins, they should start to flash on and off in the UK traffic light pattern (red, red + amber, green, amber, red). If you don’t see anything, make sure that you have the lights connected to the right pins.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_rust_lights_working.gif" class="figure-img img-fluid" alt="Lights installed and working.">
  <figcaption class="figure-caption text-center">Lights installed and working.</figcaption>
</figure>

To exit, press Ctrl + C. This will cause all of the lights to turn off after a short delay, and the program will exit.

## How it Works

Here’s a brief walkthrough of the complete source code...

<script src="https://gist.github.com/simonprickett/718e4a74fa278acf8fd510618c6be716.js"></script>

* Lines 1-5 import things we'll need from the crates that the code depends on.
* The `main` function that'll get executed when we run the code is declared at line 7.
* Lines 8-9 declare essentially a global Boolean variable that we'll use while handling a Ctrl-C event to shut down the code.  This seems overly complex to me, and is to do with Rust's memory management guarantees / checking.  This seems somewhat pedantic to me and means I probably won't use Rust for bigger Pi projects.
* At lines 11-13, we declare variables representing the three GPIO pins that the traffic lights are connected to.
* Lines 15-17 declare a function that will run when Ctrl-C is pressed and the `SIGINT` signal raised.  This function gets the pseudo-global Boolean to `false`, which will terminate the `while` loop that begins at line 23.
* Lines 19-21 make sure that each of the three lights are off, so we begin in a known state.
* At line 23, we enter a `while` loop that will continue until the pseudo-global Boolean is `false`.
* In the loop, we use the `.on()` function to turn each light on and off in the right order, and the `thread::sleep` function to wait a number of seconds.
* Lines 47-49 run after Ctrl-C / `SIGINT` has been detected, and the pseudo-global Boolean variable set to `false`... here we make sure that the lights are all switched off before exiting.

I find this a bit dissatisfying... in other languages, I've declared a function that turns all the lights off and called this before starting and whenever `SIGINT` / Ctrl-C is detected.  This involves declaring the objects that represent each GPIO pin as global variables.  Rust doesn't as such allow this, and I wasn't able to see a good solution (experienced Rust coders - please feel free to offer one, I'd love to learn!).  So my implementation as it stands could likely be improved by someone who knows what they're doing!

I’ve put the [full source code on GitHub](https://github.com/simonprickett/rustpitrafficlights) for your enjoyment.

---

TODO UPDATE THIS I’d love to hear what you’re up to with the Raspberry Pi — get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!

Main picture: [Misty Traffic Lights](https://www.deviantart.com/dhtbrowne/art/Misty-traffic-lights-149851701) by [dhtbrowne](https://www.deviantart.com/dhtbrowne) on DeviantArt. License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)