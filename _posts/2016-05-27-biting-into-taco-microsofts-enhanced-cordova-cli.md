---
layout: post
title:  "Biting into TACO, Microsoft's Enhanced Cordova CLI"
categories: [ JavaScript, Microsoft, Cordova ]
image: assets/images/taco_main.jpg
author: simon
---
Tools to streamline developer workflow when building Apache Cordova hybrid apps have been improving steadily since the introduction of the Cordova Command Line Interface (CLI) a few years ago. The CLI greatly improved, automated and standardized common development tasks that previously relied on manual processes to create or modify configuration files, or direct manipulation of native code.

(This article originally appeared on the [Modus Create blog](https://moduscreate.com/insights/blog/)).

Since Cordova is open source, others are free to build upon it and distribute their own tools tailored towards a particular JavaScript framework (Ionic does this for example), or for particular use cases (Adobe’s PhoneGap CLI adds the ability to interact with their cloud based PhoneGap Build service).

Microsoft has been working on tightly integrating the Cordova ecosystem with its Visual Studio product line, including the free and cross platform [Visual Studio Code editor](https://code.visualstudio.com/). As part of this initiative, Microsoft open sourced TACO (Tools for Apache COrdova), an alternative CLI that aims to further improve developer productivity regardless of their choice of JavaScript framework or local development platform.

{% include coffee-cta.html %}

TACO is fully compatible with the regular Cordova CLI, and you can use `taco` and `cordova` commands within the same project without issue. Let’s take a look at what benefits Mac OS based developers can expect from adding TACO to their toolboxes.

## Installation

Assuming we already have Node.js installed, getting TACO is simple:

```
$ sudo npm install -g taco-cli
```

When that’s completed, we can verify that the TACO CLI installed OK with:

```
$ taco -version
```

Which should output something like this (you can expect to see a newer version number than was available to me at time of writing):

```
1.2.1
```

## Creating an App

Let’s go ahead and use the TACO CLI to create a Cordova app called `TACOApp` in a folder `TACOApp` and with app ID `com.moduscreate.tacoapp`:

```
$ taco create TACOApp com.moduscreate.tacoapp TACOApp
```

This will download Cordova if needed (current version at time of writing was 5.4.1), and create a blank app in `TACOApp`.

Taking a look at what was created for us, we see:

```
$ ls -lF TACOApp
-rw-rw-rw- 1 simon staff 6259 Apr 29 20:49 config.xml
drwxr-xr-x 3 simon staff  102 Apr 29 20:49 hooks/
drwxr-xr-x 4 simon staff  136 Apr 29 20:49 merges/
-rw-r--r-- 1 simon staff    2 Apr 29 20:49 package.json
drwxr-xr-x 2 simon staff   68 Apr 29 20:49 platforms/
drwxr-xr-x 2 simon staff   68 Apr 29 20:49 plugins/
drwxr-xr-x 5 simon staff  170 Apr 29 20:49 res/
-rw-r--r-- 1 simon staff   50 Apr 29 20:49 taco.json
drwxr-xr-x 6 simon staff  204 Apr 29 20:49 www/
```

This looks like what we would expect for a regular Cordova app created using the Cordova CLI, with the addition of a folder named `res` and a file named `taco.json`.

`res` contains some boilerplate resources to support the Hello World app that the CLI creates for us — icons, splash screens and platform specific configuration files.

The file `taco.json` tells TACO which version of Cordova CLI and which "kit" (known set of plugin version numbers that work well together) were used when creating the app. There’s more information on TACO kits in the [documentation](http://taco.tools/docs/kits.html).

## Adding Platforms

To make our app work on a given family of devices, we need to add one or more Cordova platforms. Let’s add Android and iOS, and see what TACO does differently here:

```
$ taco platform add android
```

This will create and configure the Cordova Android platform for our project, and when it’s done we can expect to see output similar to:

```
Success! Platform(s) android added to the project.
```

Using the regular Cordova CLI workflow, we would now have to go and install the Android SDKs and tools at the correct levels for the version(s) of Android we’re targeting or have done this separately prior to commencing our app project.

The TACO CLI differs from "vanilla" Cordova here. It comes with a handy extra command that can get those platform specific SDKs and requirements for us.

```
$ taco install-reqs android
```

This will install the required tools and SDKs not already present on the local machine, so that it’s ready to build the app.

Similarly, we can add iOS platform support to our new app with:

```
$ taco platform add ios
$ taco install-reqs ios
```

As with a normal Cordova CLI project, our project folder now contains:

```
platforms/android
platforms/ios
```

## Adding Plugins

Plugins work as you would expect.

```
$ taco plugin add cordova-plugin-camera
```

will add the camera plugin for all installed platforms, at a version number that’s set by the TACO kit that the app is using. A kit is a set of plugins that are known to work well with a given version of Cordova. There’s more documentation on this [here](http://taco.tools/docs/kits.html). If you definitely want the latest version of a plugin, simply use:

```
$ taco plugin add cordova-plugin-camera@latest
```

## Building the App Locally

To build the app, we simply tell TACO which platform we want to build, in the same way that we would using the regular Cordova CLI:

```
$ taco build android
$ taco build ios
```

These work exactly as they would with a regular Cordova CLI project.

## Running the App

Having built our app, we’ll want to run and debug it, both on real device and using emulators. TACO has some extra functionality over the vanilla Cordova CLI here, too.

### Emulators and Devices

TACO allows us to run our app in an emulator, again using the same command anyone familiar with the Cordova CLI will recognize:

```
$ taco emulate ios
$ taco emulate android
```

The boilerplate app that TACO generates is visually different from the one that the regular Cordova CLI delivers, but has the same `deviceready` event detection logic. TACO’s boilerplate looks like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/taco_boilerplate.png" class="figure-img img-fluid" alt="TACO Cordova boilerplate app.">
</figure>

TACO also allows developers to run their apps on devices connected to their machine, or to a configured remote Mac build server for Windows developers wanting to run an iOS app.

Assuming we’re on a Mac, and have an iOS device connected:

```
$ taco run ios
```

will start the app on the connected device and run it.

### Live Reload

TACO allows us to run our app (on device, or in the emulator) in a way that permits us to change HTML / JS / CSS / image assets without having to do another build and emulate cycle.

Both the run and emulate commands support live reload (using BrowserSync). Here’s an example of using it with the iOS simulator:

```
$ taco emulate ios --livereload
```

Then, we can edit the application source, and it will live reload when we save our changes.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/taco_live_reload.gif" class="figure-img img-fluid" alt="TACO Live Reload Example">
</figure>

### Device Sync

Another feature TACO offers over the vanilla Cordova CLI is the ability to start an app on multiple devices and have events from one mirrored in the other.

This is very useful when demonstrating or testing with different platforms. Here’s an example where on the left we have an iPhone running our app, and to the right an Android Moto X phone also running it. These are both physical devices. Their output is captured using QuickTime for the iPhone and the excellent [Vysor](https://chrome.google.com/webstore/detail/vysor/gidgenkbbabolejbgbpnhbimgjbffefm?hl=en-US) for Android.

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/taco_device_sync.gif" class="figure-img img-fluid" alt="TACO Device Sync Example">
</figure>

Both devices need to be attached to your Mac, then enabling this behavior is as simple as:

```
$ taco run -device --devicesync
```

Live Reload is also available whilst device sync is running, so you can change your application’s files and see changes on both platforms at once. Device Sync can also work with an emulator for one or both platforms, rather than physical devices.

## Conclusion

Microsoft offers some useful enhancements for developers working with Cordova. Whether for a new project or to improve workflow on a work in progress app, developers should take a closer look at TACO CLI.

The live reload and device sync features are a great productivity boost. There is also the ability to use a remote build server which allows developers working on Windows machines to participate in building apps that need to run on iOS. In this quick look at TACO, we didn’t cover all of its features or integration with the cross platform Visual Studio Code editor. For more details we’d recommend you check out the [official documentation](http://taco.tools/index.html#get-started).

Which tools do you use to be productive when building Cordova apps? We’d love to hear from you. If you know someone who would find this article informative, please share it widely!

*(Feature image by [Ben Tesch](https://www.flickr.com/photos/magnetbox/) via Flickr, [Creative Commons License](https://creativecommons.org/licenses/by/2.0/).*