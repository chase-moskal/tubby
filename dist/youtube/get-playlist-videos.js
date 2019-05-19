var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { youtubeRequest } from "./youtube-request.js";
import { convertToTubbyThumbs } from "../toolbox/convert-to-tubby-thumbs.js";
/**
 * Get all videos in a playlist ('upload' playlist is a list of all videos)
 * - sequentially read all paginated videos — *every single one of them*
 * - it can take awhile, i found a quarter second per round trip — 50 videos per trip
 * - you can render videos as they load realtime by providing an 'onVideosReceived' callback
 */
export function getPlaylistVideos(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { playlistId, data: moreData, cannedVideos = [], paginationLimit = 50, onVideosReceived = () => { } } = opts, options = __rest(opts, ["playlistId", "data", "cannedVideos", "paginationLimit", "onVideosReceived"]);
        let count = 0;
        let videos = [...cannedVideos];
        let nextPageToken;
        let go = true;
        if (videos.length)
            onVideosReceived(videos);
        // loop over every page to receive all results
        while (go) {
            // prepare youtube api request data, to get the videos
            const data = Object.assign({ part: "snippet", playlistId, maxResults: paginationLimit }, moreData);
            // add the page token, if available
            if (nextPageToken)
                data.pageToken = nextPageToken;
            // query youtube for page of video results
            const response = yield youtubeRequest(Object.assign({ resource: "playlistItems", data }, options));
            const totalNumberOfVideos = response.pageInfo.totalResults;
            // extract videos from the response
            const newVideos = response.items.map((item) => {
                const numeral = totalNumberOfVideos - (count++);
                return {
                    numeral,
                    videoId: item.snippet.resourceId.videoId,
                    watchLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbs: convertToTubbyThumbs(item.snippet.thumbnails)
                };
            });
            // find all fresh videos which arent canned
            let canOpened = false;
            const freshVideos = newVideos.filter(video => {
                const match = videos.find(v => v.videoId === video.videoId);
                if (match)
                    canOpened = true;
                return !match;
            });
            // fire realtime 'onVideosReceived' callback
            onVideosReceived(freshVideos);
            // add to videos list
            videos = [...videos, ...freshVideos];
            // queue up the next page of video results
            nextPageToken = response.nextPageToken;
            // we're done when there are no more pages
            if (!nextPageToken || canOpened)
                go = false;
        }
        // return all of the gathered videos
        return videos.sort((a, b) => a.numeral > b.numeral ? -1 : 1);
    });
}
//# sourceMappingURL=get-playlist-videos.js.map