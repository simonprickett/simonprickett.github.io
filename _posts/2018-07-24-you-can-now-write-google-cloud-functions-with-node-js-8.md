---
layout: post
title:  "You Can Now Write Google Cloud Functions with Node.js 8"
categories: [ Cloud, GCP, Node.js, JavaScript, Serverless, Coding ]
image: assets/images/node_8_cloud_functions_main.jpg
author: simon
---
In my [previous article]({{ site.baseurl}}/using-environment-variables-with-google-cloud-functions) looking at environment variables with Google Cloud Functions I noted that one of the downsides of using them is the relatively old Node.js 6 runtime that Google provides. As the environment is fully managed there was no option to use a newer Node.js version. Things changed recently, as Google has now added beta runtimes for Node 8 and Python 3. This is a welcome move towards catching up on Amazon’s lead in this space — AWS Lambda has had these features for a while (and supports other languages too). The old Node.js 6 runtime remains the default and will be used unless you explicitly specify that you want Node.js 8 when deploying your functions.

Let’s take a look at how to use the Node.js 8 environment by deploying a function that uses a couple of features that weren’t available in Node.js 6. The specific version of Node.js 8 that Google is currently using is 8.11.1.

Probably the most significant change between Node.js 6 and 8 is the introduction of support for the `async` and `await` keywords ([see MDN for an explanation of these](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)). Node.js 8 also adds other useful items such as [object spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

{% include coffee-cta.html %}

Let’s try out the Node.js 8 runtime with a simple HTTP function that uses `async`, `await` and the object spread syntax to get some data from a public API, amending it slightly before returning it to the caller. We’ll use the [node-fetch](https://www.npmjs.com/package/node-fetch) module, adding the ability to use the same syntax as the `window.fetch` API that the browsers have:

<script src="https://gist.github.com/simonprickett/9f0beb1cde30753b35fa3237b82831d5.js"></script>

The function uses `node-fetch` to grab an object representing a single randomly generated user from the excellent [randomuser.me](https://randomuser.me/) API. We then add an extra property `generator` using the object spread syntax and return the result to the caller as JSON.

When deploying this function we have to tell Google to use the Node.js 8 runtime, as we’re using syntax not available in Node.js 6. To do this we’ll need to make sure we have the latest `gcloud beta` commands:

```
$ gcloud components update
$ gcloud components install beta
```

Deployment is pretty simple (note we have to use the `beta` commands and explicitly say that we want the Node.js 8 runtime):

```
$ gcloud beta functions deploy getUserDetails --runtime nodejs8 --trigger-http --project <projectId>
```

Where `<projectId>` is the ID of your Google Cloud project. The function can be invoked simply by visiting its URL which will look something like:

```
https://<region>-<projectId>.cloudfunctions.net/getUserDetails
```

`<region>` and `<projectId>` will depend on your Google Cloud project setup. The output looks like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/node_8_cloud_functions_output.png" class="figure-img img-fluid" alt="Function output">
  <figcaption class="figure-caption text-center">Function output.</figcaption>
</figure>

The Cloud Functions console also shows that the function is using the Node.js 8 runtime:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/node_8_cloud_functions_console.png" class="figure-img img-fluid" alt="Cloud Functions console">
  <figcaption class="figure-caption text-center">Google Cloud Functions Console.</figcaption>
</figure>

And that’s all there is to it!

---

If you’d like to use or study the code from this article feel free: I’ve [put it on GitHub for you](https://github.com/simonprickett/google-cloud-functions-node-8). Google’s documentation for the Node.js 8 Cloud Functions runtime can be [read here](https://cloud.google.com/functions/docs/concepts/nodejs-8-runtime) — this includes important information about a signature change for background functions that use the Node.js 8 environment. If you’re interested in tracking which features became available in which Node release, I recommend [node.green](https://node.green/) as an excellent resource.

Thanks for reading!
