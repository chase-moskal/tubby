
import "./register-all.js"
import {Video} from "./interfaces.js"
import {VideoDisplay} from "./components/video-display.js"

const videoDisplay: VideoDisplay = document.querySelector("video-display")

const video: Video = {
	videoId: "1234",
	watchLink: "watchlink",
	title: "Title",
	description: "descr",
	latest: true,
	numeral: 5,
	thumbs: {
		large: "large",
		small: "small",
		medium: "medium",
		biggest: "biggest"
	}
}

videoDisplay.video = video
