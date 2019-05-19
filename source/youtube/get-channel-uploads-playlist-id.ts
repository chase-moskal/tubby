
import {youtubeRequest} from "./youtube-request.js"
import {GetChannelUploadsPlaylistIdOptions} from "../interfaces.js"

/**
 * Get the id of the 'uploads' playlist (which contains all of a channel's videos)
 */
export async function getChannelUploadsPlaylistId(opts: GetChannelUploadsPlaylistIdOptions): Promise<string> {
	const {channelId, ...options} = opts
	const response = await youtubeRequest({
		...options,
		resource: "channels",
		data: {id: channelId, part: "contentDetails"}
	})
	return response.items[0].contentDetails.relatedPlaylists.uploads
}
