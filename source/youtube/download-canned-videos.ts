#!/usr/bin/env node

import * as fetch from "node-fetch"

import {getPlaylistVideos} from "./get-playlist-videos.js"

export interface DownloadCannedVideosOptions {
	apiKey: string
	playlistId: string
}

export async function downloadCannedVideos({
	apiKey,
	playlistId
}: DownloadCannedVideosOptions) {

	const videos = await getPlaylistVideos({
		fetch,
		apiKey,
		playlistId
	})

	return videos
}
