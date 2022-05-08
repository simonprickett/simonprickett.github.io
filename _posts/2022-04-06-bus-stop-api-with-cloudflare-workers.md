---
layout: post
title:  "Making a Bus Stop API with Cloudflare Workers"
categories: [ JavaScript, Programming ]
image: assets/images/bus_api_main.jpg
author: simon
---
Public transport services can be great sources of live or near-live data to use when building out an application or trying some new front end technology.  For years my usual go to API when I want to play with something like this has been the BART (Bay Area Rapid Transit) train API.  I love working with this API because it provides data about train movements through the network and information about each station.  It's also free to sign up for [here](http://api.bart.gov/docs/overview/index.aspx).

I decided I wanteed to build some projects out that used a more local data source, so I took a look at what the local tram company [Nottingham Express Transit](https://www.thetram.net/) and bus company [Nottingham City Transport](https://www.nctx.co.uk/) offer in the way of data services.  All of the tram stops and many of the bus stops have live departure screens.  Here's my local bus stop and its display:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/bus_api_bus_stop.jpg" class="figure-img img-fluid" alt="A bus at my local bus stop">
  <figcaption class="figure-caption text-center">A bus at my local bus stop.</figcaption>
</figure>

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/bus_api_live_display.jpg" class="figure-img img-fluid" alt="Live display board at my local bus stop (shows other operators too)">
  <figcaption class="figure-caption text-center">Live display board at my local bus stop (shows other operators too).</figcaption>
</figure>

There must be some sort of data feed driving there, but I wasn't able to find a way that anyone could get at this data via an API. The same applied to the tram network.  So, I decided I'd use the age old technique of [screen scraping](https://en.wikipedia.org/wiki/Data_scraping#Screen_scraping) to build a small API that would tell me which buses are coming, when they're expected to arrive, and to be able to do some basic filtering of the data.  For example, I might want to see only buses expected in the next 10 minutes.

To build such an API, I needed some sort of cloud hosted runtime that would allow me to host code that could:

* Listen for requests on (ideally a secure) URL.
* Run custom logic (my code) each time a request was received.
* Make a request from my code to the bus company's website to get the departure page for a bus stop.
* Parse the resulting HTML from the bus company, get data items out of it and filter them.
* Return a JSON response to the caller in a reasonable timeframe.

## Demo

Here's a quick demo that calls the API to get the next 8 buses headed into the city from the [Forest Recreation Ground stop](https://www.nctx.co.uk/stops/3390FO07) (stop ID 3390FO07).  The URL for this is [`https://nctx.crudworks.workers.dev/?stopId=3390FO07&maxResults=8`](https://nctx.crudworks.workers.dev/?stopId=3390FO07&maxResults=8) and there's some basic JavaScript embedded in this page that fetches that and renders the results below (what you see may depend on what time it is in England as the buses don't run 24 hours a day)...

<div id="api-demo">
  <p>Loading bus data from API...</p>
</div>

## Building with Cloudflare Workers

I could have built this any number of ways - [Google Cloud Functions](https://cloud.google.com/functions/) or [AWS Lambda](https://aws.amazon.com/lambda/) would both have been solid, sensible choices.  Another option is [Cloudflare Workers](https://workers.cloudflare.com/) - I decided to take this route because I've had success with it at work for dynamic URL routing, and because my own website sits behind Cloudflare so I'm already signed up and set up on their platform.

A worker script is associated with one or more URL paths (Cloudflare users get an account specific `*.workers.dev` subdomain, and/or can map paths from domains that you have setup to point to Cloudflare too).  When Cloudflare receives a request for one of these paths, it runs the worker logic to determine what to do and what response to send back.  Cloudflare also handles SSL for you.

Workers can be written in JavaScipt, Rust or C/C++.  I decided to use JavaScript as I'm most familiar with it and I thought it would make the code accessible to the widest number of other people.

This article won't cover how the code works or how to deploy it yourself, for that I wrote a [detailed README in the project's GitHub repo](https://github.com/simonprickett/nctx-stop-api).  Here, we'll focus on how to use the API to see which buses are expected at a given stop.

## Using the API

I deployed my workers code to a URL associated with my Cloudflare account to make the API live on the internet.  I'm on Cloudflare's free plan which gives me 100,000 requests to my workers per day with 1ms CPU time allowed for each request... I figure this will do for hobbyist use.  If I go over my allocaion, you'll see a Cloudflare error page instead of an API response!

The API's at `https://nctx.crudworks.workers.dev/` and to use it, you'll need a stop ID for the bus stop you want to see departures for...

### Obtaining a Stop ID

TODO

### Getting Departures from a Stop

TODO

### Customizing the Response 

TODO

## Limitations

TODO

## Future Plans

What do I plan to use this for?  That would be telling, but stay tuned as I've recently acquired a really appropriate type of display for this sort of information and that's a project I am working on now and will write up when done!

If you use this for anything, please do [get in touch](https://simonprickett.dev/contact/) and let me know what you're up to... I'd love to see it.

<script>
  window.onload = async function () {
    const busAPIResponse = await fetch('https://nctx.crudworks.workers.dev/?stopId=3390FO07&maxResults=8');
    const busDepartures = await busAPIResponse.json();
    const apiDemoArea = document.getElementById('api-demo');

    let htmlContent = `<h4>Departures from ${busDepartures.stopName}</h4><table class="table table-striped"><thead><tr><th scope="col">Estimated</th><th scope="col">Line</th><th scope="col">Route</th><th scope="col">Destination</th></tr></thead><tbody>`;

    for (const busDeparture of busDepartures.departures) {
      htmlContent = `${htmlContent}<tr><td>${busDeparture.expected}</td><td style="background-color:${busDeparture.lineColour}">&nbsp;</td><td>${busDeparture.routeNumber}</td><td>${busDeparture.destination}</td></tr>`;
    }

    htmlContent = `${htmlContent}</tbody></table>`;

    apiDemoArea.innerHTML = htmlContent;
  };
</script>