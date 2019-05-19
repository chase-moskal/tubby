import { GetUploadsOptions, Video } from "../interfaces.js";
/**
 * Return all of a channel's videos
 * - same as getAllPlaylistVideos, but with an extra round trip to find
 *   the 'uploads' playlist
 * - you should really just use getAllPlaylistVideos instead
 * - this exists for supremely lazy people
 */
export declare function getUploads(opts: GetUploadsOptions): Promise<Video[]>;
