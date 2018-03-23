
import {observable, action} from "mobx"
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {Video} from "../tubby"
import DefaultVideoDisplay from "./video-display"

export class VideoGridStore {
	@observable videos: Video[] = []

	@action setVideos(videos: Video[]): void {
		this.videos = [...videos]
	}
}

export interface VideoGridProps {
	store: VideoGridStore
	VideoDisplay?: typeof DefaultVideoDisplay
}

@observer
export default class VideoGrid extends Component<VideoGridProps, any> {
	render() {
		const {store, VideoDisplay = DefaultVideoDisplay} = this.props
		return (
			<ol {...{reversed: "reversed"}} className="video-grid">
				{store.videos.map(video => <VideoDisplay {...{video}}/>)}
			</ol>
		)
	}
}
