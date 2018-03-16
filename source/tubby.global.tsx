
import * as tubby from "./tubby"
import VideoGrid, {VideoGridStore} from "./components/video-grid"

import {h, render} from "preact"

window["tubby"] = tubby
window["tubby"]["components"] = {VideoGrid, VideoGridStore}

window["tubby"]["renderers"] = {
	renderVideoGrid(parent: HTMLElement): VideoGridStore {
		const store = new VideoGridStore()
		render(<VideoGrid {...{store}}/>, parent)
		return store
	}
}
