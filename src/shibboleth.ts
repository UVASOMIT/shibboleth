/**
 * @module uvasomit/shibboleth
 */

export class Shibboleth {
    private _shibURL: string;
    constructor(shibURL: string) {
        this._shibURL = shibURL;
        if(!this._shibURL.endsWith('?target=')) {
            this._shibURL = `${ this._shibURL }?target=`;
        }
    }
    public hasShibSessionInfo(req: any, headers?: string[]): boolean {
        if(headers != null && headers.length > 0) {
            for(let i = 0; i < headers.length; i++) {
                if(req.headers[headers[i]] != null) {
                    return true;
                }
            }
        }
        if(req.headers['http_shibsessionid'] != null || req.headers['x-iisnode-http_shibsessionid'] != null) {
            return true;
        }
        return false;
    }
    public shouldRedirect(req: any): boolean {
        if(!this.hasShibSessionInfo(req)) {
            return true;
        }
        return false;
    }
    public redirect(req: any, res: any, next: any): void {
        res.redirect(301, `${ this._shibURL }${ req.url }`, next);
    }
}

export function shibboleth(req: any, res: any, next: any): void {
    const shib = new Shibboleth(process.env.SHIBBOLETHURL);
    if(shib.shouldRedirect(req)) {
        shib.redirect(req, res, next);
    }
    next();
}
