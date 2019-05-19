import { CommonRequestOptions, RequestOptions, YoutubeResponse } from "../interfaces.js";
/**
 * Default options for all youtube api requests
 */
export declare const defaultRequestOptions: Partial<CommonRequestOptions>;
/**
 * Make an http 'get' request to the youtube api
 */
export declare function youtubeRequest(opts: RequestOptions): Promise<YoutubeResponse>;
