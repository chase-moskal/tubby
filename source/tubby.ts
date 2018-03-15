
/**
 * TUBBY OPTIONS
 */
export interface TubbyOptions {

	/** GOOGLE API KEY */
	youtubeApiKey: string
}

/**
 * TUBBY VIDEO
 * - represents a single youtube video
 */
export interface TubbyVideo {
	youtubeVideoId: string
	title: string
	description: string
	cover: string
}

/**
 * TUBBY
 * - youtube api helper
 */
export default class Tubby {
	private readonly youtubeApiUrl: string = "https://www.googleapis.com/youtube/v3/"
	private readonly paginationLimit: number = 50
	private readonly fetchParams: RequestInit = {
		method: "GET",
		mode: "cors",
		cache: "default",
		redirect: "follow",
		credentials: "omit"
	}

	private readonly youtubeApiKey: string

	/**
	 * CONSTRUCTOR FOR 'TUBBY' YOUTUBE API HELPER
	 * - provide the google api key to get started
	 */
	constructor({youtubeApiKey}: TubbyOptions) {
		this.youtubeApiKey = youtubeApiKey
	}

	/**
	 * ENCODE DATA
	 * - encode a javascript object as an HTTP 'get' data string
	 */
	private encodeData(data: {[key: string]: any}): string {
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
	 * DIGEST RESPONSE ITEMS AS VIDEOS
	 * - simplify youtube api responses
	 */
	private digestResponseItemsAsVideos(items: any[]): TubbyVideo[] {
		return items.map(item => ({
			youtubeVideoId: item.snippet.resourceId.videoId,
			title: item.snippet.title,
			description: item.snippet.description,
			cover: item.snippet.thumbnails.default.url
		}))
	}

	/**
	 * REQUEST
	 * - make a request to the youtube v3 api
	 */
	async request(resource, data): Promise<any> {

		// ensure api key is properly set in data
		data = {...data}
		if (data.key) throw new Error("api key must be provided only once")
		data.key = this.youtubeApiKey

		// construct the endpoint url
		let endpoint = this.youtubeApiUrl + resource + this.encodeData(data)

		// execute the request and gather the json response
		const response = await (await fetch(endpoint, this.fetchParams)).json()

		// throw any reported errors
		if (response.error) {
			throw new Error(`Error ${response.error.code}: ${response.error.message}`)
		}

		return response;
	}

	/**
	 * GET CHANNEL UPLOADS PLAYLIST ID
	 * - get the id of the 'uploads' playlist which contains all the videos
	 */
	async getChannelUploadsPlaylistId(youtubeChannelId: string): Promise<string> {
		const response = await this.request("channels", {part: "contentDetails", id: youtubeChannelId})
		return response.items[0].contentDetails.relatedPlaylists.uploads
	}

	/**
	 * GET ALL VIDEOS
	 * - get all videos of a particular channel or playlist
	 * - sequentially read all paginated videos — *every single one of them*
	 * - it takes a awhile, i found a quarter second per round trip — 50 videos per trip
	 * - you can render videos as they load realtime by providing an 'onVideosReceived' callback
	 */
	async getAllVideos(options: GetAllVideosEfficientOptions | GetAllVideosRetardedOptions): Promise<TubbyVideo[]> {
		const roptions: GetAllVideosRetardedOptions = <any>options
		const eoptions: GetAllVideosEfficientOptions = <any>options

		// obtain the 'uploads' playlist id
		const youtubePlaylistId = !eoptions.youtubePlaylistId
			? await this.getChannelUploadsPlaylistId(roptions.youtubeChannelId)
				.then(id => {
					if (!options.silent)
						console.warn(`'tubby.getAllVideos' would be faster if `
							+ `supplied {youtubePlaylistId: "${id}"} instead of `
							+ `{youtubeChannelId} — it would save a roundtrip — `
							+ `pass {silent: true} to remove this message`)
					return id
				})
			: eoptions.youtubePlaylistId

		let videos: TubbyVideo[] = []
		let nextPageToken: string
		let go: boolean = true

		// loop to receive all of the videos, despite pagination
		while (go) {

			// prepare youtube api request data, to get the videos
			const data: any = {
				part: "snippet",
				playlistId: youtubePlaylistId,
				maxResults: this.paginationLimit,
				...options.moreData
			}

			// add the page token, if available
			if (nextPageToken) data.pageToken = nextPageToken

			// query youtube for page of video results
			const response = await this.request("playlistItems", data)
			const newVideos = this.digestResponseItemsAsVideos(response.items)

			// fire realtime 'onVideosReceived' callback
			if (options.onVideosReceived) options.onVideosReceived(newVideos)

			// add to videos list
			videos = [...videos, ...newVideos]

			// queue up the next page of video results
			nextPageToken = response.nextPageToken

			// we're done when there are no more pages
			if (!nextPageToken) go = false
		}

		// return all of the gathered videos
		return videos
	}
}

export interface GetAllVideosCommonOptions {
	moreData?: any
	onVideosReceived?: (videos: TubbyVideo[]) => void
	silent?: boolean
}

export interface GetAllVideosEfficientOptions extends GetAllVideosCommonOptions {
	youtubePlaylistId: string
}

export interface GetAllVideosRetardedOptions extends GetAllVideosCommonOptions {
	youtubeChannelId: string
}
