---
layout: post
title:  "No, Maybe and Close Enough! Probabilistic Data Structures with Python"
categories: [Python, Redis, Programming ]
image: assets/images/pycon_main.jpg
author: simon
---
In this talk that I produced for Pycon USA 2021 I take a look at the Hyperloglog and Bloom Filter probabilistic data structures, using examples with the Python language and [Redis](https://redis.io/) with the [RedisBloom module](https://oss.redislabs.com/redisbloom/).

You can watch the video here, the article that follows is a transcript of the talk:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/hM1JPkEUtks" allowfullscreen></iframe>
</div><br/>

My slides are available as a PDF document [here](/no_maybe_and_close_enough_slides.pdf).  If you'd like to try this out for yourself, [get my code from Github](https://github.com/simonprickett/python-probabilistic-data-structures).

---
Hello! My name's Simon Prickett, and this is "No, Maybe and Close Enough" where we're going to look at some Probabilistic Data Structures with Python.

So, the problem we're going to look at today is related to counting things. So counting things seems quite easy on the face of it, we just maintain a count of the things that we want to count and every time we see a new and different thing, we add one to that count... so how hard can this be?

So, let's assume we want to count sheep.  So, I want to count sheep, and I'm doing that in Python.  So I have here a very simple Python program that does exactly that:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pycon_python_set_count.png" class="figure-img img-fluid" alt="Counting sheep with a set in Python">
  <figcaption class="figure-caption text-center">Counting sheep with a set in Python.</figcaption>
</figure>

Python has a set data structure built into it.  These are great for this sort of problem because we can add things to a set and if we add them multiple times it will de-duplicate them, and then we can ask it how many things are in the set.  

On the face of it, we can answer the question "how many sheep have I seen?" with a set.

Here, I'm declaring a set and then adding some sheep ear ID tags to it, so 1934, 1201, 1199 etc.  Then further down, you'll see I add 1934 again.  That's actually going to get de-duplicated, so when we ask this how many sheep are in the set of sheep that we've seen by using the `len` function, it's not going to count that one twice.

So that's perfect!  We've got an exact number of how many sheep we've seen.  Another question that I might want to ask when I'm counting things is not just how many sheep have I seen, but have I seen this particular sheep?  In this case, I need to be able to retrieve data from my set or data structure that I'm using to determine if we've seen this before, so it's a sort of set membership query.  Is sheep 1934 in the set of sheep that we've seen, for example.  Here, again, I'm using a Python set and this seems to be a great fit for this problem:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pycon_python_have_i_seen_this_sheep.png" class="figure-img img-fluid" alt="Checking set membership in Python">
  <figcaption class="figure-caption text-center">Checking set membership in Python.</figcaption>
</figure>

I declare the set with some sheep tags that we've seen already, so 1934, 1201 etc. Then I have a simple function that just basically says "is the sheep ID passed to it in the set of sheep that we have seen?".  And it either is, or it isn't.  And that's going to work perfectly, and it's going to be reliable 100% of the time.  So when we call `have_i_seen("1934")` it's going to say "yes, we have seen sheep 1934".  When asked "have we seen 1283?" it's going to say "no, we haven't seen that one before" (or at least, not yet).

So when we're counting things and we want to answer these two questions: "how many things have I seen?" (or distinct things I have seen), and "have I seen this particular distinct thing?" then a set's got us covered: it's done everything we need.  So, that's it, we're done - problem solved!  But... well, are we?

The set works great, and it's 100% accurate but we had a relatively small dataset.  We had a few sheep, and we were remembering the IDs of all the sheep and the IDs were fairly short, so remembering all of those in a set and storing all of that data is not a huge problem. But, if we need to count huge numbers of distinct things - so we're operating at internet scale, or we're operating at Australia / New Zealand sheep farm scale then we might need to think about this again: because we might have some issues here.

At scale, when things get big with counting things, we start to hit problems with, for example, memory usage.  Remembering all of the things in a set starts to get expensive in terms of the amount of memory that that set requires.  It also gives us a problem with horizontal scaling.  If we're counting lots and lots and lots of things, chances are it's not going to be one person or one process out there counting things using a local in-memory process variable to do it.  We're going to have several processes counting things, and they're going to want to count together and maintain a common count.  So, we need a way of sharing our counters and making sure that updates to them are atomic, so that we do not get false counts or we don't have a problem if one counter goes down we've lost some of the data or we can't fit all of the data in a single process' memory.

Once we get to scale, counting things exactly starts to get very expensive in terms of memory usage, potentially time, performance and concurrency.  One way that we might want to resolve that would be to move the counting problem out of memory and into a database.

Here, I'm using the Redis database for the reason that is has a set data structure so we can take the set that we were using in Python and we can move that out of the Python code and into Redis:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pycon_redis_set_count.png" class="figure-img img-fluid" alt="Counting sheep with Redis">
  <figcaption class="figure-caption text-center">Counting sheep with Redis.</figcaption>
</figure>

This is a fairly simple code change, we just create a Redis connection using the Redis module, and we tell it what the key name of a Redis set that we want to store our sheep counts in is and we just `sadd` things to it.  So, in Python where we were doing `.add` to add things to a set, for Redis' it's `.sadd` or "set add".  Same sort of thing, we say which set we want to put it in because we're now using a database, so we can store multiple of these in a key/value store and we give it the sheep tags.  The same behavior happens, so when I add "1934" a second time, "1934" will be de-duplicated.

And now because we're using Redis for this and it's out of the Python process and accessible across the network, we can connect multiple counting processes to it.  So we can solve a couple of problems here: we can solve the problem of "What if I have a load of people out there counting the sheep and we want to maintain a centralized, overall count" and we've solved the problem of the memory limitations in a given process.  The process is no longer becoming a memory hog with all of these sheep IDs in a set - we've moved that out into a database: in this case Redis.

But, we've still got the problem here of overall size. As we add more and more and more and more sheep, the dataset is still going to take up a reasonable amount of space and that's going to grow according to how we add sheep and if we were using longer tags it would grow more every time we added a new item because we're having to store the items.

Let's have a look at how we can determine if we've seen this sheep before when using a database as well.  So, here we're again using Redis, so imagine we'd put all of our data into that set and we've now got shared counters and lots of people can go out and count sheep.  To know if we've seen this sheep before we then basically have a new `have_i_seen` function and some pre-amble before it that clears out any old set in Redis, and sets up some sample data:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pycon_redis_have_i_seen_this_sheep.png" class="figure-img img-fluid" alt="Checking set membership with Redis">
  <figcaption class="figure-caption text-center">Checking set membership with Redis.</figcaption>
</figure>

What we're going to do now is instead of using an "if sheep tag is in the set" like we did with the Python set, we're going to use a Redis command called `SISMEMBER` so "set is member" and we're going to say "if this sheep ID is in the set then we've seen it, otherwise we haven't".

As we'd expect, that works exactly the same as it does in Python with an in-memory set but we've solved these two problems: we've solved the concurrency problem and we've solved the individual process memory limit problem.  But, we've really just moved that memory problem into the database.

To solve that, and to enable counting at really large scale without chewing through a lot of memory we're going to need to make some tradeoffs.  Tradeoffs basically involve giving up one thing in exchange for another, so our sheep onthe left there has its fleece, our sheep on the right has given up its fleece in exchange for being a little bit cooler but we can determine that both are sheep. 

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/pycon_before_and_after_shearing.jpg" class="figure-img img-fluid" alt="Sheep at different resolutions :)">
  <figcaption class="figure-caption text-center">Sheep at different resolutions :) (<a href="https://flickr.com/photos/cotaro70s/8670036813">Image by contaro70s</a>)</figcaption>
</figure>

This is kind of a key thing here, we've been storing the whole data set and all of the data to determine which sheep we've seen, but can we get away with storing something about the data or bits of the data and still know that its that sheep.  So, the sheep on the left and the sheep on the right, we can still tell they're sheep even though one has lost its fleece.

This is where something called Probabilistic Data Structures come in.  These are a family of data structures that make some tradeoffs.  Rather than being completely accurate, they may tradeoff accuracy for some storage efficiency.  We'll see we can save a lot of memory by giving up a bit of accuracy.  We might also tradeoff some functionality, so as we'll see we can save a lot of memory by not actually storing the data.  This means that we can no longer get a list back of what sheep we've seen but we can still determine whether we've seen a particular sheep with reasonable accuracy.

The other tradeoff that's often involved with probabilistic data structures is performance, but we'll mostly be looking at accuracy, functionality and storage efficiency.

So we have two questions that we wanted to ask here: "how many sheep have I seen?" is the first one, and a data structure or an algorithm that we can use for that, which comes from the probabilistic data structures family, is called the Hyperloglog.  What that does is it approximates distinct items.  Basically, it guesses at the cardinality of a set based on not actually storing the data but hashing the data and storing information about it.  There's some pros and cons to this - the way the Hyperloglog works is that it's going to run all the data through some hash functions and it's going to look at the longest number of leading zeros in what results from that.  It's going to hash everything to a zero or one binary sequence and look for the longest sequence of leading zeros.

There's a formula that we'll look at but don't need to understand which will enable us to determine if we've seen however many items before.  It will allow us to guess the cardinality of the set with reasonable accuracy.

The benefits here are that the Hyperloglog has a similar interface to a set: we can add things to it, and we can ask it how many things are in there.  It's going to save a lot of space, because we're using a hashing function, so it'll come down to a fixed size data structure no matter how much data we put in there.

But, we can't retrieve the items back again, unlike with a set.  That's both a benefit and a tradeoff, because we can't retrieve them... that's great in some cases where we just want a count and we don't want the overhead of storing the information - for example if it's personally identifiable information.  It's also a bad thing if we did want to get the information back, like we can with a set.

We can use Hyperloglog when we want to count, but we don't necessarily need the source information back again.

The other tradeoff involved here is that it's not built into the Python language, so we'll need to use some sort of library implementation and we'll need to use something else to store it in a data store, which we'll look at.

Here are the algorithms for Hyperloglog:

TODO IMAGE

11:39

---

If you're hosting a Meetup or conference, and would like me to talk about these topics either with Python or Node.js, [feel free to contact me](/contact/)!  Hope you enjoyed this talk.