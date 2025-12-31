---
layout: post
title:  "Environment Monitoring with Redis Streams, Raspberry Pi Pico W and MicroPython"
categories: [ IoT, Coding, Raspberry Pi, Python, Node.js, JavaScript, Redis ]
image: assets/images/pico_env_streams_main.webp
author: simon
tags: [sticky]
---
The Raspberry Pi Pico W is an extremely capable microcontroller device from the Raspberry Pi Foundation.  The W variant has on board support for wifi networking.  This and the ability to run MicroPython makes it an excellent choice for projects that need to gather data from sensors and report it to a cloud server.

I decided to build an environment monitoring system using a couple of Pi Pico W devices, Redis and some server side logic.  I used temperature, humidity and light sensors plus a fan to simulate an air conditioning unit.

This was the second project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

{% include coffee-cta.html %}

Starting with a box fresh Raspberry Pi Pico W, I demonstrated how to install MicroPython, connect to the device from Visual Studio Code and write Python code on it.  I wrote code to connect to a wireless network, created a Redis database in the cloud and got started with streaming data to Redis.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/8Q3jK5CAfNQ?start=25" allowfullscreen></iframe>
</div><br/>

* [Raspberry Pi Pico W](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html)
* [MicroPython](https://micropython.org/).
* [The Pico-W-Go extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=paulober.pico-w-go).
* [Free Redis database in the cloud](https://redis.com/try-free/).
* [RedisInsight, a free GUI for managing and visualizing data in Redis](https://redis.com/redis-enterprise/redis-insight/).
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

In the second episode, I've soldered headers to the Pi Pico W and connected it to a Seeed Studio Grove shield.  This made it easy to attach Grove compatible sensors.  I replaced the code from episode 1 that sent a stream of numbers to Redis with code that sent temperature and humidity values from a sensor attached to the Pi.  I also demonstrated how to read this data from a Redis stream using Node.js.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/TQlsvxD6zRM?start=25" allowfullscreen></iframe>
</div><br/>

* [Headers for Raspberry Pi Pico](https://shop.pimoroni.com/products/pico-header-pack?variant=32374935715923).
* [Seeed Studio Grove Starter Kit for Raspberry Pi Pico](https://www.seeedstudio.com/Grove-Starter-Kit-for-Raspberry-Pi-Pico-p-4851.html).
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

In Episode 3, I added a light sensor to the existing temperature/humidity sensor on the Pi Pico W and streamed data from that to Redis.  I then looked at how to modify the Node.js code that reads from the stream to remember how far through it was so that if it crashed or got restarted it picks up from where it left off rather than at the start of the stream.  I demonstrated how to use a Redis Sorted Set to model the 1:many relationship between sensor IDs and room IDs (one room can contain many sensors, one sensor can only live in one room) before finishing up by storing structured JSON documents in Redis representing the status of each room.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/0vw_vhouca8?start=15" allowfullscreen></iframe>
</div><br/>

* [YouTube - Redis Sorted Sets](https://www.youtube.com/watch?v=MUKlxdBQZ7g)
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

In Episode 4, I addressed the issue of how to limit the memory consumed by the Stream of incoming sensor data, fixed up some data type issues in the JSON documents and added a RediSearch index so that we can perform different sorts of query and aggregation over the dataset.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/MuaJzyUHmx0?start=20" allowfullscreen></iframe>
</div><br/>

* [The Redis XTRIM command](https://redis.io/commands/xtrim/).
* [Storing, Querying and Indexing JSON at Speed](https://university.redis.com/courses/ru204/) - a course about RediSearch and JSON at Redis University.
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

In the 5th and final episode, I introduced a second Raspberry Pi Pico W running an LCD display and a small fan.  I showed how we can control it using a Redis List to turn the fan on when the room needs cooling down.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/ypQ4bjiKeRo?start=24" allowfullscreen></iframe>
</div><br/>

* [Redis Lists Explained](https://www.youtube.com/watch?v=PB5SeOkkxQc) - a fun YouTube explainer video.
* [Redis Streams](https://university.redis.com/course/ru202) - a course about the Redis Streams data type at Redis University.
* [Source code for this project on GitHub](https://github.com/simonprickett/raspberry-pi-pico-redis).

--- 
Main photograph by [Ibrahim Boran on Pexels](https://www.pexels.com/photo/close-up-photo-of-control-panel-3582392/).
