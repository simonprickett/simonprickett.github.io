---
layout: post
title:  "Dead or Alive - an Alexa Skill using Redis"
categories: [ Node.js JavaScript Redis Alexa ]
image: assets/images/alexa_doa_main.jpg
author: simon
---
I often find that I build an Alexa skill whenever I want to play around with an API. The voice interface is easy get started with and I can create something without worrying about visual design or CSS :) A while ago I created a [Dead or Alive package](https://simonprickett.dev/wikipedia-dead-or-alive/) that's on [npm](https://www.npmjs.com/package/wikipediadeadoralive)... let's see what it takes to turn that into a game for Alexa where the user has to determine whether a few celebrities are dead or alive...

Here's a demo of the finished article running in the Alexa Developer Console:

TODO VIDEO HERE!!!

## Game Design

In my simple game, the user plays three rounds.  In each round, they're asked whether a celebrity is dead or alive.  The game checks their answer using my dead or alive package.  Alexa responds to tell the user whether they were right or not, and to read them a short biographical summary about the celebrity.  Each right answer earns one point, and after three rounds the user finds out their final score.

The game has a pool of celebrities that it can pick from, and checks their dead or alive status against Wikipedia using my existing package.  To store the pool of celebrities, I needed a database... I chose Redis as I also wanted to cache lookups from Wikipedia so that I'm not making too many requests to it, and Redis is perfect for both data storage and caching. As we'll see, there are also some properties of Redis Sets that are useful here. 

The game also needs to remember which celebrity the user was asked about in the current round, and the user's score.  Alexa maintains session state for each interaction with a skill, and I'll use that to store these as they don't need to be persisted to a database and aren't shared between users.

## Database Setup 

I need a pool of celebrities that the code can randomly select from each time a user starts a new game. The record for each celebrity should consist of their name and profession, so user's have some context.  I decided to include 100 celebrities in a JSON file, for example:

<script src="https://gist.github.com/simonprickett/eb5f05a24a0806d9a5c1132ad92bbd74.js"></script>

I modeled each celebrity record in Redis as a Redis Hash with `name` and `bio` fields.  For the key name, I used the celebrity's name with spaces replaced by underscores, and I decided to prefix all keys with `doa:` to distinguish them from anything else that was in the same Redis instance. So, the key for Pharrell Williams would be `doa:Pharrell_Williams`.

As well as the Hashes, I needed a Redis Set containing each of the celebrity names. Putting these into a set allows me to use Redis' [`SRANDMEMBER`](https://redis.io/commands/srandmember) command to randomly pick a celebrity to ask users about... we'll look at that later.

I wrote a dataloader in Node.js to take my JSON file and import it into Redis. This uses the Redis protocol's [pipeline](https://redis.io/topics/pipelining) feature to load the data with the [ioredis](https://github.com/luin/ioredis) client:

<script src="https://gist.github.com/simonprickett/e969cfc7778407a88c06716c2ecf3815.js"></script>

[Check out the complete data loader code on GitHub](https://github.com/simonprickett/alexa-dead-or-alive-game/tree/master/dataloader).

## Coding with Alexa Hosted Skills

TODO

## Starting a New Game

TODO

## Checking the User's Answer

TODO

## Updating the User's Score

TODO

## Moving to the Next Round

TODO

## Game Over!

TODO

## Testing the Skill

TODO

## Try it Yourself!

If you'd like to try this project out, I've put the code for the Alexa skill and data loader on GitHub, along with my celebrities JSON data file. Feel free to [clone the repo here](https://github.com/simonprickett/alexa-dead-or-alive-game). If you build anything fun with it, I'd love to hear from you!

*(Main Photo by [Anete Lusina](https://www.pexels.com/@anete-lusina) from Pexels)*