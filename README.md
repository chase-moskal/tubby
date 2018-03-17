
# tubby — youtube channel instant search

- tubby is a ***work-in-progress***
- see the website and live demo: [chasemoskal.com/tubby](https://chasemoskal.com/tubby/)
- there are two ways you can install tubby:
	1. module usage *[recommended]* — `npm install tubby`
	2. bundle usage — download `tubby/dist/tubby.global.bundle.js` and script-tag it in

## tubby module for making youtube api calls

- ***tubby.*** **`youtubeGetRequest(options)`** — make a youtube api call
	- options object:
		- `apiKey` {string} — google api access key with youtube permissions
		- `resource` {string} — rest-style resource that this request is about
		- `data` {object} — any data you want to send in the request to youtube
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (youtube response)
- ***tubby.*** **`getAllVideos(options)`** — get all videos in a playlist
	- options object:
		- `apiKey` {string} — google api access key with youtube permissions
		- `playlistId` {string} — youtube playlist id
		- `paginationLimit` {string} [optional] — how many results to fetch each roundtrip (youtube max 50)
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (array of video objects)
- ***tubby.*** **`getAllVideosFromChannel(options)`** — get all videos given a
	channel id
	- options object:
		- `apiKey` {string} — google api access key with youtube permissions
		- `channelId` {string} — youtube channel id
		- `paginationLimit` {string} [optional] — how many results to fetch each roundtrip (youtube max 50)
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (array of video objects)
- ***tubby.*** **`getChannelUploadsPlaylistId(options)`** — find a channel's 
	'uploads' playlist
	- options object:
		- `apiKey` {string} — google api access key with youtube permissions
		- `channelId` {string} — youtube channel id
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (playlistId)

### module usage

```javascript
import * as tubby from "tubby"

getAllVideos({
	apiKey: "abc123",
	playlistId: "xyz789",
	onVideosReceived: videos => {
		console.log("loaded some videos", videos)
	}
})
.then(allVideos => console.log("all videos loaded", allVideos))
```

### bundle usage

```html
<script src="tubby.global.bundle.js"></script>
<script>
	tubby.getAllVideos({
		apiKey: "abc123",
		playlistId: "xyz789",
		onVideosReceived: videos => {
			console.log("loaded some videos", videos)
		}
	})
	.then(allVideos => console.log("all videos loaded", allVideos))
</script>
```

## tubby's preact/mobx user-interface components

these user interface components allow the user to instant-search through a collection of videos

- **VideoGrid / VideoGridStore** — display videos to the user
- *[coming soon]* — **Searchbar / SearchbarStore** — user can input search terms
- *[coming soon]* — **InstantVideoLookup / InstantVideoLookupStore** — user can insta-search through videos
	- comprised of the VideoGrid and Searchbar components

### module usage

```jsx
import {h, render} from "preact"
import VideoGrid, {VideoGridStore} from "tubby/dist/components/video-grid"

// create a new video grid store
const store = new VideoGridStore()

// get videos and add them to the store
tubby.getAllVideos({
	apiKey: "abc123",
	playlistId: "xyz789",
	onVideosReceived: videos => {
		store.videos = [...store.videos, ...videos]
	}
})

// place a video grid instance in the document
render(<VideoGrid {...{store}}/>, document.querySelector(".video-grid-container"))
```

### bundle usage

- the components, along with preact and mobx too, are contained within the global bundle

- you can use the following render functions to place the components into the document

- a render function will return the newly created store for the component — the component's state is kept in the store — any changes to the store object's properties will automatically rerender the component (this is mobx state management)

```html
<script src="tubby.global.bundle.js"></script>
<script>
	// render the video grid component
	const videoGridStore = tubby.renderers.renderVideoGrid(document.querySelector(".video-grid"))

	// get videos and add them to the store
	tubby.getAllVideos({
		apiKey: "abc123",
		playlistId: "xyz789",
		onVideosReceived: videos => {
			videoGridStore.videos = [...videoGridStore.videos, ...videos]
		}
	})
</script>
```
