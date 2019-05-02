
import {CommonRequestOptions, Video} from "../interfaces.js"
import {getPlaylistVideos} from "./get-playlist-videos.js"
import {getChannelUploadsPlaylistId} from "./get-channel-uploads-playlist-id.js"

/**
 * Return all of a channel's videos
 * - same as getAllPlaylistVideos, but with an extra round trip to find
 *   the 'uploads' playlist
 * - you should really just use getAllPlaylistVideos instead
 * - this exists for supremely lazy people
 */
export async function getUploads(
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
	return getPlaylistVideos({playlistId, onVideosReceived, paginationLimit, ...options})
}
