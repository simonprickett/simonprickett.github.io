---
layout: post
title:  "Taking Pictures with Raspberry Pi and Redis"
categories: [ Redis, Raspberry Pi, Python ]
image: assets/images/pi_photos_redis_main.jpg
author: simon
---
TODO this needs to be the introductory paragraph that contains some meaningful text and all that stuff.  Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.

TODO project overview...

Here's what my initial Raspberry Pi camera setup looked like.  I used a [Raspberry Pi 3B](https://www.raspberrypi.com/products/raspberry-pi-3-model-b/) (I had one around, any model with the camera interface will work), the [Raspberry Pi Camera Module 2.1](https://www.raspberrypi.com/products/camera-module-v2/) and a [case from Adafruit](https://www.adafruit.com/product/2256).  I held the camera onto the case using electrical tape.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_photos_camera_setup.jpg" class="figure-img img-fluid" alt="The camera set up on the Raspberry Pi.">
  <figcaption class="figure-caption text-center">The camera set up on the Raspberry Pi.</figcaption>
</figure>

This was the ninth project in my [Things on Thursdays IoT live streaming series](/things-on-thursdays-livestreams/).  I aim to work on this some more and enhance it with search capabilities... when I do I'll be sure to make some more videos and update this article and the codebase.

Here's the video run through of the project that I did as a live stream in April 2023:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/OTDZIK55DX0?start=23" allowfullscreen></iframe>
</div><br/>

A full explanation of how the project works can be found by watching the video and/or reading the README files in the project's [GitHub repository](https://github.com/simonprickett/redis-pi-camera).  Here's a high level overview...

## Architecture

TODO other stuff...

## Capturing Images with the Raspberry Pi and Storing them in Redis

TODO...

## Displaying the Images with a Web Front End

TODO...

Here's a screenshot of the front end showing a few images captured from the Pi.  I hope to improve the image quality in a future update to this project - I'll move to using the [Raspberry Pi Camera Module 3](https://www.raspberrypi.com/products/camera-module-3/) which has autofocus built in.  I'm hoping that works well.  I originally used the v2.1 camera module as it was what I had on the shelf at the time. 

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_photos_server_component_running.png" class="figure-img img-fluid" alt="The front end showing a few captured images.">
  <figcaption class="figure-caption text-center">The front end showing a few captured images.</figcaption>
</figure>

TODO other stuff...

# Try it Yourself!

If you have a Pi and a camera module, this project should be fairly simple to set up and get running on your own hardware.  I've made the [source code available on GitHub](https://github.com/simonprickett/redis-pi-camera), feel free to use is for whatever you like!  I've provided instructions for how to set up each component and get a Redis instance in the cloud or using Docker.  I'd love to see what you make, [drop me a line](/contact/) if you come up with something new.

---
*Main photograph NASA Sofia Boeing 747SP Telescope from [Wallpaper Flare](https://www.wallpaperflare.com/white-nasa-airplane-stratosphere-dlr-boeing-747sp-infrared-telescope-wallpaper-sedrf/download).*
