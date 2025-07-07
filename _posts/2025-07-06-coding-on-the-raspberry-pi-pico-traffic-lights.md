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

To try this out, you will need the following (I've added links for UK and USA shoppers, to minimize shipping costs):

* A [Raspberry Pi Pico](TODO) (I'll use the Pi 3 Model B here, but any model with GPIO pins will work — if you want to use the Pi Zero you’ll need to solder some headers onto it or buy one with those pre-attached). I'm going to assume you have a Pi 2, 3 or 4 with 40 pins
* A [USB to micro USB data cable](TODO). TODO explanation... any length, make sure it's for data.
* A set of [traffic lights from Low Voltage Labs](http://lowvoltagelabs.com/products/pi-traffic/) (the two pack is good value).
* TODO laptop or similar.

## Attaching the Traffic Lights

The Low Voltage Labs traffic lights connect to the Pico using four pins. One of these needs to be ground, the other three being actual GPIO pins used to control each of the individual LEDs.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_stock.jpg" class="figure-img img-fluid" alt="Low Voltage Labs Traffic Lights">
  <figcaption class="figure-caption text-center">Low Voltage Labs Traffic Lights.</figcaption>
</figure>

Before powering up the Pico, attach the traffic lights so that the pins connect to the GPIO pins highlighted in red:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_pico_pinout.png" class="figure-img img-fluid" alt="GPIO Pin Diagram">
  <figcaption class="figure-caption text-center">GPIO Pin Diagram.</figcaption>
</figure>

When you're done it's going to look something like this... (an easy way to make sure you have it right is TODO update for Pico).

<div class="slick-carousel">
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_hardware_1.jpg" class="figure-img img-fluid" alt="The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.">
        <figcaption class="figure-caption text-center">The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_hardware_2.jpg" class="figure-img img-fluid" alt="The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.">
        <figcaption class="figure-caption text-center">The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_hardware_3.jpg" class="figure-img img-fluid" alt="The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.">
        <figcaption class="figure-caption text-center">The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_hardware_4.jpg" class="figure-img img-fluid" alt="The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.">
        <figcaption class="figure-caption text-center">The traffic light LEDs connected to the GPIO headers on a Raspberry Pi Pico W.</figcaption>
        </figure>
    </div>
</div>

{% include coffee-cta.html %}

## Operating System Setup

TODO replace this section.

Now you can go ahead and start turning lights on and off!

## Installing Dependencies

To get started, we'll need to install [git](https://git-scm.com/) so that we can get the project code later:

```
$ sudo apt-get install git
$ git --version
git version 2.50.0
```

(Version number was correct at the time of writing). Alternatively you can just download a zip file containing the source code from GitHub [here](TODO).

## Programming the Traffic Lights

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_lights_working.gif" class="figure-img img-fluid" alt="Operational traffic lights!">
  <figcaption class="figure-caption text-center">Operational traffic lights!</figcaption>
</figure>




### MicroPython

TODO

### CircuitPython

TODO

### C

TODO

## Wrapping Up

TODO

I’ve put the [full source code on GitHub](https://github.com/simonprickett/pi-pico-traffic-lights) for your enjoyment.

---

TODO UPDATE THIS I’d love to hear what you’re up to with the Raspberry Pi — get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!

Main picture: [Misty Traffic Lights](https://www.deviantart.com/dhtbrowne/art/Misty-traffic-lights-149851701) by [dhtbrowne](https://www.deviantart.com/dhtbrowne) on DeviantArt. License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)