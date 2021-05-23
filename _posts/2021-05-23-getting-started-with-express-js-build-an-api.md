---
layout: post
title:  "Getting Started with Express - Building an API: Part 1"
categories: [Node.js, JavaScript, Programming ]
image: assets/images/express1_main.jpg
author: simon
---
Express is a popular framework for Node.js, intended for use in building web applications and APIs.  In this article and the accompanying video, I'll show you how to get started with it and we'll build a server that mimics some behaviors of a key/value store.  If you're interested in learning more about Express, [check out its website](http://expressjs.com/).

I'll cover the concepts at a high level in this article.  Fos a complete tutorial, watch the video below:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Z04bkB7g36E" allowfullscreen></iframe>
</div><br/>

## What We'll Build

In this first part of the series, we'll build an Express server that has some API endpoints that model a key/value store database.  Think of a key/value store like a hash table, so if we set the key `favoritecolor` to `blue` and the key `luckynumber` to `99`, it might look something like this:

<div class="text-center">
  <figure class="figure">
    <img src="{{ site.baseurl }}/assets/images/express1_kvtable.png" class="figure-img img-fluid" alt="Key Value Table">
    <figcaption class="figure-caption text-center">Key Value Table.</figcaption>
  </figure>
</div>

Our API will include functionality to set a key to a value, retrieve the value stored at a given key, and ask the database for information about things like the number of keys in use.

## How it Works

The video provides a complete run through of how the code in `server.js` works, so here's a summary...

### Setting up an Express Server

First up, I require Express and initialize it.  I get the port number that Express will listen on from an environment variable, and set up an empty JavaScript object to represent the "database".  I then tell Express we want to use its JSON body parsing functionality (for parsing the body of `POST` requests):

<script src="https://gist.github.com/simonprickett/4cd8085b731f0e6ad58453620eab7fd4.js"></script>

The last line of code (`app.listen`) tells Express to listen for HTTP requests on the port that we set in our environment variable, or 3000 if none was set.

### Adding Routes

Routes are functions that tell Express what to do when a HTTP request with a matching URL pattern is received by the server.  Our application has four of these...

**Home Page**

TODO

**Set Key to Value**

TODO

**Get Value of Key**

TODO

**Database Info**

TODO

## Try it Yourself

To try this out, you'll need [git](https://git-scm.com/) and [Node.js](https://nodejs.org/) installed.  I recommend the latest "LTS" (Long Term Stable) version of Node.  At the time of writing, this was 14.17.0 but it will change over time as new releases come out.

### Get the Code

First, get the code:

```bash
$ git clone https://github.com/simonprickett/getting-started-with-express-part-1
$ cd getting-started-with-express-part-1
```

### Install Dependencies

As with most Node.js projects, this one uses depdendencies from the [npm](https://www.npmjs.com/) package registry.  These are listed in the `package.json` file:

```json
  ...
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
  ...
```

Here, I'm declaring that the project uses the Express framework and that, for development only, I want to use nodemon.  This is a convenience package that allows us to speed up development - it watches the Node.js project source code files and restarts the application whenever changes are detected.

Now, install these dependencies (The `npm` command is installed with Node.js, so you won't need to install that separately):

```bash
$ npm install

added 168 packages, and audited 169 packages in 2s

11 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
$
```

Note that while the `package.json` file named two packages (Express and nodemon), 168 packages were installed.  This is because each of the packages our application depdns on have their own dependencies, so npm handled installing all of those for us.

The installed packages will now live in the `node_modules` folder.  This generally isn't something that gets checkec into source control, as its contents can be re-created from `package.json` (and `package-lock.json` which tracks the exact version of all sub-dependencies for us).

### Start the Server

The code from GitHub contains the completed project in the state that it is in at the end of the video.  So, you'll be able to try out setting keys to values, getting the value of a key, and asking the "database" for some basic information about itself.

There are two ways to start the server.  If you want to be able to change the code in your IDE and have to server re-start each time changes are saved, start it as follows:

```bash
$ npm run dev

> getting-started-with-express-part-1@1.0.0 dev
> ./node_modules/nodemon/bin/nodemon.js

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Express application listening on port 3000.
```

This uses nodemon.  To start it without the auto reloading behavior (for example on a production server), use:

```bash
$ npm start

> getting-started-with-express-part-1@1.0.0 start
> node server.js

Express application listening on port 3000.
```

### Try the Endpoints

At this stage of development, our API has three endpoints:

* `GET /dbinfo`: Gets information about the number of keys in the database, can optionally be passed a `details=true` request parameter that will additionally return the names of each key in the database.
* `GET /get/:key`: Gets the value stored in the database at `:key`.  Example: `GET /get/favoritecolor`.
* `POST /set`: Sets the value of a key.  This is a `POST` request that expects a JSON body that looks like this: `{ "key": "favoritecolor", "value": "blue" }`.

You can try the `GET` routes in a browser, but for the `POST` route you'll need something else.  You can either use a graphical tool such as [Postman](https://www.postman.com/) (free download) or the command line [curl](https://curl.se/) tool (may be installed with your operating system already).  I'll provide examples for both here.

Let's start by setting a key.  With Postman, you'll create a `POST` request, set the URL to `http://localhost:3000/set` and set the body to be "Raw" and "JSON".  The screenshot below shows where these settings are, as well as the content of the JSON body for the request:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/express1_postman_set1.png" class="figure-img img-fluid" alt="Set operation with Postman">
  <figcaption class="figure-caption text-center">Set operation with Postman.</figcaption>
</figure>

Click "Send" to submit the request and you should expect to see a 201 created status code and JSON OK response:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/express1_postman_set2.png" class="figure-img img-fluid" alt="Results of set operation with Postman">
  <figcaption class="figure-caption text-center">Results of set operation with Postman.</figcaption>
</figure>

If you're using curl, try this:

```bash
$ curl --location --request POST 'http://localhost:3000/set' \
       --header 'Content-Type: application/json' \
       --data-raw '{
         "key": "favoritecolor",
         "value": "blue"
      }'
{"status":"OK"}$
```

Now we've set a value, let's try getting it back.  As this is a `GET` request you can use a browser for it:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/express1_browser_get.png" class="figure-img img-fluid" alt="Get operation with a browser">
  <figcaption class="figure-caption text-center">Get operation with a browser.</figcaption>
</figure>

Or with curl:

```bash
$ curl --location --request GET 'http://localhost:3000/get/favoritecolor'
{"value":"blue"}$
```

The third and final endpoint allows us to see information about the state of the database.  This is a `GET` request, so let's use the browser.  There are two ways we can call this... first to get basic information:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/express1_browser_dbinfo1.png" class="figure-img img-fluid" alt="Basic DB information with a browser">
  <figcaption class="figure-caption text-center">Basic DB information with a browser.</figcaption>
</figure>

And again, with the extra request parameter `details=true` to get more information:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/express1_browser_dbinfo2.png" class="figure-img img-fluid" alt="Detailed DB information with a browser">
  <figcaption class="figure-caption text-center">Detailed DB information with a browser.</figcaption>
</figure>

## Next Steps

In a future video and accompanying article, I'll show you how to add some Express middleware to validate parameters passed to routes, and how to protect some routes by requiring a valid API token supplied in a HTTP header.

What are you building with Express?  Let me know on [Twitter](https://twitter.com/simon_prickett).  See you for part 2 in the near future!