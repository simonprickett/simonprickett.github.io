---
layout: post
title:  "Supporting the Browser Platform in a Cordova Plugin"
categories: [ JavaScript, Cordova ]
image: assets/images/cordova_browser_main.jpg
author: simon
---
When building a Cordova hybrid app, the most common use case for adding or developing plugins is to access native device functionality not normally available to the JavaScript runtime environment.

(This article originally appeared on the [Modus Create blog](https://moduscreate.com/insights/blog/)).

Whilst plugins allow us to extend the reach of the JavaScript runtime on devices, their use can pose a problem when we also want to run our hybrid apps in a regular web browser — for example to iterate rapidly during a design phase, or to leverage browser-based automated testing tools. Sometimes, we may wish to ship our hybrid app as a HTML5 web app that only uses the enhanced native functionality when running in the Cordova wrapper on a device, but which remains usable when accessed from a web server in a standalone browser.

Adding Cordova’s browser platform to a hybrid app allows us to run and debug apps using the regular web browser without deployment to a device or server. However, if the plugins we’re using don’t support the browser platform, then they won’t be available at runtime and we would have to code around that in our app logic. This isn’t ideal for a cross platform development approach, so it is desirable to always support the browser platform when creating a plugin. Each of the [core Cordova plugins](https://cordova.apache.org/docs/en/latest/cordova/plugins/pluginapis.html) provide some level of support for the browser platform.

Often, the functionality that a plugin provides can’t be directly replicated in the browser — that’s why a plugin was needed in the first place: to go beyond the browser’s sandbox capabilities. When implementing a browser platform version of a plugin, we therefore need to consider our options to provide an alternative experience that makes sense within the confines of the browser.

Some plugins may choose to render UI components using HTML in place of native controls when running in the browser, others may return dummy data in place of reading sensors or external accessories that are present on the device but missing from the browser.

Let’s explore this by taking the “ModusEcho” plugin that we developed in a [previous blog post](https://simonprickett.dev/plugin-authoring-for-ios-and-android-in-cordova-6/), and extending it to support the Browser platform.

## Adding the Browser Platform to Our Plugin

To recap, the “ModusEcho” plugin has a couple of methods:

* `echojs` which is a simple JavaScript implementation to bounce whatever string parameter was passed to it back to its caller.
* `echo` which does the same as `echojs`, but adds a native implementation to display a toast (a popup that auto dismisses after a short time) containing whatever string parameter was passed.

To add support for the browser platform, we’ll need to configure it in `plugin.xml` (whose specification can be found in the [Cordova documentation](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html)), and add a new JavaScript module (the Browser platform’s “native” language) to implement the `echo` method. In common with the iOS and Android platforms that we previously implemented, `echojs` is contained within the platform independent JavaScript part of the plugin and requires no platform specific modification.

Our `plugin.xml` will need to have the following added as a child of the root `plugin` element:

```
<platform name="browser">
  <config-file target="config.xml" parent="/*">
    <feature name="ModusEcho">
      <param name="browser-package" value="ModusEcho" />
    </feature>
  </config-file>
  <js-module src="src/browser/ModusEchoProxy.js"
             name="ModusEchoProxy">
    <runs />
  </js-module>
</platform>
```

Here we specify that our plugin implementation module is to be found in `src/browser/ModusEchoProxy.js` and that it is to be known as `ModusEchoProxy`. We need to do this so that there is no clash between the plugin’s platform neutral JavaScript module (already named `ModusEcho`) and this one that implements the “native” code for the Browser platform, as both will run in the same JavaScript engine.

The `<runs/>` element is required to tell Cordova to initialize the module — it won’t work without this as it will fail to register the module as a plugin.

Having amended `plugin.xml`, we then need to add our browser platform implementation of `echo` in `src/browser/ModusEchoProxy.js` matching the filename and path that we configured in `plugin.xml`:

```
$ cd <path/to/plugin>
$ mkdir src/browser
```

In `src/browser` we need to add `ModusProxy.js` which implements the native `echo` plugin method for the browser platform. Cordova expects each method that the plugin exposes to take success and error callbacks, and an array (`opts`) of parameters:

```
function echo(success, error, opts) {
  var toast = undefined,
      toastId = undefined;
  if (opts && typeof(opts[0]) === 'string' && opts[0].length > 0) {
    toastId = 'toast' + Date.now();
    toast = document.createElement('div');
    toast.appendChild(document.createTextNode(opts[0]));
    toast.id = toastId;
    toast.style.width = '30%';
    toast.style.borderStyle = 'solid';
    toast.style.borderColor = '#777777';
    toast.style.borderRadius = '5px';
    toast.style.borderWidth = '2px';
    toast.style.margin = '0 auto';
    toast.style.marginTop = '30px';
    toast.style.backgroundColor = '#999999';
    toast.style.padding = '5px';
    toast.style.fontSize = '1.5em';
    toast.style.fontWeight = 'bold';
    toast.style.textAlign = 'center';
    toast.style.zIndex = 2147483647;
 
    document.body.appendChild(toast);
    setTimeout(function() {
      document
        .body
        .removeChild(document.getElementById(toastId));
    }, 3000);
    success(opts[0]);
  } else {
    error('Empty message!');
  }
}
module.exports = {
  echo: echo
};
require('cordova/exec/proxy').add('ModusEcho', module.exports);
```

For a browser "toast", we simply create and style a `<div>` with the supplied message from the caller, then use `setTimeout` to automatically dismiss it around 3 seconds later.

We then add our module to the set of plugin proxies that Cordova uses in place of native bridge calls when running in the browser.

## Testing the Browser Platform

To test the browser platform additions to our plugin, we’ll need to create a test Cordova app, add the browser platform to it, then add our plugin by installing it from a folder on the local filesystem:

```
$ cordova create testapp com.moduscreate.testapp TestApp
$ cd testapp
$ cordova platform add browser --save
```

Now we can install our plugin:

```
$ cordova plugin add <path/to/plugin>
```

e.g.

```
$ cordova plugin add ../cordova-plugin-example/
```

We can expect to see the following output:

```
Installing "com-moduscreate-plugins-echo" for android
Installing "com-moduscreate-plugins-echo" for browser
Installing "com-moduscreate-plugins-echo" for ios
******************************************
* Hello from post plugin add hook script *
******************************************
```

Let’s check that the Browser Platform code was installed correctly:

```
$ find . -name ModusEcho.js|grep browser
```

Which should return:

```
./platforms/browser/platform_www/plugins/com-moduscreate-plugins-echo/src/browser/ModusEcho.js
./platforms/browser/platform_www/plugins/com-moduscreate-plugins-echo/www/ModusEcho.js
./platforms/browser/www/plugins/com-moduscreate-plugins-echo/src/browser/ModusEcho.js
./platforms/browser/www/plugins/com-moduscreate-plugins-echo/www/ModusEcho.js
./plugins/com-moduscreate-plugins-echo/src/browser/ModusEcho.js
```

However, our test app doesn’t use the plugin code yet as we didn’t change the generated “Device Ready!” boilerplate. To test the plugin within our app, we’ll replace the generated `onDeviceReady` function in `www/js/index.js` with the following:

```
onDeviceReady: function() {
  app.receivedEvent('deviceready');
  modusecho.echo(
    'Plugin Ready!',
    function(msg) {
      document
        .getElementById('deviceready')
        .querySelector('.received')
        .innerHTML = msg;
    },
    function(err) {
      document
        .getElementById('deviceready')
        .innerHTML = '<p class="event received">' + err + '</p>';
    }
  );
  modusecho.echojs(
    'Hello Plugin',
    function(msg) {
      document
        .getElementsByTagName('h1')[0]
        .innerHTML = msg;
    },
    function(err) {
      document
        .getElementsByTagName('h1')[0]
        .innerHTML = err;
    }
  );
}
```

This exercises both methods that the “ModusEcho” plugin provides. We can now test that the browser platform support in the plugin works correctly by running the app in the browser:

```
$ cordova run browser
```

The system’s default browser will open at a URL such as `localhost:8000/index.html` and render the app. The Browser platform generates a `deviceready` event in the same way as other Cordova platforms do, and plugins that support the browser platform will be available to use.

If the plugin works, we should see “Plugin Ready!”, and a toast pops up for a few seconds if the browser Platform “native” code is installed and working properly. We should also expect to see “Hello Plugin” if the pure JavaScript function in the plugin works. A successful test of the plugin looks like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cordova_browser_running.png" class="figure-img img-fluid" alt="Example Plugin running in the browser.">
</figure>

The darker “PLUGIN READY!” area is the `<div>` that serves as a toast implementation, and will be dismissed automatically after approximately 3 seconds.

## Conclusion

Using Cordova’s browser platform gives us a lot of development, testing and deployment flexibility when writing hybrid apps. Extending plugins to also support it makes that experience a lot more useful, and can avoid the need to add platform specific conditional code to the core application logic. Hopefully this post showed that adding browser platform support to a plugin can be quick and painless. Feel free to browse our updated “ModusEcho” plugin [GitHub repo](https://github.com/ModusCreateOrg/cordova-plugin-example), or install the [updated plugin from npm](https://www.npmjs.com/package/modusecho).

If you know someone who would find this article informative, please share it widely!
