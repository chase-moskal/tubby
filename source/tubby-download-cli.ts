#!/usr/bin/env node

import * as fetch from "node-fetch"
import * as commander from "commander"
import {dieOnError} from "die-on-error"

import {getPlaylistVideos} from "./youtube/get-playlist-videos.js"

commander
	.option("-a, --api-key <api-key-string>", "google api key")
	.option("-p, --playlist-id <playlist-id-string>", "youtube playlist id")
	.parse(process.argv)

async function main() {
	const {apiKey, playlistId} = commander
	if (!apiKey) throw new Error("--api-key required")
	if (!playlistId) throw new Error("--playlist-id required")
	const videos = await getPlaylistVideos({fetch, apiKey, playlistId})
	process.stdout.write(JSON.stringify(videos, null, "\t"))
}

dieOnError()
main()
