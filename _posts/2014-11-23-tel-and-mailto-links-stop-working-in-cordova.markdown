---
layout: post
title:  "tel and mailto Links Stopped Working in Your Android Cordova/PhoneGap App?"
date:   2014-11-23 21:20:12
categories: cordova phonegap android security
---
I recently upgraded an app I've been working on for some time from Apache 
Cordova 3.0.0 to 3.6.3.  This app runs on both iOS and Android, and the 
catalyst for change here was that IBM had found some serious security issues 
in Cordova 3.5.0 and earlier for Android devices ([IBM Security Article](http://securityintelligence.com/apache-cordova-phonegap-vulnerability-android-banking-apps/#.VHKKwZPF8kM)).

Owners of Android Apps in Google Play using Cordova 3.5.0 or earlier started 
receiving emails from Google that read:

> This is a notification that your com.whatever.myapp, is built on a version of 
> Apache Cordova that contains security vulnerabilities. This includes a high 
> severity cross-application scripting (XAS) vulnerability. 
>
> Under certain circumstances, vulnerable apps could be remotely exploited to  
> steal sensitive information, such as user login credentials. You should 
> upgrade to Apache Cordova 3.5.1 or higher as soon as possible. 
>
> For more information about the vulnerabilities, and for guidance on 
> upgrading Apache Cordova, please see http://cordova.apache.org/announcements/2014/08/04/android-351.html. 
>
> Please note, applications with vulnerabilities that expose users to risk of 
> compromise may be considered "dangerous products" and subject to removal from
> Google Play. 
>
> Regards, 
>
> Google Play Team 
>
> ©2014 Google Inc. 1600 Amphitheatre Parkway Mountain View, CA 94043

Given that Google was considering removing affected apps from Google Play, we 
upgraded the app to 3.6.3 (which was the latest available at the time), took 
the opportunity to upgrade a few plugins, and resubmitted for testing.

During testing it became apparent that the Android version of the app was no 
longer able to use tel: (make a phone call) or mailto: (send an email) links 
in the code, so links like these weren't doing anything:

{% highlight html %}
<a href="tel:18001234567">Call Now!</a>
<a href="mailto:sales@megacorp.com">Email us</a>
{% endhighlight %}

This wasn't affecting the iOS version of the app, using the same codebase. 

After some debugging, I was still stumped as to why this was happening, then 
(protip: do this first) read the [release notes for 3.5.1](http://cordova.apache.org/announcements/2014/08/04/android-351.html) and discovered that the behavior for these links had changed on Android.

Specifically, tel, mailto, sms etc links now require explicit whitelisting for 
Android, which wasn't required in previous versions of Cordova:

> The latest release of Cordova Android takes steps to block explicit Android 
> intent urls, so that they can no longer be used to start arbitrary 
> applications on the device.
>
> Implicit intents, including URLs with schemes such as "tel", "geo", and "sms"
> can still be used to open external applications by default, but this 
> behaviour can be overridden by plugins.

Consulting the documentation (protip: ALWAYS make sure you are looking at 
the Cordova documentation corresponding to the Cordova version you're 
actually using) I realized there were new settings in config.xml that control 
this behavior on Android:

{% highlight xml %}
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.whatever.myapp" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>MyApp</name>
    <description>My Application</description>
    <author email="me@megacorp.com" href="http://myapp.megacorp.com">
        MegaCorp
    </author>
    <content src="index.html" />
    <!-- This now applies only to HTTP and HTTPS on Android -->
    <access origin="*" />
    <!-- These are needed in Cordova 3.6 and newer for Android -->
    <access origin="mailto:*" launch-external="yes"/>
    <access origin="tel:*" launch-external="yes"/>
</widget>
{% endhighlight %}

You can read about these in the [Whitelist Guide](http://cordova.apache.org/docs/en/3.6.0/guide_appdev_whitelist_index.md.html#Whitelist%20Guide) section of the documentation.  I would encourage you to read this and 
choose settings appropriate for your application, we went with the open 
everything approach to get back to the behavior we had prior to Cordova 3.6.3.

After a rebuild, this fixed the problem on Android and users were again able 
to click links to initiate phone calls and send email.

Note that you will also need to do this for other non HTTP protocols, for example sms and geo.






