---
layout: post
title:  "Building a Visual Bloom Filter with Raspberry Pi, Python and Unicorn Hat"
categories: [ Python, Raspberry Pi, IoT, Programming ]
image: assets/images/bloom_main.jpg
author: simon
---
Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arcade_keyboard_button_microswitch.jpg" class="figure-img img-fluid" alt="Arcade button with microswitch">
  <figcaption class="figure-caption text-center">Arcade button with microswitch - needs a clean!</figcaption>
</figure>

<script src="https://gist.github.com/simonprickett/640ef62e7bcd0ae1ba68e8f1c5574cf3.js"></script>

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/3G6DJA5bpWE" allowfullscreen></iframe>
</div><br/>

## Stuff You Need to Make One

All of the software's free, but you will need to buy a Raspberry Pi of some sort, a Unicorn Hat and ideally a case that can diffuse the LEDs as they are super bright (in the video demo I have them set to 19% brightness which is as low as they can go and still be visible with the colors I'm using).

* [Flask](https://flask.palletsprojects.com/en/1.1.x/) (API framework).
* [Murmur3 hashing](https://pypi.org/project/murmurhash3/) (for hash functions).
* [Bulma](https://bulma.io/) (front end CSS).
* [Pimoroni Unicorn Hat library for Python](http://docs.pimoroni.com/unicornhat/).
* [Pimoroni Unicorn Hat](https://shop.pimoroni.com/products/unicorn-hat) - there is also a more expensive HD version with more pixels if you want a bigger array for your filter!
* [Raspberry Pi Model A+ v1](https://www.raspberrypi.org/products/raspberry-pi-1-model-a-plus/) (any 40 pin GPIO Pi that can take HAT boards will work, which is most of them - the model I used is long obsolete I just had one kicking around).
* [USB wifi dongle for Raspberry Pi](https://www.adafruit.com/product/814) (A doesn't come with built in wifi - other models have this onboard - find these USB dongle on Amazon or eBay just make sure to get one that is known to work with the Pi / Raspbian OS).
* [Adafruit Smoked Plastic Pi case](https://www.adafruit.com/product/2361) - get the separate smoked lid too as this is what acts as a nice LED diffuser.  This is the case for A sized Pi models, they also sell them for the larger Pi models.

## Thanks!

Thanks for reading, hope you found this fun and feel free to tell me if I got anything wrong or could improve on it!  I've put my code into a [GitHub repository](https://github.com/simonprickett/visual-bloom-filter-for-pi) that you're free to use to build your own, or modify to do something else.

---

Pimoroni also make a [Unicorn Hat HD](https://shop.pimoroni.com/products/unicorn-hat-hd) with 256 LEDs.  If you'd like to see me try with one of those you can always [buy me a coffee](https://www.buymeacoffee.com/6Iv4kzj) and I'll put the proceeds towards buying one!  If you've got a Raspberry Pi Zero and want to go small, there's also a [Unicorn pHAT](https://shop.pimoroni.com/products/unicorn-phat).