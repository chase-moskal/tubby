
import {youtubeRequest} from "./youtube-request.js"
import {GetPlaylistVideosOptions, Video} from "../interfaces.js"
import {convertToTubbyThumbs} from "../toolbox/convert-to-tubby-thumbs.js"

/**
 * Get all videos in a playlist ('upload' playlist is a list of all videos)
 * - sequentially read all paginated videos — *every single one of them*
 * - it can take awhile, i found a quarter second per round trip — 50 videos per trip
 * - you can render videos as they load realtime by providing an 'onVideosReceived' callback
 */
export async function getPlaylistVideos(opts: GetPlaylistVideosOptions): Promise<Video[]> {
	const {
		playlistId,
		data: moreData,
		onVideosReceived,
		paginationLimit = 50,
		cannedVideos = [],
		...options
	} = opts

	let count = 0
	let allVideos: Video[] = cannedVideos
	let nextPageToken: string
	let go: boolean = true

	if (onVideosReceived && allVideos.length) onVideosReceived(allVideos)

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
		const response = await youtubeRequest({
			resource: "playlistItems",
			data,
			...options
		})

		const totalNumberOfVideos = response.pageInfo.totalResults

		// extract videos from the response
		const newVideos = response.items.map((item): Video => {
			const numeral = totalNumberOfVideos - (count++)
			return {
				numeral,
				videoId: item.snippet.resourceId.videoId,
				watchLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
				title: item.snippet.title,
				description: item.snippet.description,
				thumbs: convertToTubbyThumbs(item.snippet.thumbnails)
			}
		})

		// find all fresh videos which arent canned
		let canOpened = false
		const freshVideos = newVideos.filter(video => {
			const match = allVideos.find(v => v.videoId === video.videoId)
			if (match) {
				canOpened = true
			}
			return !match
		})

		// fire realtime 'onVideosReceived' callback
		if (onVideosReceived) onVideosReceived(freshVideos)

		// add to videos list
		allVideos = [...allVideos, ...freshVideos]

		// queue up the next page of video results
		nextPageToken = response.nextPageToken

		// we're done when there are no more pages
		if (!nextPageToken || canOpened) go = false
	}

	// return all of the gathered videos
	return allVideos
}
