---
layout: post
title:  "Dead or Alive - an Alexa Skill using Redis"
categories: [ Node.js JavaScript Redis Alexa ]
image: assets/images/alexa_doa_main.jpg
author: simon
---
I often find that I build an Alexa skill whenever I want to play around with an API. The voice interface is easy to get started with and I can create something without worrying about visual design or CSS :) A while ago I created a [Dead or Alive package](https://simonprickett.dev/wikipedia-dead-or-alive/) that's on [npm](https://www.npmjs.com/package/wikipediadeadoralive)... let's see what it takes to turn that into a game for Alexa where the user has to determine whether a few celebrities are dead or alive...

Here's a demo of the finished article running in the Alexa Developer Console:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/hRaeTzdxrY0" allowfullscreen></iframe>
</div><br/>

## Game Design

In my simple game, the user plays three rounds.  In each round, they're asked whether a celebrity is dead or alive.  The game checks their answer using my dead or alive package which in turn uses Wikipedia as its data source.  Alexa responds to tell the user whether they were right or not, and to read them a short biographical summary about the celebrity.  Each right answer earns one point, and after three rounds the user finds out their final score.

The game has a pool of celebrities that it can pick from, and checks their dead or alive status against Wikipedia using my existing package.  To store the pool of celebrities, I needed a database... I chose Redis as I also wanted to cache lookups from Wikipedia so that I'm not making too many requests to it, and Redis is perfect for both data storage and caching. As we'll see, there are also some properties of Redis Sets that are useful here. 

The game also needs to remember which celebrity the user was asked about in the current round, and the user's score.  Alexa maintains session state for each interaction with a skill, and I'll use that to store these as they don't need to be persisted to a database and aren't shared between users.

## Database Setup 

I needed a pool of celebrities that the code can randomly select from each time a user starts a new game. The record for each celebrity should consist of their name and profession, so users have some context.  I decided to include 100 celebrities in a JSON file, for example:

<script src="https://gist.github.com/simonprickett/eb5f05a24a0806d9a5c1132ad92bbd74.js"></script>

I modeled each celebrity record in Redis as a Redis Hash with `name` and `bio` fields.  For the key name, I used the celebrity's name with spaces replaced by underscores, and I decided to prefix all keys with `doa:` to distinguish them from anything else that was in the same Redis instance. So, the key for Pharrell Williams would be `doa:Pharrell_Williams` and the data looks like this:

```
> HGETALL doa:Pharrell_Williams

1) "name"
2) "Pharrell Williams"
3) "bio"
4) "Singer and producer"
```

As well as the Hashes, I needed a Redis Set containing each of the celebrity key names. Putting these into a set allows me to use Redis' [`SRANDMEMBER`](https://redis.io/commands/srandmember) command to randomly pick a celebrity to ask users about... we'll look at that later.

I wrote a dataloader in Node.js to take my JSON file and import it into Redis. This uses the Redis protocol's [pipeline](https://redis.io/topics/pipelining) feature to load the data with the [ioredis](https://github.com/luin/ioredis) client:

<script src="https://gist.github.com/simonprickett/e969cfc7778407a88c06716c2ecf3815.js"></script>

[Check out the complete data loader code on GitHub](https://github.com/simonprickett/alexa-dead-or-alive-game/tree/master/dataloader).

As I needed a Redis Instance that my skill's backend would be able to connect to from AWS, I set up a [free 30Mb Redis Labs instance](https://redislabs.com/try-free/) - their free trial program allows you to choose which cloud your instance is in, so I was able to select AWS and the us-east region - keeping my data close to my code for minimal latency.  *Full disclosure: I'm employed by Redis Labs.*

## Coding with Alexa Hosted Skills

[Alexa Hosted Skills](https://developer.amazon.com/en-US/docs/alexa/devconsole/about-the-developer-console.html) simplify the Alexa skill development and hosting process by allowing you to write, test and deploy code from a single console without having to switch back and forth from AWS Lambda. I'd never used this before, so decided to try it out and do all my coding in the browser. This won't be a blow by blow Alexa Skill development tutorial, we'll just look at some of the key interactions that I built.

I picked Node.js to build my skill in, but could have also chosen Python. Here's what the development environment looks like:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/alexa_doa_dev_console.png" class="figure-img img-fluid" alt="Coding in the Alexa Developer Console">
  <figcaption class="figure-caption text-center">Coding in the Alexa Developer Console.</figcaption>
</figure>

One limitation I found with Alexa Hosted Skills was that I couldn't set environment variables in the console and reference them in my code... I wanted to do this to keep the Redis hostname, port and password out of the code... so I used the [dotenv](https://www.npmjs.com/package/dotenv) package and a `.env` file to keep these in instead.  Remember not to commit secrets files to source control! 

Overall I thought the hosted skills environment was pretty easy to work with, and you can download your code and use a "proper" editor if you prefer.

## Creating the Voice Interaction Model

The voice interaction model works in the same was as any other Alexa Skill - I set up intents for each of the interactions that I wanted the user to have with my game... 

* Start a new game
* Answer, indicating that the user thinks the celebrity is alive
* Answer, indicating that the user thinks the celebrity is dead

Intents and sample utterances (words that should trigger the intent) can be configured in the Alexa Developer Console by filling out forms in the browser:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/alexa_doa_interaction_model.png" class="figure-img img-fluid" alt="Creating the Interaction Model.">
  <figcaption class="figure-caption text-center">Creating the Interaction Model</figcaption>
</figure>

This creates a JSON document that you can download as part of the project and keep in source control.  [Here's my final interaction model on GitHub](https://github.com/simonprickett/alexa-dead-or-alive-game/blob/master/alexaskill/interactionModels/custom/en-US.json).

## Code: Starting a New Game

Whenever a user wants to start a game, I need to pick three random celebrities from the pool in Redis - one for each round of the game.  The Redis [`SRANDMEMBER`](https://redis.io/commands/srandmember) command does this for me - it returns a random member from the Set of celebrity key names I created, without removing that member from the Set.

I decided to store each game's Set of three celebrities in Redis too, using a key name that includes the session ID that Alexa provides so that I can easily determine which set belongs to which user.  I build that set up by calling `SRANDMEMBER` over and over until three different celebrity names are returned:

<script src="https://gist.github.com/simonprickett/aa05d919b758143526d2a836ce975a51.js"></script>

Now I have three celebrities stored, I also set a time to live on the session's key in Redis... in case the user gets part way through playing the game and abandons it... Redis will clean up this temporary data automatically when the TTL expires. This prevents data from old sessions from taking up space in Redis.  If the user finishes their game, I'll explicitly delete this data to get rid of it sooner as I'll know it is no longer needed.

This could be more efficient, as it makes numerous network round trips to Redis and back. I could optimize this and make it a Lua script that runs inside the Redis server, although this method would block the Redis server from doing anything else while it runs the script.

Now I've got the celebrities for this user's game in a Set in Redis, I need to set the initial score to 0 and ask the user about the first celebrity... I set the score in the Alexa session attributes, then pick a random celebrity from the user's Set of 3 and store that name in the session attributes too... so that when the user answers, we know which name they were answering for:

<script src="https://gist.github.com/simonprickett/d46143048f84e6612a1a79ba9378667b.js"></script>

How does `getRandomCeleb` work? Here's the code:

<script src="https://gist.github.com/simonprickett/6c8bf8efaf39befc4d11d0463146dd1c.js"></script>

Given an Alexa session ID, it generates the Redis key name that I stored the Set of celebrities for that session in. It then uses the Redis [`SPOP`](https://redis.io/commands/spop) command to remove and return a random member of that Set.

Finally, to get some context for the user, I call `getCeleb` which in turn uses the Redis [`HGETALL`](https://redis.io/commands/hgetall) command to retrieve the Hash for that celebrity... containing that extra context we want to give the user, for example for Pharrell Williams, this would be "Singer and producer":

<script src="https://gist.github.com/simonprickett/7b5edcc12852404e2461935637040715.js"></script>

I use these values to build up a string that Alexa speaks to the user, asking them whether they think that the celebrity is dead or alive.

## Code: Checking the User's Answer and Updating their Score

When the user answers to say whether they think the celebrity is dead or alive, I need to determine whether they've answered correctly and if so, update their score. I have separate intent handlers for dead and alive answers that call a common function `handleDeadOrAliveAnswer`.

In that common function, I need to know which celebrity the user session that responded was looking at... and I stored that in the Alexa session. I get the name out and pass it to a function called `validateAnswer` which returns an object containing information about the celebrity... I check the properties of that object to see if the user's guess was correct, and use them to build up the speech string that Alexa will respond with.  If they were right, I find their current score in their session attributes and add 1 to it:

<script src="https://gist.github.com/simonprickett/f48a736dacb408f3f908afbc7cad0f15.js"></script>

How does `validateAnswer` work? It does some checks, then calls `getCelebStatus`, checking the object returned to see if the user was right or not:

<script src="https://gist.github.com/simonprickett/4e96154bce443d8b2b92a09749d8c495.js"></script>

The work to see if the celebrity is dead or alive is done in the `getCelebStatus` function... this first checks in Redis to see if we've previously determined this celebrity's status and cached it... if not, it uses my separate [wikipediadeadoralive module](https://www.npmjs.com/package/wikipediadeadoralive) to go get information about the celebrity from Wikipedia, caching the result in Redis for a while to save on duplicate lookups:

<script src="https://gist.github.com/simonprickett/9c665aae857d47520502471d558a02ab.js"></script>

Note that ioredis returns an empty object when a Hash doesn't exist, I'm detecting that by counting the number of keys... if you know a better way of comparing with an empty object, let me know!

While making the video walkthrough of this project, I realized I am setting a TTL on all Wikipedia lookups regardless of whether the celebrity turns out to be dead or alive... I could optimize this so that there's no TTL on results for dead celebrities, as that status isn't going to change... someone who is alive might have died by the next time we need their status, so we definitely want a TTL on those!

## Code: Moving to the Next Round

Having established whether or not the user answered correctly and updated their score accordingly, the next job is to start the next round by asking them about another celebrity.  I call `getRandomCeleb` again to get the next celebrity, update the user's session accordingly and ask them whether they think this new person is dead or alive:

<script src="https://gist.github.com/simonprickett/adda2b892e164d15bf349f3d6f3f2e05.js"></script>

## Code: Game Over!

The end of the game is handled in `handleDeadOrAliveAnswer`, which processes the user's answers.  

As we saw in "Moving to the Next Round", the next celebrity to ask the user about is randomly chosen from the current game's Redis Set of celebrities using the [`SPOP`](https://redis.io/commands/spop) command in the `getRandomCeleb` function. When this function returns nothing, I know that there are no more rounds left for the user to play, so I tell the user their score and clean up the session attributes that track score and current celebrity:

<script src="https://gist.github.com/simonprickett/1ab57ab1c563b379a3a0a33323c01081.js"></script>

This ensures that, if the user tries invoking the answer handler again, they'll be told that they don't have a game in progress.

## Testing the Skill

The skill code can be tested directly in the Alexa Developer Console, you don't need an Echo or other Alexa hardware device. In the "Test" tab, you can either type or speak to Alexa and see the exchange between the Alexa platform and the Lambda function code:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/alexa_doa_interaction_model.png" class="figure-img img-fluid" alt="Testing the skill">
  <figcaption class="figure-caption text-center">Testing the skill.</figcaption>
</figure>

Alexa's responses appear in the console, and if you have the volume turned up, they're also spoken for you. Here's an example run through session:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/hRaeTzdxrY0" allowfullscreen></iframe>
</div><br/>

Logs from the Lambda function appear in Cloudwatch Logs, accessible from the "Code" tab.. it's probably worth having that open in another browser window to save on back and forth when debugging.

## Try it Yourself!

If you'd like to try this project out, I've put the code for the Alexa skill and data loader on GitHub, along with my celebrities JSON data file. Feel free to [clone the repo here](https://github.com/simonprickett/alexa-dead-or-alive-game) and [get a free Redis Cloud instance here](). If you build anything fun with it, I'd love to hear from you!

*(Main Photo by [Anete Lusina](https://www.pexels.com/@anete-lusina) from Pexels).*