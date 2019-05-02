
import {encodeQueryString} from "../toolbox/encode-query-string.js"
import {CommonRequestOptions, RequestOptions, YoutubeResponse} from "../interfaces.js"

/**
 * Default options for all youtube api requests
 */
export const defaultRequestOptions: Partial<CommonRequestOptions> = {
	apiEndpoint: "https://www.googleapis.com/youtube/v3/",
	fetchParams: {
		method: "GET",
		mode: "cors",
		cache: "default",
		redirect: "follow",
		credentials: "omit"
	}
}

/**
 * Make an http 'get' request to the youtube api
 */
export async function youtubeRequest(opts: RequestOptions): Promise<YoutubeResponse> {
	const options = {...defaultRequestOptions, ...opts}
	let {apiKey, apiEndpoint, fetchParams, resource, data, fetch = window.fetch} = options
	if (!apiKey) throw new Error("missing param 'apiKey' is required")

	// ensure api key is properly set in data
	data = {...data}
	if (data.key) throw new Error("api key must not be provided in the data object")
	data.key = apiKey

	// construct the final url
	const url = apiEndpoint + resource + encodeQueryString(data)

	// execute the request and gather the json response
	const response = await (await fetch(url, fetchParams)).json()

	// throw any reported errors
	if (response.error) {
		throw new Error(`Error ${response.error.code}: ${response.error.message}`)
	}

	// return the youtube response
	return response
}
