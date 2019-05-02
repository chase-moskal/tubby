
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, action} from "mobx"

import {Video} from "../tubby"
import VideoDisplay, {VideoDisplayStore} from "./video-display"

export class VideoGridStore {
	@observable videoDisplayStores: VideoDisplayStore[] = []
	@observable VideoDisplayComponent: typeof VideoDisplay = VideoDisplay

	@action setVideos(videos: Video[]) {
		this.videoDisplayStores = videos.map(video => new VideoDisplayStore({video}))
	}

	@action setVideoDisplayStores(stores: VideoDisplayStore[]) {
		this.videoDisplayStores = stores
	}

	@action setVideoDisplayComponent(VideoDisplayComponent: typeof VideoDisplay) {
		this.VideoDisplayComponent = VideoDisplayComponent
	}
}

@observer
export default class VideoGrid extends Component<{store: VideoGridStore}, any> {
	render() {
		const {videoDisplayStores, VideoDisplayComponent} = this.props.store
		return (
			<ol {...{reversed: "reversed"}} className="video-grid">
				{videoDisplayStores.map(store => (
					<li>
						<VideoDisplayComponent {...{store}}/>
					</li>
				))}
			</ol>
		)
	}
}
