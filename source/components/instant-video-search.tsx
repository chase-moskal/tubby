
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, computed, autorun} from "mobx"

import SearchBar, {SearchBarStore} from "./search-bar"
import VideoGrid, {VideoGridStore} from "./video-grid"

import {Video} from "../tubby"

export class InstantVideoSearchStore {
	@observable videos: Video[] = []
	@observable searchBarStore: SearchBarStore
	@observable videoGridStore: VideoGridStore

	// correlate searchbar store results with videos
	@computed get videoResults(): Video[] {
		const videos = [...this.videos]
		const searchResults = [...this.searchBarStore.searchResults]
		return videos.filter((video, index) =>
			!!searchResults.find(result => result.index === index))
	}

	constructor({
		searchBarStore = new SearchBarStore(),
		videoGridStore = new VideoGridStore()
	}: {
		searchBarStore?: SearchBarStore
		videoGridStore?: VideoGridStore
	} = {}) {
		this.searchBarStore = searchBarStore
		this.videoGridStore = videoGridStore

		// convert videos into searchables
		autorun(() => {
			const videos = [...this.videos]
			this.searchBarStore.searchables = videos.map((video, index) => ({
				index,
				content: [
					video.title,
					video.description
				].join(", ")
			}))
		})

		// display results in video grid
		autorun(() => {
			const videoResults = [...this.videoResults]
			this.videoGridStore.videos = videoResults
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
