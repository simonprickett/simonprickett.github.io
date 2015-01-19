---
layout: post
title:  "Running Jekyll on Github Pages"
date:   2014-12-29 21:24:00
categories: jekyll markdown github
comments: True
---
When I originally decided I wanted to document some of the things I work with 
in a more public way, I was pretty certain I didn't want to use some database 
backed blogging platform such as WordPress.  I wanted the ability to write 
content quickly, and anywhere, and have version control of it as I am a 
developer and am already used to having everything I do under version control.

I didn't spend much time looking around, and quickly landed on using 
[Jekyll](http://jekyllrb.com/) with [GitHub Pages](http://pages.github.com): this 
met my needs, wasn't overly complicated, and looked like it could be extended 
to do anything I wanted with strong community support.

I'm still happy with my selections, but found a quirk of running Jekyll on 
GitHub Pages recently when producing 
[this post about hackpledge.org]({% post_url 2014-12-20-hack-pledge %}).

I wanted to do a bit more than just text and code samples here, and was looking 
to embed a YouTube video and a CodePen sample that people could see and use right 
in the page.

Jekyll has a nice, simple, plugins architecture with [documentation here](http://jekyllrb.com/docs/plugins/).  I was able to find plugins for both YouTube embeds and CodePen too, 
so thought this would be easy.  I needed these as you can't just put HTML inside the 
Markdown that you use to write posts in Jekyll, that's not how the generator works.

I didn't initially see the comment in the documentation (despite it being really clear, 
and in a call out!) which says that plugins don't run on GitHub Pages so you'd need 
to generate your site locally and upload the resulting HTML.  This cost me some time 
working out why my site was running great locally, but uploading to GitHub got me nothing 
but error emails for the page with the embeds on.

Having realized what was going on, I still didn't want to generate the site locally and 
upload the resulting HTML as well as the source Markdown, so started looking at alternatives.

I figured out that Jekyll's includes mechanism 
[documentation here](http://jekyllrb.com/docs/templates/) does work on GitHub Pages, and 
you can pass parameters into includes too.

This discovery let me set up some HTML snippets for a YouTube embed and a CodePen example, 
add them to the _includes folder in my Jekyll project and use them with parameters.

For example, here's the YouTube one:

{% highlight html %}
<iframe 
	width="560"
	height="420" 
	src="http://www.youtube.com/embed/{{ include.video }}?color=white&amp;theme=light">
</iframe>
{% endhighlight %}

Where include.video is a parameter that can be passed to the include like this when 
invoking it:

{% highlight html %}
{% raw %}
include youtube.html video="VRQn2utaaJw"
{% endraw %}
{% endhighlight %}

This renders like this:

{% include youtube.html video="dQw4w9WgXcQ" %}

I could always add extra parameters for width and height of the embedded video, but I 
haven't needed that yet.

The CodePen one is a little more involved, but same princples and you just pass it a 
pen user name, ID, the name of the tab you want it to default to and a desired height 
for the embedded iframe:

{% highlight html %}
<div>
	<iframe 
		id="cp_embed_{{ include.pen }}" 
		src="//codepen.io/{{ include.user }}/embed/{{ include.pen }}?height={{ include.height }}&amp;type={{ include.tab }}&amp;href={{ include.pen }}&amp;user={{ include.video }}&amp;slug-hash={{ include.pen }}&amp;default-tab={{ include.tab }}" 
		scrolling="no" 
		frameborder="0" 
		height="{{ include.height }}" 
		allowtransparency="true" 
		allowfullscreen="true" 
		class="cp_embed_iframe undefined" 
		style="width: 100%; overflow: hidden;">
	</iframe>
</div>
<script async="" src="http://codepen.io:/assets/embed/ei.js"></script>
{% endhighlight %}

This one uses some extra JavaScript from CodePen too.  Example invocation:

{% highlight html %}
{% raw %}
{% include codepen.html user="simonprickett" pen="qENLqz" 
                        tab="result" height="600" %}
{% endraw %}
{% endhighlight %}

Which renders like so:

{% include codepen.html user="simonprickett" pen="qENLqz" tab="result" height="600" %}


If you find these useful, you can grab both YouTube and CodePen includes from 
[the GitHub repo for this blog](https://github.com/simonprickett/simonprickett.github.io).  Get them from the _includes folder.

For now I am sticking with this method in lieu of plugins and generating the site locally, 
but if I hit a roadblock with it in the future I may have to reconsider.
