import * as restify from "restify";
import * as express from "express";

/**
 * @module shibboleth
 */

export function getAuthUser(req: restify.Request | express.Request, headers?: string[]): string {
    if(headers != null && headers.length > 0) {
        for(let i = 0; i < headers.length; i++) {
            if(req.headers[headers[i]] != null && req.headers[headers[i]] != "") {
                const userID = req.headers[headers[i]];
                return (userID instanceof Array) ? userID[0] : userID;
            }
        }
    }
    try {
        const ComputingID: string | string[] = req.headers["http_uid"]
         || req.headers["http_pubcookie_user"]
         || req.headers["login_user"]
         || req.headers["x-iisnode-http_uid"]
         || req.headers["x-iisnode-http_pubcookie_user"]
         || req.headers["x-iisnode-login_user"];
        return (ComputingID instanceof Array) ? ComputingID[0] : ComputingID;
    }
    catch(e) {
        return null;
    }
}
