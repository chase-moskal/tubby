#!/usr/bin/env node

const http = require("http")
const tubby = require("./dist/tubby")
const fetch = require("node-fetch")
const {writeFile} = require("fs")

module.exports = function downloadCannedVideos({
	target,
	apiKey,
	playlistId,
	apiEndpoint = "https://www.googleapis.com/youtube/v3/",
}) {
	const clock = Date.now()
	const url = apiEndpoint + tubby.encodeQueryString({
		key: apiKey
	})

	return tubby.getAllVideos({
		fetch,
		apiKey,
		playlistId
	})
	.then(function(videos) {
		writeFile(
			target,
			JSON.stringify(videos),
			err => err && console.error(err)
		)
		return videos
	})
}
