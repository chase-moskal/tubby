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
/**
 * Get the id of the 'uploads' playlist (which contains all of a channel's videos)
 */
export function getChannelUploadsPlaylistId(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { channelId } = opts, options = __rest(opts, ["channelId"]);
        const response = yield youtubeRequest(Object.assign(Object.assign({}, options), { resource: "channels", data: { id: channelId, part: "contentDetails" } }));
        return response.items[0].contentDetails.relatedPlaylists.uploads;
    });
}
//# sourceMappingURL=get-channel-uploads-playlist-id.js.map