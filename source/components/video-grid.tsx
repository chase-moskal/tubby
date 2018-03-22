
import {Video} from "../tubby"

import {observable, action} from "mobx"
import {h, Component} from "preact"
import {observer} from "mobx-preact"

export class VideoGridStore {
	@observable videos: Video[] = []

	@action setVideos(videos: Video[]): void {
		this.videos = [...videos]
	}
}

@observer
export default class VideoGrid extends Component<{store: VideoGridStore}, any> {
	render() {
		const {store} = this.props
		return (
			<ol {...{reversed: "reversed"}} className="video-grid">
				{store.videos.map(video =>
					<li style={`background-image: url("${video.thumbs.small}")`}>
						<a target="_blank" href={`https://youtube.com/watch?v=${video.videoId}`}>
							<p><strong>{video.title}</strong></p>
							<p><small>{video.description.substring(0, 280) + "..."}</small></p>
						</a>
					</li>
				)}
			</ol>
		)
	}
}
