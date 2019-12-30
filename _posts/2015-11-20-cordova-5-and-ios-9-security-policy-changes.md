---
layout: post
title:  "Cordova 5 & iOS 9 Security Policy Changes"
categories: [ JavaScript, Cordova, iOS ]
image: assets/images/cordova_security_main.png
author: simon
---
Cordova 5 was introduced earlier this year, and we’d recommend using it for any new Cordova app development as it contains improvements to developer workflow, bug fixes, performance enhancements and new functionality.

(This article originally appeared on the [Modus Create blog](https://moduscreate.com/insights/blog/)).

However, we notice many developers building new Cordova 5 projects, or upgrading older ones, encounter problems with loading remote content into their apps. These issues manifest in different ways. For example:

* Ajax requests to backend servers for data or images stop working; the server never receives them.
* JavaScript frameworks such as JQuery may display random failures.
* Apps may be able to load data on Android devices, but not on some iOS devices.
* There may be no errors in your logs that could help you determine the cause of the issues.

There are a couple of root causes for these issues:

* Cordova 5 adds a new security mechanism, the [Content Security Policy](http://content-security-policy.com/). This is configured by means of a meta tag in the head section of your app’s `index.html`, and is a W3C recommendation that some web browsers also implement. By default, Cordova generates a Content Security Policy that does not allow access to external resources, and to disallow some JavaScript features that could be considered dangerous (but which are needed for some frameworks to function). When upgrading an older app code base, it’s likely that the Content Security Policy will not be defined in the older project, which causes the same issues you would find in a newly created Cordova 5 app.
* Apps built using Xcode 7 will use the iOS 9 SDK. iOS 9 implements a new feature called [App Transport Security](https://developer.apple.com/library/ios/technotes/App-Transport-Security-Technote/) (ATS). By default, ATS does not allow apps built with Xcode 7 to make Ajax connections to servers that are not secured by SSL. Many developers are coming across this for the first time at the same time as they upgrade their stack to use Cordova 5, meaning it is common to incorrectly assume that this is a Cordova version issue.

The Content Security Policy is a browser policy designed to help prevent Cross Site Scripting attacks on the web. It works by restricting dynamic content to known safe sources. App Transport Security is an iOS 9 feature that aims to ensure network connections meet specified security criteria. Whilst we are going to have to do some work to accommodate both of these, they represent steps in the right direction towards better data security both on the web and in our apps.

## Reproducing the Issues: Create a Test App

Let’s look at what happens when we create a new app using Cordova 5, and how we can configure that app to allow us to make the requests we need to make, whilst still blocking those we might consider rogue.

First, we’ll build a test application using the Cordova 5 boilerplate for iOS and Android.

<script src="https://gist.github.com/simonprickett/949c99151a4046ee057d.js"></script>

**Note:**

Plugin [cordova-plugin-whitelist](https://github.com/apache/cordova-plugin-whitelist) was automatically added because it is referenced in the boilerplate `config.xml`. This is a change from older versions of Cordova — the whitelist plugin is now included by default in all new projects.

This gets us a generic Cordova boilerplate application that simply responds to the `deviceReady` event and updates a status message. When run on a device or in an emulator, we expect the output to look like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cordova_security_ready.png" class="figure-img img-fluid" alt="Cordova boilerplate application.">
</figure>

## Step 1: Setting up our App to Make an Ajax Call

Let’s update the boilerplate app that the Cordova CLI created for us, and change that “Device is Ready” message to something more interesting. Suppose we want to display the current value of the Euro in US Dollars.

Fixer.io provides a really simple JSON API for this, that can be called with a straightforward GET request to:

```
http://api.fixer.io/latest?base=USD&symbols=EUR
```

The response from this API looks like:

<script src="https://gist.github.com/simonprickett/aa8ea030325605055d84.js"></script>

To make our app get and display the exchange rate value, we’ll need to modify its `index.html` and `js/index.js` files.

## Modifying index.html

As this is a simple demo, we’ll keep the HTML almost the same as Cordova’s boilerplate, but make one small change, swapping:

<script src="https://gist.github.com/simonprickett/3a7b0aa44d91023ad130.js"></script>

for:

<script src="https://gist.github.com/simonprickett/43be56b5e7580884d321.js"></script>

This simply changes the app’s startup message to “Initializing...”, removes the blinking, and allows us to retrieve the DOM elements for each paragraph using their id rather than by class.

As this HTML document was created by Cordova 5’s CLI, note that it now contains a new meta tag `Content-Security-Policy` that previous versions of Cordova did not include.

<script src="https://gist.github.com/simonprickett/fc45870d9bb362a7181d.js"></script>

## Modifying js/index.js

To get the Euro value from Fixer.io’s API, let’s add a new function in `js/index.js` and call it updateEuroValue. This replaces the Cordova boilerplate’s `onDeviceReady` function that we can now remove entirely.

So our `js/index.js` file will now look like this:

<script src="https://gist.github.com/simonprickett/b434419d1aefe6e43550.js"></script>

We’ve set `updateEuroValue` to be called as soon as Cordova finishes initializing and raises the `deviceready` event.

`updateEuroValue` simply makes an Ajax request to the Fixer.io API, and on receiving a 200 (OK) response it displays the exchange rate in the `results` paragraph and hides the `initializing` paragraph. If our network call results in an error, we’ll display “Error Connecting to API.”

## Testing the App

In the Terminal, we can build and test our app:

```
$ cordova build ios
```

Open up the iOS project with Xcode and hit play. In previous versions of Cordova, we would have expected this to work and we’d be looking at the current Dollar value of the Euro.

However, in Cordova 5 we never see the app get out of the “Initializing...” state; it gets stuck here:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cordova_security_initializing.png" class="figure-img img-fluid" alt="App stuck at initializing status.">
</figure>

Additionally, we don’t see anything useful in the console output in Xcode. Android devices will show similar results.

What’s happened here is that the default Content Security Policy that the Cordova boilerplate app comes with has blocked our request to Fixer.io. We can’t see this in Xcode because by default the Cordova boilerplate app doesn’t install the console logging plugin.

However, when we open up Safari’s (or Chrome’s for Android devices) remote debugger , select the iOS Simulator, and hit Cmd-R to reload the page in Cordova’s webview, then we see where our problem is. Safari’s JavaScript console tells us:

```
Refused to connect to ‘http://api.fixer.io/latest' because it violates the following Content Security Policy directive: “default-src ‘self’ data: gap: https://ssl.gstatic.com ‘unsafe-eval’”. Note that ‘connect-src’ was not explicitly set, so ‘default-src’ is used as a fallback.

SecurityError: DOM Exception 18: An attempt was made to break through the security policy of the user agent.
```

The default Content Security Policy that the Cordova boilerplate app generated (in `index.html`) is:

<script src="https://gist.github.com/simonprickett/d6f211f042b5baf3c98d.js"></script>

There are a few things going on here, so let’s break it down into its constituent directives.

### default-src Directive:

```
default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval';
```

Unless specified otherwise by other directives, only allow local (bundled with the application) CSS, JavaScript, images, fonts, etc. Allow data scheme resources to be loaded (e.g. base64 encoded images).

* `unsafe-eval`: Allows JavaScript from any of the above sources to use dynamic JavaScript evaluation: for example using `eval()`.
* `gap`: Cordova specific, the gap scheme enables JS <-> native communications for iOS.
* `https://ssl.gstatic.com`: Cordova specific, required for Android so that TalkBack (accessibility) works properly.

### style-src Directive:

```
style-src 'self' 'unsafe-inline';
```

Only allow stylesheets to be loaded from within the application, allow inline styles.

### media-src Directive:

```
media-src *
```

Allows audio and video elements to load content from any location.

### connect-src Directive:

This is not present, and is needed to configure allowable `XMLHttpRequest` or WebSocket connection destinations. We will need to modify the default Content Security Policy and add this additional directive in order to allow our app to make requests to the Fixer.io API using the HTTP protocol.

A complete guide to configuring Content Security Policy can be found here.

## Step 2: Modifying the Content Security Policy

To allow content loads from `http://api.fixer.io`, we adjust the Content Security Policy meta tag in our app’s `index.html` to look like this:

<script src="https://gist.github.com/simonprickett/5c701d51b4ca3f8653da.js"></script>

What we’ve done here is added a connect-src directive, which specifies which URLs `XMLHttpRequests` can access, and we’ve added the URL of our API in there.

The default Cordova Content Security Policy had nothing specified for this directive, which made Cordova’s webview block our requests. This may seem to be a very restrictive default, but it does make us think about which resources we really want our app to be able to access.

Having rebuilt the app (cordova build ios), we can run it again... this now works for Android devices (and iOS 8 / Xcode 6 users). On iOS 9 / Xcode 7 we now have a different problem.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cordova_security_android_ok.png" class="figure-img img-fluid" alt="App running on Android.">
</figure>

Android on the left is working fine now, iOS 9 on the right is behaving differently... our Ajax request seems to have been executed, but returned with a non 200 (OK) status message, so our error message has been displayed.

This time around, the Xcode console shows the following error:

```
2015–10–02 18:11:27.673 HelloCordova[8575:2086476] App Transport 
Security has blocked a cleartext HTTP (http://) resource load 
since it is insecure. Temporary exceptions can be configured 
via your app’s Info.plist file.
```

Additionally, Safari’s Remote Debugger also reports:

```
Failed to load resource: The resource could not be loaded 
because the Application Transport Security policy requires 
the use of a secure connection.
```

At this point on iOS 9, we have the webview thinking it made an Ajax request that failed, and the operating system stopping that request so that no traffic ever goes over the network.

This is because by default apps compiled with Xcode 7 for iOS 9 do not allow network resources to be accessed without SSL. Existing apps already in the App Store, or those compiled with Xcode 6 for iOS 8, will not exhibit this behavior.

In an ideal world where we have control over all of our API dependencies, we would update the API to use SSL and increase the overall security of our application. When this isn’t possible (for example: because we don’t control the API), we can configure an exception to this and partially disable ATS to get our app working.

## Step 3: Configuring an ATS Exception

To disable iOS 9’s Application Transport Security (ATS) , we need to add values to the application’s Info plist. This is found in:

```
platforms/ios/<ProjectName>/<ProjectName>-Info.plist
```

[Apple’s documentation](https://developer.apple.com/library/ios/technotes/App-Transport-Security-Technote/) says we can either completely disable ATS, or specify exception domains.

To completely disable it, we’d add this to the plist file:

<script src="https://gist.github.com/simonprickett/c65c2732f1dcf73cf5fc.js"></script>

Given we want to be security minded, let’s use the alternative and specify an exception domain that we will have the app trust without using SSL:

<script src="https://gist.github.com/simonprickett/37cfc34b007e025824fc.js"></script>

There are other configuration options available here that give us a fine grain of control when specifying the app’s SSL expectations: consult the [Apple documentation](https://developer.apple.com/library/ios/technotes/App-Transport-Security-Technote/) for a full list.

**Note:** ATS and the Cordova web view’s Content Security Policy are configured **independently of each other**, and you should make sure that you keep the two configurations consistent with each other to avoid situations where one layer is allowing a connection only to have the other block it.

We could implement these changes by editing the plist file directly with a text editor, or Xcode. However we generally don’t want to keep the platforms folder under source control in a Cordova project as it is all auto generated code. So, rather than editing the file directly we should look at other options for doing this automatically.

We can use a [Cordova build hook](https://cordova.apache.org/docs/en/edge/guide_appdev_hooks_index.md.html) for this, and configure it so that it only runs before Cordova does a build for iOS (as this doesn’t apply to other platforms we might be building our project on).

Historically, hooks were defined as scripts having set names that lived in the hooks folder of a Cordova project and were run by the Cordova CLI as part of executing the CLI command that the scripts were named for. In more recent Cordova releases, this approach has been deprecated in favor of configuring the associations between the hook and implementing script filename and folder in the project’s `config.xml` file — we’ll use this approach.

Apple provides the [PlistBuddy](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man8/PlistBuddy.8.html) utility (`/usr/libexec/plistbuddy`) to programatically update plist files. We can use this in a Cordova hook script to adjust the plist file for us prior to each build of the iOS project.

We’ll then also need to modify the Cordova project’s `config.xml` to call the hook script before each iOS build:

<script src="https://gist.github.com/simonprickett/478011b357723338356a.js"></script>

Then add a suitable script `hooks/ios_ats.sh` to our project (remembering to set it to have execute permissions too). Create a file containing:

<script src="https://gist.github.com/simonprickett/9c56415c97e5cab181f9.js"></script>

**Note:** I’m capturing and suppressing the return code of PlistBuddy here because it returns an error code if the key already exists, and we don’t want it to do that and stop the Cordova build process with a false positive type error.

Save this in the Cordova project’s hooks folder and name it `ios_ats.sh`. Remember to make it executable:

```
$ chmod 755 hooks/ios_ats.sh
```

Now, whenever we run:

```
$ cordova build ios
```

The `ios_ats.sh` script will run prior to the build step, and the plist file will get modified with our custom ATS settings.

Once we have done that, we can run the application in the iOS 9 simulator and... Success!

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cordova_security_success.png" class="figure-img img-fluid" alt="App running successfully on iOS 9.">
</figure>

## Try it Yourself

If you want to experiment with these concepts yourself, I’ve made a GitHub repo with all the source code for the working application [available here](https://github.com/ModusCreateOrg/CordovaCSPBlogApp).

After cloning the repo, the app will be in its initial (broken) state. To see it in different states, use the scripts provided to transition the source code to match each step of the tutorial...

To transition it to step 2 (fixed Content Security Policy meta tag, works on iOS <9 and Android):

<script src="https://gist.github.com/simonprickett/eb88a024d7d3cda24e61.js"></script>

To then transition to step 3 (fixed Content Security Policy and patches iOS 9 ATS in the project’s .plist file — works on all devices):

<script src="https://gist.github.com/simonprickett/6dc4cdf107fa8a478f37.js"></script>

To go back to step 1 (not working on iOS <9, 9 or Android):

<script src="https://gist.github.com/simonprickett/cbf9565e8a5aea4d2369.js"></script>

## Conclusion

Hopefully this has helped you get a better understanding of both the web view’s Content Security Policy and Apple’s App Transport Security for iOS 9. If you want to get some help with configuring your own Content Security Policy strings, there’s an excellent online tool at [cspisawesome.com](http://cspisawesome.com/) that will help you get it right.

Here at Modus Create, we’re big fans of the Cordova project and have used it on many customer projects. I am working on other Cordova related blog posts, so please check back periodically for further updates.