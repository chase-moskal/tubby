
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, runInAction, action} from "mobx"

import {Video} from "../tubby"

export class VideoDisplayStore {
	@observable video: Video
	@observable maxDescriptionLength: number

	@action setVideo(video: Video) {
		this.video = video
	}

	@action setMaxDescriptionLength(max: number = 240) {
		this.maxDescriptionLength = max
	}

	constructor({video, maxDescriptionLength}: {video?: Video; maxDescriptionLength?: number} = {}) {
		this.setVideo(video)
		this.setMaxDescriptionLength(maxDescriptionLength)
	}
}

@observer
export default class VideoDisplay<Store extends VideoDisplayStore = VideoDisplayStore> extends Component<{store: Store}, any> {

	protected renderTitle() {
		const {title, numeral} = this.props.store.video
		return (
			<div class="video-title">
				<span class="video-titletext">{title}</span>
				<span class="video-numeral">{numeral}</span>
			</div>
		)
	}

	protected renderDescription() {
		const {video, maxDescriptionLength} = this.props.store
		return (
			<div class="video-description">
				{video.description.substring(0, maxDescriptionLength) + "..."}
			</div>
		)
	}

	protected renderCoverAttributes() {
		const {video} = this.props.store
		return {
			style: {"background-image": `url("${video.thumbs.small}")`},
			"data-latest": video.latest ? "true" : "false"
		}
	}

	protected renderLinkAttributes() {
		const {video} = this.props.store
		return {
			target: "_blank",
			href: video.watchLink
		}
	}

	render() {
		const {video, maxDescriptionLength} = this.props.store
		return video ? (
			<a className="video-display"
				{...this.renderCoverAttributes()}
				{...this.renderLinkAttributes()}>
					{this.renderTitle()}
					{this.renderDescription()}
			</a>
		) : null
	}
}
