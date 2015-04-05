---
layout: post
title:  "Dulles TSA Wait API"
date:   2015-04-04 22:44:10
categories: api,php,jquery,javascript
comments: True
---
About two years ago I noticed that my local airport Washingon Dulles was posting 
TSA security wait times on their website for each of the checkpoints at the 
airport.

At the time I was flying through Dulles frequently, so this sort of information 
was useful and I asked them via Twitter if they provided it in API format so it 
could be used with other services.

They replied saying no, but they're always interested in better ways to disseminate
information and I said, OK I'll build a demo "API" that takes what you have now 
and adds a JSON representation of it so that the data can be used elsewhere more 
easily.

I then got busy and things happened, and two years later decided to actually do 
something about it.  I rechecked, and the airport still only provided HTML data, 
but at least on a JQuery Mobile page so it looked easy to parse and extract what 
I wanted.  You can take a look at that [here](http://www.mwaa.com/mobile/IAD/IADWaitTime.html).

I went ahead and did this in PHP and threw it up on a domain I own, along with a 
GitHub repo containing the source and an example HTML / JavaScript client.

The point of this isn't to be a real API, and screen scraping data isn't reliable or a 
clever way of making a pseudo API, but I wanted to show the airport folks how easy 
this is to do, and that they should just take whatever powers that JQuery Mobile 
page and have it also output some JSON.

In my day job, I work with a lot of clients who have aspirations to get all sorts 
of data into single page applications, mobile apps or other end user experiences.  

Usually they have an existing website that serves up the same data, and have a lot of trouble understanding why a good API and a proper content model is needed to allow their data to be used efficiently and flexibly in the project they are trying to complete.  Too often they 
see the new application as a front end only effort, which then limits ability to achieve 
the desired user experience and/or causes the front end to parse out data that should 
have been cleaned up on the server.  Because this happens on the client (user's phone, browser, etc) this leads to that work being done many more times than is necessary as 
each browser or phone running the client has to do it.  It also means that every 
different client that needs the application has to implement whatever logic is necessary 
to get and clean up the data.

If you find yourself working on a project to product something like the Dulles wait 
times mobile web page, consider also adding an API for the data that your new 
page exposes.  A little up front effort will save you a lot of work later when 
some other future project wants to use the data.  You should do this whether the 
project you are working on is public facing or intranet.

API Endpoint
------------

I created a simple PHP page that goes out and gets the HTML for the airport's mobile
TSA wait times page and scrapes the data from it, returning that data in a JSON 
object.  

Here's what my pretty arbitrary JSON format ended up looking like... I left room 
for more airports in there, perhaps Washington Reagan which is also run by the 
Metropolitan Washington Airports Authority, but doesn't seem to offer online TSA wait 
time information at this point.

{% highlight json %}
{
  "airports": [
    {
      "iata": "IAD",
      "name": "Washington Dulles",
      "lastUpdated": "2015-04-04 22:48:00",
      "lastUpdatedTimestamp": 1428202080,
      "checkPoints": [
        {
          "name": "East",
          "wait": 7
        },
        {
          "name": "West",
          "wait": 3
        }
      ]
    }
  ]
}
{% endhighlight %}

For convenience I converted the date to a timestamp to save clients from having to 
do this.  Wait times at each checkpoint are expressed in minutes.

As this was more a "show how easy this is to get done" effort rather than a real 
production one, each call to my JSON API hits the Dulles mobile website and re-scrapes 
the information.  For a "real" implmentation you'd want some caching (and to not have 
to scrape the web page but have the airport publish the data in JSON too).

Here's what the PHP that produces this looks like:

{% highlight php %}
<?php
// Go get the page
$iadUrl = 'http://www.mwaa.com/mobile/IAD/IADWaitTime.html';
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $iadUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

$pageHtml = curl_exec($ch);
curl_close($ch);

// Now parse it
$dom = new DOMDocument();
$dom->loadHTML($pageHtml);

// Get the wait times
$eastWait = -1;
$westWait = -1;
$spans = $dom->getElementsByTagName('span');
foreach($spans as $span) {
  $pos = strpos($span->nodeValue, 'minute');

  if ($pos > 0) {
    // -2 gets rid of the &nbsp;
    $waitTime = trim(substr($span->nodeValue, 0, $pos - 2));
    if ($eastWait === -1) {
      $eastWait = $waitTime;
    } else {
      $westWait = $waitTime;
    }
  }
}

// Get the last updated time
$paras = $dom->getElementsByTagName('p');
$lastUpdated = '';

foreach($paras as $para) {
  if (strpos($para->nodeValue, '* Last updated at') !== false) {
    // 19 = length of * Last updated at plus 2 for the &nbsp;
    $lastUpdated = trim(substr($para->nodeValue, 19));
    break;
  }
}

// Time zone
$dt = new DateTime($lastUpdated, new DateTimeZone('America/New_York'));

$jsonOut = '{ "airports": [ { "iata": "IAD", "name" : "Washington Dulles", "lastUpdated": "' . $lastUpdated . '", "lastUpdatedTimestamp": ' . $dt->getTimestamp() . ', "checkPoints": [ { "name": "East", "wait" : ' . $eastWait . ' }, { "name": "West", "wait" : ' . $westWait . ' } ] } ] }';

// Send the response with appropriate content type
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
print $jsonOut;
?>
{% endhighlight %}

I added the Access-Control-Allow-Origin header to enable CORS, so that browser clients 
can make requests from other domains, making this easier to use in mash up type browser 
applications.

Sample Client
-------------

I built a simple client (I'm no web developer but this will do) which exercises the PHP, 
gets the data and displays it.  This is a simple HTML / JavaScript client, but could be 
anything really for example an Arduino driving a LED display.

{% include codepen.html user="simonprickett" pen="ByeNbZ" tab="result" height="450" %}

I don't really intend this to be anything other than a demo howto client, sure other 
people could do a lot better.

Use it Yourself
---------------

If you want to use this, it's running at:

* JSON API: [http://dulleswaitapi.crudworks.org/](http://dulleswaitapi.crudworks.org/) -- has CORS so is accessible cross domain by JavaScript clients
* Basic example JS / HTML client: [http://dulleswaitapi.crudworks.org/demo/example.html](http://dulleswaitapi.crudworks.org/demo/example.html)
* GitHub: [https://github.com/simonprickett/dulleswaitapi](https://github.com/simonprickett/dulleswaitapi)

Feel free to do anything you like with this, but mostly thing about producing proper 
APIs for any content you put out there on the web so hacks like this become 
unnecessary.