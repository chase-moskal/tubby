var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
import { TubbyError } from "../tubby-error.js";
import { getUploads } from "../youtube/get-uploads.js";
import { Component, html, css, svg, prop } from "../toolbox/component.js";
import { getPlaylistVideos } from "../youtube/get-playlist-videos.js";
const { err } = TubbyError;
const _load = Symbol("_load");
const _videos = Symbol("_videos");
const _status = Symbol("_status");
const _statusToReady = Symbol("_statusToReady");
const _statusToError = Symbol("_statusToError");
const _searchedVideos = Symbol("_searchedVideos");
const _statusToPending = Symbol("_statusToPending");
const _updateSearchedVideos = Symbol("_updateSearchedVideos");
export class TubbyYoutubeExplorer extends Component {
    constructor() {
        super(...arguments);
        this.search = false;
        this["max-description-length"] = 240;
        this["thumb-size"] = "small";
        this[_a] = [];
        this[_b] = [];
        this[_c] = "pending";
    }
    set videos(videos) {
        if (videos && videos.length > 0) {
            this[_videos] = videos;
            this[_updateSearchedVideos]();
            this[_statusToReady]();
        }
        else {
            this[_statusToPending]();
        }
    }
    get videos() {
        return [...this[_videos]];
    }
    firstUpdated() {
        this[_load]();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has(_videos) || changedProperties.has("search")) {
            this[_updateSearchedVideos]();
        }
    }
    static get styles() {
        return css `
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
		}

		.pending, .error {
			padding: 2em 1em;
			position: relative;
			text-align: center;
		}

		.pending > svg, .error > svg {
			display: inline-block;
			width: 32px;
			height: 32px;
			vertical-align: middle;
			margin-right: 0.5em;
		}

		.pending {
			background: var(--tubby-pending-bg, rgba(0,0,0, 0.2));
			color: var(--tubby-pending-color, white);
		}

		.pending > svg {
			animation: rotation 8s infinite linear;
			fill: var(--tubby-pending-color, white);
		}

		.error {
			background: var(--tubby-error-bg, rgba(128,0,0, 0.2));
			color: var(--tubby-error-color, yellow);
		}

		.error > svg {
			fill: var(--tubby-error-color, yellow);
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
			background: var(--tubby-results-blink-color, rgba(255,255,255, 0.5));
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
			background: var(--tubby-grid-bg, rgba(0,0,0, 0.1));
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
			color: var(--tubby-video-color, white);
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
	`;
    }
    render() {
        const { search } = this;
        const status = this[_status];
        const searchedVideos = this[_searchedVideos];
        const handleSearchUpdate = () => this[_updateSearchedVideos]();
        const pending = html `
			<div class="pending">
				${svg `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M10.24 7.4a4.15 4.15 0 0 1-1.2 3.6 4.346 4.346 0 0 1-5.41.54L4.8 10.4.5 9.8l.6 4.2 1.31-1.26c2.36 1.74 5.7 1.57 7.84-.54a5.876 5.876 0 0 0 1.74-4.46l-1.75-.34zM2.96 5a4.346 4.346 0 0 1 5.41-.54L7.2 5.6l4.3.6-.6-4.2-1.31 1.26c-2.36-1.74-5.7-1.57-7.85.54C.5 5.03-.06 6.65.01 8.26l1.75.35A4.17 4.17 0 0 1 2.96 5z"/></svg>`}
				loading videos...
			</div>
		`;
        const error = html `
			<div class="error">
				${svg `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"/></svg>`}
				error loading 
			</div>
		`;
        const ready = html `
			${search ? html `
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
				${searchedVideos.map(video => html `
					<tubby-video
						.video="${video}"
						thumb-size="${this["thumb-size"]}"
						max-description-length="${this["max-description-length"]}">
					</tubby-video>
				`)}
			</div>
		`;
        return html `
			${({ pending, error, ready })[status]}
		`;
    }
    [(_a = _videos, _b = _searchedVideos, _c = _status, _load)]() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = this["api-key"];
            const playlistId = this["playlist-id"];
            const channelId = this["channel-id"];
            const canned = this.canned;
            let videos = [];
            try {
                if (canned) {
                    const response = yield fetch(canned);
                    videos = yield response.json();
                }
                if (apiKey) {
                    if (playlistId)
                        videos = yield getPlaylistVideos({ apiKey, playlistId, cannedVideos: videos });
                    else if (channelId)
                        videos = yield getUploads({ apiKey, channelId, cannedVideos: videos });
                    else
                        throw err(`missing required attribute: "playlist-id", or "channel-id"`);
                }
                this.videos = videos;
            }
            catch (error) {
                const errorToReport = error instanceof TubbyError
                    ? error
                    : err(`unexpected: ${error.message}`, error);
                this[_statusToError](errorToReport);
            }
        });
    }
    [_updateSearchedVideos]() {
        const searchElement = this.shadowRoot.querySelector("tubby-search");
        this[_searchedVideos] = searchElement
            ? this[_videos].filter(video => searchElement.match([
                video.title,
                video.description,
                `#${video.numeral}`,
                video.videoId
            ].join(" ")))
            : this.videos;
        const results = this.shadowRoot.querySelector(".results");
        if (results) {
            results.setAttribute("data-blink", "true");
            setTimeout(() => results.removeAttribute("data-blink"), 0);
        }
    }
    [_statusToPending]() {
        this[_status] = "pending";
    }
    [_statusToReady]() {
        this[_status] = "ready";
        this.dispatchEvent(new CustomEvent("ready", {
            detail: {},
            bubbles: true,
            composed: true
        }));
        if (this.onReady)
            this.onReady();
    }
    [_statusToError](error) {
        this[_status] = "error";
        this.error = error;
        this.dispatchEvent(new CustomEvent("error", {
            detail: { error },
            bubbles: true,
            composed: true
        }));
        if (this.onError)
            this.onError(error);
        else
            console.error(error);
    }
}
__decorate([
    prop(Error)
], TubbyYoutubeExplorer.prototype, "error", void 0);
__decorate([
    prop(String)
], TubbyYoutubeExplorer.prototype, "canned", void 0);
__decorate([
    prop(String)
], TubbyYoutubeExplorer.prototype, "api-key", void 0);
__decorate([
    prop(Function)
], TubbyYoutubeExplorer.prototype, "onReady", void 0);
__decorate([
    prop(String)
], TubbyYoutubeExplorer.prototype, "channel-id", void 0);
__decorate([
    prop(String)
], TubbyYoutubeExplorer.prototype, "playlist-id", void 0);
__decorate([
    prop(Boolean, true)
], TubbyYoutubeExplorer.prototype, "search", void 0);
__decorate([
    prop(Function)
], TubbyYoutubeExplorer.prototype, "onError", void 0);
__decorate([
    prop(Number, true)
], TubbyYoutubeExplorer.prototype, "max-description-length", void 0);
__decorate([
    prop(String, true)
], TubbyYoutubeExplorer.prototype, "thumb-size", void 0);
__decorate([
    prop(Array)
], TubbyYoutubeExplorer.prototype, _a, void 0);
__decorate([
    prop(Array)
], TubbyYoutubeExplorer.prototype, _b, void 0);
__decorate([
    prop(String)
], TubbyYoutubeExplorer.prototype, _c, void 0);
//# sourceMappingURL=tubby-youtube-explorer.js.map