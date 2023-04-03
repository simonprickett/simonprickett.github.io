---
layout: post
title:  "Announcing Conectric's USB IoT Gateway & Sensor Product"
categories: [ Node.js, JavaScript, IoT ]
image: assets/images/conectric_announce_main.jpg
author: simon
---
Here at [Conectric](http://www.conectric.com) we’re excited to announce the launch of our new IoT Gateway product with accompanying suite of sensors. 

(This post was originally published in the [Conectric publication on Medium](https://medium.com/conectric-networks)).

We’ve worked hard to create something that allows you to go from unboxing to a functional mesh network with wireless sensors deployed in a matter of minutes. Our introductory video provides a high level overview of how easy this is to use:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/aPfZNUkFKBM" allowfullscreen></iframe>
</div><br/>

In this article, we’ll take a look at the product’s hardware and software components which have been designed from the ground up to work seamlessly together.

## Hardware

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_announce_hardware.png" class="figure-img img-fluid" alt="The Conectric sensors and router.">
  <figcaption class="figure-caption text-center">The Conectric sensors and router.</figcaption>
</figure>

The system currently includes three different types of sensor and a USB router. We’ll take a look at each one individually.

### USB Router

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_announce_router.jpg" class="figure-img img-fluid" alt="The Conectric USB router.">
  <figcaption class="figure-caption text-center">The Conectric USB router.</figcaption>
</figure>

The USB router acts as the gateway to the Conectric mesh network, receiving messages from the sensors and, with the open source Node.js SDK, translating these into JSON objects that you can then leverage in your application code. It connects to a regular USB port on any computer and does not require an external power source.

Additional USB routers can be used to extend the mesh network’s range. These are powered from regular USB chargers and act as message repeaters.

### Temperature/Humidity Sensor

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_announce_temphumidity.jpg" class="figure-img img-fluid" alt="The Conectric Temperature/Humidity sensor.">
  <figcaption class="figure-caption text-center">The Conectric Temperature/Humidity sensor.</figcaption>
</figure>

The combined temperature and humidity sensor emits a `tempHumidity` message every minute. It can be configured through software to provide readings in Fahrenheit or Celsius.

This sensor is also supplied in a tough plastic enclosure that can be wall mounted as needed.

### Motion Detection Sensor

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_announce_motion.jpg" class="figure-img img-fluid" alt="The Conectric Motion sensor.">
  <figcaption class="figure-caption text-center">The Conectric Motio  sensor.</figcaption>
</figure>

This sensor sends a `motion` message whenever it detects movement in its surrounding area. It is supplied in an enclosure that can easily be wall or ceiling mounted. An LED flashes whenever motion is detected, allowing you to check that the sensor is working without having to remove the cover.

(We have subsequently written a separate article that looks at using the Motion Sensor in depth to create a movement alerting app with Slack. You can [read it here]({{ site.baseurl }}/movement-alerts-in-slack-with-conectrics-motion-sensor-and-iot-gateway-for-nodejs/)).

### Door / Switch Sensor

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_announce_switch.jpg" class="figure-img img-fluid" alt="The Conectric Switch sensor.">
  <figcaption class="figure-caption text-center">The Conectric Switch sensor.</figcaption>
</figure>

This sensor can be used to monitor the open/close state of numerous types of fixture, most commonly a door or window. Whenever the door is opened or closed the sensor emits a `switch` message whose payload will be set to “true” if the door is open (magnets apart from each other) or `false` if closed (magnets close together). This behavior can be reversed through software configuration if your application needs a `true` payload when the door is closed.

The switch sensor is supplied in a tough plastic enclosure that can be wall mounted as needed. The enclosure contains a magnet in addition to the one connected by trailing wires which is easily removed if not required for your installation.

(We have subsequently written a separate article that looks at using the Switch Sensor in depth to create a door open alerting system with Twilio. You can [read it here]({{ site.baseurl }}/door-open-alerts-with-twilio-and-conectrics-iot-sensor-product-for-nodejs/)).

---

All sensors use long life batteries and our testing shows that these will last for several years of normal usage. Each sensor also reports its battery strength when sending messages over the mesh network and will send “boot” messages on first power up or after a battery is replaced. These allow for remote asset management, minimizing the need for visual inspections.

## Software

We've built an easy to use SDK for Node.js which can run on Windows, Mac OS X, and Linux. As our mesh router connects to a USB port you can quickly build your own gateway implementation using your existing computer. We've also tested the SDK on the Raspberry Pi running the free [Raspberry Pi OS](https://www.raspberrypi.com/software/) operating system. This makes for a low cost, easy to embed solution.

You can find our software on [npm](https://www.npmjs.com/package/conectric-usb-gateway). Once you have Node.js on your machine installation is as simple as:

```
npm install conectric-usb-gateway
```

It's then just a matter of starting the gateway module, inserting the USB router and you can start receiving sensor messages with minimal coding:

```
// server.js
const gateway = require('conectric-usb-gateway');
gateway.runGateway({
  onSensorMessage: (sensorMessage) => {
    console.log(sensorMessage); // arrives as a JSON object
  }
});
```

You can also configure the gateway to customize or filter messages delivered to your callback function. For example, to receive temperatures in Fahrenheit and ignore messages generated when batteries are inserted into sensors:

```
gateway.runGateway({
  onSensorMessage: (sensorMessage) => {
    console.log(sensorMessage);
  },
  // Override some default settings:
  useFahrenheitTemps: true,
  sendBootMessages: false
});
```

Messages are simple JSON objects. Here’s an example of a temperature and humidity reading:

```
{
  type: 'tempHumidity',         // Message type
  payload: { 
    battery: 3,                 // Sensor battery voltage
    temperature: 23.05,         // Reported temperature
    temperatureUnit: 'C',       // Temperature is in Celsius
    humidity: 41.65             // Reported relative humidity
  },
  timestamp: 1518761945243,     // UNIX timestamp
  sensorId: 'a946',             // Sensor identifier
  sequenceNumber: 37            // Sensor sequence identifier
}
```

Along with [comprehensive documentation](https://www.npmjs.com/package/conectric-usb-gateway), we’ve also bundled [example integrations](https://github.com/Conectric/conectric-usb-gateway/tree/master/examples) with popular APIs and products to demonstrate common use cases:

* Sending an SMS message via [Twilio](https://www.twilio.com/) when a door is opened.
* Posting to a [Slack](https://slack.com/) channel if a motion sensor detects movement, and more than five minutes have passed since the last notification was sent.
* Reporting temperature and humidity data to [ElasticSearch](https://www.elastic.co/products/elasticsearch).

All of the software including the above examples ships under the terms of the [MIT License](https://github.com/Conectric/conectric-usb-gateway/blob/master/LICENSE).

---

We’re really excited about the possibilities that this product opens up for developers and systems integrators alike. We hope that you are too!