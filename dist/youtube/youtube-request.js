var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { encodeQueryString } from "../toolbox/encode-query-string.js";
/**
 * Default options for all youtube api requests
 */
export const defaultRequestOptions = {
    apiEndpoint: "https://www.googleapis.com/youtube/v3/",
    fetchParams: {
        method: "GET",
        mode: "cors",
        cache: "default",
        redirect: "follow",
        credentials: "omit"
    }
};
/**
 * Make an http 'get' request to the youtube api
 */
export function youtubeRequest(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = Object.assign(Object.assign({}, defaultRequestOptions), opts);
        let { apiKey, apiEndpoint, fetchParams, resource, data, fetch = window.fetch } = options;
        if (!apiKey)
            throw new Error("missing param 'apiKey' is required");
        // ensure api key is properly set in data
        data = Object.assign({}, data);
        if (data.key)
            throw new Error("api key must not be provided in the data object");
        data.key = apiKey;
        // construct the final url
        const url = apiEndpoint + resource + encodeQueryString(data);
        // execute the request and gather the json response
        const response = yield (yield fetch(url, fetchParams)).json();
        // throw any reported errors
        if (response.error) {
            throw new Error(`Error ${response.error.code}: ${response.error.message}`);
        }
        // return the youtube response
        return response;
    });
}
//# sourceMappingURL=youtube-request.js.map