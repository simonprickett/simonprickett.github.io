---
layout: post
title:  "Synchronised Counting with Redis and a Seven Segment Display"
categories: [ IoT, Programming, Raspberry Pi, Python, JavaScript, Redis ]
image: assets/images/redis_counting_main.png
author: simon
---
Counting things seems relatively easy, until it isn't!  In this project, I used Redis to maintain a central count that was displayed on and could be updated from a range of different interfaces.  Each interface needed to stay in sync at all times - an update to the count from any interface should update the value of the count shown on that interface and all others at the same time.

For this I used Redis keyspace notifications and built a web interface plus a physical display with a Raspberry Pi, 7 segment display and arcade button.  The code was written in a mix of Python and Node.js.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/redis_counting_screenshot.png" class="figure-img img-fluid" alt="Screenshot from my live stream showing synchronised counting with Redis">
  <figcaption class="figure-caption text-center">Synchronised counting with Redis.</figcaption>
</figure>

This was the fourth project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  

In this two week project I demonstrated how to count things using Redis, then synchronise multiple devices to display the current count.  In the first week, I looked at doing this for a web interface with Node.js and Express:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/NJyR8FKb9aI?start=8" allowfullscreen></iframe>
</div><br/>

In the second part of this two week project, I implemented an additional counter and display using arcade buttons, a TM1637 7 digit display and a Raspberry Pi 3.  I wrote this in Python.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Ad7zHs5ViWw?start=22" allowfullscreen></iframe>
</div><br/>

* [Source code for this project on Github](https://github.com/simonprickett/redis-counter)
* [TM1637 7 segment display - Arduino example](https://create.arduino.cc/projecthub/ryanchan/tm1637-digit-display-arduino-quick-tutorial-ca8a93)
* [gpiozero library](https://gpiozero.readthedocs.io/en/stable/) used for the arcade buttons
* [Redis Keyspace Notifications](https://redis.io/docs/manual/keyspace-notifications/)

--- 
Main photograph - Kraftwerk performing "Numbers" from [YouTube](https://www.youtube.com/watch?v=HTBxnOUM-Oc).
