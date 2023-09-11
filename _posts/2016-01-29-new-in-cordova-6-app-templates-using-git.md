---
layout: post
title:  "New in Cordova 6: App Templates Using Git"
categories: [ JavaScript, Cordova, GitHub ]
image: assets/images/cordova_git_main.png
author: simon
---
[Apache Cordova version 6.0.0](https://cordova.apache.org/news/2016/01/28/tools-release.html) was released today at [PhoneGap Day 2016 in Utah](http://pgday.phonegap.com/us2016/). Along with the usual bug fixes, platform and plugin upgrades, a new feature was added to the Cordova CLI allowing users to create new apps based from templates hosted at git URLs, on npm or on the local filesystem.

(This article originally appeared on the [Modus Create blog](https://moduscreate.com/insights/blog/)).

The ability to use a git URL or npm as the source for template applications should make sharing sample applications much easier. It could also be used, for example, to have a best practices boilerplate app that an organization can use as a start point, or for training purposes to keep copies of a demo app at different stages of development.

Let’s take a look at how to make and use a couple of template applications using a Github repo with branches as our repository.

## Creating a Template Cordova Application Git Repo

Before we can make use of the new ability to pull template applications from git, we need to create an app that can be used as a template, and store it in the expected format in our git repo.

To do this, we simply create a new Cordova app as normal:

```
$ cordova create tplapp com.moduscreate.cordovatpl TplExample
```

Then let’s add the iOS and Android platforms, and let’s use the Device Orientation plugin that allows us to access the device’s compass and the Status Bar plugin that allows us to control status bar appearance for iOS:

```
$ cd tplapp
$ cordova platform add ios --save
$ cordova platform add android --save
$ cordova plugin add cordova-plugin-device-orientation --save
$ cordova plugin add cordova-plugin-statusbar --save
```

Note here that we’re using — save for each platform and plugin that we add. This adds an entry into the app’s `config.xml` file telling Cordova which platform and plugin versions the app uses, allowing us to recover these later without having to check in platform and plugin binaries to our repo.

We can then make any changes that we want to make inside the www folder, and build and test our app as normal.

Once we’ve made changes in the www folder to get our app to do whatever we want it to do, we can then commit it to our git repo, ensuring that the following are in the root of the repo:

* `www` — folder containing our app’s HTML, CSS, JavaScript and any other assets (images, data files for example).
* `config.xml` — the Cordova config file for our app, containing the required platform and plugin versions to make the app work.

For demonstration purposes, I created two simple demo apps that exist on separate branches of the same GitHub repo. Both are based on Bootstrap templates from [Start Bootstrap](http://startbootstrap.com/), with some simple JavaScript to detect Cordova’s `deviceready` event and add a listener that watches the device’s compass position and updates that on the screen. Both template apps have the same functionality, but use different Start Bootstrap projects to give them a different look from one another. The `config.xml` files and JavaScript application logic for both are identical.

You can view the template apps here:

* [Using the “Heroic” Start Bootstrap template](https://github.com/ModusCreateOrg/cordova6templates/tree/template1).
* [Using the “One Page Wonder” Start Bootstrap template](https://github.com/ModusCreateOrg/cordova6templates/tree/template2).

When built and run on iOS, the apps look like this (template 1 to the left, template 2 on the right):

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cordova_git_compass.png" class="figure-img img-fluid" alt="Example Template App">
</figure>

## Using the Template Apps as the Basis of New Apps

Using the new functionality in Cordova 6, we can now go ahead and use our template apps when creating new ones at the command line. Cordova 6 is able to fetch the template directly from a specified git repo, including a specific branch.

Let’s try this out by creating a new app using our “One Page Wonder” template, which is branch `template2` in our GitHub repo.

First, we should ensure we’re using Cordova 6:

```
$ cordova --version
```

Should return `6.0.0` or higher.

Now let’s make a new app using the template, and giving our new app a different name and ID:

```
$ cordova create mydemoapp com.moduscreate.mydemoapp mydemoapp --template https://github.com/ModusCreateOrg/cordova6templates#template2
```

This tells Cordova to create a new app “mydemoapp” in a folder of the same name, and use our repo’s `template2` branch as the start point. The `--template` is the new Cordova 6 feature that we are taking advantage of here.

When we execute the above command we can expect to see the Cordova CLI create a new app and check out our template from GitHub:

```
Creating a new cordova project.
Retrieving https://github.com/ModusCreateOrg/cordova6templates#template2 from GitHub...
Repository "https://github.com/ModusCreateOrg/cordova6templates" checked out to git ref "template2".
```

Our new app will now have the “One Page Wonder” template HTML, JavaScript, CSS and images in its `www` folder, and its `config.xml` file will have all the platform and plugin dependencies listed in `config.xml` from the template, but the app name and ID will be those of the new app we just created.

To get our new app up and running, we need to download the correct platform and plugin dependencies. As they are listed in `config.xml`, this is simply a case of running:

```
$ cd mydemoapp
$ cordova prepare
```

Cordova then realizes that the required platforms and plugins aren’t present in our app yet and downloads them for us:

```
$ cordova prepare
Restoring platform ios@~4.0.1 referenced on config.xml
Adding ios project…
iOS project created with cordova-ios@4.0.1
Discovered plugin "cordova-plugin-whitelist" in config.xml. Installing to the project
Fetching plugin "cordova-plugin-whitelist@1" via npm
Installing "cordova-plugin-whitelist" for ios
Discovered plugin "cordova-plugin-device-orientation" in config.xml. Installing to the project
Fetching plugin "cordova-plugin-device-orientation@~1.0.2" via npm
Installing "cordova-plugin-device-orientation" for ios
Discovered plugin "cordova-plugin-statusbar" in config.xml. Installing to the project
Fetching plugin "cordova-plugin-statusbar@~2.1.0" via npm
Installing "cordova-plugin-statusbar" for ios
Restoring platform android@~5.1.0 referenced on config.xml
Adding android project…
Creating Cordova project for the Android platform:
Path: platforms/android
Package: com.moduscreate.mydemoapp
Name: mydemoapp
Activity: MainActivity
Android target: android-23
Android project created with cordova-android@5.1.0
Installing "cordova-plugin-device-orientation" for android
Installing "cordova-plugin-statusbar" for android
Installing "cordova-plugin-whitelist" for android
```

We can now go ahead and build the app, and work on adding features to it as normal.

## Conclusion

The ability to manage template Cordova apps using git and/or npm is a welcome addition in Cordova 6 and allows an easier workflow for organizations that build lots of apps using a common base. It should also make Cordova training classes easier to organize and manage. Do you have plans to use this new feature? Get in touch ([contact page](/contact)), I'd love to hear from you.