---
layout: post
title:  "Making a Game with a Raspberry Pi, LED Arcade Button, Buzzer and Python"
categories: [ Raspberry Pi, Python, Technology, Coding ]
image: assets/images/pi_led_arcade_main.webp
author: simon
---
This is a project I'd wanted to do for a while, and finally got motivation and time to make headway with!  As the current social distancing measures have made in person Meetups impossible to organize, I've benefitted greatly from being able to virtually attend sessions that I would normally be unable to.  My favourite of these has been the [Ladies of Code London](https://www.meetup.com/Ladies-of-Code-UK/) "Get on With It" project sessions... these are a bring your own project format organized through Zoom calls, Google meet and Slack.  Basically we get together, talk about what we're going to do, get on with it for a bit and check back in.  It's a fun, supportive environment and has been well worth some seriously early weekend wake ups to join at 6 and 7am Pacific time.  If you want to read more about how this works, Suze [wrote a blog post about it here](https://suze.dev/blog/2020/05/10/get-on-with-it/).

At one of these sessions, I said I was going to build a pointless object using a Raspberry Pi, an Adafruit LED arcade button that I had left over from my [Arduino Task Tracker project](https://simonprickett.dev/building-a-task-tracker-with-arduino-and-led-arcade-buttons/), and a buzzer that I also had in my parts cupboard.  Over the course of two sessions, I did some soldering to attach wires to the button and buzzer, connected them up to the Pi and mounted the button on top of a plastic soup container that I had.  Here's what the end result looked like:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_led_arcade_assembled.webp" class="figure-img img-fluid" alt="Assembled Pi Project">
  <figcaption class="figure-caption text-center">Assembled Pi Project.</figcaption>
</figure>

After one Get on With It session, I had a truly pointless object... if you pressed the arcade button, it would flash however many times it had been pressed in total... like this:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/olSWVYz0dvE" allowfullscreen></iframe>
</div><br/>

I'd also learned that the red and green versions of these buttons don't work with a Pi as they really need 5v power, and Pi GPIO pins are 3.3v.  Blue and yellow buttons work well though - so I'll save the red and green ones for future Arduino projects.

{% include coffee-cta.html %}

During a subsequent weekend session, I decided to get the soldering iron out again and add a piezo buzzer and make some sort of game out of this.  The idea was it would be some sort of Russian Roulette type thing... pressing the arcade button would cause it to flash and if you were unlucky, the buzzer would sound and you'd be the loser.  Here's a second video I made with a code walkthrough showing how that worked:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/oazOvfxgGPw" allowfullscreen></iframe>
</div><br/>

If you want to check out the source code and where to get the parts I used, [check out my GitHub repo for this project](https://github.com/simonprickett/pi-arcade-button-led).  I also made the code run as a systemd service on the Pi, so I don't have to SSH into a soup container to start it :)  If you want to know how to do that, [check out my previous article on the subject](https://simonprickett.dev/writing-a-systemd-service-in-node-js-pi/).

This was a fun, quick project to throw together and I enjoyed using the food container as an impromptu enclosure.  Check back soon as I'm going to try and build something similar with an Arduino and maybe a PIR sensor so it's following the current trend for no touch solutions!

---

Are you making fun stuff with single board computers and random bits of hardware?  I'd love to hear about it - get in touch via the [Contact page](https://simonprickett.dev/contact/).