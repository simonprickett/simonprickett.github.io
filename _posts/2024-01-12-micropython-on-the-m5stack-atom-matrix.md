---
layout: post
title:  "MicroPython on the M5Stack Atom Matrix: A Live Streaming Series"
categories: [ IoT, Coding, Python ]
image: assets/images/m5atom_main.jpg
author: simon
---
The Atom Matrix is a tiny (24mm x 24mm x 14mm) ESP32 based device from M5Stack.  For such a small thing at a nice price (around US$ 15 at the time of writing) it has a lot to offer.  I've owned a couple of these devices for a year or so and hadn't had time to use them for anything, so I decided to get them out, install MicroPython on them, and see how easy or not it would be to use all of the features from the MicroPython language.

I thought I'd undertake this project as a series of live streams where I'd get to test out the zoom on my new overhead second camera.  I didn't live code everything, but had some material and resources prepared beforehand so we could focus on getting stuff done rather than potentially tedious debugging.  I made three streams for this project that are all linked below.

Here's what the Atom Matrix looks like, including an overview of its features:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/m5atom_overview.png" alt="Overview of the M5Stack Atom Matrix.">
  <figcaption class="figure-caption text-center">Overview of the M5Stack Atom Matrix.</figcaption>
</figure>

The M5Stack range of devices and accessories is available from all the usual maker places:

* Direct from [M5Stack](https://shop.m5stack.com/products/atom-matrix-esp32-development-kit).
* [Pimoroni](https://shop.pimoroni.com/products/atom-matrix-esp32-development-kit?variant=31880178532435) (UK based, worldwide shipping).
* [The Pi Hut](https://thepihut.com/products/atom-matrix-esp32-development-kit) (UK based, worldwide shipping).
* [Adafruit](https://www.adafruit.com/product/4497) (US based, worldwide shipping).

Here are the three videos that I made covering how to use the features of this device from MicroPython.  In the first episode, I showed how to install the MicroPython runtime, connect to a MicroPython REPL on the device and work with the LED matrix and button.  Then, I wrote code to connect to a WiFi network and retrieve the current [Cheerlights](https://cheerlights.com/) color using MQTT.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/bwvli5pEA0A?si=WnZ3IZVyVbxt9PIT&start=23" allowfullscreen></iframe>
</div><br/>

Code for episode one is in the [`first_livestream`](https://github.com/simonprickett/m5stack-atom-micropython/tree/main/first-livestream) folder on GitHub.

For the second episode I walked through a small [pull request](https://github.com/micropython/micropython/pull/13350) that I made to the MicroPython helper class for the Atom Matrix and we learned about how to operate the accelerometer.  You'll find the code in the [`second-livestream`](https://github.com/simonprickett/m5stack-atom-micropython/tree/main/second-livestream) folder on GitHub.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/-Ej06U2x-i8?si=26UYTrkcRKfD6k_5&start=24" allowfullscreen></iframe>
</div><br/>

{% include coffee-cta.html %}

In episode three I demonstrated how to use the Grove connector on the device to connect and work with three different types of sensor.  These were a light sensor, a DHT11 temperature/humidity sensor and a PIR motion detector.  The MicroPython code to accompany this episode is in the [`third-livestream`](https://github.com/simonprickett/m5stack-atom-micropython/blob/main/third-livestream/main.py) folder on GitHub.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/f3BA2R5eIJU?si=JvC_xbLFRdfPyzfw&start=23" allowfullscreen></iframe>
</div><br/>

If you want to try this out for yourself or study the code, I've [made it available freely on GitHub](https://github.com/simonprickett/m5stack-atom-micropython).  If you do anything with it, or are building similar projects I'd love to see what you're up to.  ([Contact me here](/contact)).

--- 
Main photograph from [pxhere.com](https://pxhere.com/en/photo/980934).
