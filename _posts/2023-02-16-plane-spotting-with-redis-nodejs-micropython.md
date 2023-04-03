---
layout: post
title:  "Plane Spotting with Redis, Node.js and MicroPython"
categories: [ IoT, Programming, Raspberry Pi, Redis, JavaScript, Python ]
image: assets/images/plane_tracking_main.jpg
author: simon
---
This is placeholder text and will eventually be replaced by the real thing.  This article may also include random images from other projects until I swap them out for content relevant to this project.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/plane_tracking_flipdot.gif" alt="Animated GIF of a flip dot bus sign showing flight information">
  <figcaption class="figure-caption text-center">The Flip Dot Display Front End.</figcaption>
</figure>

Todo some more text about that this is...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/plane_tracking_architecture.png" class="figure-img img-fluid" alt="Architecture of the plane tracking system">
  <figcaption class="figure-caption text-center">Architecture of the plane tracking system.</figcaption>
</figure>

This was the eighth and most ambitious project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

TODO this should be a description of the project...

In the first episode I begin the project by demonstrating how to figure out to see which planes are passing by using a software defined radio USB stick, Redis and Node.js.  I cover receiving data from the radio, decoding it, and storing it in Redis Hashes.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/TCTej1uihG4?start=21" allowfullscreen></iframe>
</div><br/>

In the second episode, I start adding detail to the data obtained from the radio by calling the FlightAware API.  I show how to use Redis as a queue to schedule calls to the API and how to use caching to prevent repeated calls that could cost money!

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Qu-_wvSJrdE?start=32" allowfullscreen></iframe>
</div><br/>

It's time to add a search index over our flight data in Redis and that's the topic for episode 3.  I show how to use the search capabilities of Redis Stack to query the flight data in different ways - we'll use this in the next episode to write a notifier component.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/IEx2WgWdhIA?start=23" allowfullscreen></iframe>
</div><br/>

During episode 4 I look at writing a RediSearch aggregate query to find the most recently updated widebody aircraft flight passing by, then use Redis Pub/Sub to notify front ends of its details.  

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/fYnrNqSgqR4?start=25" allowfullscreen></iframe>
</div><br/>

In episode 5, I finally use the big mechanical flip dot bus display that sits behind me on all of my livesstreams, and build a flight notification component with it.  I demonstrate the use of Redis Pub/Sub and show code in Node.js running on a Raspberry Pi 3.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/i8grA5fsbdM?start=23" allowfullscreen></iframe>
</div><br/>

Episode 6 is the final one for this project.  I use a Pimoroni Badger 2040W and MicroPython to build a second flight display that consumes a Redis Stream.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/RROQA0QOq0k" allowfullscreen></iframe>
</div><br/>

Resources for this project:

* [Source code for this project on GitHub](https://github.com/simonprickett/local-aircraft-tracker)
* [FlightAware API](https://flightaware.com/commercial/aeroapi/) - note this is a paid API
* [Search capabilities of Redis Stack](https://redis.io/docs/stack/search/)
* [Redis Pub/Sub](https://redis.io/docs/manual/pubsub/)
* [Redis Streams](https://redis.io/docs/data-types/streams-tutorial/)
* [Pimoroni Badger 2040W](https://shop.pimoroni.com/products/badger-2040-w)

--- 
Main photograph by [Ramon Kagie on Unsplash](https://unsplash.com/photos/WOyBhxyB8KI).
