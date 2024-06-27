/// <reference types="node" />
import * as mHttp from 'http';
import * as mHttps from 'https';
export declare class OnvifHttpAuth {
    private user;
    private pass;
    private method;
    private path;
    private nonceCount;
    private options;
    request(options: mHttps.RequestOptions | mHttps.RequestOptions, callback: (req: mHttp.IncomingMessage) => void): mHttp.ClientRequest;
    private handleHttpDigest;
    private parseAuthHeader;
    private createAuthReqHeaderValue;
    private createHash;
    private createCnonce;
}
