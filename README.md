# Shibboleth Node.JS Package

JavaScript package for accessing authentication items from Shibboleth.

## Installation

To install the package:

    npm install shibboleth --save

## Usage (TypeScript)

### Restify

To use this as Restify middleware:

    const { shibboleth } = require("shibboleth");

    const server: restify.Server = restify.createServer();

    server.use(shibboleth);

The middleware will look to see if the `http_shibsessionid` header or the `x-iisnode-http_shibsessionid` header is present. If so, the middleware passes, and moves to the next middleware. If not, the middleware will look for an environment variable called `SHIBBOLETHURL`. This URL should be the login/authentication URL without the query string. It will append `?target=` to the end of it, and then redirect the user to the Shibboleth authentication URL with the target set to the currently requested page.

When it returns the headers should be present, and the middleware will pass. To get the authenticated user, check your headers for the apprioriate item, such as `http_uid` or `logon_user`. This will depend on your setup.

You can also get the user via the user helper:

    const { getUserAuth, shibboleth } = require("shibboleth");

You can then call:

    const userID = getUserAuth(req);

This accepts a Restify or Express request object, and by default will return one of the following (in this order):

* `http_uid`
* `http_pubcookie_user`
* `logon_user`
* `x-iisnode-http_uid`
* `x-iisnode-http_pubcookie_user`
* `x-iisnode-login_user`

You can also check explicitly for a different set of headers via:

    const headers = ['header_to_check'];
    const userID = getUserAuth(req, headers);

### Manual Process

If you don't want to use the middleware, you can import the `Shibboleth` class:

    const { Shibboleth } = require("shibboleth");

    const shib = new Shibboleth(process.env.SHIBBOLETHURL);

Once you have the class instantiated, you have access to several methods:

* `shib.hasShibSessionInfo(req, headers)`

In the above `headers` is optional, and is a string array of Shibboleth session headers to look for in order to verify that the request has a Shibboleth session.

* `shib.shouldRedirect(req)`
* `shib.redirect(req, next)`

In the above, `next` is for Restify only, and is what is passed through via the `shibboleth()` middleware.
