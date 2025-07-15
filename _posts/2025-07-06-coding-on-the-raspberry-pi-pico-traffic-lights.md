---
layout: post
title:  "Coding on the Raspberry Pi Pico: Traffic Lights"
categories: [ Raspberry Pi, Technology, C, Python, Coding, IoT ]
image: assets/images/pico_traffic_lights_main.jpg
author: simon
---
If you're a long time reader here, you'll know that my favourite way to compare and contrast support for different programming languages on the Raspberry Pi single board computers has been to attach a set of Low Voltage Labs traffic lights to the GPIO pins and write a small program that runs them through the UK traffic light sequence.

I've been a big fan of the Raspberry Pi Pico board ever since its first release back in 2021.  Rather than being a single board computer that you install an operating system on, the Pico is a microcontroller akin to the Arduino series of boards.  Raspberry Pi did a great job of writing documentation and SDKs for programming the Pico in C (and subsequent W version that added wifi/bluetooth, then more recently the more powerful Pico 2 and 2W) and the MicroPython project was also quick to make a MicroPython runtime available for it.  Adafruit also ported their CircuitPython fork to the Pico.  

You'll find plenty of Pico projects (mostly using MicroPython) on this site already, but it was only recently that I realized I'd never tried my "classic" traffic lights project with the board.  It's time to recitfy that, so in this "three in one" article I'll compare and contrast using MicroPython, CircuitPython and C to get the traffic lights working on the Pico.

If you want to check out the traffic light articles for the Raspberry Pi single board computer here they are, organized by language:

* [Python]({{ site.baseurl }}/playing-with-raspberry-pi-traffic-lights/)
* [Swift]({{ site.baseurl }}/raspberry-pi-coding-in-swift-traffic-lights/)
* [Node.js]({{ site.baseurl }}/raspberry-pi-coding-with-node-js-traffic-lights/)
* [Node RED]({{ site.baseurl }}/raspberry-pi-coding-with-node-red-traffic-lights/)
* [Java]({{ site.baseurl }}/playing-with-raspberry-pi-gpio-pins-and-traffic-lights-in-java/)
* [Bash scripting]({{ site.baseurl}}/controlling-raspberry-pi-gpio-pins-from-bash-scripts-traffic-lights/)
* [C]({{ site.baseurl }}/gpio-access-in-c-with-raspberry-pi-traffic-lights/)
* [Go]({{ site.baseurl}}/raspberry-pi-coding-in-go-traffic-lights/) 
* [.NET/C#]({{ site.baseurl }}/raspberry-pi-coding-with-dotnet-traffic-lights/)
* [Rust]({{ site.baseurl }}/raspberry-pi-coding-with-rust-traffic-lights/)

I also produced a version for the [Arduino]({{ site.baseurl}}/traffic-lights-with-arduino/) microcontrollers.  Enough history, let's get going with the Pico!

## Shopping List

To try this out, you'll need the following (I've added links for UK and USA shoppers as well as a reseller in Kenya, to minimize shipping costs for as many readers as possible):

* **A Raspberry Pi Pico Microcontroller**. There are many options here... this project doesn't need wifi, but I'd recommend getting a Pico WH (wifi and headers) because it'll be more useful for other projects you might want to do in future and already has the headers soldered to it. This also saves you the fiddly job of buying headers separately and soldering them to the board manually.  If you want to spend a little more and get a microcontroller with more memory and a faster processor, grab a Pico 2 WH. Either works fine with this project. Buy from:
  * UK: Pimoroni, [Pico WH](https://shop.pimoroni.com/products/raspberry-pi-pico-w?variant=40059369652307) or [Pico 2 WH](https://shop.pimoroni.com/products/raspberry-pi-pico-2-w?variant=54852253024635).
  * UK: The Pi Hut, [Pico WH](https://thepihut.com/products/raspberry-pi-pico-w?variant=41952994787523) or [Pico 2 WH](https://thepihut.com/products/raspberry-pi-pico-2-w?variant=54063378760065).
  * USA: Adafruit, [Pico WH](https://www.adafruit.com/product/5544) or [Pico 2 WH](https://www.adafruit.com/product/6315).
  * Kenya: Ivyliam Gadgets, [Pico WH]() or [Pico 2 WH]().
* **A USB to micro USB data cable**. Any length or colour will do. This is to power your Pico and to connect to it to copy your code to it.  You may already have one of these already, make sure it's a data cable not just a charging one.  If you need to buy one, they're available from the resellers below (links are for USB A -> micro USB, you can also choose a USB C -> micro USB if that works better with the computer you're using):
  * UK: [Pimoroni](https://shop.pimoroni.com/products/usb-a-to-microb-cable-black?variant=31241639562).
  * UK: [The Pi Hut](https://thepihut.com/products/usb-to-micro-usb-cable-0-5m?variant=37979679293635).
  * USA: [Adafruit](https://www.adafruit.com/product/592).
  * Kenya: [Ivyliam Gadgets](https://shop.ivyliam.com/product/usb-a-to-micro-usb-cable/).
* **A set of [traffic lights from Low Voltage Labs](http://lowvoltagelabs.com/products/pi-traffic/)** (the two pack is good value).  These can also be [purchased from Amazon](https://a.co/d/aZspNII) in two or five packs.
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
  <figcaption class="figure-caption text-center">GPIO Pin Diagram from <a href="https://pico.pinout.xyz/" target="_blank">pico.pinout.xyz</a> (used here after donating to the creator's ko-fi).</figcaption>
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

Now you can go ahead and start turning lights on and off!

## Setting up your Development Machine

I'll cover dependencies specific to C, MicroPython or CircuitPython in their respective sections.  There's a couple of things you'll need whichever languages you choose to try out.

First up, you'll want to get a copy of the code that controls the traffic lights.  I've included it inline in this article later, but it's also available in a git repository that you can get either by cloning it...

```bash
git clone https://github.com/simonprickett/pi-pico-traffic-lights.git
```

...or by downloading it as a zip file from GitHub ([click here for that](https://github.com/simonprickett/pi-pico-traffic-lights/archive/refs/heads/main.zip)).  Unzip the file wherever you like to store source code on your machine.

Next, you'll want some sort of code editor or IDE.  I'd recommend [Visual Studio Code](https://code.visualstudio.com/) as it's got some nice integrations that'll be especially helpful with C.  It's also free!

## Programming the Traffic Lights

Whether you choose one, two or all three of the languages covered in this article, here's what success looks like:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_traffic_lights_lights_working.gif" class="figure-img img-fluid" alt="Operational traffic lights!">
  <figcaption class="figure-caption text-center">Operational traffic lights!</figcaption>
</figure>

The lights should cycle indefinitely in the [UK traffic light pattern](https://www.gov.uk/guidance/the-highway-code/light-signals-controlling-traffic):

* Red (stop)
* Red + amber (also stop)
* Green (go if the way is clear)
* Amber (stop, unless you're already so close to the line that pulling up might cause an accident)
* Red (stop)
* ...repeat...

Let's try each language in turn...

### MicroPython

TODO

Here's the complete MicroPython code:

<script src="https://gist.github.com/simonprickett/17dfc46c0ee8d497ef1bd228a606608b.js"></script>

### CircuitPython

TODO

Putting it all together, the finished CircuitPython code looks like this:

<script src="https://gist.github.com/simonprickett/fa6ffc704be7110543cb816818e54a41.js"></script>

### C

TODO

Here's the final program in full:

<script src="https://gist.github.com/simonprickett/e29bf25d7a5a556227221b9b6628b1f4.js"></script>

## Wrapping Up

And that's the end of our little three-in-one tour of different ways to program the traffic lights on the Raspberry Pi Pico.  I’ve put the [full source code on GitHub](https://github.com/simonprickett/pi-pico-traffic-lights) for your enjoyment.  If C or Python aren't your thing, you might want to try the [Kaluma](https://kalumajs.org/) runtime to code in JavaScript or you could give [Rust](https://www.raspberrypi.com/news/rust-on-rp2350/) a go.  Maybe I'll look at these alternatives here in future too!

---

I’d love to hear what you’re up to with the Raspberry Pi Pico, and how you choose to program it — get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!

Main picture: [Misty Traffic Lights](https://www.deviantart.com/dhtbrowne/art/Misty-traffic-lights-149851701) by [dhtbrowne](https://www.deviantart.com/dhtbrowne) on DeviantArt. License: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)