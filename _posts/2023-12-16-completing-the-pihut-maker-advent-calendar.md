---
layout: post
title:  "Completing the PiHut Maker Advent Calendar"
categories: [ IoT, Coding, Raspberry Pi, Python ]
image: assets/images/advent_main.jpg
author: simon
---
Last year I noticed that UK Raspberry Pi reseller The Pi Hut had made a really nice looking "12 Projects of Codemas" maker advent calendar.  It was a large box containing 12 smaller ones, each containing parts that built up various Raspberry Pi Pico projects.  I missed out on this last year, so got organized this time around and bought one relatively early in the seasonal shopping window.

Rather than just play around with this myself for my own entertainment, I decided to make live stream videos of me doing each day's project... and to do them all with no prior knowledge: The first time I look at the instructions or know what's in each day's box is when I open it on the stream.

If you'd like to buy your own box, The Pi Hut do two versions... the "Maker" one that I have plus a second one that focusses more on LEDs.  I won't link to the products directly as I'm not sure if they're in the store year round, but they should be easy to find from the store home page [here](https://thepihut.com/).  They cost £40.00 and contain everything you need other than a computer to edit and run the code from.

Here's what the box looks like with the sleeve on.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/advent_kit_1.jpg" alt="The PiHut Maker Advent Calendar in its box">
  <figcaption class="figure-caption text-center">The PiHut Maker Advent Calendar in its box.</figcaption>
</figure>

Removing the sleeve reveals a really nice arrangement of numbered boxes:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/advent_kit_2.jpg" alt="The 12 Projects of Codemas!">
  <figcaption class="figure-caption text-center">The 12 Projects of Codemas!</figcaption>
</figure>

There are no printed materials provided, comprehensive instructions can be found online [here](https://thepihut.com/pages/maker-advent-2022-guides) - this is smart as it allows for easy updates as needed to fix errata / incorporate suggestions from the community.

This is what the project looked like at the end of day five... we had a Raspberry Pi Pico H connected to a breadboard and running MicroPython.  It's currently got three LEDs attached to it as well as a potentiometer and buzzer.  The three buttons added as part of day two had been removed at this point.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/advent_project_day_five.jpg" alt="The project state at the end of day five">
  <figcaption class="figure-caption text-center">The project state at the end of day five.</figcaption>
</figure>

Here's the videos I made... beginning of course with a bit of an introduction and day one's box: setting up the Pi Pico H, installing MicroPython and running some tests.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/HTT3DYCTJxk?si=lQwsuMj7WQvhq0Ti&start=21" allowfullscreen></iframe>
</div><br/>

Day two's box contained some LEDs, so I wired those up and learned how to use GPIO pins as outputs from MicroPython.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/5awZ40iZFl8?si=YLyjOT8UxqHDfFUS&start=23" allowfullscreen></iframe>
</div><br/>

{% include coffee-cta.html %}

Day three introduced the use of GPIO pins for inputs by adding three buttons and associated wiring.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/TEizkk5kzgU?si=gzD7IXe7AfvqS394&start=23" allowfullscreen></iframe>
</div><br/>

In the first video covering two days, I tackled days four and five together.  I mis-wired the potentiometer for day four which resulted in a smaller range of values than expected, then added a buzzer for day five.  After some help from the audience on Twitter, I've fixed the potentiometer wiring and will quickly revisit that in the next episode.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/c19bse5KMwY?si=FQ035eMD6jTInWGg&start=22" allowfullscreen></iframe>
</div><br/>

Thank you!!

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sorry about your potentiometer issues. It&#39;s tricky to see, but I think you may have its signal wire connected to the Pico&#39;s pin 33, which is GND. It should be connected to pin 32 (GP27). Hope this helps. Good luck!</p>&mdash; v.edgy (the dot is silent) (@vdotedgy) <a href="https://twitter.com/vdotedgy/status/1736717420247519486?ref_src=twsrc%5Etfw">December 18, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

While completing days six and seven I revisited day four to show the potentiometer working properly.  For day six we learned about a light sensor and in day seven we created a motion alarm with a mini PIR sensor...  sadly this video suffers from some stalling of the cameras and desktop sharing that I'm putting down to experimenting with using the Firefox browser for StreamYard... I won't do that again, it's back to Chrome for future streams.  This is partly why I'm doing this series - shake down and refine the streaming setup.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/7_OI6ltq6Ks?si=jQ8lYmw5PKyKHVFC&start=24" allowfullscreen></iframe>
</div><br/>

I tackled days eight, nine and ten in the same stream so that I could finish all twelve projects by Christmas.  On these days, we looked at a temperature sensor, a tilt sensor and made a game with a break beam sensor.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/N_1iCx3V7Nw?si=VnklMw-jjUWERmnj&start=23" allowfullscreen></iframe>
</div><br/>

In day 11 we introduced an OLED display and made a game with it. Day 12 was all about Neopixel addressable LEDs.

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/FaHv7xBI2Og?si=NIdmrOZYfUNOE4WP&start=20" allowfullscreen></iframe>
</div><br/>

This was a really fun project to do and I think the Maker Advent Calendar represents good value for money with well written instructions and a nicely planned story arc as you go from day to day.  I bought this with my own money, I wasn't sponsored by The PiHut or anyone else to endorse this.

## Current Live Streaming Setup

I got asked on Twitter how I was making these live streams... here's the ever evolving setup I use with links to each product / item.  

I use [StreamYard](https://streamyard.com/) as the broadcast "studio" software.  It runs entirely in the browser and handles the screen layout, support for the multiple cameras I am using and the titles you see on screen during the stream as well as the countdown before it.  It allows easy desktop sharing and enables remote guests to join the stream simply by clicking a URL I share with them.  I've used StreamYard a lot in the past, and highly recommend it. I use the "Professional" subscription to get 1080p streaming and multiple camera views.  If you have a laptop with microphone and camera, StreamYard is all you need to get going with live streaming.  Everything else on this list could be considered optional / nice to have.

StreamYard is configured to broadcast to my Twitter, LinkedIn, YouTube and Twitch accounts.  Configuring these is extremely straightforward.  I choose to stream to all four of my configured destinations but could mix and match as needed.  Streamyard brings audience comments made during the stream to a central location where I can pop them up on screen to share with the audience.  It also gives me a central place from which to reply to the audience in real time.

I am just beginning to dabble with automation on the stream, so far I configured Ko-Fi to comment in the Twitch stream every 30 minutes with a call to action to buy me a coffee.

The main camera (the one you see me through) is a [Logitech Brio 4K Stream](https://www.logitech.com/en-gb/products/webcams/brio-stream-4k-hd-webcam.960-001194.html).  It's attached to my iMac (27" 2019 Intel 5k model, not particularly high spec but I do have 128Gb RAM) by a USB cable.  The secondary camera (usually showing things on the desk) is an older [Logitech C922](https://www.logitech.com/en-gb/products/webcams/c922-pro-stream-webcam.960-001088.html), also attached to the iMac by a USB cable.  The secondary camera is currently on a small tripod - I'd like to move this to an overhead boom / arm setup sometime.

I use a [Blue Yeti Nano](https://www.logitech.com/en-gb/products/streaming-gear/yeti-nano-usb-microphone.988-000205.html) microphone.  It's on a boom arm and attaches to the iMac via yet another USB cable (so I use a USB hub as there's so many things - my mouse and keyboard are also USB and I usually need a USB to Micro USB cable to power the Pico / other IoT thing I am working with on stream).  The microphone has got a foam pop filter over it, and I run it in cardioid mode to try and control the direction that it picks up sounds from.  I feel the microphone is the weak part of the current setup - either the product or the placement of it.  In early videos for this series you'll notice my sound trailing off when I'm looking over at the second camera to the side of me.  I've changed the microphone placement and input gain settings to try and help with this and will continue to work on it.

I also have a [Stream Deck Mini](https://www.elgato.com/uk/en/p/stream-deck-mini) which is an 8 key programmable macro pad.  I had some issues using this to control StreamYard, mostly related to switching to the Firefox browser for one stream to try it out.  I'll get this working with Chrome in the near future. I've had a lot of success using this before to switch between applications when sharing desktop (for example the terminal, VSCode, browser, full-screen Keynote slides) and highly recommend it.  They make larger versions with basically more buttons, but I'm happy with this cheapest one.  It connects to the iMac by yet another USB cable.

I'll add some pictures / screenshots of my setup as I revisit this page to add the remaining live stream video embeds.  I'll also add details of the freestanding lights and second monitor that I use.

Hope you enjoyed this - if you'd like to see more of this sort of thing or want to share your projects with me I'd love to hear from you  ([Contact me here](/contact)).

--- 
Main photograph from [pxhere.com](https://pxhere.com/en/photo/1069156).
