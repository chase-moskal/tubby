
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, computed, autorun, action} from "mobx"

import {Video} from "../tubby"

import SearchBar, {SearchBarStore, Searchable} from "./search-bar"
import VideoGrid, {VideoGridStore} from "./video-grid"

export class InstantVideoSearchStore {
	@observable videos: Video[] = []
	@observable blink: boolean = false
	@observable searchBarStore: SearchBarStore = new SearchBarStore()
	@observable videoGridStore: VideoGridStore = new VideoGridStore()
	@observable blinkDuration: number = 400

	/**
	 * Correlates the searchbar store results with videos
	 */
	@computed get videoResults(): Video[] {
		const videos = [...this.videos]
		const searchResults = [...this.searchBarStore.searchResults]
		return videos.filter((video, index) =>
			!!searchResults.find(result => result.index === index))
	}

	/**
	 * Set all videos
	 */
	@action setVideos(videos: Video[]): void {
		this.videos = [...videos]
	}

	/**
	 * Add videos such that newest videos appear first in the array
	 */
	@action addVideosInOrder(videos: Video[]): void {
		for (let i = videos.length - 1; i >= 0; i -= 1) {
			this.videos.unshift(videos[i])
		}
	}

	/**
	 * Set the animated blinker's visibility
	 */
	@action private setBlink(blink: boolean) {
		this.blink = blink
	}

	protected procureSearchables(videos: Video[]): Searchable[] {
		return videos.map((video, index) => ({
			index,
			content: [
				video.title,
				video.description,
				`#${video.numeral}`,
				video.videoId
			].join(", ")
		}))
	}

	// to debounce blinking
	private blinking: boolean = false

	/**
	 * Instant video search store constructor
	 */
	constructor() {

		// convert videos into searchables
		autorun(() => {
			const videos = [...this.videos]
			this.searchBarStore.setSearchables(this.procureSearchables(videos))
		})

		// display results in video grid
		autorun(() => {
			const videos = [...this.videoResults]
			this.videoGridStore.setVideos(videos)
		})

		// blinking attribute for each search
		autorun(() => {
			const videos = [...this.videoResults]
			if (videos && !this.blinking) {
				this.blinking = true
				this.setBlink(true)
				setTimeout(() => {
					this.setBlink(false)
					this.blinking = false
				}, this.blinkDuration)
			}
		})
	}
}

@observer
export default class InstantVideoSearch extends Component<{store: InstantVideoSearchStore}, any> {

	render() {
		const {store} = this.props
		return (
			<div className="instant-video-search" data-blink={store.blink ? "true" : "false"}>
				<SearchBar store={store.searchBarStore}/>
				<div class="search-info">
					<p class="results" style={{transitionDuration: `${store.blinkDuration}ms`}}>
						{store.videoResults.length} result{
							store.videoResults.length === 1
								? ""
								: "s"
						}
					</p>
				</div>
				<VideoGrid store={store.videoGridStore}/>
			</div>
		)
	}
}
