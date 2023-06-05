---
layout: post
title:  "Flip Dot Displays with Raspberry Pi"
categories: [ IoT, Coding, Raspberry Pi, JavaScript, Python ]
image: assets/images/flipdot_main.jpg
author: simon
---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget euismod ex, scelerisque egestas libero. Suspendisse cursus convallis arcu quis mollis. Pellentesque suscipit, leo eu tristique mollis, lorem leo convallis sapien, sed consectetur erat elit at dolor. Fusce at felis ut neque finibus interdum. Morbi posuere lacus non dolor venenatis, quis suscipit nunc venenatis. Mauris non dolor pellentesque, mattis nisi ac, malesuada ligula. Nam sollicitudin, nibh ut lobortis posuere, dolor velit egestas lorem, in pulvinar elit augue eget eros.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/plane_tracking_flipdot.gif" alt="Animated GIF of a flip dot bus sign showing flight information">
  <figcaption class="figure-caption text-center">The Flip Dot Display Front End.</figcaption>
</figure>

Here's the video of the talk:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/xSsINHL9COE?start=12" allowfullscreen></iframe>
</div><br/>

This talk is about flip dots and managing a flip dot display with a Raspberry Pi.  Before we go any further what we can do is take a look at the thing behind me - it is a flip dot display.  For scale, there's a Raspberry Pi 4 in a box - so it's quite big.  It's also extremely heavy, because each one of these dots it electromechanical.  It's not using LEDs.  It weighs quite a lot, it's difficult to bring to London and navigate the tube, so it's staying up here in Nottingham and we're doing this remotely.

What does it do?  Let's see if we can make it do something... 

TODO GIF FROM VIDEO AROUND 1:05

It basically does anything you want - they are usually, or were, used in digital signage.  They make a lovely noise when they change and the other thing that they've got going for them is that when they're not changing they don't really consume any power.  There's no lights involved here, these are very bright on one side and black on the other and it's all done with electromagnets.

Before we play around with this some more, we need to go look at "What are these things and where do they come from?".

To answer this, we need to talk about buses a little bit because this thing behind me came out of a bus.  Around the year 2000 it was fitted into a bus... that bus was later scrapped, I'm not sure when.  It was parted out and I was able to buy the sign.  The purpose of these signs is that they generally serve as destination blinds in buses.  They tell you where the bus is going to go, or what the next stop is or whatever.

They were popular for a while because they have a couple of properties we'll look at in a minute, but historically these were just blinds...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_buses_destination_blinds.png" alt="Bus with destination blind">
  <figcaption class="figure-caption text-center">A bus with a destination blind.</figcaption>
</figure>

They were just bits of fabric with the destinations written on, and the driver would wind a handle and around would come the next destination.  There's a few buses in this presentation - they're all Nottingham-based ones which is where I grew up.  The one above is one that used to take me to school.

Buses that you see these days don't have flip dot displays....

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_buses_led_matrices.png" alt="Buses with LED matrix destination displays">
  <figcaption class="figure-caption text-center">Buses with LED matrix destination displays.</figcaption>
</figure>

What you see on buses now is LED matrices which are essentially like the sort of things you can buy in maker kits - they have LEDS which are usually a single colour.  In vehicles they have this high visibility property and unlike flip dots they are silent and do require constant power (albeit very low power these days).  Modern buses all use LEDs.

Somewhere in between destination blinds and LEDs we had a period where things were a bit cooler... and we had what was called a split flap display:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_split_flap_display.png" alt="A split flap display">
  <figcaption class="figure-caption text-center">A split flap display.</figcaption>
</figure>

You might have seen these in Waterloo Station sometime ago although they're long gone now.  Frankfurt Airport still has them. They're those displays where, when something changes, it makes this amazing clacking sound and the letters all spin around and then is settles down to the new state.  These are really cool - you can make them, you can also buy them from certain maker companies too.  However, they're really expensive because each letter has got the whole alphabet in there plus all of the numbers then some punctuation and anything else you wanted to put on the screen.

Split flap displays were kind of fun and expensive, and also had the property of no power consumption when they aren't updating.  Inbetween split flap displays and LEDs there were these flip dot things that had their day.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_flipdot_nyc_bus.png" alt="Bus with flip dot display in New York City">
  <figcaption class="figure-caption text-center">Bus with flip dot display in New York City.</figcaption>
</figure>

This was the hardest picture to source for this whole presentation. "Can I find a picture of the flip dot display installed in a bus?"  The answer is generally "no" because they seem to have existed for a moment in time and then stopped.  You might also have seen flip dots in use as clocks on railway platforms.  The bus we're looking at here is in New York - it's using a flip dot display with a back light.  My sign here also has a backlight but you don't really need it unless it's very dark outside because the dots themselves are so bright.

As happened to the bus that my sign came from, a lot of these buses got retired and broken up.  The flip dot signs from them are having a second life in the maker community for a couple of reasons:

One because they have this really satisfying mechanical property: they make noise when they change.  So you don't need to annouce that something's about to change, you just change it and it makes a clack clack noise as the sign updates as we've already seen and will see some more of later.

The other reason is because the company that made them put out a relatively decent amount of information about them and did so in PDF files, so people have reverse engineered how to operate these and how to wire them up.

They are fairly simple - it takes 24 Volt power (as provided in a vehicle) and that's about all.  We'll look at the data protocol in a minute.

So flip dot signs are having a bit of a second life.  In the big scheme of things, these signs are not that expensive as they are mostly from scrapped buses.  There are places to buy "new old stock" signs that were never fitted to a bus in the first place - they're just very old and have been sat on a shelf.

How does the sign work?

TODO GIF OF SLOW FLIP MECHANIC
<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_TODO.png" alt="TODO alt text">
  <figcaption class="figure-caption text-center">TODO CAPTION.</figcaption>
</figure>

Watch the loop for a moment - it's been slowed down quite a lot.  What happens is that each dot in the sign, or the matrix, has a very very bright side and a very very dark side.  Each dot is on a hinge or pole at the top and bottom and there's electromagnets / a solenoid in each one.  To control these, you tell each one to turn on or off and it changes the magnets around causing the dot to flip which is why you have this noise...  it is actually turning and banging into the other side when it finishes.

This is also why it's "object permanent" if you like.  You can turn it off and it will stay where it was.  You could turn it upside down, ship it to someone else using UPS or whatever and it's still going to be in the same state.

That's how it works, and this is a blown up diagram that I made of what they look like:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_mechanics.png" alt="Diagram showing flip dots">
  <figcaption class="figure-caption text-center">Flip dots.</figcaption>
</figure>

Each one is just this two coloured thing and it sits on a rod and behind there there's a couple of electromagnets.  But, there's lots and lots of these mechanisms.  This particular sign I've got is the medium sized sign - it's the one that would go down the side of the bus, not on the front or the back.  These signs generally work in threes: there's a front one which is really big, a side one which is that big (points to sign behind him) and a rear one that might just have space to display a route number.  Later, we'll look at how the protocol works if you have multiple signs connected together.

Basically, the sign presents to the programmer as a giant bit array:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_bit_array.png" alt="Diagram showing numbers on a flip dot display represented as a bit array">
  <figcaption class="figure-caption text-center">Numbers on a flip dot display represented as a bit array.</figcaption>
</figure>

I've got a 7 x 87 (oops - it's actually 84!) sign, so that's 0 to 6 and then 0 to 86 (correction: 83) across the width.  The sign has no concept of text, or fonts, or anything really... it's just on or off for each dot.  Anything you want to draw on there requires you to figure out yourself.

Like Mark (the previous speaker on the night) was saying earlier, a lot of us grew up with early ZX Spectrums - you use to have graph paper from WH Smith and you'd draw 8x8 pixel sprites for your game or whatever you were making.  These signs use that same bitmap array approach.

So how do we control the thing?

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_controller.png" alt="A Hanover DERIC flip dot display controller">
  <figcaption class="figure-caption text-center">A Hanover DERIC flip dot display controller.</figcaption>
</figure>

We've got this sign, it's originally from a bus... it's not designed for use with any sort of programming language really.  When the sign was installed in the bus originally you'd also buy that little unit on the right there, which is a controller unit for it.  You would plug a laptop into the serial port on there and use proprietary software to load a set of destinations.  You'd then use the buttons on the controller to flip through available destinations and send them to the sign.  It then sends the data to signs at the front, side and back of the bus.

This would give the bus driver a pre-programmed set of approved destination messages, which is probably what you want... again going back to Mark's (previous speaker) example of how we all walked into Currys or WH Smiths or Woolworth or whatever and did `10 PRINT <something rude> 20 GOTO 10` on the old BASIC computers from the 80s... you don't want to give the driver free text input to put any old thing they want on the front of the bus and then go driving it around on their last day at work!  That would not be good for anybody.

The actual controller was quite limited in what it could do and required proprietary programming via a laptop.

People who are better than me at electronics looked at this and started looking at how the controller talks to the sign (all credit to John Whittington for writing an [excellent article](https://engineer.john-whittington.co.uk/2017/11/adventures-flippy-flip-dot-display/) about this).  Similarly to parts of Mark's (the previous speaker) project, it uses RS-485 which is a pretty simple way of connecting A to B.  This means that we can connect the sign to lots of different computers.  You can get a USB to RS485 modem type thing for about £3-4 on Amazon, eBay etc.  You can treat that in your code as a sort of USB modem and send it whatever protocol the thing at the other end is expecting.  The thing at the other end will then react to that.

The bus sign protocol for controlling the signs is really quite strange:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_protocol.png" alt="Flip dot protocol explained">
  <figcaption class="figure-caption text-center">Flip dot protocol explained.</figcaption>
</figure>

Imagine if we had 8 dots in a column and we wanted to turn on the 1st, 3rd, 5th, 6th, 7th and 8th dots.  You could look at them like this:

This one here (the top most one) represents the top left flip dot and it should be on (yellow side out).  The zero below represents the flip dot below it and that needs to be off (black side out).  

The way the protocol works is that there's first a header "hey this is for a bus sign".  Then we send an address - that's because there's potentially up to three signs in a vehicle, they're all wired together.  Each has a different wiring bus address (1, 2, 3...) which is set using a switch on the back of the sign.  The sign then only listens to messages for that address.

Then we need to encode every single column, in my case I have 87 of them (correction: 84).  We do it like this which is a little bit weird but luckily other people got there first and figured this out!

What we do is treat this as a binary number... the first 1 is worth 1, and the 0 is 2, the next 1 is worth 4 and so on.  We should then have a column of numbers with the more significant numbers as we go down... add them all together to give a total... we get 245, which is decimal representation of this column of flip dots here.

Where this protocol is really strange is that it requires us to turn that 245 into a hex number 0xF5.  You'd think that's maybe the end of it but what the protocol actually wants is the ASCII codes for each of those hex digits.. 0x46 and 0x35.

So to encode that column of flip dots to send to the sign you need to do the maths to do all of this and you come out with 0x46 0x35.  Having done the same for each column, you'd then get all of the values together, calculate a CRC (cyclic reudundancy check) code to make sure that the sign can determine that it's received all of the data without corruption.

All of this data is sent across the USB/RS485 modem and the sign updates.  What is important to note here is that it's a broadcast.  It's like TV or pub/sub if you're familiar with publish/subscribe protocols.  You just put it out there on the RS485 and the sign either updates or it doesn't... if it wasn't listening because it's on the wrong address then it's not going to update.  If the data's corrupt it's not going to update.  It's not going to tell you when it's finished updating either, so you have to time these things a bit as it takes a finite amount of time for the sign to update... there's only so many frames you can send in a second.

It's essentially a one frame per communication type of broadcast TV thing.  Luckily, most people won't need to worry about this because people went ahead and wrote drivers for these signs which make them a lot more accessible to those just wanting to get on with doing projects...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_drivers.png" alt="Flip dot driver packages for Node.js and Python">
  <figcaption class="figure-caption text-center">Flip dot driver packages for Node.js and Python.</figcaption>
</figure>

I've mostly worked with the Node.js driver in the top right.  It's probably the most mature one.  It supports fonts so you can send it text and the driver works out all of the ASCII font stuff that you need to represent letters.  This is what we were using in the demo earlier.  It also supports scrolling - send a message that's bigger than your sign is wide and it will scroll it across the sign for you.  It also has a debug mode where you can see what's going on with the protocol underneath - handy if you wanted to do something a bit trickier.

Again - what you have to do when working with these signs is remember that every update sets every flip dot even if it's not changed.  There isn't a delta mechanism - you can't say "I know I turned them all on, now we're going to starting turning some of these off".  It literally is like making a flip book - you have to keep sending it the whole frame, you can't send it just deltas.

There's also a Python interface which works more in the model of the sign being a big array / buffer.  You send it a big array of "on / off / on / off / off / on / off etc" and it encodes it for you and sends it to the sign.  If you want to work with this one and fonts, you're going to have to figure out the encoding of those fonts yourself so you're back to the ZX Spectrum days with the graph paper and figuring out what your sprite looks like.

Those are the main two drivers that are out there.  You can of course write your own because we know what the protocol is.  At some point I might want to try this with the little Raspberry Pi Pico W and see if we can do it in MicroPython, but for now these two work great.

What does any of this have to do with Raspberry Pi?  Well - anything and nothing really as we are plugging a USB/RS485 in... the main advantages of using a Raspberry Pi here are that it's got a USB port... but so do most things... I could plug this into my Macintosh.  The Pi can however also be mounted in the back of the sign.  I've got a Pi 3 stuck in the back of the sign here with some stick on velcro from B&Q:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_back_of_sign.png" alt="Inside the flip dot sign showing the Raspberry Pi and RS485 USB modem">
  <figcaption class="figure-caption text-center">Inside the flip dot sign showing the Raspberry Pi and RS485 USB modem.</figcaption>
</figure>

That's the RS485 down there, the thing with the green screw blocks and a couple of wires.  The expanded view there is my address selector.  I've got bus address 1 selected in this example, so when we address this sign we'd know it as sign number 1.  If we had multiple signs chained together like in a real bus we could send messages to each, or the same message to all of them at the same time (note: this would require all the signs to be the same size).

How does it work in code?  There's two ways of coding for the sign using the drivers provided.  This is a Node.js example:

TODO GIST OF THE NODE EXAMPLE?

It doesn't necessarily lend itself particularly well to Node.js because Node is asynchronous and non-blocking and this is pretty much the opposite of that.  What we need to do is form up the message that we want to send to the sign.  We do that with a `writeText` function in the driver here.  It handles encoding the font into the protocol for us.  

What we do then is send it to the sign.  But, sending it to the sign is a broadcast: there's no way that I know that the sign has done the thing.  Inside this Node program I can register for a "the driver has finished sending the data" event, but that doesn't tell me if the sign has received it and finished updating itself yet.  There's a lot of playing the sleep/wait game here which is not very Node-centric.  This is why you see a lot of Promises there that involve sleeping for a bit and setting timeouts.

If we want to display a long message on this sign as multiple words, we have to "write something then sleep, write something then sleep".  We're not going to get told "OK the sign updated, you can move to the next word(s)".

In Python... TODO 18:24 of the video

TODO GIST OF THE PYTHON CODE

## Resources

* [Flip Dot Display Node.js driver](https://www.npmjs.com/package/flipdot-display)
* [Flip Dot Display Python driver](https://pypi.org/project/pyflipdot/)
* [Article by John Whittington, author of the Node.js driver](https://engineer.john-whittington.co.uk/2017/11/adventures-flippy-flip-dot-display/)
* [My aircraft tracking project that uses the flip dot sign](https://github.com/simonprickett/local-aircraft-tracker)
* [Look Mum No Computer's flip dot etch-a-sketch video](https://www.youtube.com/watch?v=5gilhOpXEUk)
* [PSV Automobilia - a seller of flip dot displays](https://psvautomobilia.com/?product_cat=hanover-flip-dots)
* [USB to RS485 adapter](https://www.amazon.co.uk/WINGONEER-USB-485-Converter-Adapter-Window-1/dp/B016IG6X7I/ref=sr_1_22)

--- 
Main photograph by [MTATransitFan](https://commons.wikimedia.org/wiki/File:2002_D4500_2905.jpg) at WikiMedia Commons.
