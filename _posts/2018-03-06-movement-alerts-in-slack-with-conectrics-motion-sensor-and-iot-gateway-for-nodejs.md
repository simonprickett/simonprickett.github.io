---
layout: post
title:  "Movement Alerts in Slack with Conectric's Motion Sensor & IoT Gateway for Node.js"
categories: [ Slack, Node.js, JavaScript, IoT, Coding ]
image: assets/images/conectric_motion_slack_main.jpg
author: simon
---
At Conectric we recently launched our new IoT Gateway product with an accompanying suite of wireless, battery powered sensors. In this article we’ll take a closer look at how to use our motion sensor and Node.js SDK together. We’ll use out of the box example code that ships with the SDK to create a movement alerting app for popular messaging platform Slack.

(If you missed it, you may wish to read our [first article]({{ site.baseurl}}/announcing-conectrics-usb-iot-gateway-and-sensor-product/) that provides an overview of all the components in the system).

We also produced a video run through of how to set up the motion sensor with Slack and our Node.js SDK. The video shows this with Mac OS, but the same process applies on Windows and Linux too (including Raspberry Pi with Raspbian OS):

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/-Y-HHBAmI58" allowfullscreen></iframe>
</div><br/>

Let’s look at how to quickly get setup and running...

## Hardware

The complete system currently includes a USB router and the following types of sensor:

* Motion
* Switch (door)
* Temperature / humidity

In this example use case we’ll be using both the USB Router and Motion sensor.

### USB Router

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_motion_slack_router.jpg" class="figure-img img-fluid" alt="The Conectric USB router.">
  <figcaption class="figure-caption text-center">The Conectric USB router.</figcaption>
</figure>

The USB router acts as the gateway to the Conectric mesh network, receiving messages from the sensors and working with the open source Node.js SDK to translate these into JavaScript objects that you can use in your application code. It connects to a regular USB port on any computer and does not require an external power source.

{% include coffee-cta.html %}

Additional USB routers can be used to extend the mesh network’s range. These are powered from regular USB chargers and act as message repeaters. In this example, we’ll use a single router.

### Motion Sensor

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_motion_slack_motion_sensor.jpg" class="figure-img img-fluid" alt="The Conectric motion sensor.">
  <figcaption class="figure-caption text-center">The Conectric motion sensor.</figcaption>
</figure>

This sensor sends a "motion" message whenever it detects movement in its surrounding area. It is supplied in an enclosure that can easily be wall or ceiling mounted. An LED flashes whenever motion is detected, allowing you to check that the sensor is working without having to remove the cover.

For this example we’ll use a single motion sensor. As each reports its own unique ID, you can use also several of them together and determine which of them detected motion based on sensor IDs contained in each message received.

Hardware setup is as simple as fitting the batteries into the motion sensor then mounting it in the area you would like to monitor and closing the case.

## Software

There are two distinct pieces of software to configure here. We need to use Slack’s API to allow us to post messages into the right team and channel, then we’ll have to implement a callback function for the Conectric SDK to tell it how to handle "motion" messages received from the sensor.

### Slack Setup

If you're familiar with Slack, you'll know that external integrations can post messages to their platform using [Incoming Webhooks](https://api.slack.com/incoming-webhooks). These are HTTP `POST` requests containing formatted JSON bodies that describe the message content along with the channel and name to post that content as.

In Slack we set up an incoming webhook and keep a copy of the URL that their portal generates for us to post data to. Later, we’ll require that URL in our Node.js callback function:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/conectric_motion_slack_slack_setup.png" class="figure-img img-fluid" alt="Slack setup.">
  <figcaption class="figure-caption text-center">Slack setup.</figcaption>
</figure>

(If you’d like to see a step by step guide covering how to set up a Slack incoming webhook, we’ve provided one in the [video](https://www.youtube.com/watch?v=-Y-HHBAmI58&t=2m05s) accompanying this article).

### Conectric SDK & Callback Function Implementation

Conectric's SDK can be [found on npm](https://www.npmjs.com/package/conectric-usb-gateway). To use it simply install as you would any other package:

```
npm install conectric-usb-gateway
```

For this example we’re also using Slack, so let’s also install a third-party helper package to manage calls to Slack’s API:

```
npm install slack-node
```

The Conectric SDK works by allowing developers to provide their own `onSensorMessage` callback function when starting the gateway driver. This abstracts away the details of talking to the USB Router and mesh network thus freeing the developer to focus on application level logic instead.

Each time a message arrives the `onSensorMessage` callback is invoked and receives a JavaScript object containing message data. All messages have a `type` property — the motion sensor sends messages of type `motion` having the form below:

```
{
  "type": "motion",
  "payload": {
    "battery": 2.8,
    "motion": true
  },
  "timestamp": 1518757698977,
  "sensorId": "02A2",
  "sequenceNumber": 12
}
```

Each message’s `payload` tells us that motion was detected and the sensor’s remaining battery voltage. Additionally it includes a UNIX timestamp for when the message was received, the ID of the sensor that sent it and the sequence number of the message from that sensor.

Complete example code for processing movement messages and sending alerts to Slack via a webhook URL is [included with the SDK](https://github.com/Conectric/conectric-usb-gateway/tree/master/examples). Let’s take a look at it and split it into two parts for ease of explanation:

```
// server.js
const gateway = require('conectric-usb-gateway');
const Slack = require('slack-node');
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const MOTION_REPORTING_CHANNEL =
    process.env.MOTION_REPORTING_CHANNEL;
let MOTION_REPORTING_INTERVAL =
    process.env.MOTION_REPORTING_INTERVAL;
MOTION_REPORTING_INTERVAL = parseInt(MOTION_REPORTING_INTERVAL);
let lastMotionTime = 0;
const slack = new Slack();
slack.setWebhook(SLACK_WEBHOOK_URL);
```

The initial pre-amble code loads the Conectric SDK and Slack API helper modules, then reads values for the webhook URL and name of the channel to send alerts to from environment variables.

The third value read from the environment is the "motion reporting interval" which represents the time in seconds that should pass between motion alerts being set to Slack. This acts as a throttle to avoid flooding Slack with every single alert as someone walks across a room monitored by the sensor.

For example to ensure at least a minute between movement alerts in the monitored area, we’d set `MOTION_REPORTING_INTERVAL` to `60`.

The variable `lastMotionTime` will be used to store the timestamp of the last message that triggered a Slack alert. We initially set this to 0 to make sure that the first message we receive becomes an alert.

The final two lines set up the Slack API helper to post data to the webhook URL that we obtained earlier.

The remainder of the example code then starts the Conectric SDK which waits for the USB router to be inserted. Having detected the router, it then waits for messages to arrive from the mesh network. Each message received (from any sensor type) causes the developer’s `onSensorMessage` callback to be invoked:

```
gateway.runGateway({
  onSensorMessage: (sensorMessage) => {
    if ((sensorMessage.type === 'motion') && (sensorMessage.timestamp >= (lastMotionTime + MOTION_REPORTING_INTERVAL))) {
      const motionMessageStr = `Motion detected by sensor ${sensorMessage.sensorId}.`;
      console.log(`Sending message to Slack: ${motionMessageStr}.`);
      lastMotionTime = sensorMessage.timestamp;
      slack.webhook({
        text: motionMessageStr,
        channel: `#${MOTION_REPORTING_CHANNEL}`,
        username: 'Conectric',
        icon_emoji: ':wave:'
      }, (err, response) => {
        if (err) {
          console.error(`Error posting to Slack: ${JSON.stringify(err)}`);
        } else {
          console.log(`Message posted to Slack: ${response.response}`);
        }
      });
    }
  }
});
```

The example callback implementation above works as follows:

* Check if the sensor message received is a motion message (`type` key will have value `motion`). Do nothing otherwise.
* Check if the timestamp of the newly received message indicates that enough time has passed since the last alert was sent to Slack. Do nothing if insufficient time has passed.
* If we did receive a motion message and that message's timestamp indicates that enough time has passed, then create a formatted text message with a waving emoji icon and post it to Slack as "user" Conectric. This message contains the ID of the reporting sensor (`sensorMessage.sensorId`).
* Update the last time that Slack was updated to be the time represented by the newly received message's timestamp.
* Wait for further messages from the mesh network, at which point the callback function will be invoked again.

## Demo Time!

We’ve now got everything we need to translate movement in front of a sensor to alerts in Slack… First set the environment variables. Next start the gateway script `server.js`:

```
export SLACK_WEBHOOK_URL=https://...
export MOTION_REPORTING_CHANNEL=motiondemovideo
export MOTION_REPORTING_INTERVAL=60
npm start
```

Insert the Conectric router into an open USB port, add batteries to the motion sensor and create some movement...

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/-Y-HHBAmI58?start=413" allowfullscreen></iframe>
</div><br/>

The sensor detects activity in the area and a message is sent over the mesh network to the USB router. The SDK invokes the callback function whose logic runs and posts a message to Slack. Slack then displays that message in the configured channel.

As we can see it is very straightforward to integrate with the Conectric motion sensor and SDK, requiring minimal custom coding work. The Conectric SDK for Node.js is designed from the ground up to enable you to embed our scalable mesh network and reliable low maintenance sensors into your own product, platform or other solution.

---

All of our software including the example code referenced in this article ships under the terms of the [MIT License](https://github.com/Conectric/conectric-usb-gateway/blob/master/LICENSE) allowing you to use it for your own purposes.

We’re really excited about the possibilities that this product opens up for developers and systems integrators alike. We hope that you are too!

