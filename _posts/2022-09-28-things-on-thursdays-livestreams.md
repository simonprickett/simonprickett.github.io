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

intro video:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/uyjAFP73ttI?start=25" allowfullscreen></iframe>
</div><br/>

connecting to the visual bloom filter using the redis protocol:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Ym4g5iti3bo?start=25" allowfullscreen></iframe>
</div><br/>

## Redis Streams, Raspberry Pi Pico and MicroPython Project

intro video:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/8Q3jK5CAfNQ?start=25" allowfullscreen></iframe>
</div><br/>

episode 2: sending sensor data to redis

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/TQlsvxD6zRM?start=25" allowfullscreen></iframe>
</div><br/>

This is an ongoing project, don't forget to check out the Redis streaming schedule to see when the next episode will be.  I'll update this page shortly after the next episode airs.

---
*Main image: "Person using Appliance" by [Alexander Dummer on Pexels](https://www.pexels.com/photo/person-using-appliance-132700/).*