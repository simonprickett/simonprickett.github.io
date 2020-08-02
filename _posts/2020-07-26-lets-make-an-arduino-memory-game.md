---
layout: post
title:  "Let's Make an Arduino Memory Game"
categories: [ Arduino, C, IoT, Programming ]
image: assets/images/arduino_memory_main.jpg
author: simon
---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque finibus congue lacus sit amet molestie. Etiam mauris elit, posuere tempus elementum a, porta nec purus. Nunc in metus cursus, consectetur turpis id, maximus ante. Cras pharetra felis vitae risus porta tincidunt. Cras lacinia magna sem, at elementum justo ornare vel. Duis aliquam dapibus velit sit amet pulvinar. Praesent pellentesque velit tincidunt volutpat vehicula. Nulla cursus mauris in convallis condimentum. Curabitur vehicula scelerisque laoreet.

Suspendisse posuere cursus tellus quis hendrerit. Aliquam ultrices urna a lorem bibendum tincidunt. Ut ut nunc suscipit, tincidunt mauris sed, sagittis urna. Cras ornare in lorem vel bibendum. Quisque tempus urna nisi, in aliquam erat placerat nec. Curabitur sed pharetra ex, vitae dignissim tortor. Etiam tincidunt luctus accumsan. Nam laoreet sem sit amet nisi fringilla pellentesque. Vestibulum vitae lacinia metus. Duis ac sem vitae ex tempus elementum.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/arduino_memory_button_flash.gif" class="figure-img img-fluid" alt="Adafruit 24mm LED Arcade Button">
  <figcaption class="figure-caption text-center">Adafruit 24mm LED Arcade Button.</figcaption>
</figure>

TODO:

* Intro and pointer to some video of the original game working?
* Or just play the original online here: https://kidmons.com/game/simon-memorize/
* Demo video of the finished product
* First build, Arduino Uno and screw shield
* Arduino Uno (Elgoo compatible) https://www.amazon.com/ELEGOO-Board-ATmega328P-ATMEGA16U2-Compliant/dp/B01EWOE0UU/ref=sr_1_2_sspa?dchild=1&keywords=arduino+uno+elegoo&qid=1596329060&sr=8-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExS0MwRTZNVVRDOFoxJmVuY3J5cHRlZElkPUEwNjM0NDE4M0NMR1pLTEZLMTM1TiZlbmNyeXB0ZWRBZElkPUEwNDgzODMzMUlIN1I4WVRSM0w1UiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=
* Screw Shield https://www.amazon.com/Aideepen-Assembled-Prototype-Expansion-Bareboard/dp/B01JFQQXRS/ref=sxts_sxwds-bia-wc-p13n1_0?cv_ct_cx=arduino+screw+shield&dchild=1&keywords=arduino+screw+shield&pd_rd_i=B01JFQQXRS&pd_rd_r=48c83c42-0975-4833-ae31-22da680bcf64&pd_rd_w=kc21B&pd_rd_wg=K6XXh&pf_rd_p=13bf9bc7-d68d-44c3-9d2e-647020f56802&pf_rd_r=Y48613AF3V29S050WPDQ&psc=1&qid=1596329100&sr=1-1-791c2399-d602-4248-afbb-8a79de2d236f
* Adafruit 24mm LED arcade buttons in different colors, green one - https://www.adafruit.com/product/3433
* Adafruit arcade button quick connect wires https://www.adafruit.com/product/1152
* Enclosure build - https://www.amazon.com/Cantex-5133705-PVC-Junction-Box/dp/B009EBNLGG
* Second build, Adafruit Metro Mini and soldered wires to save space
* Metro Mini -- https://www.adafruit.com/product/2590
* 5v logic required for the LEDs in the arcade buttons as some won't work with less than 5v.
* TODO check if I used ground wires?

## Software

* TODO software intro, debouncer library summary (check other articles)
* TODO where does tone come from?
* TODO overall description of the attact phase and the game phase
* TODO use `currentDelay` to make game go faster as they get further, and reset at "win"
* TODO remove count and replace with time using Arduino `millis` function (https://www.arduino.cc/reference/en/language/functions/time/millis/)
* TODO prevent overflow at line 145
* TODO update gist below with any code changes...
* TODO note we didn't build a win scenario as we're assuming nobody will ever win, maybe just reset to 1?

<script src="https://gist.github.com/simonprickett/7e1b822e570b5de14f493322ce38d19f.js"></script>

* TODO break down how the code works...

Thanks and outro...

---

Something else goes here!