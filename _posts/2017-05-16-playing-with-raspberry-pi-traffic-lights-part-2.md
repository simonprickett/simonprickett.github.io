---
layout: post
title:  "Playing with Raspberry Pi and Python: Traffic lights, Part 2"
categories: [ Raspberry Pi, Technology, IoT, Python, Coding ]
image: assets/images/pi_traffic_lights_python_2_main.webp
author: simon
---
In a [previous post in this series]({{ site.baseurl}}/playing-with-raspberry-pi-traffic-lights), we looked at writing Python code to control a set of Low Voltage Labs Traffic Light LEDs for the Raspberry Pi. If you haven’t read that article yet, now would be a good time to do so as this one builds on what we achieved there.

This time, we’ll look at using an environment variable to set whether the lights should follow the UK or USA pattern (UK: red, red & amber, green, amber, red, USA: red, green, amber, red). Start by getting the latest code from GitHub:

```bash
$ git clone https://github.com/simonprickett/pitrafficlights.git
$ cd pitrafficlights
```

Set an environment variable `TRAFFIC_LIGHT_COUNTRY` to have the value `UK`, and start the lights:

```bash
$ export TRAFFIC_LIGHT_COUNTRY=UK
$ python trafficlightpatterns.py
```

The lights should cycle through the UK pattern where red is followed by red and amber before switching to green...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_python_2_uk_pattern.gif" class="figure-img img-fluid" alt="Lights operating in the UK pattern.">
  <figcaption class="figure-caption text-center">Lights operating in the UK pattern.</figcaption>
</figure>

Next, change over to the USA pattern:

```bash
$ export TRAFFIC_LIGHT_COUNTRY=USA
$ python trafficlightpatterns.py
```
The lights should now cycle through the USA pattern where a red light is followed by green…

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pi_traffic_lights_python_2_usa_pattern.gif" class="figure-img img-fluid" alt="Lights operating in the USA pattern.">
  <figcaption class="figure-caption text-center">Lights operating in the USA pattern.</figcaption>
</figure>

Try changing to an unsupported setting:

```bash
$ export TRAFFIC_LIGHT_COUNTRY=NZ
$ python trafficlightpatterns.py
```

The lights won’t come on and instead you’ll see this on the console:

```bash
TRAFFIC_LIGHT_COUNTRY should be set to UK or USA
```

## How it Works

The basic structure of the code remains unchanged from the [previous post]({{ site.baseurl }}/playing-with-raspberry-pi-traffic-lights): set up the GPIO pins, clean up on exit, sit in an infinite while loop that turns the lights on and off in a pattern with sleeps after each step.

{% include coffee-cta.html %}

We now check to see if there’s an environment variable called `TRAFFIC_LIGHT_COUNTRY` set, and if so that its’ value is one of `UK` or `USA`. If it is, the variable `pattern` is set to `uk` or `usa`. If it isn’t, we error and quit:

```python
if ('TRAFFIC_LIGHT_COUNTRY' in os.environ) and (os.environ['TRAFFIC_LIGHT_COUNTRY'] in ['UK', 'USA']):
  pattern = os.environ['TRAFFIC_LIGHT_COUNTRY'].lower()
else:
  print('TRAFFIC_LIGHT_COUNTRY should be set to UK or USA')
  sys.exit(1)
```

Now in the main code loop, we add a step for the UK pattern only, where we turn on both the red and amber lights before switching to green:

```python
# Loop forever
while True:
  # Red
  GPIO.output(9, True)
  time.sleep(3)
 
  # Red and amber for UK only
  if (pattern == 'uk'):
    GPIO.output(10, True)
  time.sleep(1)
  
  # Green
  GPIO.output(9, False)
  GPIO.output(10, False)
  GPIO.output(11, True)
  time.sleep(5)
 
  # Amber, longer in US than UK
  GPIO.output(11, False)
  GPIO.output(10, True)
  if (pattern == 'uk'):
    time.sleep(2)
  else:
    time.sleep(3)
 
  # Amber off (red comes on at top of loop)
  GPIO.output(10, False)
```

Also note that after the green light, we show the amber light for a longer time in the US configuration than we do for the UK one.

## Next Steps

In this article, we made a simple change to the code to run the lights in different patterns depending on the value of an environment variable. In the next post ([now available here]({{ site.baseurl}}/playing-with-raspberry-pi-traffic-lights-with-a-finite-state-machine)), we’ll look at another way we can structure the code by building a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine).

---

I’d love to hear what you’re up to with the Raspberry Pi — get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!