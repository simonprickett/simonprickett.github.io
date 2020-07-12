---
layout: post
title:  "Making a Single Button Keyboard with the Adafruit Trinket M0"
categories: [ Arduino, C, IoT, Programming ]
image: assets/images/arcade_keyboard_main.jpg
author: simon
---
This will be the text when I get around to writing it and I will need to make a video for it as well sometime and that will probably drive the flow of this article, as some of this will be quite visual and won't otherwise translate well to a purely written format with still images.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_trinket_m0.jpg" class="figure-img img-fluid" alt="Adafruit Trinket M0">
  <figcaption class="figure-caption text-center">Adafruit Trinket M0 (photo: <a href="https://learn.adafruit.com/assets/45708">Adafruit</a>)</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_button_microswitch.jpg" class="figure-img img-fluid" alt="Arcade button with microswitch">
  <figcaption class="figure-caption text-center">Arcade button with microswitch) - needs a clean!</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_soldered.jpg" class="figure-img img-fluid" alt="Soldering completed">
  <figcaption class="figure-caption text-center">Soldering completed.</figcaption>
</figure>

## Stuff You Need to Make One

* [Adafruit Trinket M0](https://www.adafruit.com/product/3500).
* [Microswitch](https://www.adafruit.com/product/818).
* [Buttons that use Microswitches](https://shop.xgaming.com/collections/arcade-parts/products/20-pack-arcade-buttons-no-switches).
* [Other arcade buttons (some may have microswitches built in)](https://www.adafruit.com/category/757).  Some of the fancy ones have LEDs built into them, I've used those in a [previous project](/raspberry-pi-arcade-button-led-game/) and recommend them.
* A [USB to micro USB data cable](https://www.adafruit.com/product/2185) (nothing special about this, you might have one from something else, for example an Android phone).  If the machine you're connecting to uses USB C you might want to get a [USB C to micro USB cable](https://www.adafruit.com/product/3879) instead.  Either way make sure it's both a charge and data cable :)
* Some [wire](https://www.adafruit.com/product/1311) - I used red and black to distinguish ground from live / signal but you can use the same color for both it doesn't matter.  Single core makes soldering easier, but anything that fits through the holes in the Trinket board should do!
* A [soldering set](https://www.adafruit.com/product/180) - soldering iron and solder.
* An enclosure - I used a reusable Starbucks hot cup that I had, but anyting sturdy enough to hold the arcade button will do.
* Depending on your enclosure, maybe some [Forstner bits](https://www.harborfreight.com/14-in-1-in-forstner-drill-bit-set-with-38-in-shanks-7-pc-62361.html) to drill tidy circular holes. Make sure there's one that's an appropriate size for your arcade button!
* As the Trinket M0 supports both, you could build this project with either [CircuitPython](https://circuitpython.org/) or Arduino.  I chose Arduino as I am more familiar with it, if you want to do the same then [download the free Arduino IDE](https://www.arduino.cc/en/Main/Software) and consider making a donation if possible.

Here's the Arduino sketch:

<script src="https://gist.github.com/simonprickett/c56deaab1dadb160ffe61f1ae8577874.js"></script>

Here's the AppleScript:

<script src="https://gist.github.com/simonprickett/640ef62e7bcd0ae1ba68e8f1c5574cf3.js"></script>

---

Another fun project that uses a lot of the same components and ideas is this [Trinket powered foot switch](https://learn.adafruit.com/usb-foot-switch).  Let me know if you try making something like this, I'd love to see it!