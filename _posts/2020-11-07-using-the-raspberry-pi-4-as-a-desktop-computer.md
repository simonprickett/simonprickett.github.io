---
layout: post
title:  "Using the Raspberry Pi 4 as a Desktop Computer"
categories: [ Raspberry Pi ]
image: assets/images/pi_desktop_main.jpg
author: simon
---
TODO intro, they sell an official desktop kit and now the all in one pi 400... aim is to use the pi as a regular desktop computer with access to things like gpio and camera connector a secondary concern.

Official Pi 4 complete desktop kit https://shop.pimoroni.com/products/raspberry-pi-4-desktop-kit?variant=31856456171603
Pi 400 complete kit https://www.adafruit.com/product/4796
Pi 400 bring your own power supply, micro SD card and mouse https://www.adafruit.com/product/4795

## Shopping List

Here's what you'll need to build your own desktop Pi 4... links are for USA suppliers.  If you're in the UK/EU, [Pimoroni](https://shop.pimoroni.com/) will have most of this stuff.

* Raspberry Pi 4 (I used the [4Gb RAM model](https://www.adafruit.com/product/4296), but there's also an [8Gb](https://www.adafruit.com/product/4564)).
* Appropriate [USB C power supply for the Pi 4](https://www.adafruit.com/product/4298).
* [Micro SD card](https://www.amazon.com/SanDisk-Ultra-microSDHC-Memory-Adapter/dp/B08GYBBBBH) (whatever size suits your needs, I used 64Gb and I like SanDisk products).
* [Argon One Raspberry Pi 4 case](https://www.argon40.com/catalog/product/view/id/52/s/argon-one-raspberry-pi-4-case/category/4/) with fan and power switch.  I bought mine while visiting the UK, and got it from [amazon.co.uk](https://www.amazon.co.uk/gp/product/B086JXR75B/)

You'll also want a couple of things you might already have:

* USB mouse.
* USB keyboard.

I used some older Microsoft products I had on hand.

## Hardware Build

TODO building the case...

TODO note about the GPIO ports...

TODO slideshow of images for case build...

<div class="slick-carousel">
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pi_desktop_1_case_parts.jpg" class="figure-img img-fluid" alt="Pi 4 Desktop Case parts">
        <figcaption class="figure-caption text-center">Pi 4 Desktop Case parts.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pi_desktop_2_case_fan_with_pi.jpg" class="figure-img img-fluid" alt="Built in fan with Raspberry Pi 4 board">
        <figcaption class="figure-caption text-center">Built in fan with Raspberry Pi 4 board.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pi_desktop_3_case_port_extender_fitted.jpg" class="figure-img img-fluid" alt="Raspberry Pi 4 with the case's port extender fitted">
        <figcaption class="figure-caption text-center">Raspberry Pi 4 with the case's port extender fitted.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pi_desktop_4_pi_in_top_of_case.jpg" class="figure-img img-fluid" alt="Raspberry Pi 4 with port extender mounted in the case">
        <figcaption class="figure-caption text-center">Raspberry Pi 4 with port extender mounted in the case.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pi_desktop_5_case_ports.jpg" class="figure-img img-fluid" alt="Arrangement of ports and power button">
        <figcaption class="figure-caption text-center">Arrangement of ports and power button.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pi_desktop_6_case_gpio.jpg" class="figure-img img-fluid" alt="Access to GPIO ports via removable magnetic cover">
        <figcaption class="figure-caption text-center">Access to GPIO ports via removable magnetic cover.</figcaption>
        </figure>
    </div>
    <div>
        <figure class="figure">
        <img src="{{ site.baseurl }}/assets/images/pi_desktop_7_case_instructions.jpg" class="figure-img img-fluid" alt="Example of the case assembly instructions">
        <figcaption class="figure-caption text-center">Example of the case assembly instructions.</figcaption>
        </figure>
    </div>
</div>

## Operating System Setup

TODO Raspbian setup...

## Power Button and Fan Management Software

TODO - not sure if it works with other operating systems..

## Wrap Up

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_desktop_with_monitor.jpg" class="figure-img img-fluid" alt="Raspberry Pi 4 desktop up and running">
  <figcaption class="figure-caption text-center">Raspberry Pi 4 desktop up and running!</figcaption>
</figure>

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/_79nXUG4Y4Y" allowfullscreen></iframe>
</div><br/>

TODO it's early days, we'll see how it goes with use...

---

Main image: Michael Henzler / [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
