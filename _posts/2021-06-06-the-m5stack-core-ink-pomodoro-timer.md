---
layout: post
title:  "The M5Stack Core Ink Pomodoro Timer"
categories: [Arduino, M5Stack, C, IoT, Programming ]
image: assets/images/m5stack_pomodoro_main.jpg
author: simon
---
The Pomodoro Technique is a time management method developed by Italian Francesco Cirillo in which a timer is used to break work into time periods separated by breaks.  Each time period is called a pomodoro - Cirillo used a tomato shaped kitchen timer, and "tomato" in Italian is "pomodoro".

[M5Stack](https://m5stack.com/) is a company that makes a fascinating range of modular IoT devices and I'd wanted to try one for a while.  I decided to start with their [Core Ink](https://docs.m5stack.com/en/core/coreink) product.  I bought mine from [Pimoroni](https://shop.pimoroni.com/products/m5stack-esp32-core-ink-development-kit-1-54-elnk-display), M5Stack [also sell them direct](https://shop.m5stack.com/collections/m5-core/products/m5stack-esp32-core-ink-development-kit1-54-elnk-display).

This is a really nice self-contained unit with some buttons, an e-ink screen, a buzzer, rechargable battery and wifi capabilities.  It all fits inside a really nice case and looks like this:

<div class="text-center">
  <figure class="figure">
    <img src="{{ site.baseurl }}/assets/images/m5stack_pomodoro_eink.png" class="figure-img img-fluid" alt="The M5Stack Core Ink Device">
    <figcaption class="figure-caption text-center">The M5Stack Core Ink Device.</figcaption>
  </figure>
</div>

I decided to use the Core Ink to make a Pomodoro timer as a gift to a loved one,  programming in C using the Arduino IDE.  I got my code onto it using the supplied USB C cable.  Here's what the final product looks like (sped up in the video): 

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/8_YdzONjkVY" allowfullscreen></iframe>
</div><br/>

As you can see in the video, my version of the timer works like this...

* Press the top button on the device to start it.
* The buzzer sounds.
* A 25 minute work period starts, with the display counting down the 25 minutes.
* The buzzer sounds, heralding a short 5 minute break... the display counts down the 5 minutes.
* The buzzer sounds, and another 25 minute work period starts...
* After 4 x 25 minute work periods separated by 5 minute breaks, there's a longer 10 minute break.
* After the 10 minute break, the cycle begins again.
* At any point, pressing the top button again resets the timer to the idle state.
* Pressing the power button displays a goodbye message and turns the device off.

## Coding a Pomodoro Timer with the Arduino IDE

How does this work?  At a high level, the code has the same two entry points as any other Arduino sketch:

* `setup()`: Code that runs once when the device is initially powered up.
* `loop()`: Code that runs continuously in a loop once `setup()` has finished.

M5Stack provide an SDK for each of their devices, in the form of an Arduino library.  This provides functions that make working with the device's display, buttons and buzzer straightforward.  [Example code is provided](https://github.com/m5stack/M5-CoreInk), and I used this to learn about programming the device.  I won't focus on how to use the SDK in detail here, we'll concentrate mostly on the logic for the Pomodoro timer instead.

The timer has three states, so I declared constants for each of those:

* `STATE_IDLE`: Not currently in use, waiting to begin!
* `STATE_WORKING`: In one of the work periods.
* `STATE_BREAK`: In one of the break periods, which could be the shorter or longer break.

I'm storing the current state in a global variable named `currentState`, whose initial value gets set to `STATE_IDLE`.

### Setup

The `setup()` function looks like this:

<script src="https://gist.github.com/simonprickett/6e5134756203fdfb96d7602f558cd185.js"></script>

This initializes the M5 SDK, clears the screen and creates a drawing area on it, then displays an initial "Press to start message".  Finallly, it beeps the buzzer once.  After this finishes executing, the `loop()` function begins executing continuously.

If you want to see how drawing text on the screen works, [check out the full source code on GitHub](https://github.com/simonprickett/m5stack-pomodoro).

### Loop

Once `setup()` has completed, the device executes the code in the `loop()` function indefinitely. I chose to write my `loop()` function so that it works roughly like this for each iteration:

* Was the button on top of the device pressed?  If so, handle that and take actions depending on the what state the `currentState` global variable says we're in... TODO

## Try it Yourself!

Hope you enjoyed reading about this - if you get a Core Ink and want to try this out, I've put the [code on GitHub](https://github.com/simonprickett/m5stack-pomodoro) and you're free to use it or modify it for your own purposes.  I'd love to see what you build!

---

*(Main Photo by [Rauf Allahverdiyev](https://www.pexels.com/@rauf-allahverdiyev-561368) from Pexels).*