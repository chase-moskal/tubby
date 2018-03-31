
# tubby — youtube channel instant search

a collection of frontend javascript code, ui components, and stylesheets to provide a user interface for searching through youtube videos

- see the website and live demo: [chasemoskal.com/tubby](https://chasemoskal.com/tubby/)
- there are two ways you can install tubby:
	1. module usage *[recommended]* — `npm install tubby`
	2. bundle usage — download [tubby.global.bundle.js](https://raw.githubusercontent.com/chase-moskal/tubby/gh-pages/dist/tubby.global.bundle.js) and script-tag it in
- you may also want to grab a copy of the [css](https://raw.githubusercontent.com/chase-moskal/tubby/gh-pages/dist/tubby.css) (or [scss](https://raw.githubusercontent.com/chase-moskal/tubby/master/source/tubby.scss) if you're fancy)

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
		- `cannedVideos` {array of video objects} [optional] — canned videos to save youtube api requests
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

> #### tubby video object format
>
> ```typescript
> export interface Video {
> 	videoId: string
> 	title: string
> 	description: string
> 	thumbs: {
> 		small: string
> 		medium: string
> 		large: string
> 		huge?: string
> 		full?: string
> 		biggest: string
> 	}
> }
> ```

### module usage

```javascript
import * as tubby from "tubby"

getAllVideos({
	apiKey: "abc123",
	playlistId: "xyz890",
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
		playlistId: "xyz890",
		onVideosReceived: videos => {
			console.log("loaded some videos", videos)
		}
	})
	.then(allVideos => console.log("all videos loaded", allVideos))
</script>
```

## tubby's preact/mobx user-interface components

these user interface components allow the user to instant-search through a collection of videos

- **InstantVideoLookup** */ InstantVideoLookupStore* — user can insta-search through videos
	- **VideoGrid** */ VideoGridStore* — display videos to the user
	- **SearchBar** */ SearchBarStore* — user can input search terms

regarding css styles,
- if you're using scss, use the mixins in `tubby.scss`
- if you're using regular old css, link in `tubby.css` and add the class `tubby` to your `<html>` element

### module usage

```jsx
import {h, render} from "preact"
import InstantVideoSearch, {InstantVideoSearchStore} from 
	"tubby/dist/components/instant-video-search"

// create the instant video search store
const store = new InstantVideoSearchStore()

// render instant video search component
render(<InstantVideoSearch {...{store}}/>, document.querySelector(".tubby-demo"))

// get videos and add them to the store
tubby.getAllVideos({
	apiKey: "abc123",
	playlistId: "xyz890",
	onVideosReceived: videos => {
		store.videos = [...store.videos, ...videos]
	}
})
```

### bundle usage

- included in the bundle
	- tubby
		- components
	- preact
	- mobx
	- mobxPreact

```html
<script src="tubby.global.bundle.js"></script>
<script>

	// create the instant video search store
	const store = new tubby.components.InstantVideoSearchStore()

	// render the instant video search component
	preact.render(
		preact.h(tubby.components.InstantVideoSearch, {store}),
		document.querySelector(".tubby-demo")
	)

	// get videos and add them to the store
	tubby.getAllVideos({
		apiKey: "abc123",
		playlistId: "xyz890",
		onVideosReceived: videos => {
			store.videos = [...store.videos, ...videos]
			console.log(`tubby returned ${store.videos.length} videos`)
		}
	})
	.then(videos => {
		console.log(`tubby finished all ${videos.length} videos`)
	})
</script>
```

### canning videos to save api requests

***tubby.*** **`getAllVideos(options)`** — now accepts `cannedVideos` array

- tubby now has a serverside node module, `download-canned-videos.js`, which you can use to download videos into a canned json file
- the client can grab that json file, and stops making youtube api requests after duplicate (canned) videos are encountered
- canned videos can be passed right into getAllVideos as a parameter, it's optional
- this optimizes api usage by reducing redundant calls -- now only one call is guaranteed, which checks for new videos
