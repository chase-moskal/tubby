#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fetch from "node-fetch";
import * as commander from "commander";
import { dieOnError } from "die-on-error";
import { getPlaylistVideos } from "./youtube/get-playlist-videos.js";
commander
    .option("-a, --api-key <api-key-string>", "google api key")
    .option("-p, --playlist-id <playlist-id-string>", "youtube playlist id")
    .parse(process.argv);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, playlistId } = commander;
        if (!apiKey)
            throw new Error("--api-key required");
        if (!playlistId)
            throw new Error("--playlist-id required");
        const videos = yield getPlaylistVideos({ fetch, apiKey, playlistId });
        process.stdout.write(JSON.stringify(videos, null, "\t"));
    });
}
dieOnError();
main();
//# sourceMappingURL=tubby-download-cli.js.map