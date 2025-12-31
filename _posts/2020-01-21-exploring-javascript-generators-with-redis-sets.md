---
layout: post
title:  "Exploring JavaScript Generators with Redis Sets"
categories: [ JavaScript, Node.js, Redis, Coding ]
image: assets/images/jsgenerator_main.webp
author: simon
---
Back in October 2019, I attended the [San Diego JS](https://www.sandiegojs.org/) "Fundamental JS" meetup where one of the talks was about generator functions.  After the talk I decided to see if I could use a generator function to iterate over the members of a set stored in Redis.  I wrote some code in Node.js, and never quite got around to writing about it until now...

## What are JavaScript Generators?

MDN provides the following [definition](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) for generators:

> "Generators are functions which can be exited and later re-entered. 
> Their context (variable bindings) will be saved across re-entrances."

Generators were introduced with ECMAScript 6, and have been available in Node.js since version 4.9.1 (source: [node.green](https://node.green/)).

Regular JavaScript functions will run until they end, either by hitting a `return` statement, or just running off the end of the function's code.  Generator functions differ from regular functions in that they can also run until execution is yielded.

Generator functions are identified by a `*` before their names.  When called, a generator function returns an iterator... this iterator's `next()` function can then be called to execute the generator function's logic and get a value from it.  

Every time the `next()` function is called, the generator runs until it hits a `yield` expression.  This returns a value from the generator function, and suspends its execution until `next()` is called again.  The internal state of the generator function is maintained between executions.

{% include coffee-cta.html %}

The value returned by the generator function is an object containing two keys: `value` and `done`.  `value` contains the actual value returned by the generator function, and `done` will be set to `false` if the generator function has more values to yield on subsequent calls to `next()`, or `true` if the generator function is out of new values and should not be called again.

## A Simple Example

Let's quickly look at a simple example of a generator function that yields a number each time it runs, until it has nothing new to yield.  The code below will yield the numbers 0-5 inclusive, before falling off the end of the function and returning rather than yielding:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/jsgenerator_generatenumbers.webp" class="figure-img img-fluid" alt="Code for a simple generator example.">
  <figcaption class="figure-caption text-center">A simple generator example.</figcaption>
</figure>

Each call to the generator's iterator - `next()` causes the code to run until a `yield` statement.  The first five times this happens, the value of `n` is yielded, and on the sixth iteration the code falls out of the `for` loop and returns like a normal function.  This causes the object returned from the generator function to have `done` set to `false`, and the code to exit.  Here's what happens when we run this simple generator script:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/jsgenerator_running_generate_numbers.webp" class="figure-img img-fluid" alt="Example generator code.">
  <figcaption class="figure-caption text-center">Output from running the example code.</figcaption>
</figure>

As expected, the subsequent calls to `next()` yield an object where the `value` key contains the numbers 1-5 and the `done` key contains `true`.

## Using a Generator to Iterate Over a Set in Redis

A use case that I immediately saw generators being a good fit for was retrieval of all of the values from a Redis set (disclosure: I work for [Redis Labs](https://redislabs.com), so think about Redis quite a lot).  I started writing some code for this at the meetup to try out the concept for myself.  

Redis supports sets as a data type, which models the mathematical concept of a set.  New member values can be added to a set with the `SADD` command, and any duplicates will be removed.  Here's a basic demo of this using `redis-cli` to store and retrieve a set of candy bar names:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/jsgenerator_candybars.webp" class="figure-img img-fluid" alt="Set example in Redis.">
  <figcaption class="figure-caption text-center">Creating a set in Redis.</figcaption>
</figure>

Here, I'm adding 7 members to a set named `candy`.  As I'm adding "Twix", "Snickers" and "KitKat" multiple times, Redis will de-duplicate these as a set's members must be unique.

This leaves us with 4 unique members as we can see from running the `SCARD` command that returns the cardinality of the set.

The `SMEMBERS` command retrieves all members of the set and, as we might expect, returns the 4 unique candy bar names.  

Redis sets can hold a huge number of members, to be precise 2<sup>32</sup> - 1 (4294967295, more than 4 billion).  As the cardinality of a set gets larger and larger, using `SMEMBERS` to get all members at once from the Redis server becomes costly for a few reasons:

1. It will take the single threaded Redis server more time to retrieve the members of the set, blocking other operations.
2. All of that data will then have to be sent across the network as a single response from the Redis server to the client that issued the `SMEMBERS` command.
3. The client will have to wait for all of the data to be returned from Redis before it can display or work with any of it.

To provide a more performant solution for large sets, Redis provides the `SSCAN` command.  This allows us to incrementally iterate over the members of a set, returning a few at a time along with a cursor value to be fed into the next `SSCAN` command so that we can pick up where we left off and get the next few members on a subsequent call.  A complete read of a large set can be achieved by repeatedly calling `SSCAN` until the cursor value returned is 0, indicating no more members remain to be read.

Let's look at this with a slightly larger set example.  This time we'll add a few more members to a set called `usernames` and use the `SSCAN` command to retrieve them all.  Starting with cursor value 0, we then use the cursor value returned by Redis in the next `SSCAN` call, until we receive 0 back again:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/jsgenerator_sscan.webp" class="figure-img img-fluid" alt="SSCAN example with Redis.">
  <figcaption class="figure-caption text-center">SSCAN example with Redis.</figcaption>
</figure>

This pattern is sort of like a generator in that we're calling the same command (function) multiple times, and keeping state between calls.  We also have a distinct end state where it no longer makes sense to call the function again.

I figured that implementing a Redis set scan as a generator was a good idea because it wraps the Redis specifics inside the generator function, leaving the developer to work with the standard generator / iterator pattern without needing to worry about the Redis specific details.  This then became a very simple implementation where my generator function remembers the cursor value returned from each Redis `SSCAN` command, and yields the results until the cursor returned is 0.  You can see my implementation in the function `setMembersGenerator` at line 29 below:

<script src="https://gist.github.com/simonprickett/960062759aa75a4c20c381f9f4e99006.js"></script>

Running this script will create an example set in Redis and populate it with some sample data values.  It then repeatedly calls the generator's iterator (`next()`), receiving multiple set members back from Redis on each call then terminating when no more remain:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/jsgenerator_redis_output.webp" class="figure-img img-fluid" alt="Output from the Redis set generator example.">
  <figcaption class="figure-caption text-center">Output from running the Redis set scanning generator.</figcaption>
</figure>

Note that because Redis is accessed as a server across a network, all command invocations from Node.js are asynchronous.  I chose to wrap all of the Redis clients functions in Promises with the Bluebird promise library, and this means that I can then use `async` and `await`, which are also allowed with generator functions.

If you're interested in playing with this concept some more, I've made my code freely available on GitHub [here](https://github.com/simonprickett/redis-sscan-with-generator).  If you need to install Redis, you can get [started with that here](https://redis.io/download).

Thanks for reading, I'd love to hear about what you're using generators and/or Redis for!  Get in touch via the [Contact page](https://simonprickett.dev/contact/).