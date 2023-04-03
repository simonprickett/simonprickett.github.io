---
layout: post
title:  "Cheerlights with MQTT and Redis Streams"
categories: [ IoT, Programming, Raspberry Pi, Python, Redis ]
image: assets/images/cheerlights_main.jpg
author: simon
---
CheerLights is a global network of synchronised lights that can be controlled by anyone.  Tweeting a colour to the CheerLights Twitter account and talking to a bot on its Discord server are a couple of examples of ways that anyone can change the colour of all CheerLights installations globally to one of the several supported colours.

I decided to write my own small CheerLights display using the Pimoroni Unicorn Hat LED matrix connected to a Raspberry Pi.  CheerLights provides different methods to get the latest colour information - I chose to use their MQTT server and store colour history in a Redis Stream.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cheerlights_screenshot.png" class="figure-img img-fluid" alt="Screenshot from my live stream showing the Cheerlights project working">
  <figcaption class="figure-caption text-center">Cheerlights via MQTT and Redis Streams displaying on a Pimoroni Unicorn Hat.</figcaption>
</figure>

This was the third project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

In this project, I showed how to show and track the current CheerLights colour on a Pimoroni Unicorn Hat connected to a Raspberry Pi.  I subscribed to a topic on the CheerLights MQTT server, put the latest colour into a Redis Stream and consumed it on the Pi.  The code is all in Python.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/j0TphaKoEVg?start=21" allowfullscreen></iframe>
</div><br/>

* [CheerLights blog about this project](https://cheerlights.com/learn-redis-streams-with-the-cheerlights-iot-project/)
* [Redis Streams](https://university.redis.com/course/ru202) - a free online course about the Redis Streams data type at Redis University.
* [Source code for this project on GitHub](https://github.com/simonprickett/cheerlights-with-redis-streams).

--- 
Main photograph by [Tony Hisgett on Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Coloured_Lights_1_%285129802026%29.jpg).
