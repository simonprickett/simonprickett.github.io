---
layout: post
title:  "Building a Redis Compatible Visual Bloom Filter"
categories: [ IoT, Coding, Raspberry Pi, Python, Node.js, JavaScript, Redis ]
image: assets/images/redis_bloom_filter_main.webp
author: simon
---
I wanted to take my previous Visual Bloom Filter project and enhance it so that, instead of a web front end and REST like API, it could instead use the Redis wire protocol.  This would make it usable from any existing Redis client package or directly with the Redis CLI.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/redis_bloom_filter_screenshot.webp" class="figure-img img-fluid" alt="Screenshot from my live stream showing the Visual Bloom Filter working">
  <figcaption class="figure-caption text-center">Controlling the Visual Bloom Filter using redis-cli.</figcaption>
</figure>

This was the first project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  In the first episode which also served as a series introduction for Things on Thursdays, I built a simple fake Redis server in Python that implemented some of the Redis Set data type commands.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/1F2nmm2jBjA?start=25" allowfullscreen></iframe>
</div><br/>

{% include coffee-cta.html %}

* [Visual Bloom Filter article](https://simonprickett.dev/visual-bloom-filter-with-raspberry-pi/).
* [Source code for the original Visual Bloom Filter](https://github.com/simonprickett/visual-bloom-filter-for-pi).
* [Redis wire protocol](https://redis.io/docs/reference/protocol-spec/).
* [Redis Set commands](https://redis.io/commands/?group=set).

In the first full episode dedicated to this project, I walked through my pre-existing Visual Bloom Filter project that uses a Raspberry Pi and a Pimoroni Unicorn Hat LED matrix.  The code is in Python.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/uyjAFP73ttI?start=25" allowfullscreen></iframe>
</div><br/>

* [Visual Bloom Filter article](https://simonprickett.dev/visual-bloom-filter-with-raspberry-pi/).
* [Source code for the original Visual Bloom Filter](https://github.com/simonprickett/visual-bloom-filter-for-pi).
* [Pimoroni Unicorn Hat](https://shop.pimoroni.com/products/unicorn-hat?variant=932565325)

In the second episode, I combined the fake Redis server that I made in the "Series Introduction" stream with the Visual Bloom Filter project, creating a Visual Bloom Filter than can be used from any Redis client.  I demonstrated usage with the redis-cli and Node Redis client for Node.js.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Ym4g5iti3bo?start=25" allowfullscreen></iframe>
</div><br/>

* [Source code for this project on GitHub](https://github.com/simonprickett/redis-compatible-bloom-filter)
* [Node Redis](https://github.com/redis/node-redis) (Node.js client for Redis)
