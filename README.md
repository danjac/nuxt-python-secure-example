Handling secure authentication with a Python backend (e.g. Flask or Django/DRF) and Nuxt frontend.

Overview
--------

1. User goes to login page (login.vue) and enters their credentials.
2. Server.js (node app running Nuxt) POSTs credentials to a Flask app.
3. Flask app returns with an auth token.
4. Node app stores token in session (using express-session).
5. Calls to /api/ are proxied to http://localhost:5000/ (URL of Flask app) using middleware.
6. If user is authenticated, we add the auth token in the session to the proxied request headers.

Using Nuxt over plain VueJS incurs a number of advantages, most obviously server-side rendering (SSR) for fast-loading and better SEO.

However, in addition, this allows for a cleaner architecture. Rather than mixing our Django/Flask REST app with our browser application, we can have a completely separate API app that can serve multiple clients - browsers, mobile, desktop, other servers - using the same authentication mechanism, without the additional complexity of managing an SPA wrapped inside Django or Flask templates.

This is of course possible with a plain VueJS (client only) architecture, but the issue here is authentication. Storing tokens in the browser - whether JWT, DRF auth tokens, oauth2 tokens etc - is fraught with security risks, as localStorage, sessionStorage or client side cookies are all vulnerable to XSS attacks and should never be used for securing sensitive info. Using a node app "frontend" however does not incur such risk - we can safely store the auth token in a server cookie, completely opaque to the browser. As the node app is responsible for communicating with the API we don't need to worry about the auth tokens being exposed on the client.

In addition, we've added CSRF protection using csurf middleware.
