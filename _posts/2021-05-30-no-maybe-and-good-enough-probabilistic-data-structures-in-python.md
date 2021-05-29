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

So that's perfect!  We've got an exact number of how many sheep we've seen.  Another question that I might want to ask when I'm counting things is not just how many sheep have I seen, but have I seen this particular sheep?  1:36.

---

If you're hosting a Meetup or conference, and would like me to talk about these topics either with Python or Node.js, [feel free to contact me](/contact/)!  Hope you enjoyed this talk.