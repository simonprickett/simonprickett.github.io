---
layout: post
title:  "What's on BBC Radio with Pimoroni Pico Display Pack 2"
categories: [ IoT, Coding, Raspberry Pi, Python ]
image: assets/images/bbcradio_main.jpg
author: simon
---
At home in our kitchen we have an Amazon Echo Show device that we use for a few things.  When cooking, it's handy to be able to yell out "Alexa, set timer 15 minutes" so that we can keep track of how long something needs.  The primary thing we use the Echo Show for is accessing digital / online radio stations.  

We spend most of our time listening to a few BBC Radio stations on the device.  This uses the BBC Sounds application / skill for the device.  This is mostly great and allows us to listen to live broadcasts, pause and rewind them and ask for content from the large collection of previous shows that BBC Sounds offers.

Something that really annoys me about this otherwise excellent way of listening to the radio is that the screen shows which station we're on but doesn't show the song title and artist for the song that's currently playing.  This means we spend an awful lot of time using services like Shazam to have our phones listen to the Echo Show output and tell us what's playing.

This seems like a big omission that should be easy for the BBC to fix.  They have the information available, as I can see it on the BBC Sounds desktop web browser implementation.  Here's what it looks like on the Echo Show:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/bbcradio_echo_six_music.jpg" alt="What's playing on BBC 6 Music?  Who knows!">
  <figcaption class="figure-caption text-center">What's playing on BBC 6 Music?  Who knows!</figcaption>
</figure>

Other radio stations can get this right, for example when we're listening to an Absolute Radio station they almost always display the current song title and artist:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/bbcradio_echo_absolute.jpg" alt="Absolute Radio 00's manages to show what's playing just fine!">
  <figcaption class="figure-caption text-center">Absolute Radio 00's manages to show what's playing just fine!</figcaption>
</figure>

I decided this was something I wanted to fix for myself, by adding a small companion screen/device that can sit next to the Echo Show, pull the information from the BBC somehow and display it.  So I made something that allows us to switch between the four BBC stations that we mostly listen to and which will show us the missing information... we'll see how this works next, but first here's a demo (this video has no sound to avoid copyright strikes on YouTube):

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/BcLZgDzzvOg?si=VotwlJyqK1PsAm-2" allowfullscreen></iframe>
</div><br/>

TODO some other stuff... 

TODO some other pictures...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/carbonintensity_kit.png" alt="The hardware needed to run this example.">
  <figcaption class="figure-caption text-center">The hardware needed to run this example.</figcaption>
</figure>


## Resources

Here's some things you'll need to buy / download to build your own version of this project:

* [Raspberry Pi Pico W](https://shop.pimoroni.com/products/raspberry-pi-pico-w?variant=40454061752403) - get the version with headers pre-soldered if you can, otherwise you'll need to buy [appropriate headers](https://shop.pimoroni.com/products/pico-header-pack?variant=32374935715923) and solder them on yourself.
* TODO other stuff...

## Keep in Touch!

If you build one of these and use it, I'd love to hear from you - get in touch via my [contact page](/contact) or on whatever [Twitter](https://twitter.com/simon_prickett) calls itself at the time of reading.

--- 
Main photo "Stack of Vintage Radios in an Electronics Store" by [Berna Elif on Pexels](https://www.pexels.com/photo/stack-of-vintage-radios-in-an-electronics-store-18449793/).
