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

But you have the data BBC, so this just seems like really lazy coding for the Echo...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/bbcradio_sounds_web.png" alt="BBC Sounds web showing the current artist and track information.">
  <figcaption class="figure-caption text-center">Hmmm, we have the data...</figcaption>
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

How did I build this and what did I use?  Let's dig in...

{% include coffee-cta.html %}

## Shopping List

You'll need the following to build and run this project... no soldering required!

### Hardware

Most of these links go to the Pimoroni shop in the UK (they also ship worldwide!).

* [Raspberry Pi Pico W](https://shop.pimoroni.com/products/raspberry-pi-pico-w?variant=40059369652307) (I recommend the version with the headers pre-soldered, if you want to do some soldering then pick up a Pico W without headers, get a set of headers and solder them on!)
* [Pimoroni Pico Display Pack 2.0](https://shop.pimoroni.com/products/pico-display-pack-2-0?variant=39374122582099).  A 320 x 240 pixel LCD display for Raspberry Pi Pico, with four buttons and an RGB LED.  This project uses all of these features.
* A [USB to micro USB data cable](https://shop.pimoroni.com/products/usb-a-to-microb-cable-red?variant=32065140746) (to provide power to the project and install code on the Pico W).  I like red cables but any colour and length will do so long as it provides both charging and data.
* A [USB plug](https://www.amazon.co.uk/TECHNOPLAY-Charger-Adapter-1000mAh-Compatible-White/dp/B09HDRYG7J/?th=1) if you want to power the project from a wall socket.  If you have one from a phone that you already own, that'll work fine.

### Software

This stuff's free! (but if you enjoy Thonny, please check out their "Support Ukraine" initiative [here](https://github.com/thonny/thonny/wiki/Support-Ukraine)).

* Pimoroni MicroPython runtime.  You'll want the latest build for the Raspberry Pi Pico W.  This contains the MicroPython runtime plus pre-installed libraries for Pimoroni products that the code depends on.  Download the latest `.uf2` file for the Pi Pico W from GitHub [here](https://github.com/pimoroni/pimoroni-pico/releases) (it will be named something like `pimoroni-picow-vX.XX.X-micropython.uf2`).  
* [Thonny IDE](https://thonny.org/) - a simple code editor that connects to the Raspberry Pi Pico W to install, run and debug code.  Alternative IDEs (for example Visual Studio Code with appropriate extensions) are available - if you're comfortable using one of those with the Raspberry Pi Pico W then go for it!

## How it Works

Let's dive in and see how this works at a high level (there's a lot more detail in the project's [GitHub README](https://github.com/simonprickett/pico-display-pack-2-radio-whats-on)).

### Getting the Data

This project relies on being able to get data about what's currently or most recently playing on various BBC radio stations. 

I found out that the track and artist information is available as a JSON feed by looking at the requests sent from the BBC Sounds page for Radio 2 ([here](https://www.bbc.co.uk/sounds/play/live:bbc_radio_two)).

Using Chrome's network inspector I found that this URL is requested periodically and contains the information we need:

```
https://rms.api.bbc.co.uk/v2/services/bbc_radio_two/segments/latest?experience=domestic&offset=0&limit=4
```

Using the station ID from the end of the page URL (e.g. `bbc_radio_two`) we can infer that swapping `bbc_radio_two` for another station's ID will get information for that station.  I  played around with this and found that is indeed what happens.

In fact there's more information that I'm using here, including the URL of an image to show for the artist.  I didn't do this with the Display Pack as the Pico W didn't have enough memory, but you could use it with a device that has more RAM. 

Here's what the data looks like:

```json
{
  "$schema": "https://rms.api.bbc.co.uk/docs/swagger.json#/definitions/SegmentItemsResponse",
  "total": 4,
  "limit": 4,
  "offset": 0,
  "data": [
    {
      "type": "segment_item",
      "id": "p0gnbhlc",
      "urn": "urn:bbc:radio:segment:music:nznnmm",
      "segment_type": "music",
      "titles": {
        "primary": "Eminem",
        "secondary": "Lose Yourself",
        "tertiary": null
      },
      "synopses": null,
      "image_url": "https://ichef.bbci.co.uk/images/ic/{recipe}/p02l4wr2.jpg",
      "offset": {
        "start": 770,
        "end": 1034,
        "label": "Now Playing",
        "now_playing": true
      },
      "uris": [
        
      ]
    },...
```

I decided to only fetch the most recent song to reduce memory requirements and processing load on the Pico W.  So the final generalised URL we need looks like this:

```
https://rms.api.bbc.co.uk/v2/services/STATION_ID/segments/latest?experience=domestic&offset=0&limit=1
```

So the approach I took is to call this URL periodically and grab the following information from the response:

* `data[0].titles.primary` - the artist name.
* `data[0].titles.secondary` - the track name.
* `data[0].offset.label` - text description telling us whether the song is "now playing" or was "2 minutes ago" etc. 

To get the data from the BBC, I used the standard `urequests` MicroPython package like so with some basic safeguards against the data being missing:

```python
def get_song_data(radio_station):
    now_playing = urequests.get(f"https://rms.api.bbc.co.uk/v2/services/{radio_station}/segments/latest?experience=domestic&offset=0&limit=1", headers= {"User-Agent": "PicoW"}).json()

    if len(now_playing["data"]) > 0:
        status = now_playing["data"][0]["offset"]["label"]
        artist = now_playing["data"][0]["titles"]["primary"]
        song = now_playing["data"][0]["titles"]["secondary"]
    else:
        status = "NO DATA"
        artist = "NO DATA"
        song = "NO DATA"
        
    return status, artist, song
```

One thing to note is that I'm explicitly setting the `User-Agent` HTTP header.  This is used to identify the type of browser making the request.  I found that if I didn't set this, the BBC would deny my requests after a few attempts.  As this isn't an official documented API, it could also go away at any point... it'd be nice if the BBC provided proper APIs for this stuff.

The project also contains code to connect to a configurable WiFi network SSID using a configurable password.

### Displaying the Data

In common with their other Pico displays, the Pico Display Pack 2 is supported by Pimoroni's excellent [Pico Graphics library](https://github.com/pimoroni/pimoroni-pico/tree/main/micropython/modules/picographics).  At a high level, Pico Graphics abstracts the details of various Pimoroni displays away so that the programmer can mostly deal with them as one thing.  There are some implementation differences for each screen type.  For example the Display Pack 2 we're using here has colours unlike the e-ink display you'll find on the [Badger 2040W](https://shop.pimoroni.com/products/badger-2040-w?variant=40514062188627).

The Pico Graphics API metaphor is one of drawing on displays with pens, where pens potentially have different colours.  There's also support for writing text to a display with a choice of fonts and scaling options as well as drawing lines and shapes.  We'll use all of these things in this project.

Pico Graphics is built into the Pirate brand MicroPython runtime, so there's no extra files to add to the project.  We begin by importing the right display and an appropriate pen for it: 


```python
from picographics import PicoGraphics, DISPLAY_PICO_DISPLAY_2, PEN_RGB332
```

Now we need to initialize Pico Graphics:

```python
display = PicoGraphics(display=DISPLAY_PICO_DISPLAY_2, pen_type=PEN_RGB332, rotate=0)
```

Note the use of the `rotate` parameter - useful if you mount your display in an enclosure and want to re-orient the display so that the top points up.
 
We'll need a black and a white pen, so let's create those by passing `create_pen` appropriate RGB colour values:

```python
BLACK_PEN = display.create_pen(0, 0, 0)
WHITE_PEN = display.create_pen(255, 255, 255)
```

There are four other pens defined in a global configuration dictionary that holds the radio station details.  We'll use those for drawing a coloured circle that represents the station's logo.

The following utility function clears the display basically by painting it with the black pen:

```python
def clear_screen():
    display.set_pen(BLACK_PEN)
    display.clear()
```

To render text on the display, the code uses the Pico Graphics `text` function, passing in x and y co-ordinates as well as the font scaling factor.  Let's render some text in white using the `bitmap6` font:

```python
# text and status are strings containing data about the current song.
display.set_pen(WHITE_PEN)
display.set_font("bitmap6")
display.text(text, 10, 180, 300, scale = 3)
display.text(status, 10, 60, 200, scale = 4)
display.update()
```

Changes aren't drawn on the screen until we call `update`.

The radio station logo is drawn on the screen as a coloured circle with an optional outline and a single large text character in the middle.  Let's see how that works at a high level.

Station information is contained in a Python dictionary that looks like this:

```python
STATION_MAP = {
    "a": {
        "id": "bbc_radio_one",
        "display": "1",
        "pen": display.create_pen(0, 0, 0),
        "outline": display.create_pen(128, 128, 128)
    },
    # Same for the other 3 buttons...
```

To draw the circle for the station's logo in the right colour, we need the `pen` declared here, and potentially also the `outline` pen if one is specified (this is optional and only used if the station's circle logo colour isn't clearly distinguishable from the black background).

The global variable `current_station` holds the key in the `STATION_MAP` dictionary for the station that's currently selected.  So let's draw the station's logo using this information:

```python
h_offset = 0

if "outline" in STATION_MAP[current_station]:
    display.set_pen(STATION_MAP[current_station]["outline"])
    display.circle(245, 85, 62)
    h_offset = 2
            
display.set_pen(STATION_MAP[current_station]["pen"])
display.circle(245, 85, 60)
display.set_pen(WHITE_PEN)
display.set_font("bitmap8")
display.text(STATION_MAP[current_station]["display"], 228 + h_offset, 50, scale = 10)    
```

First up, the code checks if an outline circle is needed and if so sets the pen to the colour specified in the `STATION_MAP` dictionary.  Using the Pico Graphics `circle` function, we draw a 62 pixel radius circle at the given x and y co-ordinates.  This circle will be filled with the colour of the current pen.  If the outline circle was necessary, the variable `h_offset` gets updated.  We use this to adjust the position that the station logo character is drawn at to accommodate the space taken up by the outline.

For all stations whether or not an outline was drawn, we then create a circle in the station's logo colour before switching to the white pen and a larger font to add the character that forms part of the logo.

There's additional code that handles periodically updating the display every so often, making sure that the display stays in sync with what's currently playing on the radio.  Check out the project [GitHub README](https://github.com/simonprickett/pico-display-pack-2-radio-whats-on) for details of that.

### Selecting Different Stations

The Pico Display Pack 2 has four buttons labelled "a", "b", "x" and "y".  Pimoroni provide a `Button` abstraction that we can use by creating instances of it for each of the GPIO pins that the buttons are connected to:

```python
from pimoroni import Button

button_a = Button(12)
button_b = Button(13)
button_x = Button(14)
button_y = Button(15)
```

I used these to give the user a way of changing between four different stations. 

Detecting a button press is then a simple matter of calling the `read` function on a button instance.  If it returns `True`, the button is being pressed.  This is a polling approach, so needs to be carried out frequently in a loop:

```python
while True:
    # Other code omitted...

    # Check if any of the buttons were pressed and change station if so.
    if button_a.read():
        current_station = "a"
    elif button_b.read():
        current_station = "b"
    elif button_x.read():
        current_station = "x"
    elif button_y.read():
        current_station = "y"
```

The different values of `current_station` map to a configuration dictionary in the code which contains the station ID code and some information about which colours to use and what character to place in the coloured circle area of the display.

It would be cool to have the Pico listen and change station automatically when I tell the Echo Show unit "Alexa play BBC Radio 6 Music" etc, but that's way out of scope and maybe not possible with this hardware... so a manual station change on the display after a verbal instruction to Alexa is fine by me.

## Try it Out!

If you'd like to try this out yourself, head on over to my [GitHub repository](https://github.com/simonprickett/pico-display-pack-2-radio-whats-on) where there's a more detailed set of instructions to get you up and running.  I've also included details on how to connect to your WiFi network as well as how to change the stations and colours associated with each button, so that you can pick your own favourites.

## Keep in Touch!

If you build one of these and use it, I'd love to hear from you - get in touch via my [contact page](/contact) or on whatever [Twitter](https://twitter.com/simon_prickett) calls itself at the time of reading.

--- 
Main photo "Stack of Vintage Radios in an Electronics Store" by [Berna Elif on Pexels](https://www.pexels.com/photo/stack-of-vintage-radios-in-an-electronics-store-18449793/).
