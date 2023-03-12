---
title: "Airline Routemap"
permalink: "/routemap/"
---
This is the full size version of my "airline routemap" project with Google Maps.  Read the full article [here](/geodesic-lines-with-the-google-maps-geometry-api/).

---

<div id="map" style="height: 800px; width: 100%"></div>

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
