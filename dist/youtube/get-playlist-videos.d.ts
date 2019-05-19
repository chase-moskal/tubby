import { GetPlaylistVideosOptions, Video } from "../interfaces.js";
/**
 * Get all videos in a playlist ('upload' playlist is a list of all videos)
 * - sequentially read all paginated videos — *every single one of them*
 * - it can take awhile, i found a quarter second per round trip — 50 videos per trip
 * - you can render videos as they load realtime by providing an 'onVideosReceived' callback
 */
export declare function getPlaylistVideos(opts: GetPlaylistVideosOptions): Promise<Video[]>;
