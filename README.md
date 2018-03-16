
# tubby — youtube api helper

- see the website and live demo: [chasemoskal.com/tubby](https://chasemoskal.com/tubby/)
- install tubby: `npm install tubby`
- import tubby functions: `import {getAllVideos} from "tubby"`

## tubby module scrappy documentation

- **`tubby.request(options)`** — make a youtube api call
	- options:
		- `apiKey` {string} — google api access key with youtube permissions
		- `resource` {string} — rest-style resource that this request is about
		- `data` {object} — any data you want to send in the request to youtube
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (youtube response)
- **`tubby.getAllVideos(options)`** — get all videos in a playlist
	- options:
		- `apiKey` {string} — google api access key with youtube permissions
		- `playlistId` {string} — youtube playlist id
		- `paginationLimit` {string} [optional] — how many results to fetch each roundtrip (youtube max 50)
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (array of videos)
- **`tubby.getAllVideosFromChannel(options)`** — get all videos given a channel id
	- options:
		- `apiKey` {string} — google api access key with youtube permissions
		- `channelId` {string} — youtube channel id
		- `paginationLimit` {string} [optional] — how many results to fetch each roundtrip (youtube max 50)
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (array of videos)
- **`tubby.getChannelUploadsPlaylistId(options)`** — find a channel's 'uploads' playlist
	- options:
		- `apiKey` {string} — google api access key with youtube permissions
		- `channelId` {string} — youtube channel id
		- `apiEndpoint` {string} [optional] — youtube api access point url
		- `fetchParams` {RequestInit} [optional] — params passed to `fetch`
	- returns: promise (playlistId)
