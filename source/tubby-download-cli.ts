
import * as commander from "commander"
import {downloadCannedVideos} from "./youtube/download-canned-videos.js"

commander
	.option("-a, --api-key", "google api key")
	.option("-p, --playlist-id", "youtube playlist id")
	.parse(process.argv)

async function main() {
	const {apiKey, playlistId} = commander
	if (!apiKey) throw new Error("--api-key required")
	if (!playlistId) throw new Error("--playlist-id required")

	const videos = await downloadCannedVideos({apiKey, playlistId})
	process.stdout.write(JSON.stringify(videos))
}

main()
