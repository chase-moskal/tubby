
import {Video} from "../interfaces.js"
import {Component, html, prop} from "../toolbox/component.js"

import {TubbySearch} from "./tubby-search.js"
import {getUploads} from "../youtube/get-uploads.js"
import {getPlaylistVideos} from "../youtube/get-playlist-videos.js"

const _load = Symbol("_load")
const _dispatchLoad = Symbol("_dispatchLoad")
const _dispatchError = Symbol("_dispatchError")
const _searchedVideos = Symbol("_searchedVideos")
const _updateSearchedVideos = Symbol("_getVideosThatMatchSearch")

class TubbyYoutubeExplorerError extends Error {
	originalError: Error
}
const errtag = "tubby-youtube-explorer"
const err = (message: string) => new TubbyYoutubeExplorerError(message)

export class TubbyYoutubeExplorer extends Component {
	@prop(String) canned: string
	@prop(Array) videos: Video[] = []
	@prop(String) ["api-key"]: string
	@prop(Function) onLoad: () => void
	@prop(String) ["channel-id"]: string
	@prop(String) ["playlist-id"]: string
	@prop(Boolean, true) loading: boolean = true
	@prop(Function) onError: (error: Error) => void
	@prop(Array) private [_searchedVideos]: Video[] = []

	private [_dispatchLoad]() {
		this.dispatchEvent(new CustomEvent("explorerLoad", {
			detail: {},
			bubbles: true,
			composed: true
		}))
		if (this.onLoad) this.onLoad()
	}

	private [_dispatchError](error: TubbyYoutubeExplorerError) {
		this.dispatchEvent(new CustomEvent("explorerError", {
			detail: {error},
			bubbles: true,
			composed: true
		}))
		if (this.onError) this.onError(error)
		else console.error(error)
	}

	private [_updateSearchedVideos]() {
		const search: TubbySearch = this.shadowRoot.querySelector("tubby-search")
		this[_searchedVideos] = this.videos.filter(
			video => search.match([
				video.title,
				video.description,
				`#${video.numeral}`,
				video.videoId
			].join(" "))
		)
	}

	private async [_load]() {
		const apiKey = this["api-key"]
		const playlistId = this["playlist-id"]
		const channelId = this["channel-id"]
		const canned = this.canned

		let cannedVideos = []

		try {
			cannedVideos = canned
				? await fetch(canned).then(response => response.json())
				: []
			this.videos = [...cannedVideos]
		}
		catch (error) {
			const tubbyError = err(`error fetching canned videos from "${canned}"`)
			tubbyError.originalError = error
			this[_dispatchError](tubbyError)
		}

		if (playlistId || channelId) {
			if (!this["api-key"]) throw err(`required attribute 'api-key' is missing`)

			try {
				this.videos = playlistId
					? await getPlaylistVideos({apiKey, playlistId, cannedVideos})
					: await getUploads({apiKey, channelId, cannedVideos})
			}
			catch (error) {
				const tubbyError = err(`unable to fetch from ${playlistId ? `playlist-id "${playlistId}"` : `channel-id "${channelId}"`}`)
				tubbyError.originalError = error
				this[_dispatchError](tubbyError)
			}
		}

		this.loading = false
		this[_updateSearchedVideos]()
		this[_dispatchLoad]()
	}

	getSearchedVideos() {
		return [...this[_searchedVideos]]
	}

	firstUpdated() {
		this[_load]().catch(error => this[_dispatchError](error))
	}

	updated(changedProperties: Map<any, any>) {
		super.updated(changedProperties)
		if (changedProperties.has("videos")) {
			this[_updateSearchedVideos]()
		}
	}

	render() {
		const videos = this.videos
		const searchedVideos = this[_searchedVideos]
		const handleSearchUpdate = this[_updateSearchedVideos]

		return html`
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}

				.loadable {
					position: relative;
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

			<div class="latest loadable">
				${videos.length > 0
					? html`<tubby-video .video="${videos[0]}"></tubby-video>`
					: null}
			</div>

			<div class="search">
				<tubby-search @searchUpdate=${handleSearchUpdate}></tubby-search>
			</div>

			<div class="info">
				<p class="number-of-results">
					${searchedVideos.length} result${searchedVideos.length === 1 ? "" : "s"}
				</p>
			</div>

			<div class="grid loadable">
				${searchedVideos.map(video => html`
					<tubby-video .video="${video}"></tubby-video>
				`)}
			</div>
		`
	}
}
