---
layout: post
title:  "Testing Zesty.io's Templating Engine using... Zesty.io!"
categories: [ Node.js, JavaScript, CMS, Testing, Coding ]
image: assets/images/zesty_testing_main.webp
author: simon
---
Parsley is a major component of the Zesty.io Content Management platform. It is a server side templating engine which can be used to inject dynamic content into web pages or many other output formats such as API endpoints, RSS feeds or SVG images.

Parsley works by reading a template and evaluating code statements contained in `{% raw %}{{ … }}{% endraw %}` which we refer to as "hugs". These hugs are then replaced by the result of the evaluation: for example some text content may get inserted or the current date and time or the result of evaluating a math expression. You may have seen hugs referred to as mustaches in other templating languages.

A quick example of some Parsley code to insert a dynamic value into a HTML document looks like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/zesty_testing_parsley_hug.webp" class="figure-img img-fluid" alt="A Parsley hug.">
  <figcaption class="figure-caption text-center">A Parsley hug.</figcaption>
</figure>

In this example, `{% raw %}{{this.first_name}}{% endraw %}` would be replaced by the value of a field named “first_name” when the template is rendered in the context of a content item whose content model specifies such a field.

As our clients rely on Parsley to build dynamic websites, feed data into mobile apps, and even into video games it is extremely important that its functionality is tested against every update that we make to the Zesty.io platform.

{% include coffee-cta.html %}

In this article we’ll take a look at how we’ve been developing automated tests to ensure Parsley continues to work as we expect it to. We decided to take an approach that combines a standard test tool / test reporting format with the Zesty.io CMS as a headless content repository for both the Parsley code and supporting data for each test.

## Creating Test Data in Zesty.io

Probably the first question here should be, why create your test data in a CMS rather than for example alongside your test code in Github? For us this allows a wider range of team members to contribute test cases than we might otherwise have — many of our team members who don’t build the product themselves work in it daily. This allows them to use their knowledge of Parsley and the Zesty.io content editing interface to contribute test cases directly. Additionally, it gives us a good way to separate code required to run tests from the Parsley statements and accompanying data for those tests. This means that we can write a generic data driven test harness and not have to make code changes when we add more tests or update existing ones.

The first things we needed were some content models. In Zesty.io these define the data items (fields) and types for sets of content items.

We made a group content model called "Parsley Tests". Each item in the group will have:

* **Code Sample:** the code that Parsley will be required to process. This is a text area field as it may need to contain multiple lines of code.
* **Desired Result:** the output that we expect to receive once the code has been processed correctly. This is a texa area field as it may need also need to contain newlines.
* Other fields of secondary importance, such as a title, test description, sort order, etc.

Here’s a simple example test using this content model as seen in the Zesty.io Manager interface:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/zesty_testing_manager_app.webp" class="figure-img img-fluid" alt="A simple test.">
  <figcaption class="figure-caption text-center">A simple test.</figcaption>
</figure>

We also wanted to be able to have multiple sets or suites of tests. Each suite could cover a different functional area: for example one may be math functions with another for string manipulation. Each test suite will have its own ZUID (platform wide unique ID), and provide its own context item against which to run the tests. The content model for this needs to have fields as follows:

* **Group ZUID:** the ZUID of a group of test cases that make up the members of this test suite.
* **Data ZUID:** the ZUID of a content item containing test data for the test suite. This item would be used as the context in which Parsley resolves each "hug" in the test code sample.

We can call the group of items that share this content model "Test Suites". This group acts as a list of sets of tests to run, with each set having multiple test cases in it.

## Accessing the Test Data

Once we’ve got all of our tests defined and grouped in Zesty.io, we need a way to access them from a programming language so that we can run them and check the results. Zesty.io’s Instant API feature provides us with an out of the box method to get any set of content items as a JSON representation. This saves us from having to write rendering templates to do this ourselves.

Using the Instant API is as simple as turning it on in the Zesty.io Manager’s "Schema (Config)" setting then looking up the URL for the content that we want to access. In this case we want every content item in the "Parsley Tests" content model group. The URL for this can be found by viewing the appropriate content model in the Manager and clicking the URL fragment beginning `/-/instant...`:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/zesty_testing_instant_api_endpoint.webp" class="figure-img img-fluid" alt="Instant API endpoint.">
  <figcaption class="figure-caption text-center">Instant API endpoint.</figcaption>
</figure>

Looking at the structure of the JSON returned, we see that each content item (a test definition in our case) appears in the "data" array (JSON edited for brevity):

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/zesty_testing_api_response_example.webp" class="figure-img img-fluid" alt="Example JSON from the instant API.">
  <figcaption class="figure-caption text-center">Example JSON from the instant API.</figcaption>
</figure>

As we chose to break up our tests into multiple suites or groups in the CMS, we’ll also need to get the JSON representation for those. This ensures that the test code can get the ZUID for each test group to run and its’ corresponding content item ZUID for the example data that the tests may reference. To get this information we use the Instant API endpoint for the "Test Page Groups" content model. This returns a JSON response containing an array of objects, each having the ZUID for a test suite such as "Parsley Tests" and a content item ZUID for the item that holds the test data associated with that test group.

Now we can access our data in a standard way, we’ll need to write some code to get the list of test suites, and run each test with them using the supplied context.

## Writing Code for our Tests

There are many tools and frameworks for test automation. The one you choose will depend on a number of factors including the programming language you prefer to work with. We decided to write our code in Node.js and chose the [Tape framework](https://www.npmjs.com/package/tape) as it provides an easy to use API and outputs standard [TAP format](https://testanything.org/) results that can be interpreted by other tools.

Rather than hard coding test data and URLs into a Node.js script, we wanted to make this dynamic. We achieved this by building tests at runtime using data from the Zesty.io Instant API. To do this the code first needs to request the JSON for all items that use the "Test Page Groups" content model. This gives it an array of pairs of ZUIDs representing a set of content items containing test suites and the content item containing the data values for those tests.

For each of these test suites, the code then needs to get the JSON for items in the suite and loop over them. To run a test, we use the same Parsley processing endpoint that our [Parsley REPL tutorials](https://parsley.zesty.io/) use and send the value of `code_sample` to it, plus the ZUID for the content item containing the sample data (this is essentially the context that Zesty.io will process the Parsley code in). We then simply compare the result returned by the platform to the value for `desired_result` and mark the test as passed or failed accordingly using tape’s methods for reporting success and failure.

Assuming we have the ZUID for a suite of tests in `groupZuid` and the ZUID for the content item containing data items for those tests in `dataZuid`, then code to dynamically build and run a test looks like this:

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/zesty_testing_test_code.webp" class="figure-img img-fluid" alt="Code to build and run a test.">
  <figcaption class="figure-caption text-center">Code to build and run a test.</figcaption>
</figure>

This function also takes a parameter `env` which we use to configure tests to run against our development, staging or production environments. That parameter is used by the function `generateBaseUrl` to create actual Zesty.io URLs to use for the tests.

## Running the Tests

Running the test suites is then a simple matter of starting tape and optionally piping the results to a reporter package that knows how to deal with TAP format output. In this case we decided to brighten things up using the [tap-nyan](https://www.npmjs.com/package/tap-nyan) package :)

<figure class="figure">
  <img src="{{ site.baseurl }}/assets/images/zesty_testing_running_tests.gif" class="figure-img img-fluid" alt="Running tests.">
  <figcaption class="figure-caption text-center">Running tests.</figcaption>
</figure>

Adding additional tests, amending or retiring existing ones then becomes a simple matter of making the appropriate content changes in Zesty.io. There’s complete separation between the code to run the tests, the Parsley code being tested, and the test data that it uses. As Zesty.io maintains an audit trail for content we also have a complete record of when tests were added, deleted or modified.

## Wrap Up

At Zesty.io I used a range of different testing techniques for the various components of our CMS platform. To test the platform’s templating engine it seemed like a natural fit to write and maintain the test cases and their associated data on the platform itself. As Zesty.io allows full headless CMS functionality, it was then very simple to get that content from the platform and work with it using standard test tools in a language that we were already familiar with. Running the tests then becomes an integral part of the development and release cycle allowing us to spend more time delivering new features but also ensuring overall platform stability and reliability is not compromised. This is particularly important when delivering a product as a Software as a Service (SaaS) solution because new feature rollouts are delivered to all customers simultaneously.