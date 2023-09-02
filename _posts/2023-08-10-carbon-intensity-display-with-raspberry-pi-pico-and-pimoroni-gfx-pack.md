---
layout: post
title:  "Carbon Intensity Display with Raspberry Pi Pico and Pimoroni GFX Pack"
categories: [ IoT, Coding, Raspberry Pi, Python ]
image: assets/images/carbonintensity_main.jpg
author: simon
---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus leo augue, semper quis augue quis, ullamcorper porta ipsum. Aliquam consectetur leo tortor, non tincidunt libero accumsan sit amet. Phasellus at facilisis est, ac porttitor elit. Suspendisse vitae tristique leo. Phasellus varius eu ipsum sit amet iaculis. Nulla commodo, sapien eget sodales tincidunt, ante urna tincidunt purus, in fringilla est lacus a leo. Quisque mollis turpis et neque ultrices, ut volutpat justo cursus. Proin viverra nulla sed libero tempus, a cursus lectus lacinia. Morbi tempus massa in urna feugiat vehicula. Quisque tristique nisl in ornare convallis. Maecenas vel magna at libero semper interdum sit amet ut dolor. Aenean varius vitae ex ut ultrices. Vivamus dui dolor, luctus dignissim scelerisque eu, mollis a nunc. Aenean egestas diam magna.

TODO talk about the video that follows...

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/xRejaScBBcU?si=UVZegorOGzDUBo35" allowfullscreen></iframe>
</div><br/>

TODO something with an image...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/carbonintensity_kit.png" alt="The hardware needed to run this example.">
  <figcaption class="figure-caption text-center">The hardware needed to run this example.</figcaption>
</figure>

TODO embedded API demo...

<div id="api-demo">
  <p>Loading carbon intensity data from API...</p>
</div>

TODO more text...

## How Does The Web Demo Work?

TODO...

TODO GIST...

## Resources

Here's some things you'll need to buy / download to run this on your own GFX Pack at home:

* [Raspberry Pi Pico W](https://shop.pimoroni.com/products/raspberry-pi-pico-w?variant=40454061752403) - get the version with headers pre-soldered if you can, otherwise you'll need to buy [appropriate headers](https://shop.pimoroni.com/products/pico-header-pack?variant=32374935715923) and solder them on yourself.
* [Pimoroni GFX Pack](https://shop.pimoroni.com/products/pico-gfx-pack?variant=40414469062739).
* [USB A to Micro USB power/data cable](https://shop.pimoroni.com/products/usb-a-to-microb-cable-red?variant=32065140746).
* [Pimoroni MicroPython build](https://github.com/pimoroni/pimoroni-pico/releases) - grab the latest `pimoroni-picow-*-micropython.uf2` file.
* Carbon Intensity Python Software from Pimoroni's [GFX Pack examples repository](https://github.com/pimoroni/pimoroni-pico/tree/main/micropython/examples/gfx_pack).

## Have Fun

If you build one of these and use it, I'd love to hear from you - get in touch via my [contact page](/contact) or on whatever [Twitter](https://twitter.com/simon_prickett) calls itself at the time of reading.

--- 
Main photograph from pxhere.com ([link](https://pxhere.com/en/photo/1611116)).

<script>
  window.onload = async function () {
    const intensityAPIResponse = await fetch('https://api.carbonintensity.org.uk/regional/postcode/NG1');
    const intensityData = await intensityAPIResponse.json();
    const regionData = intensityData.data[0];
    const forecastNum = regionData.data[0].intensity.forecast;
    const forecastStr = regionData.data[0].intensity.index;
    const generationMix = regionData.data[0].generationmix;
    const apiDemoArea = document.getElementById('api-demo');

    // Sort the generation mix by percentage descending: RANT... the API should do this for you.
    console.log(generationMix);
    const sortedGenerationMix = generationMix.sort((a, b) => {
      if (a['perc'] < b['perc']) return 1;
      if (a['perc'] > b['perc']) return -1;
      return 0;
    });

    // Work out the colour for the header area...
    let intensityColour = '';

    switch(forecastStr) {
      case 'very low':
        // Brighter green.
        intensityColour = '#49FF33';
        break;
      case 'low':
        // Lighter green.
        intensityColour = '#9FFF33';
        break;
      case 'moderate':
        // Yellow..
        intensityColour = '#FFE933';
        break;
      case 'high':
        // Orange.
        intensityColour = '#FF9033';
        break;
      case 'very high':
        // Red.
        intensityColour = '#FF3333';
        break;
    }

    let htmlContent = `<h4 style="text-align:center; padding-top:20px; padding-bottom:20px; color:#FFFFFF; background-color:${intensityColour}">${regionData.shortname} - ${forecastNum} (${forecastStr.split(' ').map(w => `${w[0].toUpperCase()}${w.substring(1)}`).join(' ')})</h4><table class="table table-striped"><thead><tr><th scope="col">Source</th><th scope="col">Percentage</th></tr></thead><tbody>`;

    for (const entry of sortedGenerationMix) {
      if (entry.perc > 0) {
        htmlContent = `${htmlContent}<tr><td>${entry.fuel[0].toUpperCase()}${entry.fuel.substring(1)}</td><td>${entry.perc}%</td></tr>`;
      }
    }

    htmlContent = `${htmlContent}</tbody></table>`;

    apiDemoArea.innerHTML = htmlContent;
  };
</script>