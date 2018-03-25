
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {Video} from "../tubby"

@observer
export default class VideoDisplay extends Component<{video: Video; maxDescriptionLength?: number}, any> {
	render() {
		const {video, maxDescriptionLength = 280} = this.props
		return (
			<a
				target="_blank"
				href={video.watchLink}
				className="video-display"
				data-latest={video.latest ? "true" : "false"}
				style={`background-image: url("${video.thumbs.small}")`}>
					<div class="video-title">
						<span class="video-titletext">{video.title}</span>
						<span class="video-numeral">{video.numeral}</span>
					</div>
					<div class="video-description">{video.description.substring(0, maxDescriptionLength) + "..."}</div>
			</a>
		)
	}
}
