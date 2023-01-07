---
layout: post
title:  "Geodesic Lines with the Google Maps Geometry API"
categories: [ JavaScript, Coding, Front End, Google Maps ]
image: assets/images/geodesic_maps_main.jpg
author: simon
---
Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/geodesic_maps_a340_300.jpg" class="figure-img img-fluid" alt="An Airbus A340-300 aircraft.">
  <figcaption class="figure-caption text-center">An Airbus A340-300 aircraft.</figcaption>
</figure>

Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.

Airlines generally have maps of their route networks towards the back of the in flight magazine, or as posters in travel agencies (remember those?!).  I wanted to make something like this to maintain and share a record of places I've flown from/to as if I were an airline myself.  For example here's a classic map for Pan American airlines:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/geodesic_maps_route_network.jpg" class="figure-img img-fluid" alt="Map of part of Pan American Airlines Route Network.">
  <figcaption class="figure-caption text-center">Map of part of Pan American Airlines Route Network.</figcaption>
</figure>

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

Try moving around the map and clicking on different airports.  Clicking on an airport shows the routes to/from that airport, and a popup listing them all.  You can dismiss the popup to just see the routes.  TODO link to a bigger version of this running.

# How it Works

Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.

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

    const MAIN_HUB_NUM_DESTINATIONS = 9;
    const REGIONAL_HUB_NUM_DESTINATIONS = 4;

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

      if (destinations.length > MAIN_HUB_NUM_DESTINATIONS) {
        markerColor = 'red';
        airportType = 'Main Hub';
      } else if (destinations.length > REGIONAL_HUB_NUM_DESTINATIONS) {
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
