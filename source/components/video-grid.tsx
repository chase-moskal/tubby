
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, action} from "mobx"

import {Video} from "../tubby"
import DefaultVideoDisplay, {VideoDisplayStore} from "./video-display"

export class VideoGridStore {
	@observable videoDisplayStores: VideoDisplayStore[] = []
	@observable VideoDisplay: typeof DefaultVideoDisplay = DefaultVideoDisplay

	@action setVideos(videos: Video[]) {
		this.videoDisplayStores = videos.map(video => new VideoDisplayStore({video}))
	}

	@action setVideoDisplayStores(stores: VideoDisplayStore[]) {
		this.videoDisplayStores = stores
	}

	@action setVideoDisplayComponent(VideoDisplay: typeof DefaultVideoDisplay) {
		this.VideoDisplay = VideoDisplay
	}
}

@observer
export default class VideoGrid extends Component<{store: VideoGridStore}, any> {
	render() {
		const {videoDisplayStores, VideoDisplay} = this.props.store
		return (
			<ol {...{reversed: "reversed"}} className="video-grid">
				{videoDisplayStores.map(store => (
					<li>
						<VideoDisplay {...{store}}/>
					</li>
				))}
			</ol>
		)
	}
}
