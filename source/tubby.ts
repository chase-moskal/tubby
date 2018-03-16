
/**
 * Options common to all requests to the youtube api
 */
export interface CommonRequestOptions {
	apiKey: string
	apiEndpoint?: string
	fetchParams?: RequestInit
}

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
 * Encode an object as url query string parameters
 * - you know, like "?key=value&alpha=beta"
 */
function encodeQueryParams(data: {[key: string]: any}): string {
	let subject = ""
	let first = true
	for (const key of Object.keys(data)) {
		const separator = first ? "?" : "&"
		subject += `${separator}${key}=${data[key]}`
		first = false
	}
	return subject
}

/**
 * Response from the youtube api
 */
export type YoutubeResponse = any

/**
 * Options for a generic request to the youtube api
 * - provide your own resource and data
 */
export interface RequestOptions extends CommonRequestOptions {
	resource: string
	data: any
}

/**
 * Make a call to the youtube api
 */
export async function request(opts: RequestOptions): Promise<YoutubeResponse> {
	const options = {...defaultRequestOptions, ...opts}
	let {apiKey, apiEndpoint, fetchParams, resource, data} = options
	if (!apiKey) throw new Error("missing param 'apiKey' is required")

	// ensure api key is properly set in data
	data = {...data}
	if (data.key) throw new Error("api key must not be provided in the data object")
	data.key = apiKey

	// construct the final url
	const url = apiEndpoint + resource + encodeQueryParams(data)

	// execute the request and gather the json response
	const response = await (await fetch(url, fetchParams)).json()

	// throw any reported errors
	if (response.error) {
		throw new Error(`Error ${response.error.code}: ${response.error.message}`)
	}

	// return the youtube response
	return response;
}

/**
 * Youtube video
 */
export interface Video {
	videoId: string
	title: string
	description: string
	thumbs: {
		small: string
		medium: string
	}
}

/**
 * Get the id of the 'uploads' playlist which contains all the videos
 */
export async function getChannelUploadsPlaylistId(opts: CommonRequestOptions & {channelId: string}): Promise<string> {
	const {channelId, ...options} = opts
	const response = await request({
		...options,
		resource: "channels",
		data: {id: channelId, part: "contentDetails"}
	})
	return response.items[0].contentDetails.relatedPlaylists.uploads
}

/**
 * Get all videos of a playlist ('upload' playlist is a list of all videos)
 * - sequentially read all paginated videos — *every single one of them*
 * - it can take awhile, i found a quarter second per round trip — 50 videos per trip
 * - you can render videos as they load realtime by providing an 'onVideosReceived' callback
 */
export async function getAllVideos(
	opts: CommonRequestOptions & {
		playlistId: string;
		paginationLimit?: number
		data?: any;
		onVideosReceived?: (videos: Video[]) => void
	}
): Promise<Video[]> {
	const {playlistId, data: moreData, onVideosReceived, paginationLimit = 50, ...options} = opts
	
	let allVideos: Video[] = []
	let nextPageToken: string
	let go: boolean = true

	// loop over every page to receive all results
	while (go) {

		// prepare youtube api request data, to get the videos
		const data: any = {
			part: "snippet",
			playlistId,
			maxResults: paginationLimit,
			...moreData
		}

		// add the page token, if available
		if (nextPageToken) data.pageToken = nextPageToken

		// query youtube for page of video results
		const response = await request({
			resource: "playlistItems",
			data,
			...options
		})

		// extract videos from the response
		const newVideos = response.items.map((item): Video => ({
			videoId: item.snippet.resourceId.videoId,
			title: item.snippet.title,
			description: item.snippet.description,
			thumbs: {
				small: item.snippet.thumbnails.default.url,
				medium: item.snippet.thumbnails.medium.url
			}
		}))

		// fire realtime 'onVideosReceived' callback
		if (onVideosReceived) onVideosReceived(newVideos)

		// add to videos list
		allVideos = [...allVideos, ...newVideos]

		// queue up the next page of video results
		nextPageToken = response.nextPageToken

		// we're done when there are no more pages
		if (!nextPageToken) go = false
	}

	// return all of the gathered videos
	return allVideos
}

/**
 * Return all of a channel's videos
 * - same as getAllVideos, but with an extra round trip to find
 *   the 'uploads' playlist
 * - you should just use getAllVideos instead
 * - this exists for supremely lazy people
 */
export async function getAllVideosForChannel(
	opts: CommonRequestOptions & {
		channelId: string;
		paginationLimit?: number
		onVideosReceived?: (videos: Video[]) => void
	}
): Promise<Video[]> {
	const {channelId, onVideosReceived, paginationLimit, ...options} = opts

	// fetch the 'uploads' playlist for the channel
	const playlistId = await getChannelUploadsPlaylistId({channelId, ...options})

	// get all of the videos for that playlist
	return getAllVideos({playlistId, onVideosReceived, paginationLimit, ...options})
}
