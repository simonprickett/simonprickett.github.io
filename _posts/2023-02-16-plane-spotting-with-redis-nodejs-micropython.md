---
layout: post
title:  "Plane Spotting with Redis, Node.js and MicroPython"
categories: [ IoT, Programming, Raspberry Pi, Redis, JavaScript, Python ]
image: assets/images/plane_tracking_main.jpg
author: simon
---
I've always been interested to watch planes pass by, so I decided to build a plane tracking system... For this I used some existing software called [dump1090](https://github.com/antirez/dump1090) - this receives data broadcast from passing aircraft.  This works by using a software defined radio USB stick with an antenna, decoding messages to usable data that can be read with Node.js.

I used this, plus a Redis instance to store and manage data in, to track aircraft passing by.  Not all of the information I wanted to have access to is available from the radio, so I used the FlightAware API to enhance the data adding in information about the type of aircraft, and its origin and destination airports.

I then used this information and the search capabilities of Redis Stack to identify "interesting" flights (for example those flown by wide body aircraft).

Finally, I used the pub/sub and streams capabilities of Redis to broadcast information about interesting flights to a couple of front ends.  The first one that I made was written in Node.js and runs on a Raspberry Pi.  It controls a flip dot sign that used to be in a bus.  My other front end demo used an e-ink screen controlled by a Raspberry Pi Pico W... the [Badger 2040W from Pimoroni](https://shop.pimoroni.com/products/badger-2040-w).

Here's the flip dot dign working:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/plane_tracking_flipdot.gif" alt="Animated GIF of a flip dot bus sign showing flight information">
  <figcaption class="figure-caption text-center">The Flip Dot Display Front End.</figcaption>
</figure>

Here's a diagram showing the architecture for this project, watch the videos for a full explanation...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/plane_tracking_architecture.png" class="figure-img img-fluid" alt="Architecture of the plane tracking system">
  <figcaption class="figure-caption text-center">Architecture of the plane tracking system.</figcaption>
</figure>

This was the eighth and most ambitious project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

I was amazed to wake up one morning and find that someone else had used this project to make their own version and that they have the same flip dot display as me:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I was mad enough to copy 😄<br>Thanks for the awesome intro’s to nodejs and redis too! I do want to rewrite some of the components in Python, mainly because of familiarity.<br>I noticed the address was 1 out using the js but matched the potentiometer in Python - did you have the same? <a href="https://t.co/syOVhJB2wA">pic.twitter.com/syOVhJB2wA</a></p>&mdash; jaket91 (@jaket91) <a href="https://twitter.com/jaket91/status/1644128357175504896?ref_src=twsrc%5Etfw">April 7, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

From chatting to them I also found out that you can buy Hanover flip dot displays used from [psvautomobilia.com](https://psvautomobilia.com/?product_cat=hanover-flip-dots) in the UK.

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
* [Dump 1090](https://github.com/antirez/dump1090)
* [FlightAware API](https://flightaware.com/commercial/aeroapi/) - note this is a paid API
* [Search capabilities of Redis Stack](https://redis.io/docs/stack/search/)
* [Redis Pub/Sub](https://redis.io/docs/manual/pubsub/)
* [Redis Streams](https://redis.io/docs/data-types/streams-tutorial/)
* [Pimoroni Badger 2040W](https://shop.pimoroni.com/products/badger-2040-w)

--- 
Main photograph by [Ramon Kagie on Unsplash](https://unsplash.com/photos/WOyBhxyB8KI).
