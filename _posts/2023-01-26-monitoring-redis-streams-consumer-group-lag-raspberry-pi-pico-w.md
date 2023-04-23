---
layout: post
title:  "Monitoring Redis Streams Consumer Group Lag with a Raspberry Pi Pico W"
categories: [ IoT, Coding, Raspberry Pi, Redis, JavaScript, Python ]
image: assets/images/redis_streams_lag_main.jpg
author: simon
---
When working with streaming data or any sort of system where a data structure acts as a buffer or queue betwen producers and consumers, we often want to know how far behind the consumers are with processing the data stream.  This is commonly referred to as the consumer lag.  

In this project, I build a visual representation of the lag for a Redis stream using new features of the `XINFO GROUPS` command added in Redis 7.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/redis_streams_lag_screenshot.png" class="figure-img img-fluid" alt="Screenshot from my live stream demonstrating Redis Consumer Groups">
  <figcaption class="figure-caption text-center">Redis Consumer Group overview from my live stream.</figcaption>
</figure>

This was the seventh project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

In this first of two episodes, I demonstrate how Redis Streams Consumer Groups work.  We also look at how to determine the lag for a given consumer group using features added in Redis 7.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/NCvHfB7BhfQ?start=24" allowfullscreen></iframe>
</div><br/>

In this second of two episodes for this project, I show you how to display a Redis Streams consumer group lag using MicroPython, a Raspberry Pi Pico W and some LEDs...

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/qzFUZ7aBCEo?start=25" allowfullscreen></iframe>
</div><br/>

* [Source code for this project on GitHub](https://github.com/simonprickett/redis-streams-lag-pi-pico-w)
* [MicroPython/Redis/Pi Pico W boilerplate source code](https://github.com/redis-developer/micropython-redis-boilerplate)
* [Source code for testing the LEDs](https://github.com/simonprickett/pico-led-test)
* [Try out my free Redis Streams workshop](/redis-streams-workshop/)
* [RU202: Redis Streams](https://nodered.org/), a free course at Redis University

--- 
Main photograph by [Cottonbro Studio on Pexels](https://www.pexels.com/photo/backlit-analog-meters-7087611/).
