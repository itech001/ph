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

- **Hybrid scrolling.** It's like infinite scrolling, but without the sudden
unexpected lag on mobile!


## Development

Ph uses Product Hunt's API, which is currently invite-only. To run Ph you need
to update *config.json* with your API Client ID and Client Secret.

Ph uses [Stylus][stylus] with [Nib][nib] for CSS.

Run *app.py* and allow it to scrape at least one full page before viewing Ph at
`localhost:4001`. When developing switch `app.debug = False` to `app.debug =
True` at the bottom of *app.py* for Flask's built-in debugging tools and auto
CSS compiling (compiles every time you load the page).

### Dependencies

- MongoDB
- Python 3 (`pip install -r requirements.txt`)
  - flask
  - stylus
  - pymongo
  - requests
- Node.js (`npm install`)
  - stylus
  - nib

The core of Ph is all Python based, but Node.js is used for Stylus/Nib.


# TODO

- **Iframe error handling and reports.** Though it's very rare with new
websites and startups (ie the kinds of things shared on Product Hunt), some
websites block iframes which Ph uses to display them within the app. When this
happens the user should be notified. Also, even more rarely iframes REDIRECT
the parent website to their own URL. This should be blocked.

- **User sign in.** Commenting, voting, posting.


[ph]: http://ph.bram.gg
[hn]: http://hn.premii.com
[stylus]: https://learnboost.github.io/stylus/
[nib]: https://visionmedia.github.io/nib/
[ex]: http://example.com
[screenshot]: promo/android-screenshot.png
