import * as restify from "restify";
import * as express from "express";

/**
 * @module shibboleth
 */

export class Shibboleth {
    private _shibURL: string;
    constructor(shibURL: string) {
        this._shibURL = shibURL;
        if(!this._shibURL.endsWith("?target=")) {
            this._shibURL = `${this._shibURL}?target=`;
        }
    }
    public hasShibSessionInfo(req: restify.Request | express.Request, headers?: string[]): boolean {
        if(headers != null && headers.length > 0) {
            for(let i = 0; i < headers.length; i++) {
                if(req.headers[headers[i]] != null) {
                    return true;
                }
            }
        }
        if(req.headers["http_shibsessionid"] != null || req.headers["x-iisnode-http_shibsessionid"] != null) {
            return true;
        }
        return false;
    }
    public shouldRedirect(req: restify.Request | express.Request): boolean {
        if(!this.hasShibSessionInfo(req)) {
            return true;
        }
        return false;
    }
    public redirect(req: restify.Request | express.Request, res: restify.Response | express.Response, next: any): void {
        res.redirect(301, `${process.env.SHIBBOLETH}${req.url}`, next)
    }
}

export function shibboleth(req: restify.Request | express.Request, res: restify.Response | express.Response, next: any): void {
    const shib = new Shibboleth(process.env.SHIBBOLETHURL);
    if(shib.shouldRedirect(req)) {
        shib.redirect(req, res, next);
    }
    next();
}
