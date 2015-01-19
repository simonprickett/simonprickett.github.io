---
layout: post
title:  "Cordova Now Requires a Namespace for Apps"
date:   2014-11-26 14:30:00
categories: cordova phonegap android ios javascript
comments: True
---
I recently had to update a Cordova project from version 3.0.0 to 3.6.3.  During this
process I found that the app ID in 3.6.3 must now contain at least one . -- this wasn't 
the case in 3.0.0, and can be an issue if you already have an app in the App Store / on 
Google Play.

Let's try using Cordova 3.6.3 to create a new project with no ID specified:

{%highlight bash %}
simon$ cordova -version
3.6.3-0.2.13

simon$ cordova create doge
Creating a new cordova project with name "HelloCordova" 
and id "io.cordova.hellocordova" at location "/Users/simon/projects/doge"
{% endhighlight %}

Note that "io.cordova" is prefixed onto the ID by the CLI.

We can continue to work with this project using the CLI with no issues:

{% highlight bash %}
simon$ cd doge
simon$ cordova platform add android
Creating android project...
Creating Cordova project for the Android platform:
     Path: platforms/android
     Package: io.cordova.hellocordova
     Name: HelloCordova
     Android target: android-19
Copying template files...
Project successfully created.
{% endhighlight %}

Let's try starting another new project, and give it an explicit ID... with a . in:

{% highlight bash %}
simon$ cordova create suchproject doge.suchproject
Creating a new cordova project with name "HelloCordova" 
and id "doge.suchproject" at location "/Users/simon/projects/doge/suchproject"
simon$ cd suchproject
simon$ cordova platform add android
Creating android project...
Creating Cordova project for the Android platform:
     Path: platforms/android
     Package: doge.suchproject
     Name: HelloCordova
     Android target: android-19
Copying template files...
Project successfully created.
{% endhighlight %}

So that's also good.  Now, let's try specifying an ID, without a . in it...

{% highlight bash %}
simon$ cordova create sobroken doge
Creating a new cordova project with name "HelloCordova" 
and id "doge" at location "/Users/simon/projects/doge/suchproject/sobroken"
simon$ cd sobroken
simon$ cordova platform add android
Creating android project...
/Users/simon/.cordova/lib/npm_cache/cordova-android/3.6.3/package/bin/node_modules/q/q.js:126
                    throw e;
                          ^
Package name must look like: com.company.Name
Error: /Users/simon/.cordova/lib/npm_cache/cordova-android/3.6.3/package/bin/create: Command failed with exit code 8
    at ChildProcess.whenDone (/usr/local/lib/node_modules/cordova/node_modules/cordova-lib/src/cordova/superspawn.js:135:23)
    at ChildProcess.EventEmitter.emit (events.js:98:17)
    at maybeClose (child_process.js:735:16)
    at Process.ChildProcess._handle.onexit (child_process.js:802:5)
{% endhighlight %}

Well that didn't work... not sure if this is as such a bug, but caused me an issue as my existing app in the stores has an ID without a . in it.