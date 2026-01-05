---
layout: post
title:  "Placing Markers Inside Google Maps"
categories: [ Google Maps, JavaScript, Front End, Coding ]
image: assets/images/google_maps_main.webp
author: simon
canonical_url: https://moduscreate.com/blog/placing-markers-inside-polygons-with-google-maps/
---
While working with Google Maps recently, our team needed to be able to drop map markers inside various different types of shapes drawn on the map. This is simple for circles and rectangles as each have a defined center point. For more complex polygons however, a "sensible" location to drop a marker is not necessarily as obvious nor directly provided by the Google Maps API. This led us to look for a lightweight solution that would find a reasonably appropriate spot inside the polygon to drop a marker, preferably using Google’s existing Maps geometry functionality.

(This article was originally published on the blog of my employer at the time, [Modus Create](https://moduscreate.com/insights/blog/)).

## Setup

As usual with projects that use the Google Maps API, we need to include a script tag in our HTML document to tell the browser to fetch the JavaScript from Google. In addition to the usual API key that the Maps API requires, we also need to load a version of the script containing the optional geometry library as we will need some functions from `google.maps.geometry`. This is achieved like so:

```
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY_HERE&libraries=geometry&callback=fnToRunWhenAPILoaded" async defer></script>
```

## Approximating the Polygon’s Center Point

With the Google Maps API, it’s simple to get the center point of a rectangle or circle and place a marker there. For example, assuming `rectangle` is a `google.maps.Rectangle`:

```
new google.maps.Marker({
  position: rectangle.getBounds().getCenter(),
  map: map
});
```

However, for more complex polygon shapes represented by `google.maps.Polygon` this doesn’t exist, so:

```
polygon.getBounds();
```

fails at runtime with:

```
Uncaught TypeError: polygon.getBounds is not a function
```

For rectangle objects, the `getBounds` function returns a [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) for the rectangle (the smallest box containing all the points within the rectangle — which is, of course, the rectangle itself). We started to look at how to implement a `getBounds` like function for polygons, and quickly found a [neat solution on Stack Overflow](http://stackoverflow.com/a/13772082/5338708), by user ["furiozo"](http://stackoverflow.com/users/1886787/furiozo):

```
google.maps.Polygon.prototype.getBoundingBox = function() {
  var bounds = new google.maps.LatLngBounds();
  this.getPath().forEach(function(element,index) {
    bounds.extend(element)
  });
  return(bounds);
};
```

This loops around each of the polygon’s paths, amending a `LatLngBounds` object to ensure that it includes all of them. Having completed the loop, we have an object representing the minimum bounding box for the polygon.

As the `google.maps.LatLngBounds` object has `getCenter`, we can now put our marker in the center of the minimum bounding box that fully contains the polygon:

```
var polygon = new google.maps.Polygon({
  paths: [
    { lat: 41.78500, lng: -87.75133 },
    { lat: 41.77681, lng: -87.87836 },
    { lat: 41.80138, lng: -87.92780 },
    { lat: 41.77988, lng: -87.95527 },
    { lat: 41.83208, lng: -87.95801 },
    { lat: 41.83208, lng: -87.94154 },
    { lat: 41.81673, lng: -87.88866 },
    { lat: 41.81417, lng: -87.78773 },
    { lat: 41.87607, lng: -87.77056 },
    { lat: 41.78500, lng: -87.75133 }
  ],
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35
});
new google.maps.Marker({
  position: polygon.getBoundingBox().getCenter(),
  map: map
});
```

This gives us an approximation of the polygon’s [centroid](https://en.wikipedia.org/wiki/Centroid) point. However, trying this out on a map shows we have a problem...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/google_maps_problem.webp" class="figure-img img-fluid" alt="Google Map">
</figure>

In this case, the exact center point of the bounding box (shown as the black rectangle) is outside the polygon. Whilst this won’t always be the case, we clearly need to do some more work here...

## Ensuring the Marker Always Drops Inside the Polygon

To make sure that we find the closest point to the center of our bounding box that is actually inside the polygon, we decided to take the following approach:

* If the bounding box center point is inside the polygon, drop the marker there.
* Otherwise, sample points at fixed percentages of the bounding box’s height North and South of the center point.
* Sample points at fixed percentages of the bounding box’s width East and West of the center point.
* Stop when we find the first point that is inside the area of the polygon, and drop the marker there.
* Wrap this logic up as a function `getApproximateCenter` and add it to the Prototype of `google.maps.Polygon`.

{% include coffee-cta.html %}

The Google Maps API makes this relatively easy to implement this strategy (with minimal math too as we’re using their geometry library).

```
google.maps.Polygon.prototype.getApproximateCenter = function() {
  var boundsHeight = 0,
      boundsWidth = 0,
      centerPoint,
      heightIncr = 0,
      maxSearchLoops,
      maxSearchSteps = 10,
      n = 1,
      northWest,
      polygonBounds = this.getBoundingBox(),
      testPos,
      widthIncr = 0;
  // Get polygon Centroid
  centerPoint = polygonBounds.getCenter();
  if (google.maps.geometry.poly.containsLocation(centerPoint, this))
  {
    // Nothing to do Centroid is in polygon use it as is
    return centerPoint;
  } else {
    maxSearchLoops = maxSearchSteps / 2;
    // Calculate NorthWest point so we can work out 
    // height of polygon NW->SE
    northWest = new google.maps.LatLng(
      polygonBounds.getNorthEast().lat(),
      polygonBounds.getSouthWest().lng()
    );
    // Work out how tall and wide the bounds are and what our search
    // increment will be
    boundsHeight =
      google.maps.geometry.spherical.computeDistanceBetween(
        northWest,
        polygonBounds.getSouthWest()
      );
    heightIncr = boundsHeight / maxSearchSteps;
    boundsWidth = 
      google.maps.geometry.spherical.computeDistanceBetween(
        northWest,
        polygonBounds.getNorthEast()
      );
    widthIncr = boundsWidth / maxSearchSteps;
    // Expand out from Centroid and find a point within polygon at
    // 0, 90, 180, 270 degrees
    for (; n <= maxSearchSteps; n++) {
      // Test point North of Centroid
      testPos = google.maps.geometry.spherical.computeOffset(
        centerPoint,
        (heightIncr * n),
        0
      );
      if (google.maps.geometry.poly.containsLocation(
        testPos, 
        this)
      ) {
        break;
      }
      // Test point East of Centroid
      testPos = google.maps.geometry.spherical.computeOffset(
        centerPoint,
        (widthIncr * n),
        90
      );
      if (google.maps.geometry.poly.containsLocation(
        testPos, 
        this)
      ) {
        break;
      }
      // Test point South of Centroid
      testPos = google.maps.geometry.spherical.computeOffset(
        centerPoint,
        (heightIncr * n),
        180
      );
      if (google.maps.geometry.poly.containsLocation(
        testPos, 
        this)
      ) {
        break;
      }
      // Test point West of Centroid
      testPos = google.maps.geometry.spherical.computeOffset(
        centerPoint,
        (widthIncr * n),
        270
      );
      if (google.maps.geometry.poly.containsLocation(
        testPos, 
        this)
      ) {
        break;
      }
    }
    return(testPos);
  }
};
```

Here, we use `google.maps.geometry.poly.containsLocation` to determine whether the center point of the bounding box is inside the polygon. If not, we then calculate the height and width of the bounding box and divide each by the number of sampling steps we want to take, then loop inspecting points at increasing distances North / East / South / West until we find one that falls inside the polygon. To do this we use:

```
google.maps.geometry.spherical.computeOffset(centerPoint, distance, bearing)
```

to calculate the location of the next point to try, along with:

```
google.maps.geometry.poly.containsLocation(pointToTest, polygon)
```

which tells us whether that point is inside the polygon or not.

The image in figure 1 shows a test polygon with the bounding box also drawn on the map for debugging. The blue marker is the center point of the bounding box, and the algorithm chose to place the marker below that as the point due South is the closest inside the polygon.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/google_maps_figure_1.webp" class="figure-img img-fluid" alt="Figure 1: Example Polygon with Bounding Box">
  <figcaption class="figure-caption text-center">Figure 1: Example Polygon with Bounding Box.</figcaption>
</figure>

Figure 2 demonstrates that the marker lands to the right because the polygon is much wider than it is tall, so in this case we use proportionally larger gaps when looking East/West than we look North/South.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/google_maps_figure_2.webp" class="figure-img img-fluid" alt="Figure 2: A Wider, Narrower Polygon">
  <figcaption class="figure-caption text-center">Figure 2: A Wider, Narrower Polygon.</figcaption>
</figure>

## Testing

So to place the marker, we can now simply use:

```
new google.maps.Marker({
  position: polygon.getApproximateCenter(),
  map: map
});
```

With this done, we then tried out a range of polygons to make sure that we’re always dropping markers in reasonably sensible places regardless of whether the center of the bounding box is inside or outside the polygon.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/google_maps_figure_2.webp" class="figure-img img-fluid" alt="Figure 3: A Selection of Test Polygons">
  <figcaption class="figure-caption text-center">Figure 3: A Selection of Test Polygons.</figcaption>
</figure>

We created a complete example that you can try out yourself, and you can find that [here on GitHub](https://github.com/ModusCreateOrg/google-maps-polygon-center-approximation-blog). You’ll just need to get a Google Maps API key, which is [available here](https://developers.google.com/maps/documentation/javascript/get-api-key).

## Alternative Solutions

Ours is a very simple solution that accomplishes what we needed from it for our use case (our users could also move the markers manually to a position of their liking, and we only needed to show a single polygon on the map at any given time). It is also tied to Google Maps, as we didn’t have to consider other mapping solutions in this case. We could further enhance it to search in more directions (NE, SE, SW, NW for example). This may lead to a slightly better result, and this needs to be traded off against the increased computational cost required.

There may, however, be cases where you need a more exact "center point" than this will offer, or something that doesn’t depend on Google Maps. The MapBox team recently wrote a [blog post](https://www.mapbox.com/blog/polygon-center/) about an algorithm they developed, and they offer a library that finds the point inside the polygon that’s farthest from an edge using a recursive algorithm, without a Google Maps dependency.
 
Hopefully you found this informative and useful, and can maybe have fun using the Google Maps Geometry library in your own projects.  I've love to hear how you get on - get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!