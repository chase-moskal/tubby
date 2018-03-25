
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
					<div class="video-numeral"><p>{video.numeral}</p></div>
					<div class="video-title"><p>{video.title}</p></div>
					<div class="video-description"><p>{video.description.substring(0, maxDescriptionLength) + "..."}</p></div>
			</a>
		)
	}
}
