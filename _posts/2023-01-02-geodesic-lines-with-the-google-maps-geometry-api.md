---
layout: post
title:  "Geodesic Lines with the Google Maps Geometry API"
categories: [ JavaScript, Coding, Front End, Google Maps ]
image: assets/images/geodesic_maps_main.jpg
author: simon
---
Who doesn't like a good map?  I've always enjoyed working with data that lends itself to mapping, and have built a few interactive things with the Google Maps API before.  I'm also pretty interested in aviation and, as part of that, I keep a note of which airports I've flown between, which airlines and what type of aircraft I've travelled on.

I thought it would be fun to use this as a data set to experiment with the [Google Maps Geometry API](https://developers.google.com/maps/documentation/javascript/geometry) and put a picture of my [favourite aircraft](https://en.wikipedia.org/wiki/Airbus_A340) on my website, so here we go...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/geodesic_maps_a340_300.jpg" class="figure-img img-fluid" alt="An Airbus A340-300 aircraft.">
  <figcaption class="figure-caption text-center">An Airbus A340-300 aircraft.</figcaption>
</figure>

Side note: If you want to try an A340-300 flight these days, [Lufthansa](https://www.lufthansa.com/gb/en/34p) or [Swiss](https://www.swiss.com/gb/en/discover/fleet/airbus-longhaul) are probably your best bet.  I flew on every one of Virgin Atlantic's A340-300s before they retired them :)

Airlines generally have maps of their route networks towards the back of the in flight magazine, or as posters in travel agencies (remember those?!).  I wanted to make something like this to maintain and share a record of places I've flown from/to as if I were an airline myself.  For example here's a classic map for Pan American airlines:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/geodesic_maps_route_network.jpg" class="figure-img img-fluid" alt="Map of part of Pan American Airlines Route Network.">
  <figcaption class="figure-caption text-center">Map of part of Pan American Airlines Route Network.</figcaption>
</figure>

Blah blah something about geodesic lines in the Google Maps API... (https://gisgeography.com/great-circle-geodesic-line-shortest-flight-path/)

## Route Map Data

This seemed like the perfect data source to try out the geodesic lines feature with, so I made a JSON file containing data about all of the airports I've visited, and the flights I've taken between them.  The format of the file looks like this:

```json
{
  "airports": {
    "BOG": {
      "name": "El Dorado International Airport",
      "shortName": "Bogotá",
      "location": {
        "latitude": 4.7014128,
        "longitude": -74.1466856
      }
    },
    "IAD": {
      "name": "Dulles International Airport",
      "shortName": "Washington Dulles",
      "location": {
        "latitude": 38.9531162,
        "longitude": -77.4587275
      }
    },
    ... similar for each airport I have visited...
  },
  "flights": [
    {
      "airports": [
        "IAD",
        "BOG"
      ],
      "status": "current"
    },
    ... similar for each airport pair I have flown between...
  ]
}
```

In the excerpt above, we can see that I've got two airports: Washington Dulles USA and Bogotá El Dorado Colombia defined in the `airports` object.  Each airport's key is its three letter [IATA code](https://www.iata.org/en/publications/directories/code-search/).  For each airport, I'm storing a longer and shorter version of the airport's name, and it's latitude / longitude position so that it can be placed on the map.  Finally I'm using the `status` field to indicate if the route betwen the airports is one that my pretend airline currently operates (`current`), or one that's planned in the future (`planned`) A.K.A. a route I am aiming to fly on myself in the near future.  I'm not currently using the `status` field in this project, but wanted to capture it anyway.

Here's the [completed file](https://raw.githubusercontent.com/simonprickett/airline-google-map/main/data/data.json), with all the routes that I can remember having flown on!

What I wanted to do with this data was make an interactive route map that first showed all of the possible routes (like the Pan American example above) then allowed the user to click on an airport and see just the routes from that airport.  Like many airlines, I want my pretend one to operate on a [hub and spoke model](https://en.wikipedia.org/wiki/Airline_hub) and for the map to reflect that certain airports are hubs.  I decided to say that if an airport has 10 or more possible destinations I'll call that a "main" hub and show it in red on the map.  I'll call airports with 5-9 destinations "regional" hubs, showing those in green on the map.  Airports with less than 5 connections don't get any special status, and will be shown in yellow on the map.

## Demonstration

Before going into detail on how it works, here's the finished article that you can play with.

---

<div id="map" style="height: 600px; width: 100%"></div>

---

Try moving around the map and clicking on different airports.  Clicking on an airport shows the routes to/from that airport, and a popup listing them all.  You can dismiss the popup to just see the routes.  View a bigger version of the map [here](/routemap).

I love the way this looks as you zoom in and move around it.  Here's the view of "my United States network":

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/geodesic_maps_usa_network.png" class="figure-img img-fluid" alt="A view of the USA network.">
  <figcaption class="figure-caption text-center">A view of the USA network.</figcaption>
</figure>

# How it Works

Here's a high level overview of how this works...

## HTML

The HTML is pretty simple, we just set up a `div` and give it a known ID (I went with `map` as that's what will live in it) and size it according to how big we want the map to be.  The only other things that we need are `script` tags to get the Google Maps API JavaScript file and a second JavaScript file containing the logic to build and manage our map.  The complete HTML document looks like this:

```
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <title>Airline Map</title>
  </head>
  <body>
    <h1>Airline Map</h1>
    <hr/>
    <div id="map" style="height: 600px; width: 100%"></div>
    <script src="https://maps.googleapis.com/maps/api/js?libraries=geometry&key=%%GOOGLE_MAP_KEY%%"></script>
    <script defer src="js/airline-google-map.js"></script>
  </body>
</html>
```

Note that we're specifically requesting the additional `geometry` library for the Google Maps API, and that we have to provide a key (I've used `%%GOOGLE_MAP_KEY%%` as a placeholder here).  Google doesn't include the geometry library by default, as I guess most maps use cases don't need it so they help to keep the overall page weight down by not loading it unless told to.

## Google Maps API Key

To make Google Maps work when embedded in a web page, you need an API key.  Google provides excellent documentation on how to get a key [here](https://developers.google.com/maps/documentation/javascript/get-api-key).

Your key is a secret, but it's going to have to be shared - you'll need to put it in the URL for the Maps API JavaScript and that means it needs to go in your web page and be shared publically.  

To stop others from misusing your key for their own purposes, you should give the key a meaningful name in your Google account so that you know what it's for, then also restrict the key's scope:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/geodesic_maps_api_key.png" class="figure-img img-fluid" alt="Restricting the Google Maps API key.">
  <figcaption class="figure-caption text-center">Restricting the Google Maps API key.</figcaption>
</figure>

I've restricted my key so that it can only be used when developing locally (`127.0.0.1` and `localhost`) or from my website (hosted on `simonprickett.dev`).  I've also restricted the key to only be valid for the Google Maps API (and not other Google APIs).  You should use similar restrictions when creating your own key.

Don't commit your key to source control (e.g. GitHub).  In my repository, I've provided a simple Node.js build script that replaces the value of `%%GOOGLE_MAP_KEY%%` in the HTML file with the actual key (real value provided through an environment variable) and places all of the files that you need to upload to your web server in a `build` folder which is then git ignored so that it can't accidentally be committed.  Use the instructions in my project [README](https://github.com/simonprickett/airline-google-map) to follow along if you intend to deploy your own version of this project.

## Desired Functionality

Here's what I wanted from my map:

* When first loaded, display all of the routes as lines between each airport pair that I've flown between.
* Show each airport as a Google Maps marker, in different colours as follows:
  * Red for "Main Hub" airports - ones where there are 10 or more destinations.
  * Green for "Regional Hub" airports - ones having between 5 and 9 destinations.
  * Yellow for other airports - ones having fewer than 5 destinations.
* Allow the user to zoom in and out and move around the map.
* When the user clicks on any airport marker:
  * Show only the routes to/from that airport.
  * Display a popup on the map showing the airport name and a list of all the destinatins from that airport.
  * Display text indicating that the airport is a "Main Hub" or "Regional Hub" as appropriate.
* Allow the user to dismiss the popup.

## Implementing the Functionality in JavaScript

Let's see how I implemented all of the above in a relatively small amount of JavaScript!

First, let's tackle a couple of "freebies" that we don't need to write any code for... Google Maps manages scrolling and zooming for us, so nothing to do there.  We also don't need to write any code to handle dismissing popups (I might look into this in future to add some additional functionality though).

That leaves us with two tasks to write code for...

### Display the Initial Map

Here we need to do a couple of things... first let's draw a map and centre it on a particular location.  As many of my flights originated or ended in the USA, I chose to centre the initial map view on a location in Kansas and with a zoom level that shows the rest of the world too:

```javascript
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 38.499768, lng: -100.6875177 }, // This is Kansas, Dorothy...
  zoom: 2
});
```

I've put the map inside the `div` element with ID `map` in my HTML document.  As we saw earlier, the size of that element in the final rendered page is determined inline in the HTML.

Now we have a map on the page, we need to add markers to it.  For the initial view, I wanted to display all of the airports in the data file, with geodesic lines drawn between each flown airport pair.

This is achieved by reading the JSON data file, storing the value of the `airports` object in a global variable `airports` and the value of the `flights` array in a second global variable `flights`. 

The code then loops over each airport object in `airports`.  I also have a utility function `getDestinationsForAirport` that builds an array of the airport codes that a given airport is connected to.

For each airport, we'll first work out what "type" of airport it is, and what colour marker to use.  These data points depend on the number of destinations that `getDestinationsForAirport` found in the data file for this airport:

```javascript
let markerColor;
let airportType;

if (destinations.length >= MAIN_HUB_NUM_DESTINATIONS) {
  markerColor = 'red';
  airportType = 'Main Hub';
} else if (destinations.length >= REGIONAL_HUB_NUM_DESTINATIONS) {
  markerColor = 'green';
  airportType = 'Regional Hub';
} else {
  markerColor = 'yellow';
}
```

We'll add this information to a HTML fragment that will pop up when the marker is clicked, using a [Google Maps InfoWindow](https://developers.google.com/maps/documentation/javascript/infowindows):

```javascript
const infoWindow = new google.maps.InfoWindow({
  content: `<div>${airport.name}</div><hr/><p>We fly from ${airportType ? 'our ' + airportType + ' at ' : ''} ${airport.shortName} to:</p>${renderDestinations(destinations)}`
});
```

Finally, we can use information about the airport's location plus our `infoWindow` to create a 
 [Google Maps Marker](https://developers.google.com/maps/documentation/javascript/markers) for it on the map:

 ```javascript
const marker = new google.maps.Marker({
  title: airport.name,
  airportCode,
  destinations,
  infoWindow,
  map,
  position: {
    lat: airport.location.latitude,
    lng: airport.location.longitude
  },
  icon: {
    url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`
  }
});
```

 Alongside some items the `Marker` expects (a `title`, `position`, `icon` and the `map` to attach to), I'm passing in other data that we'll need to remember in there for later when the user clicks the marker.  Each `Marker` needs to have a `click` event associated with it - we'll cover those in the next sub-section.

TODO storing marker in the airports global?

Once we've created all our markers... TODO about drawing the lines...

```javascript
for (const airportCode in airports) {
  const airport = airports[airportCode];

  for (const destination of airport.marker.destinations) {
    currentLines.push(new google.maps.Polyline({
      strokeColor: '#0000DD',
      strokeOpacity: 0.5,
      strokeWeight: 1,
      geodesic: true,
      map: map,
      path: [airport.marker.getPosition(), airports[destination].marker.getPosition()]
    }));
  }
}
```

### Handle a Click Event on a Marker

TODO rework this a bit...

Furthermore we need to add a `click` event to the `Marker`, providing a function to run when the marker is clicked:

 ```javascript
google.maps.event.addListener(marker, 'click', () => {
  for (const polyLine of currentLines) {
    polyLine.setMap(null);
  }

  currentLines = [];

  if (currentInfoWindow) {
    currentInfoWindow.close();
  }

  marker.infoWindow.open(map, marker)
  currentInfoWindow = marker.infoWindow;

  for (const destination of marker.destinations) {
    const geodesicPoly = new google.maps.Polyline({
      strokeColor: '#0000DD',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      geodesic: true,
      map: map,
      path: [marker.getPosition(), airports[destination].marker.getPosition()]
    });

    currentLines.push(geodesicPoly);
  }
});
```

### Future Enhancements

TODO

# Try it Yourself!

If you want to study this further or try running it yourself, I've made it [available on GitHub](https://github.com/simonprickett/airline-google-map) for your entertainment.  Don't forget that you'll need your own Google Maps API key.  [Let me know](https://simonprickett.dev/contact/) if you build anything based on this, I'd love to see it!

---
*Main photograph by [Porapak Apichodilok on Pexels](https://www.pexels.com/photo/globe-on-sand-346696/).*

<script src="https://maps.googleapis.com/maps/api/js?libraries=geometry&key=AIzaSyCXCV36XJ9fGsFxC4Ne1A8vGUClXnswTG0"></script>
<script>
  window.onload = async function () {
    const response = await fetch('https://raw.githubusercontent.com/simonprickett/airline-google-map/main/data/data.json');
    const data = await response.json();
    const airports = data.airports;
    const flights = data.flights;

    let currentLines = [];
    let currentInfoWindow;

    const MAIN_HUB_NUM_DESTINATIONS = 10;
    const REGIONAL_HUB_NUM_DESTINATIONS = 5;

    const getDestinationsForAirport = (airportCode) => {
      const destinations = [];

      for (const flight of flights) {
        if (flight.airports.includes(airportCode)) {
          for (const airport of flight.airports) {
            if (airport !== airportCode) {
              destinations.push(airport);
            }
          }
        }
      }

      return destinations;
    }

    const renderDestinations = (destinations) => {
      let str = '<ul>';

      for (const destination of destinations) {
        const airport = airports[destination];
        str = `${str}<li>${airport.shortName}</li>`;
      }

      return `${str}</ul>`;
    }

    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 38.499768, lng: -100.6875177 }, // This is Kansas, Dorothy...
      zoom: 2
    });

    for (const airportCode in airports) {
      const airport = airports[airportCode];
      const destinations = getDestinationsForAirport(airportCode);

      let markerColor;
      let airportType;

      if (destinations.length >= MAIN_HUB_NUM_DESTINATIONS) {
        markerColor = 'red';
        airportType = 'Main Hub';
      } else if (destinations.length >= REGIONAL_HUB_NUM_DESTINATIONS) {
        markerColor = 'green';
        airportType = 'Regional Hub';
      } else {
        markerColor = 'yellow';
      }

      const infoWindow = new google.maps.InfoWindow({
        content: `<div>${airport.name}</div><hr/><p>We fly from ${airportType ? 'our ' + airportType + ' at ' : ''} ${airport.shortName} to:</p>${renderDestinations(destinations)}`
      })

      const marker = new google.maps.Marker({
        title: airport.name,
        airportCode,
        destinations,
        infoWindow,
        map,
        position: {
          lat: airport.location.latitude,
          lng: airport.location.longitude
        },
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`
        }
      });

      google.maps.event.addListener(marker, 'click', () => {
        for (const polyLine of currentLines) {
          polyLine.setMap(null);
        }

        currentLines = [];

        if (currentInfoWindow) {
          currentInfoWindow.close();
        }

        marker.infoWindow.open(map, marker)
        currentInfoWindow = marker.infoWindow;

        for (const destination of marker.destinations) {
          const geodesicPoly = new google.maps.Polyline({
            strokeColor: '#0000DD',
            strokeOpacity: 0.5,
            strokeWeight: 2,
            geodesic: true,
            map: map,
            path: [marker.getPosition(), airports[destination].marker.getPosition()]
          });

          currentLines.push(geodesicPoly);
        }
      });

      airport.marker = marker;
    }

    for (const airportCode in airports) {
      const airport = airports[airportCode];

      for (const destination of airport.marker.destinations) {
        currentLines.push(new google.maps.Polyline({
          strokeColor: '#0000DD',
          strokeOpacity: 0.5,
          strokeWeight: 1,
          geodesic: true,
          map: map,
          path: [airport.marker.getPosition(), airports[destination].marker.getPosition()]
        }));
      }
    }
  };
</script>
