---
layout: post
title:  "Things on Thursdays: A Live Streaming Series"
categories: [ IoT, Programming, Raspberry Pi ]
image: assets/images/things_on_thursdays_main.jpg
author: simon
tags: [sticky]
---
As part of my job as the Principal Developer Advocate at [Redis](https://redis.io), I've been producing a live stream series in which I take a look at how Redis or related concepts can be used with a variety of Internet of Things devices.  These streams go out most weeks on Thursdays on the Redis YouTube and Twitch channels -- [check out our team's schedule](https://developer.redis.com/redis-live/) for links to future events.

So far, I've mostly focussed on work with the Raspberry Pi family of devices as that's what I have on hand.  I've been working on different projects across multiple streams and wanted to bring them all together in one place here so that you can follow along.  I've tried to describe each project and link to the source code I produced where relevant.  I've been coding in Python, MicroPython (for the Raspberry Pi Pico) and Node.js.

This is an ongoing work in progress, so please check back here for updates!  I'm also always interested in ideas for topics to cover - if I have or can get hold of the hardware, I'll certainly try out your suggestions.  [Get in touch with me](http://localhost:4000/contact/) if you want to share ideas, or even appear as a guest to work on something together.  My only real criteria are that we should be using Redis or talking about data structures that Redis implements.

Here's the videos and links to the relevant GitHub repositories and articles.  Enjoy!

## Series Introduction

In the first video I introduce the Things on Thursdays concept and the first project -- building a Bloom Filter using LEDs on a Raspberry Pi, and talking to it using redis-cli and the Redis wire protocol.  Coding in Python, I build a simple fake Redis server that implements some of the Redis Set data type commands.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/1F2nmm2jBjA?start=25" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Visual Bloom Filter article](https://simonprickett.dev/visual-bloom-filter-with-raspberry-pi/).
* [Source code for the original Visual Bloom Filter](https://github.com/simonprickett/visual-bloom-filter-for-pi).
* [Redis wire protocol](https://redis.io/docs/reference/protocol-spec/).
* [Redis Set commands](https://redis.io/commands/?group=set).

## Redis Compatible Visual Bloom Filter Project

### Episode 1

In this episode, I walk through my pre-existing Visual Bloom Filter project that uses a Raspberry Pi and a Pimoroni Unicorn Hat LED matrix.  The code is in Python.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/uyjAFP73ttI?start=25" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Visual Bloom Filter article](https://simonprickett.dev/visual-bloom-filter-with-raspberry-pi/).
* [Source code for the original Visual Bloom Filter](https://github.com/simonprickett/visual-bloom-filter-for-pi).
* [Pimoroni Unicorn Hat](https://shop.pimoroni.com/products/unicorn-hat?variant=932565325)

### Episode 2

In this second episode, I combine the fake Redis server that I made in the "Series Introduction" stream with the Visual Bloom Filter project, creating a Visual  Bloom Filter than can be used from any Redis client.  I demonstrate usage with the redis-cli and Node Redis client for Node.js.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Ym4g5iti3bo?start=25" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Source code for this project on GitHub](https://github.com/simonprickett/redis-compatible-bloom-filter)
* [Node Redis](https://github.com/redis/node-redis) (Node.js client for Redis)

## Redis Streams, Raspberry Pi Pico and MicroPython Project

### Episode 1

Starting with a box fresh Raspberry Pi Pico W, I show you how to install MicroPython, connect to the device from Visual Studio Code and write Python code on it.  I demonstrate how to connect to a wireless network, create a Redis database in the cloud and get started with streaming data to Redis.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/8Q3jK5CAfNQ?start=25" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Raspberry Pi Pico W](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html)
* [MicroPython](https://micropython.org/).
* [The Pico-W-Go extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=paulober.pico-w-go).
* [Free Redis database in the cloud](https://redis.com/try-free/).
* [RedisInsight, a free GUI for managing and visualizing data in Redis](https://redis.com/redis-enterprise/redis-insight/).
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

### Episode 2

In Episode 2, I've soldered headers to the Pi Pico W and connected it to a Seeed Studio Grove shield.  This makes it easy to attach Grove compatible sensors.  I replace the code from episode 1 that sent a stream of numbers to Redis with code that sends temperature and humidity values from a sensor attached to the Pi.  I also demonstrate how to read this data from a Redis stream using Node.js.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/TQlsvxD6zRM?start=25" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Headers for Raspberry Pi Pico](https://shop.pimoroni.com/products/pico-header-pack?variant=32374935715923).
* [Seeed Studio Grove Starter Kit for Raspberry Pi Pico](https://www.seeedstudio.com/Grove-Starter-Kit-for-Raspberry-Pi-Pico-p-4851.html).
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

### What's Next?

This is an ongoing project, don't forget to check out the [Redis developer relations streaming schedule](https://developer.redis.com/redis-live/) to see when the next episode will be.  I'll update this page shortly after the next episode airs.

---
*Main image: "Person using Appliance" by [Alexander Dummer on Pexels](https://www.pexels.com/photo/person-using-appliance-132700/).*