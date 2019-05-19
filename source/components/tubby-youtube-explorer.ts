
import {Video} from "../interfaces.js"
import {TubbyError} from "../tubby-error.js"
import {getUploads} from "../youtube/get-uploads.js"
import {Component, html, prop} from "../toolbox/component.js"
import {getPlaylistVideos} from "../youtube/get-playlist-videos.js"

import {TubbySearch} from "./tubby-search.js"

const {err} = TubbyError

const _load = Symbol("_load")
const _videos = Symbol("_videos")
const _status = Symbol("_status")
const _statusToReady = Symbol("_statusToReady")
const _statusToError = Symbol("_statusToError")
const _searchedVideos = Symbol("_searchedVideos")
const _updateSearchedVideos = Symbol("_updateSearchedVideos")

export class TubbyYoutubeExplorer extends Component {
	@prop(Error) error: Error
	@prop(String) canned: string
	@prop(String) ["api-key"]: string
	@prop(Function) onReady: () => void
	@prop(String) ["channel-id"]: string
	@prop(String) ["playlist-id"]: string
	@prop(Function) onError: (error: Error) => void
	@prop(Number, true) maxDescriptionLength: number = 100

	@prop(Array) private [_videos]: Video[] = []
	@prop(Array) private [_searchedVideos]: Video[] = []
	@prop(String) private [_status]: "pending" | "error" | "ready" = "pending"

	set videos(videos: Video[]) {
		if (videos && videos.length > 0) {
			this[_videos] = videos
			this[_updateSearchedVideos]()
			this[_statusToReady]()
		}
		else {
			this[_statusToError](err(`videos array is empty, must be populated`))
		}
	}

	get videos(): Video[] {
		return this[_videos]
	}

	firstUpdated() {
		this[_load]()
	}

	updated(changedProperties: Map<any, any>) {
		super.updated(changedProperties)
		if (changedProperties.has(_videos)) {
			this[_updateSearchedVideos]()
		}
	}

	render() {
		const videos = this[_videos]
		const status = this[_status]
		const {maxDescriptionLength} = this
		const searchedVideos = this[_searchedVideos]
		const handleSearchUpdate = () => this[_updateSearchedVideos]()

		const styles = html`
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}

				:host {
					position: relative;
					min-height: 4em;
				}
			</style>
		`

		const pending = html`
			<div class="pending">..pending..</div>
		`

		const error = html`
			<div class="error">error has occurred</div>
		`

		const ready = html`
			<div class="latest">
				${videos.length > 0
					? html`
						<tubby-video
							.video="${videos[0]}"
							maxDescriptionLength="${maxDescriptionLength}">
						</tubby-video>`
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

			<div class="grid">
				${searchedVideos.map(video => html`
					<tubby-video
						.video="${video}"
						maxDescriptionLength="${maxDescriptionLength}">
					</tubby-video>
				`)}
			</div>
		`

		return html`
			${styles}
			${({pending, error, ready})[status]}
		`
	}

	private async [_load]() {
		const apiKey = this["api-key"]
		const playlistId = this["playlist-id"]
		const channelId = this["channel-id"]
		const canned = this.canned

		let videos: Video[] = []

		try {
			if (canned) {
				const response = await fetch(canned)
				videos = await response.json()
			}
			if (apiKey) {
				if (playlistId)
					videos = await getPlaylistVideos({apiKey, playlistId, cannedVideos: videos})
				else if (channelId)
					videos = await getUploads({apiKey, channelId, cannedVideos: videos})
				else
					throw err(`missing required attribute: "playlist-id", or "channel-id"`)
			}
			else if (!canned)
				throw err(`missing required attribute: "api-key", or "canned"`)
			this.videos = videos
		}
		catch (error) {
			const errorToReport = error instanceof TubbyError
				? error
				: err(`unknown error`, error)
			this[_statusToError](errorToReport)
		}
	}

	private [_updateSearchedVideos]() {
		const search: TubbySearch = this.shadowRoot.querySelector("tubby-search")
		if (!search) return
		this[_searchedVideos] = this[_videos].filter(
			video => search.match([
				video.title,
				video.description,
				`#${video.numeral}`,
				video.videoId
			].join(" "))
		)
	}

	private [_statusToReady]() {
		this[_status] = "ready"
		this.dispatchEvent(new CustomEvent("ready", {
			detail: {},
			bubbles: true,
			composed: true
		}))
		if (this.onReady) this.onReady()
	}

	private [_statusToError](error: TubbyError) {
		this[_status] = "error"
		this.error = error
		this.dispatchEvent(new CustomEvent("error", {
			detail: {error},
			bubbles: true,
			composed: true
		}))
		if (this.onError) this.onError(error)
		else console.error(error)
	}
}
