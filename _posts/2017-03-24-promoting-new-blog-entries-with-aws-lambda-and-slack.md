---
layout: post
title:  "Promoting New Blog Entries with AWS Lambda and Slack"
categories: [ AWS, Serverless, Slack, JavaScript, DevOps ]
image: assets/images/lambda_slack_main.jpg
author: simon
canonical_url: https://moduscreate.com/blog/aws-lambda-and-slack-promoting-new-blog-entries/
---
At my former employer Modus Create, we were avid users of [Slack](https://slack.com/) as a team collaboration tool and had been working on ways to use it more as we go about our daily business. We also maintained a regularly updated [company blog](http://moduscreate.com/blog/). We decided that it would be a fun learning exercise to combine these things and build a small bot that posts new blog entry announcements to Slack.

(This article originally appeared on the [Modus Create blog](http://moduscreate.com/blog/)).

*"But wait!"*, you say... *"Doesn’t your blog have an RSS feed... Slack already supports those as a data source!"* You’d be right to say this: we do publish an [RSS feed](http://moduscreate.com/feed/), and Slack is able to notify users of new blog posts using out of the box functionality (you can read about this in the [Slack documentation](https://get.slack.help/hc/en-us/articles/218688467-Add-RSS-feeds-to-Slack)). We decided we’d have a go at building something similar ourselves primarily as a learning exercise for a different and more feature-rich bot we plan to develop. This approach also allows us to add our own logic later should we need to go beyond Slack’s built-in RSS support that cannot be customized.

## Basic Lifecycle

To make this work with any RSS feed, we decided to use a polling approach rather than rely on having admin access to our blogging platform and modifying that to ping Slack every time a new article is published. This meant that our "lifecycle" basically needed to include the following:

* A timer event occurs.
* Some code is executed which: Reads the RSS feed URL for the blog, then determines if any new posts have been added since the last time it ran.
* If there are new posts, creates nicely formatted message payload containing links to each new post and pushes the resulting message into Slack.
* Slack displays the message in a specific channel.
* Team members read that there’s a new blog post, check it out over a coffee and maybe share it with their social networks.
* Repeat.

## Implementation Choices

One way of implementing the desired lifecycle would be to run a server with a [cron](https://en.wikipedia.org/wiki/Cron) job that runs some sort of script every so often to check the feed and post to Slack if needed. The downside of this is that it requires a server to be running all the time — somewhat overkill for such a small task.

## Somewhere to Execute Logic

To avoid the need to run a server continuously, we chose AWS Lambda where we only incur costs when our code is running and has a generous amount of [free tier usage](https://aws.amazon.com/lambda/pricing/). Lambda supports writing code in Java, Python or JavaScript. (Node.js) We’d previously used Lambda with Python to [create an Alexa Skill](http://moduscreate.com/build-an-alexa-skill-with-python-and-aws-lambda/). This time we selected Node.js instead to learn about its programming model in the Lambda environment. Since we want to be able to read a URL, process the RSS feed XML document from it and post to a Slack URL if needed, any of the three languages that Lambda supports would have been a sensible choice since they all support each step.

## A Trigger Mechanism

We need to be able to run our code periodically at configurable intervals. In the AWS environment, there’s a sufficiently capable solution in the [CloudWatch Events](http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) service. Normally this is used to trigger target code when an event happens to some other AWS resource, but it can also be setup to behave like cron ([using a similar notation](http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions)) and invoke a Lambda function on a schedule.

Our blog posts generally get published during working hours, US Eastern and US Pacific time, so we used a polling schedule that invokes a Lambda function once an hour around these times as shown:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/lambda_slack_cloudwatch.png" class="figure-img img-fluid" alt="Configuring CloudWatch Events">
</figure>

Note that CloudWatch Events run in UTC, hence the "early" and "late" hours. The "Resource name" maps to the Lambda function that will perform the next two steps in the process for us.

## Determining if New Post(s) Exist

Once CloudWatch invokes our Lambda function, it needs to read the RSS feed for the blog, and work out if one or more posts were added since the last time it ran. As we’re working with the Node runtime in AWS Lambda, we can simply use the popular [request package](https://www.npmjs.com/package/request) to get the blog RSS feed, and parse the entries from XML to JSON with the [xml2js package](https://www.npmjs.com/package/xml2js).

Because Lambda functions don’t retain state between executions, we can’t as such "remember" when the function was last invoked. To keep things simple, we opted not to store the last execution time or the ID of the newest post from the prior run in a database. Instead we will assume anything newer than the polling interval configured in CloudWatch Events could be classed as a "new" post that needs to be sent to Slack, and add details of it to an array of objects:

```
request(blogFeedUrl, (err, res, body) => {
  if (! err && res.statusCode == 200) {
    parseXMLString(body, (e, r) => {
      if (! err && r) {
        let newBlogEntries = [],
            currentTime = new Date();
        // Loop over entries until we find one that is too old.
        for (let blogEntry of r.rss.channel[0].item) {
          // Work out if the blog entry is new since last
          // time we looked...
          let latestBlogTime = new Date(blogEntry.pubDate[0]);
          if ((currentTime.getTime() - latestBlogTime.getTime()) <=
              (runInterval * ONE_MINUTE)) {
            // Post was published since the last check...
            newBlogEntries.push({
              author: blogEntry['dc:creator'][0],
              title: blogEntry.title[0],
              link: blogEntry.link[0]
            });
          } else {
            // We are done as blog entries are in date order with
            // most recent first.
            break;
          }
        }
      ...
```

Once we’ve determined that there’s at least one new post, we need…

## A Way to Push Messages into Slack

In order to send a message to Slack, we require:

* A webhook URL (configured in Slack so that Slack knows where to send incoming messages).
* Code to format a message string for Slack and post it to the webhook URL.

Setting up a webhook URL is handled on the admin site for your Slack team, sign in at:

```
https://<YOUR_SLACK_TEAM>.slack.com/apps/manage/custom-integrations
```

New incoming webhooks are configured here, and Slack will need to know the following in order to configure one:

* The channel that you want the messages to post to (e.g. `#general`).
* The name that you want your messages to post as (e.g. `modus-blog`).
* Optionally: an image or emoji that you want to use for each message (e.g. `:newspaper`)

The Slack admin page will then generate a webhook URL for you, which looks something like:

```
https://hooks.slack.com/services/T02XXXXXX/BXXXXXXS3/SnTXh5LxxxXXXXEG8rdXXGr
```

Formatting the message for Slack is simple, just send a message body object with a text key containing [Slack formatted markup](https://api.slack.com/docs/message-formatting) to link to the URL of the blog entry, and make a bullet list item for each new entry:

```
let messageBody = `{"text": "*New blog entr${newBlogEntries.length === 1 ? 'y' : 'ies'} published:*\n\n`;

for (let blogEntry of newBlogEntries) {
  messageBody += `• <${blogEntry.link}|${blogEntry.title}> _by ${blogEntry.author}_\n`;
}

messageBody += '", "unfurl_links": true}';
```

Sending the message to Slack is then as simple as using a HTTP `POST` to the Slack webhook URL:

```
request.post({
  url: process.env.SLACK_HOOK_URL,
  body: messageBody
});
```

## The End Result

When Slack’s API receives the message payload at the webhook URL, it publishes a message to the channel associated with that URL. As our payload contain links, and we asked Slack to [unfurl links](https://medium.com/slack-developer-blog/everything-you-ever-wanted-to-know-about-unfurling-but-were-afraid-to-ask-or-how-to-make-your-e64b4bb9254), it will attempt to create a preview view, resulting in a message that looks like this (screenshot from the Slack client for Mac OS):

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/lambda_slack_end_result.png" class="figure-img img-fluid" alt="A new blog post announced in Slack">
</figure>

## Try it Out

If you want to use this with your own Slack team or extend it to meet your organization’s needs, feel free! We’ve [published our code in full on GitHub](https://github.com/ModusCreateOrg/newblogbot), along with a guide to setting it up and getting it running. We’d also love to see what you’ve built with Slack that keeps your team members more in the loop.

I've love to hear how you get on - get in touch via the [Contact page](https://simonprickett.dev/contact/). If you enjoyed this article, please share it far and wide!
