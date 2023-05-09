---
layout: post
title:  "Taking Pictures with Raspberry Pi and Redis"
categories: [ Redis, Raspberry Pi, Python ]
image: assets/images/pi_photos_redis_main.jpg
author: simon
---
"How can you store images in Redis from a Python script?" - I was asked this by someone looking to build an IoT project that used Redis as the data store for image classification.  The really short answer is "Well, Redis Strings are binary safe, so any data structure in Redis that uses those can hold your image data safely".  That's a bit boring though, and I'm always on the lookout for ideas for the Internet of Things live streams...

So I thought I'd build something that demonstrates how to get image data in and out of Redis.  Making a command line utility to read or write JPG files is a bit dull and not the point of an IoT series... I decided to fish out a previously unused Raspberry Pi camera module that I'd had for some years and finally give it a go.  A web front end to display images seemed like an obvious choice.

Here's what my initial Raspberry Pi camera setup looked like.  I used a [Raspberry Pi 3B](https://www.raspberrypi.com/products/raspberry-pi-3-model-b/) (I had one around, any model with the camera interface will work), the [Raspberry Pi Camera Module 2.1](https://www.raspberrypi.com/products/camera-module-v2/) and a [case from Adafruit](https://www.adafruit.com/product/2256).  I held the camera onto the case using electrical tape.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_photos_camera_setup.jpg" class="figure-img img-fluid" alt="The camera set up on the Raspberry Pi.">
  <figcaption class="figure-caption text-center">The camera set up on the Raspberry Pi.</figcaption>
</figure>

This was the ninth project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  I aim to work on this some more and enhance it with search capabilities, sensors and who knows what else!  When I do I'll be sure to make some more videos and update this article and the codebase.

Here's the video run through of the project that I did as a live stream in April 2023:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/OTDZIK55DX0?start=23" allowfullscreen></iframe>
</div><br/>

A full explanation of how the project works can be found by watching the video and/or reading the README files in the project's [GitHub repository](https://github.com/simonprickett/redis-pi-camera).  Here's a high level overview...

## Architecture

TODO other stuff...

## Capturing Images with the Raspberry Pi and Storing them in Redis

TODO...

In a future live stream I'd like to add one or more sensors to the Raspberry Pi and use them to trigger the camera.  Rather than a picture being taken every so many seconds, the Pi would respond to events such as a button press or a noise... depending on which sensors I choose to use.  I might be able to use the sensor to generate additional metadata... for example capturing some idea of the magnitude of a noise that triggered the sensor.

## Displaying the Images with a Web Front End

I'm terrible at CSS, so I always use a lightweight framework when making a web front end.  I nearly always go with [Bulma](https://bulma.io/) as there's no build step needed and it's really well documented - allowing me to get on with building stuff and not wasting time on the minutiae of layout.

There are two components to the "front end" - a HTML/CSS/JavaScript interface to display the images and their metadata in the browser, and a server that handles talking to Redis to get the data/images when the JavaScript running in the browser asks for them.  This is a simple project, so I didn't feel the need for a JavaScript framework.  For the server, I chose Python and the [Flask framework](https://flask.palletsprojects.com/) as it's simple to use and many of you may already be familiar with it.

Here's a screenshot of the finished front end showing a few images captured from the Pi.  I hope to improve the image quality in a future update to this project - I'll move to using the [Raspberry Pi Camera Module 3](https://www.raspberrypi.com/products/camera-module-3/) which has autofocus built in.  I'm hoping that works well.  I originally used the v2.1 camera module as it was what I had on the shelf at the time. 

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_photos_server_component_running.png" class="figure-img img-fluid" alt="The front end showing a few captured images.">
  <figcaption class="figure-caption text-center">The front end showing a few captured images.</figcaption>
</figure>

As this was a basic demo to prove that the image data could go into and out of Redis safely, I didn't build any pagination or clever lazy load features into the front end or Flask server.  I might add those later as part of future live streams.

TODO other stuff... how server works then the JavaScript...

# Try it Yourself!

If you have a Pi and a camera module, this project should be fairly simple to set up and get running on your own hardware.  I've made the [source code available on GitHub](https://github.com/simonprickett/redis-pi-camera), feel free to use is for whatever you like!  I've provided instructions for how to set up each component and get a Redis instance in the cloud or using Docker.  I'd love to see what you make, [drop me a line](/contact/) if you come up with something new.

---
*Main photograph NASA Sofia Boeing 747SP Telescope from [Wallpaper Flare](https://www.wallpaperflare.com/white-nasa-airplane-stratosphere-dlr-boeing-747sp-infrared-telescope-wallpaper-sedrf/download).*

