---
layout: post
title:  "Writing Google Cloud Functions in Go"
categories: [ Cloud, GCP, Go, Serverless, Coding ]
image: assets/images/go_cloud_functions_main.jpg
author: simon
---
Let’s try building and deploying a Google Cloud Function using Go!  Google Cloud recently added the Go language to its list of runtimes for the Cloud Functions serverless compute platform. The Go runtime uses version 1.11 and is currently in beta but available to everyone. If it follows the path of the Python and Node.js 8 runtimes I expect it to spend a short time in beta before being moved to general availability.

In this article I’ll take a a quick look at how to write and deploy a simple function in Go.

## Coding
Let’s use the Go runtime to host a HTTP function that performs the same task as my [Node.js 8 Cloud Functions demo]({{ site.baseurl }}/you-can-now-write-google-cloud-functions-with-node-js-8) does (or if you prefer Python 3 take a look at [this example]({{ site.baseurl }}/writing-google-cloud-functions-with-python-3)). I’ll use the [randomuser.me](https://randomuser.me/) API to output a JSON object representing data about a single user, then add one extra key named `generator` ...

<script src="https://gist.github.com/simonprickett/099470b3e331cc28bac30e0140f29a3d.js"></script>

I’m using the HTTP function model here (as opposed to a background function that could be triggered by an event such as a pub/sub message or a change in a file in a Google Cloud Storage bucket). In this model we’re expected to provide a function that can take two parameters: a `http.ResponseWriter` and a pointer to a `http.Request`.

On deployment the function will be bound to a URL. When something requests that URL the function is invoked. It should do whatever work it needs to before returning something back through the `http.ResponseWriter`.

{% include coffee-cta.html %}

In this example the body of the function grabs a JSON document from randomuser.me, unmarshals it then gets the first object from the `results` array. I add an extra key whose name is `generator` and set its value to `google-cloud-function`.

I won’t go into the details of handling arbitrary JSON in Go here. If you’re interested then I suggest you read [this article](https://blog.golang.org/json-and-go) which helped me.

## Deployment
When deploying this function Google needs to know that it is intended for the Go runtime. To do this I need to install the latest gcloud beta commands:

```bash
$ gcloud components update
$ gcloud components install beta
```

Deployment is simple (use the beta commands and explicitly specify the Go runtime):

```bash
$ gcloud beta functions deploy getUserDetails --runtime go111 --entry-point F --trigger-http --project <projectId>
```

Where `<projectId>` is the ID of my Google Cloud project. The function can be invoked by simply visiting its URL which will look something like:

```
https://<region>-<projectId>.cloudfunctions.net/getUserDetails
```

`<region>` and `<projectId>` will depend on the Google Cloud project setup. The gcloud command displays the full invocation URL for you at the end of a successful deployment.

The output looks like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/go_cloud_functions_output.png" class="figure-img img-fluid" alt="Function output">
  <figcaption class="figure-caption text-center">Function output.</figcaption>
</figure>

The Cloud Functions console also shows that the function is using the Go runtime:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/go_cloud_functions_console.png" class="figure-img img-fluid" alt="Cloud Functions console">
  <figcaption class="figure-caption text-center">Google Cloud Functions Console.</figcaption>
</figure>

And that’s all there is to it!

---

If you’d like to use or study the code from this article feel free: [I’ve put it on GitHub for you](https://github.com/simonprickett/google-cloud-functions-go). Google’s announcement of beta support for Go in Cloud Functions can be read [here](https://cloud.google.com/blog/products/application-development/cloud-functions-go-1-11-is-now-a-supported-language). The announcement covers other topics that may be of interest too: using library code, and background Cloud Function development in Go.

Thanks for reading!