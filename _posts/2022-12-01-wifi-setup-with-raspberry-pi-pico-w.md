---
layout: post
title:  "Wifi Setup with the Raspberry Pi Pico W"
categories: [ IoT, Coding, Raspberry Pi, Python ]
image: assets/images/pico_wifi_main.jpg
author: simon
tags: [featured]
---
One of the problems associated with making and distributing IoT devices to consumers is dealing with having the consumer connect the device to their own wifi network when they first receive it. 

This is especially problematic for headless devices that don't have displays or input mechanisms.  In this video, I look at how to use Pimoroni's Phew! templating system and a captive access portal to provision wifi credentials to a Raspberry Pi Pico W.  The code is in MicroPython.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pico_wifi_livestream.png" class="figure-img img-fluid" alt="Screenshot from my live stream in which I worked on this project">
  <figcaption class="figure-caption text-center">My livestream where I worked on this project.</figcaption>
</figure>

This was the fifth project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

{% include coffee-cta.html %}

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Gzp9nLkqadg?start=33" allowfullscreen></iframe>
</div><br/>

* [Source code for this project on GitHub](https://github.com/simonprickett/phewap)
* [Pimoroni Phew! templating engine and webserver](https://github.com/pimoroni/phew)
* [Captive Portal / Access point article from Kev McAleer](https://www.kevsrobots.com/blog/phew-access-point.html)

--- 
Main photograph by [Gontran Isnard on Upsplash](https://unsplash.com/photos/3-fuFf4gPNY).
