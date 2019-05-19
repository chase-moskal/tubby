var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, html, css, prop } from "../toolbox/component.js";
export class TubbyVideo extends Component {
    constructor() {
        super(...arguments);
        this["max-description-length"] = 240;
        this["thumb-size"] = "small";
    }
    static get styles() {
        return css `
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		:host {
			display: block;
			position: relative;
		}

		.link {
			z-index: 1;
			position: relative;
			display: block;
			height: 100%;
			padding: 0.5em 1em;
			padding-bottom: 2em;
			overflow: hidden;
			text-decoration: none;
			cursor: pointer;
			outline: 3px solid transparent;
			background-size: cover;
			background-position: center center;
			color: inherit;
		}

		.link:hover, .link:focus {
			outline: var(--focus-outline, 2px solid #0ef);
		}

		.link::before {
			content: "";
			display: block;
			z-index: -1;
			position: absolute;
			top: 0; left: 0;
			width: 100%; height: 100%;
			background: rgba(25,25,25, 0.8);
			background: var(--tubby-video-bg, linear-gradient(to bottom right,
				rgba(25,25,25, 0.95) 32%,
				rgba(25,25,25, 0.6)
			));
		}

		.link > div {
			line-height: 1.1em;
		}

		.title {
			margin: 0.5em 0;
		}

		.title .text {
			font-weight: bold;
		}

		.title .numeral {
			opacity: 0.8;
			display: block;
			font-size: 0.8em;
			padding-left: 0.4em;
		}

		.title .numeral::before {
			content: "#";
		}

		.description {
			font-size: 0.8em;
		}
	`;
    }
    render() {
        const coverThumb = this.video.thumbs[this["thumb-size"]];
        const link = html `
			<a class="link"
				target="_blank"
				href="${this.video.watchLink}"
				style="background-image: url('${coverThumb}')">
					<div class="title">
						<span class="text">${this.video.title}</span>
						<!-- TODO: numeral is disabled because it was found inaccurate -->
						<!-- <span class="numeral">${this.video.numeral}</span> -->
					</div>
					<div class="description">
						${this.video.description.substring(0, this["max-description-length"]) + "..."}
					</div>
			</a>
		`;
        const blank = html `<p>--</p>`;
        return html `
			${this.video ? link : blank}`;
    }
}
__decorate([
    prop(Object)
], TubbyVideo.prototype, "video", void 0);
__decorate([
    prop(Number, true)
], TubbyVideo.prototype, "max-description-length", void 0);
__decorate([
    prop(String, true)
], TubbyVideo.prototype, "thumb-size", void 0);
//# sourceMappingURL=tubby-video.js.map