
import {Video} from "../interfaces.js"
import {Component, html, prop} from "../toolbox/component.js"

import {getUploads} from "../youtube/get-uploads.js"
import {getPlaylistVideos} from "../youtube/get-playlist-videos.js"

const _videos = Symbol("videos")
const _getMatchingVideos = Symbol("getMatchingVideos")

const err = (message: string) => new Error(`tubby-youtube-explorer: ${message}`)

export class TubbyYoutubeExplorer extends Component {
	@prop(String, false) ["api-key"]: string
	@prop(String, false) ["playlist-id"]: string
	@prop(String, false) ["channel-id"]: string
	@prop(String, false) ["canned"]: string
	@prop(Boolean, true) ["loading"]: boolean = true
	@prop(Array, false) private [_videos]: Video[] = []

	private async load(): Promise<Video[]> {
		const apiKey = this["api-key"]
		const playlistId = this["playlist-id"]
		const channelId = this["channel-id"]
		const canned = this["canned"]

		const cannedVideos = canned
			? await fetch(canned).then(response => response.json())
			: []

		// accumulate videos as they come in
		const onVideosReceived = (videos: Video[]) =>
			this[_videos] = [...this[_videos], ...videos]

		const videos = this[_videos] = playlistId
			? await getPlaylistVideos({
				apiKey,
				playlistId,
				cannedVideos,
				onVideosReceived
			})
			: await getUploads({apiKey, channelId, onVideosReceived})

		this.loading = false

		return videos
	}

	firstUpdated() {
		if (!this["api-key"])
			throw err(`required attribute 'api-key' is missing`)
		if (!this["playlist-id"] && !this["channel-id"])
			throw err(`one of the following attributes is required: 'playlist-id', or 'channel-id'`)
		this.load()
	}

	private [_getMatchingVideos]() {
		// const searchbar = this.shadowRoot.querySelector(".search")
		const searchbar = {
			match(video: Video) { return true }
		}
		return this[_videos].filter(video => searchbar.match(video))
	}

	private mystyle = html`
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			.loadable {
				position: relative;
				background: red;
				min-height: 4em;
			}
			:host([loading]) .loadable::before {
				content: "LOADING";
				display: block;
				position: absolute;
				top: 0%;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(255,255,255, 0.5);
				color: black;
			}
		</style>
	`

	render() {
		return html`
			${this.mystyle}
			<div class="latest loadable">
				${this[_videos].length > 0
					? html`<tubby-video .video="${this[_videos][0]}"></tubby-video>`
					: null}
			</div>
			<div class="search"></div>
			<div class="info"></div>
			<ol class="grid loadable">
				${this[_getMatchingVideos]().map(video => html`
					<tubby-video .video="${video}"></tubby-video>
				`)}
			</ol>
		`
	}
}
