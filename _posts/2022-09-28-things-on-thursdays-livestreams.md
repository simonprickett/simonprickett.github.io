---
layout: post
title:  "Things on Thursdays: A Live Streaming Series"
categories: [ IoT, Programming, Raspberry Pi, Python, Node.js, JavaScript ]
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

### Episode 3

In Episode 3, I add a light sensor to the existing temperature/humidity sensor on the Pi Pico W and stream data from that to Redis.  I then look at how to modify the Node.js code that reads from the stream to remember how far through it was so that if it crashes or gets restarted it picks up from where it left off rather than at the start of the stream.  I demonstrate how to use a Redis Sorted Set to model the 1:many relationship between sensor IDs and room IDs (one room can contain many sensors, one sensor can only live in one room) before finishing up by storing structured JSON documents in Redis representing the status of each room.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/0vw_vhouca8?start=15" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [YouTube - Redis Sorted Sets](https://www.youtube.com/watch?v=MUKlxdBQZ7g)
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

### Episode 4

In Episode 4, I address the issue of how to limit the memory consumed by the Stream of incoming sensor data, fix up some data type issues in the JSON documents and add a RediSearch index so that we can perform different sorts of query and aggregation over the dataset.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/MuaJzyUHmx0?start=20" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [The Redis XTRIM command](https://redis.io/commands/xtrim/).
* [Storing, Querying and Indexing JSON at Speed](https://university.redis.com/courses/ru204/) - a course about RediSearch and JSON at Redis University.
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

### Episode 5

In the 5th and final episode, I introduce a second Raspberry Pi Pico W running an LCD display and a small fan.  I show how we can control it using a Redis List to turn the fan on when the room needs cooling down.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/ypQ4bjiKeRo?start=24" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Redis Lists Explained](https://www.youtube.com/watch?v=PB5SeOkkxQc) - a fun YouTube explainer video.
* [Redis Streams](https://university.redis.com/course/ru202) - a course about the Redis Streams data type at Redis University.
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

## CheerLights with Redis Streams, MQTT and Python

In this project, I show how to show and track the current CheerLights color on a Pimoroni Unicorn Hat connected to a Raspberry Pi.  I subscribe to a topic on the CheerLights MQTT server, put the latest color into a Redis Stream and consume it on the Pi.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/j0TphaKoEVg?start=21" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [CheerLights blog about this project](https://cheerlights.com/learn-redis-streams-with-the-cheerlights-iot-project/)
* [Redis Streams](https://university.redis.com/course/ru202) - a course about the Redis Streams data type at Redis University.
* [Source code for this project on GitHub](https://github.com/simonprickett/cheerlights-with-redis-streams).

## Synchronized Counting with Redis Keyspace Notifications and a 7 Segment Display

### Episode 1

This is a two week project in which I demonstrate how to count things using Redis, then synchronize multiple devices to display the current count.  In the first week, I look at doing this for a web interface with Node.js and Express:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/NJyR8FKb9aI?start=8" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Source code for this project on Github](https://github.com/simonprickett/redis-counter)
* [TM1637 7 segment display - Arduino example](https://create.arduino.cc/projecthub/ryanchan/tm1637-digit-display-arduino-quick-tutorial-ca8a93)
* [Redis Keyspace Notifications](https://redis.io/docs/manual/keyspace-notifications/)

### Episode 2

In the second part of this two week project, I implement an additional counter and display using arcade buttons, a TM1637 7 digit display and a Raspberry Pi 3.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Ad7zHs5ViWw?start=22" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Source code for this project on Github](https://github.com/simonprickett/redis-counter)
* [TM1637 7 segment display - Arduino example](https://create.arduino.cc/projecthub/ryanchan/tm1637-digit-display-arduino-quick-tutorial-ca8a93)
* [gpiozero library](https://gpiozero.readthedocs.io/en/stable/) used for the arcade buttons

## Wifi Setup with Raspberry Pi Pico W

One of the problems associated with making and distributing IoT devices to consumers is dealing with having the consumer connect the device to their own wifi network.  This is especially problematic for headless devices that don't have displays or input mechanisms.  In this video, I look at how to use Pimoroni's Phew! templating system and a captive access portal to provision wifi credentials to a Raspberry Pi Pico W.  The code is in MicroPython.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Gzp9nLkqadg?start=22" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Source code for this project on GitHub](https://github.com/simonprickett/phewap)
* [Pimoroni Phew! templating engine and webserver](https://github.com/pimoroni/phew)
* [Captive Portal / Access point article from Kev McAleer](https://www.kevsrobots.com/blog/phew-access-point.html)

## Node-RED with Redis

### Episode 1

Node-RED is a low code graphical programming environment, often used to describe event driven IoT systems.  In this first episode, I show how to build a flow that uses Redis Pub/Sub to model requests for room service at a hotel.  The code is in JavaScript.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/byt8jWg6M98?start=27" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Source code for this project on GitHub](https://github.com/simonprickett/node-red-redis-hotel-jobs)
* [Node-RED](https://nodered.org/)
* [Node-RED extension for Redis](https://flows.nodered.org/node/node-red-contrib-redis)

### Episode 2

In this episode, I show Node-RED running on a Raspberry Pi, move my Redis instance to the cloud, move connection secrets out of the Node-RED flow into an environment variable and attach an illuminated arcade button to the flow.  The code is in JavaScript.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/r3yaVFN7Mzg?start=23" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Source code for this project on GitHub](https://github.com/simonprickett/node-red-redis-hotel-jobs)
* [Node-RED](https://nodered.org/)
* [Node-RED extension for Redis](https://flows.nodered.org/node/node-red-contrib-redis)
* [24mm Illuminated arcade button, blue](https://thepihut.com/products/mini-led-arcade-button-24mm-translucent-blue) - UK supplier ([USA click here](https://www.adafruit.com/product/3432))
* [Arcade button quick wires](https://thepihut.com/products/arcade-button-quick-connect-wire-pairs-0-11-10-pack) - UK supplier ([USA click here](https://www.adafruit.com/product/1152))

## More Redis Streams!

### Episode 1

In this first of two episodes for a new project, I demonstrate how Redis Streams Consumer Groups work.  We also look at how to determine the lag for a given consumer group using features added in Redis 7.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/NCvHfB7BhfQ?start=23" allowfullscreen></iframe>
</div><br/>

**Resources:**

* [Source code for this project on GitHub](https://github.com/redis-developer/redis-streams-hotel-jobs)
* [RU202: Redis Streams](https://nodered.org/), a free course at Redis University

### Episode 2

In this second of two episodes of his weekly series, I'll show you how to display a Redis Streams consumer group lag using MicroPython, a Raspberry Pi Pico W and some LEDs...

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/qzFUZ7aBCEo?start=25" allowfullscreen></iframe>
</div><br/>

* [Source code for this project on GitHub](https://github.com/simonprickett/redis-streams-lag-pi-pico-w)
* [MicroPython/Redis/Pi Pico W boilerplate source code](https://github.com/redis-developer/micropython-redis-boilerplate)
* [Source code for testing the LEDs](https://github.com/simonprickett/pico-led-test)

## Plane Spotting with Redis and Node.js

### Episode 1

It's the start of another Redis IoT project!  In this episode I demonstrate how to figure out what planes are passing by using a software defined radio USB stick, Redis and Node.js.  I cover receiving data from the radio, decoding it, and storing it in Redis Hashes.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/TCTej1uihG4?start=21" allowfullscreen></iframe>
</div><br/>

* [Source code for this project on GitHub](https://github.com/simonprickett/local-aircraft-tracker)

## What's Next?

This is an ongoing series of projects, don't forget to check out the [Redis Developer Relations streaming schedule](https://developer.redis.com/redis-live/) to see when the next episode will be.  I'll update this page shortly after each episode airs.

---
*Main image: "Person using Appliance" by [Alexander Dummer on Pexels](https://www.pexels.com/photo/person-using-appliance-132700/).*