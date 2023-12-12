---
layout: post
title:  "Using Environment Variables with Google Cloud Functions"
categories: [ Cloud, GCP, Node.js, JavaScript, Serverless, Coding ]
image: assets/images/cloud_functions_env_vars_main.jpg
author: simon
---
Google’s [Cloud Functions](https://cloud.google.com/functions/) have been around for a little while now. The product works well with other Google Cloud Platform offerings and provides a scalable, event-driven runtime for serverless applications or microservices. Developers can write functions using (a relatively old version of `¯\_(ツ)_/¯`) Node.js (other language runtimes aren’t available at this point `¯\_(ツ)_/¯`) and attach them to events. Supported event triggers include a HTTP request, a message being published to a pub/sub topic or changes to an object in a cloud storage bucket.

One feature that’s been noticeably absent from the Cloud Functions runtime until very recently has been support for [environment variables](https://en.wikipedia.org/wiki/Environment_variable). This omission has made it more difficult than necessary to provide values to functions at runtime without using a database or hard coding. These are not ideal approaches to managing values such as third party API keys. The lack of environment variables has also made it awkward to manage the normal progression of code through development, QA, staging and production environments for example if different keys to the same third party API are required in each.

{% include coffee-cta.html %}

Fortunately Google recently played catchup, adding support for environment variables as a beta feature. This helps to close the gap between Google’s Cloud Functions and Amazon’s AWS Lambda, which had this feature since forever. Let’s take a look at how it works in practice…

## Modifying Code to Use Environment Variables
There’s nothing exciting here… we can get the value of an environment variable in the same way as we would do in any other Node.js runtime. Let’s use a function called `helloEnvVars` that we’ll attach to a URL for a browser to read:

<script src="https://gist.github.com/simonprickett/45ec417a72f70cfb2ebb1adb280d3657.js"></script>

The code expects three environment variables:

* `SUCH_SECRET`
* `MANY_ENCRYPTS`
* `SO_FINALLY_CAUGHT_UP_WITH_AWS`

If it can’t find a value for any of these, it will fallback to displaying "UNKNOWN" in the resulting HTML.

If we deploy the function as usual (substitute `<projectID>` for your Google Cloud Platform project ID):

```
$ gcloud functions deploy helloEnvVars --trigger-http --project <projectID>
```

We can then point a browser at the URL that appears in the `gcloud` command’s output and see that none of these environment variables are currently set...

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cloud_functions_env_vars_unset_all.png" class="figure-img img-fluid" alt="No environment variables set yet...">
  <figcaption class="figure-caption text-center">No environment variables set yet...</figcaption>
</figure>

## Deploying Environment Variables
Environment variables are set when the function is deployed. This is currently a beta function, so we’ll need to ensure that the `gcloud` command has `beta` functionality installed:

```
$ gcloud components update
$ gcloud components install beta
```

There are two ways to set environment variables:

* As parameters to the `gcloud` command
* Within a YAML file

### Setting Environment Variables from the Command Line
To set an environment variable from the command line:

```
$ gcloud beta functions deploy helloEnvVars --trigger-http --set-env-vars SUCH_SECRET=hello --project <projectID>
```

(Note: we are now using `gcloud beta functions deploy`)

Multiple environment variables can be set with a single command by providing a comma separated list of `<name=value>` pairs:

```
$ gcloud beta functions deploy helloEnvVars --trigger-http --set-env-vars SUCH_SECRET=Hello,MANY_ENCRYPTS=World --project <projectID>
```

Revisiting the function’s URL shows that the code is able to access the values:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/cloud_functions_env_vars_set_two.png" class="figure-img img-fluid" alt="Some environment variables now have values set.">
  <figcaption class="figure-caption text-center">Some environment variables now have values set.</figcaption>
</figure>

### Setting Environment Variables using a YAML File
For large numbers of values or as part of a continuous integration progress, it probably makes more sense to use a file to deploy environment variables. Google supports the use of a YAML file for this. Let’s create a file called `env.yaml`:

<script src="https://gist.github.com/simonprickett/7d9452602baa6b6521c40b6c3845528c.js"></script>

To deploy the function and set all of the environment variables in the file, use:

```
$ gcloud beta functions deploy helloEnvVars --trigger-http --env-vars-file env.yaml --project <projectID>
```

**Note:** This method will reset the environment so that only the environment variables declared in the file are set. Any that previously existed and which are not listed in the file will be unset.

## Scope
It’s important to note that environment variables are only set for the function that they are deployed with. If you have multiple functions in your project’s `index.js` file or similar, deploying one of them with environment variables configured **does not** cause those environment variables to be available to other functions.

## Updating Environment Variables
Updating environment variables appears to work in the same way as setting them for the first time, but using `--update-env-vars`:

```
$ gcloud beta functions deploy helloEnvVars --trigger-http --update-env-vars SUCH_SECRET=Updated --project <projectID>
```

As with the other commands, you can supply a comma separated list or specify a YAML file together with `--env-vars-file`.

It seems that you can also use `--set-env-vars` to overwrite the values of existing environment variables and `--update-env-vars` to add values for new ones. The two seem pretty interchangeable `¯\_(ツ)_/¯`.I think I’ll stick with just using `--set-env-vars` for everything unless there’s a good reason not to?

## Unsetting Environment Variables
Environment variables can be unset (removed) individually. Let’s remove two in one command:

```
$ gcloud beta functions deploy helloEnvVars --trigger-http --remove-env-vars SUCH_SECRET,MANY_ENCRYPTS --project <projectID>
```

We can also unset all environment variables at once:

```
$ gcloud beta functions deploy helloEnvVars --trigger-http --clear-env-vars --project <projectID>
```

**Remember:** Environment variables are scoped to the function that they are deployed with. Removing them for one function in your project won’t remove them for others even if the other functions are defined in the same .js file

## Notes and Gotchas

I tripped over a few things while researching this topic, so thought I’d add these here to help others.

### Notes

* Repetitive, but worth another mention… Environment variables are scoped by function, so are not shared between functions — you need to add separate environment variables for each function even if they are deployed together and/or exist in the same source code file
* The maximum allowable size for environment variables is 32kb per function
* You should probably add any YAML files that you use to store environment variable values in to your project’s `.gitignore` file as you likely don't want these adding to source control!
* A deployment failure will not update any environment variables, only a completely successful deployment updates them
* Once environment variables are set, deploying the function again without specifying any environment variable options will leave the current settings intact. For example this command does not change the values of any environment variables, nor unset any that previously existed: `gcloud beta functions deploy helloEnvVars --trigger-http --project <projectID>`
* The current values of all environment variables will be displayed in the output of `gcloud` after each successful function deployment

### Gotchas

Don’t forget to quote and escape values when using `--set-env-vars` or `--update-env-vars`:

```
$ gcloud beta functions deploy helloEnvVars --trigger-http --set-env-vars MANY_ENCRYPTS="it'srTgHi0444452\!" --project <projectID>
```

If you don’t do this, the shell will try and interpret the values.

When deploying environment variables in a YAML file, be careful of values that can be interpreted as boolean or int types by the YAML parser, e.g.:

```
SO_FINALLY_CAUGHT_UP_WITH_AWS: true
```

These cause deployment errors:

```
ERROR: gcloud crashed (ValidationError): Expected type <type 'unicode'> for field value, found True (type <type 'bool'>)
```

The answer is to explicitly make the value a string:

```
SO_FINALLY_CAUGHT_UP_WITH_AWS: "true"
```

The same applies to numeric values, for example:

```
MANY_ENCRYPTS: 12
```

will error on deploy, but:

```
MANY_ENCRYPTS: "12"
```

will not.

---

If you’d like to use or study the code from this article feel free: I’ve [put it on GitHub](https://github.com/simonprickett/google-cloud-functions-environment-variables) for you.

Thanks for reading!