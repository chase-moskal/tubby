
import {Video} from "../interfaces.js"
import {Component, html, prop} from "../toolbox/component.js"

export class VideoDisplay extends Component {
	@prop(Object, false) video: Video
	@prop(Number) maxDescriptionLength: number = 100

	private mystyle = html`
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			.link {
				z-index: 1;
				position: relative;
				display: block;
				padding: 0.5em 1em;
				padding-bottom: 2em;
				min-height: 200px;
				overflow: hidden;
				text-decoration: none;
				cursor: pointer;
				outline: 3px solid transparent;
				background-size: cover;
				background-position: center center;
				color: white;
			}
			.link:hover, .link:focus {
				outline-color: red;
			}
			.link::before {
				content: "";
				display: block;
				z-index: -1;
				position: absolute;
				top: 0; left: 0;
				width: 100%; height: 100%;
				background: rgba(25,25,25, 0.7);
				background: linear-gradient(to bottom right,
					rgba(25,25,25, 0.95) 32%,
					rgba(25,25,25, 0.1)
				);
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
				display: block;
			}
		</style>
	`

	private renderLinkHtml() {
		const {video, maxDescriptionLength} = this
		const coverThumb = video.thumbs.medium
		return html`
			<a class="link"
				target="_blank"
				href="${video.watchLink}"
				style="background-image: url('${coverThumb}')">
					<div class="title">
						<span class="text">${video.title}</span>
						<span class="numeral">${video.numeral}</span>
						
					</div>
					<div class="description">
						${video.description.substring(0, maxDescriptionLength) + "..."}
					</div>
			</a>
		`
	}

	private renderBlankSlate() {
		return html`<p>--</p>`
	}

	render() {
		const {video} = this
		return html`
			${this.mystyle}
			${!!video ? this.renderLinkHtml() : this.renderBlankSlate()}`
	}
}
