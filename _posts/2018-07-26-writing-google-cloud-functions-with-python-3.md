---
layout: post
title:  "Writing Google Cloud Functions with Python 3"
categories: [ Cloud, GCP, Python, Serverless ]
image: assets/images/python3_cloud_functions_main.jpg
author: simon
---
This is my third and final article looking at new features in Google Cloud functions as Google starts to narrow the gap to Amazon’s AWS Lambda product. Until recently Node.js 6 was the only option for writing Google Cloud functions. That’s changed now with the addition of Node.js 8 (read my article) and Python 3 runtimes available in public beta. (Later update: you can also now write Cloud functions in Go -- [see my article]({{ site.baseurl }}/writing-google-cloud-functions-in-go)).

Let’s take a look at how to use the Python environment by deploying a HTTP function that performs the same task as my Node.js 8 Cloud Functions demo does. We’ll use the `requests` library and [randomuser.me](https://randomuser.me/) API to output a JSON object representing data about a single user, then add one extra key named `generator` ...

<script src="https://gist.github.com/simonprickett/330a0892643b8fb1fc4e03a27437f875.js"></script>

Items of note here include:

* The Python runtime uses Python 3.7.0
* Your functions have to live in a file called `main.py`
* The functions are executed within the [Flask](https://palletsprojects.com/p/flask/) framework
* The function’s `request` argument will be a Flask `request` object
* The function must return anything that can be made into a Flask response object using Flask’s `make_response` — in this case, we pass a JSON string
* Dependencies are specified in `requirements.txt` which looks like this for our example (version numbers can also be specified e.g. `requests=2.19.1`):

```
requests
```

(Flask is provided as part of the environment, so isn’t listed here).

When deploying this function we have to tell Google to use the Python 3 runtime. To do this we’ll need to make sure we have the latest `gcloud beta` commands:

```
$ gcloud components update
$ gcloud components install beta
```

Deployment is simple (we have to use the `beta` commands and explicitly say we want the Python runtime):

```
$ gcloud beta functions deploy getUserDetails --runtime python37 --trigger-http --project <projectId>
```

Where `<projectId>` is the ID of your Google Cloud project. The function can be invoked simply by visiting its URL which will look something like:

```
https://<region>-<projectId>.cloudfunctions.net/getUserDetails
```

`<region>` and `<projectId>` will depend on your Google Cloud project setup, and the gcloud command will display the full invocation URL for your function at the end of a successful deployment.

The output looks like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/python3_cloud_functions_output.png" class="figure-img img-fluid" alt="Function output">
  <figcaption class="figure-caption text-center">Function output.</figcaption>
</figure>

The Cloud Functions console also shows that the function is using the Python runtime:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/python3_cloud_functions_console.png" class="figure-img img-fluid" alt="Cloud Functions console">
  <figcaption class="figure-caption text-center">Google Cloud Functions Console.</figcaption>
</figure>

And that’s all there is to it!

---

If you’d like to use or study the code from this article feel free: I’ve [put it on GitHub](https://github.com/simonprickett/google-cloud-functions-python) for you. Google’s documentation for the Python Cloud Functions runtime can be [read here](https://cloud.google.com/functions/docs/concepts/python-runtime).

Thanks for reading, please give me a follow on [Twitter](https://twitter.com/simon_prickett) if you’d like to see more in future! I write about a range of technologies including Node.js, Go, Python, Raspberry Pi and Amazon Alexa.