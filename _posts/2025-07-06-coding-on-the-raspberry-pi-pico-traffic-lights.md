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

To try this out, you will need the following (I've added links for UK and USA shoppers as well as a reseller in Kenya, to minimize shipping costs for as many readers as possible):

* A Raspberry Pi Pico Microcontroller. There are many options here... this project doesn't need wifi, but I'd recommend getting a Pico WH (wifi and headers) because it'll be more useful for other projects you might want to do in future and already has the headers soldered to it. This also saves you the fiddly job of buying headers separately and soldering them to the board manually.  If you want to spend a little more and get a microcontroller with more memory and a faster processor, grab a Pico 2 WH. Either works fine with this project. Buy from:
  * UK: Pimoroni, [Pico WH](https://shop.pimoroni.com/products/raspberry-pi-pico-w?variant=40059369652307) or [Pico 2 WH](https://shop.pimoroni.com/products/raspberry-pi-pico-2-w?variant=54852253024635).
  * UK: The Pi Hut, [Pico WH](https://thepihut.com/products/raspberry-pi-pico-w?variant=41952994787523) or [Pico 2 WH](https://thepihut.com/products/raspberry-pi-pico-2-w?variant=54063378760065).
  * USA: Adafruit, [Pico WH](https://www.adafruit.com/product/5544) or [Pico 2 WH](https://www.adafruit.com/product/6315).
  * Kenya: Ivyliam Gadgets, [Pico WH]() or [Pico 2 WH]().
* A USB to micro USB data cable. Any length or colour will do. This is to power your Pico and to connect to it to copy your code to it.  You may already have one of these already, make sure it's a data cable not just a charging one.  If you need to buy one, they're available from the resellers below (links are for USB A -> micro USB, you can also choose a USB C -> micro USB if that works better with the computer you're using):
  * UK: [Pimoroni](https://shop.pimoroni.com/products/usb-a-to-microb-cable-black?variant=31241639562).
  * UK: [The Pi Hut](https://thepihut.com/products/usb-to-micro-usb-cable-0-5m?variant=37979679293635).
  * USA: [Adafruit](https://www.adafruit.com/product/592).
  * Kenya: [Ivyliam Gadgets](https://shop.ivyliam.com/product/usb-a-to-micro-usb-cable/).
* A set of [traffic lights from Low Voltage Labs](http://lowvoltagelabs.com/products/pi-traffic/) (the two pack is good value).  These can also be [purchased from Amazon](https://a.co/d/aZspNII) in two or five packs.
* You'll also need a computer to program the Pico from... any Windows, macOS or Linux machine that you can plug your USB cable into should be fine.  I'm using a Mac for the examples below, and coding with [Visual Studio Code](https://code.visualstudio.com/).  I'll point out any additional / recommended software as we go along, but don't worry it's all available free of charge!

## Attaching the Traffic Lights

The Low Voltage Labs traffic lights connect to the Pico using four pins. One of these needs to be ground, the other three being actual GPIO pins used to control each of the individual LEDs.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_stock.jpg" class="figure-img img-fluid" alt="Low Voltage Labs Traffic Lights">
  <figcaption class="figure-caption text-center">Low Voltage Labs Traffic Lights.</figcaption>
</figure>

Before powering up the Pico, attach the traffic lights so that the pins connect to the GPIO pins highlighted in red:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_pico_pinout.png" class="figure-img img-fluid" alt="GPIO Pin Diagram">
  <figcaption class="figure-caption text-center">GPIO Pin Diagram from [pico.pinout.xyz](https://pico.pinout.xyz/) (used here after donating to the creator's ko-fi).</figcaption>
</figure>

When you're done it's going to look something like this... (an easy way to make sure you have it right is to hold the Pico with the micro USB port to the right and the header pins pointing up, then count 5 pins from the right and locate the rightmost side of the lights on that pin with the lights facing you).

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

TODO notes about the three different languages.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_lights_working.gif" class="figure-img img-fluid" alt="Operational traffic lights!">
  <figcaption class="figure-caption text-center">Operational traffic lights!</figcaption>
</figure>

### MicroPython

TODO

<script src="https://gist.github.com/simonprickett/17dfc46c0ee8d497ef1bd228a606608b.js"></script>

### CircuitPython

TODO

<script src="https://gist.github.com/simonprickett/fa6ffc704be7110543cb816818e54a41.js"></script>

### C

TODO

<script src="https://gist.github.com/simonprickett/e29bf25d7a5a556227221b9b6628b1f4.js"></script>

## Wrapping Up

TODO

I’ve put the [full source code on GitHub](https://github.com/simonprickett/pi-pico-traffic-lights) for your enjoyment.

---

I’d love to hear what you’re up to with the Raspberry Pi Pico, and how you choose to program it — get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!

Main picture: [Misty Traffic Lights](https://www.deviantart.com/dhtbrowne/art/Misty-traffic-lights-149851701) by [dhtbrowne](https://www.deviantart.com/dhtbrowne) on DeviantArt. License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)