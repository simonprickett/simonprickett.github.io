---
layout: post
title:  "Hotel Room Service with Node RED and Redis on the Raspberry Pi"
categories: [ IoT, Coding, Raspberry Pi, Redis, JavaScript ]
image: assets/images/node_red_redis_main.jpg
author: simon
---
Node-RED is a low code graphical programming environment, often used to describe event driven IoT systems.  In this project, I show how to build a flow that uses Redis Pub/Sub to model requests for room service at a hotel.  The code is in JavaScript.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/node_red_redis_stream.png" class="figure-img img-fluid" alt="Screenshot from my live stream showing the Node RED project flow">
  <figcaption class="figure-caption text-center">The Node RED flow as seen on the live stream videos.</figcaption>
</figure>

This was the sixth project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

In the first episode, I got the basic flow up and running...

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/byt8jWg6M98?start=30" allowfullscreen></iframe>
</div><br/>

In the second video, I show Node-RED running on a Raspberry Pi, move my Redis instance to the cloud, move connection secrets out of the Node-RED flow into an environment variable and attach an illuminated arcade button to the flow.  The code is in JavaScript.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/r3yaVFN7Mzg?start=24" allowfullscreen></iframe>
</div><br/>

* [Source code for this project on GitHub](https://github.com/simonprickett/node-red-redis-hotel-jobs)
* [Node-RED](https://nodered.org/)
* [Node-RED extension for Redis](https://flows.nodered.org/node/node-red-contrib-redis)
* [24mm Illuminated arcade button, blue](https://thepihut.com/products/mini-led-arcade-button-24mm-translucent-blue) - UK supplier ([USA click here](https://www.adafruit.com/product/3432))
* [Arcade button quick wires](https://thepihut.com/products/arcade-button-quick-connect-wire-pairs-0-11-10-pack) - UK supplier ([USA click here](https://www.adafruit.com/product/1152))

I also completed a small Node-RED project a while back, demonstrating how to operate traffic light lights connected to the GPIO pins of a Raspberry Pi.  If you're interested in that, [check out the article here](/raspberry-pi-coding-with-node-red-traffic-lights/).

--- 
Main photograph by [Cottonbro Studio on Pexels](https://www.pexels.com/photo/guest-service-knocking-on-a-hotel-room-5371562/).
