---
layout: post
title:  "Carbon Intensity Display with Raspberry Pi Pico and Pimoroni GFX Pack"
categories: [ IoT, Coding, Raspberry Pi, Python ]
image: assets/images/carbonintensity_main.jpg
author: simon
---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus leo augue, semper quis augue quis, ullamcorper porta ipsum. Aliquam consectetur leo tortor, non tincidunt libero accumsan sit amet. Phasellus at facilisis est, ac porttitor elit. Suspendisse vitae tristique leo. Phasellus varius eu ipsum sit amet iaculis. Nulla commodo, sapien eget sodales tincidunt, ante urna tincidunt purus, in fringilla est lacus a leo. Quisque mollis turpis et neque ultrices, ut volutpat justo cursus. Proin viverra nulla sed libero tempus, a cursus lectus lacinia. Morbi tempus massa in urna feugiat vehicula. Quisque tristique nisl in ornare convallis. Maecenas vel magna at libero semper interdum sit amet ut dolor. Aenean varius vitae ex ut ultrices. Vivamus dui dolor, luctus dignissim scelerisque eu, mollis a nunc. Aenean egestas diam magna.

TODO make and embed a small video...

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/xSsINHL9COE?start=12" allowfullscreen></iframe>
</div><br/>

TODO something with an image...
<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/flipdot_welcome.gif" alt="Example text display on a flip dot sign">
  <figcaption class="figure-caption text-center">Example text display on a flip dot sign.</figcaption>
</figure>

TODO embedded API demo...

<div id="api-demo">
  <p>Loading carbon intensity data from API...</p>
</div>

TODO more text...

## Resources

* TODO
* TODO

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