
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
	@prop(Boolean, true) search: boolean = false
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
		return [...this[_videos]]
	}

	firstUpdated() {
		this[_load]()
	}

	updated(changedProperties: Map<any, any>) {
		super.updated(changedProperties)
		if (changedProperties.has(_videos) || changedProperties.has("search")) {
			this[_updateSearchedVideos]()
		}
	}

	render() {
		const videos = this[_videos]
		const status = this[_status]
		const {search, maxDescriptionLength} = this
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
					display: block;
					margin: 1em auto;
					min-height: 800px;
					padding-bottom: 400px;
				}

				.info {
					margin-top: 0.2em;
					opacity: 0.6;
					text-align: right;
				}

				.info > * {
					display: inline-block;
				}

				.results {
					padding: 0.05em 0.2em;
					border-radius: 3px;
					background: rgba(255,255,255, 0);
					transition: background 400ms linear;
				}

				.results[data-blink="true"] {
					background: rgba(255,255,255, 0.5);
					transition: none;
				}

				.grid {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-evenly;
					width: 100%;
					margin: 1em auto;
					padding: 0.5em;
					list-style: none;
					background: rgba(0,0,0, 0.1);
				}

				.grid * + p {
					margin-top: 0.5em;
				}

				.grid > li {
					position: relative;
					flex: 1 1 0;
					min-width: 350px;
					max-width: 640px;
					min-height: 160px;
					margin: 0.5em;
				}

				@media (max-width: 400px) {
					.grid, .grid > li {
						display: block;
						width: 100%;
						min-width: unset;
						max-width: unset;
						list-style: none;
						margin-left: 0;
						margin-right: 0;
						padding-left: 0;
						padding-right: 0;
					}
					.grid > li {
						margin-bottom: 0.5em;
					}
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

			${search ? html`
				<div class="search">
					<tubby-search @searchUpdate=${handleSearchUpdate}></tubby-search>
				</div>

				<div class="info">
					<p class="results">
						${searchedVideos.length} result${searchedVideos.length === 1 ? "" : "s"}
					</p>
				</div>
			` : null}

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
		const searchElement: TubbySearch = this.shadowRoot.querySelector("tubby-search")
		this[_searchedVideos] = searchElement
			? this[_videos].filter(
				video => searchElement.match([
					video.title,
					video.description,
					`#${video.numeral}`,
					video.videoId
				].join(" "))
			)
			: this.videos
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
