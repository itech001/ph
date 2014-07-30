# Ph

[Ph][ph] is a *good* mobile web interface for Product Hunt. Visit
[ph.bram.gg][ph] on your **mobile device** to experience the awesome! Ph was
heavily inspired by [hn.premii.com][hn].


## Features

- **9 days of products.** Ph stores five pages (9 days) of the latest Product
Hunt content. Most people will never need to look back that far.

- **Inline product viewer.** Ph allows you to view product websites within the
app using iframes, meaning no mobile tab clutter.

- **Inline comments.** Product Hunt would be nothing without the community,
which is why you can read mobile-optimized comments without leaving the app.
Unfortunately it's currently read-only due to the lack of Product Hunt POST (or
any) API (Ryan Hoover [plz][api plz]).

- **Infinite scrolling.** Pressing buttons is *soo* 2013.


## Development

Ph uses [Stylus][stylus] with [Nib][nib] for CSS.

Scrape at least one page of Product Hunt with *scrape.py* before running
*app.py* and viewing Ph at `localhost:4001`. When developing switch
`app.debug = False` to `app.debug = True` at the bottom of *app.py* for
Flask's built-in debugging tools and auto CSS compiling (compiles every time
you load the page).

### Dependencies

- MongoDB
- Python 3
  - flask
  - stylus
  - pymongo
  - requests
  - beautifulsoup4
- Node.js (`npm install`)
  - stylus
  - nib

The core of Ph is all Python based, but Node.js is used for Stylus/Nib.


# TODO

- **Scrape links/images from comments.** Currently *scrape.py* only gets text
from comments. If a link's text is its URL (eg [http://example.com][ex])
*index.js* can convert it to a clickable URL with Regex, but if a link's URL is
hidden (eg [example][ex]) then the client will just display the text (eg
"example"). This along with no image support should be fixed in *scrape.py*.

- **Iframe error handling and reports.** Though it's very rare with new
websites or startups (ie the kinds of things shared on Product Hunt), some
websites block iframes which Ph uses to display them within the app. When this
happens the user should be notified. Also, even more rarely iframes REDIRECT
the parent website to their own URL. This should be blocked.

- **More clear infinite scrolling.** There should be indications when the next
page is trying to load or when all five pages have already been loaded.


[ph]: http://ph.bram.gg
[hn]: http://hn.premii.com
[api plz]: https://twitter.com/intent/tweet?text=%40rrhoover+Product+Hunt+api+plz+ty
[stylus]: https://learnboost.github.io/stylus/
[nib]: https://visionmedia.github.io/nib/
[ex]: http://example.com
[screenshot]: promo/android-screenshot.png
