# simonprickett.dev

Simon Prickett's GitHub pages site.  Check out the live site at [https://simonprickett.dev/](https://simonprickett.dev/).

Jekyll and the Ruby ecosystem are pretty brittle and hard to manage, so just use Docker to run this locally:

```
docker-compose up
```

Then wait until you see:

```
simonprickettgithubio-jekyll-1  |     Server address: http://0.0.0.0:4000/
simonprickettgithubio-jekyll-1  |   Server running... press ctrl-c to stop.
```

The site should then be available at [`http://localhost:4000`](http://localhost:4000).

Jekyll watches for changes and will restart whenever you save an existing file or add new ones.
