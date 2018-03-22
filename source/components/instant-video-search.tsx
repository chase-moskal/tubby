
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, computed, autorun, action} from "mobx"

import {Video} from "../tubby"

import SearchBar, {SearchBarStore} from "./search-bar"
import VideoGrid, {VideoGridStore} from "./video-grid"

export class InstantVideoSearchStore {
	@observable videos: Video[] = []
	@observable searchBarStore: SearchBarStore = new SearchBarStore()
	@observable videoGridStore: VideoGridStore = new VideoGridStore()

	// correlate searchbar store results with videos
	@computed get videoResults(): Video[] {
		const videos = [...this.videos]
		const searchResults = [...this.searchBarStore.searchResults]
		return videos.filter((video, index) =>
			!!searchResults.find(result => result.index === index))
	}

	@action setVideos(videos: Video[]): void {
		this.videos = [...videos]
	}

	constructor() {

		// convert videos into searchables
		autorun(() => {
			const videos = [...this.videos]
			this.searchBarStore.setSearchables(videos.map((video, index) => ({
				index,
				content: [
					video.title,
					video.description
				].join(", ")
			})))
		})

		// display results in video grid
		autorun(() => {
			const videos = [...this.videoResults]
			this.videoGridStore.setVideos(videos)
		})
	}
}

@observer
export default class InstantVideoSearch extends Component<{store: InstantVideoSearchStore}, any> {

	render() {
		const {store} = this.props
		return (
			<div className="instant-video-search">
				<SearchBar store={store.searchBarStore}/>
				<div class="search-info">
					<p class="results">{store.videoResults.length} result{
						store.videoResults.length === 1
							? ""
							: "s"
					}</p>
				</div>
				<VideoGrid store={store.videoGridStore}/>
			</div>
		)
	}
}
