
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
const _statusToPending = Symbol("_statusToPending")
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
	@prop(Number, true) maxDescriptionLength: number = 200

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
			this[_statusToPending]()
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

				@keyframes rotation {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(899deg);
					}
				}

				:host {
					display: block;
					margin: 1em auto;
					min-height: 800px;
					padding-bottom: 400px;
				}

				.pending, .error {
					padding: 2em 1em;
					position: relative;
					text-align: center;
					background: rgba(0,0,0, 0.2);
				}

				.error {
					background: rgba(128,0,0, 0.2);
				}

				.pending::before, .error::before {
					content: "";
					display: inline-block;
					background-size: cover;
					background-position: center center;
					width: 32px;
					height: 32px;
					vertical-align: middle;
					margin-right: 0.5em;
				}

				.pending::before {
					background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill="white" fill-rule="evenodd" d="M10.24 7.4a4.15 4.15 0 0 1-1.2 3.6 4.346 4.346 0 0 1-5.41.54L4.8 10.4.5 9.8l.6 4.2 1.31-1.26c2.36 1.74 5.7 1.57 7.84-.54a5.876 5.876 0 0 0 1.74-4.46l-1.75-.34zM2.96 5a4.346 4.346 0 0 1 5.41-.54L7.2 5.6l4.3.6-.6-4.2-1.31 1.26c-2.36-1.74-5.7-1.57-7.85.54C.5 5.03-.06 6.65.01 8.26l1.75.35A4.17 4.17 0 0 1 2.96 5z"/></svg>');
					animation: rotation 8s infinite linear;
				}

				.error::before {
					background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="white" fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"/></svg>');
					background-size: cover;
					background-position: center center;
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

				tubby-video {
					position: relative;
					flex: 1 1 0;
					min-width: 350px;
					max-width: 640px;
					margin: 0.5em;
				}

				@media (max-width: 400px) {
					.grid, tubby-video {
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

					tubby-video {
						margin-bottom: 0.5em;
					}
				}
			</style>
		`

		const pending = html`
			<div class="pending">loading videos...</div>
		`

		const error = html`
			<div class="error">error loading videos</div>
		`

		const ready = html`
			${search ? html`
				<div class="search">
					<tubby-search placeholder="search videos" @searchUpdate=${handleSearchUpdate}></tubby-search>
				</div>

				<div class="info">
					<p class="results">
						${searchedVideos.length} video${searchedVideos.length === 1 ? "" : "s"}
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
			this.videos = videos
		}
		catch (error) {
			const errorToReport = error instanceof TubbyError
				? error
				: err(`unexpected: ${error.message}`, error)
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

	private [_statusToPending]() {
		this[_status] = "pending"
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
