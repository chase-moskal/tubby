
/**
 * Options common to all youtube api requests
 */
export interface CommonRequestOptions {
	apiKey: string
	apiEndpoint?: string
	fetchParams?: RequestInit
	fetch?: typeof fetch
}

/**
 * Response from the youtube api
 */
export type YoutubeResponse = any

/**
 * Options for a generic request to the youtube api
 * - provide your own resource and data
 */
export interface RequestOptions extends CommonRequestOptions {
	resource: string
	data: any
}

export interface GetChannelUploadsPlaylistIdOptions extends CommonRequestOptions {
	channelId: string
}

export interface YoutubeThumbnail {
	url: string
	width: number
	height: number
}

export interface YoutubeThumbnails {
	default: YoutubeThumbnail
	medium: YoutubeThumbnail
	high: YoutubeThumbnail
	standard?: YoutubeThumbnail
	maxres?: YoutubeThumbnail
}

/**
 * Tubby-formatted youtube thumbnails
 */
export interface TubbyThumbs {
	small: string
	medium: string
	large: string
	huge?: string
	full?: string
	biggest: string
}

/**
 * Tubby-formatted youtube video
 */
export interface Video {
	numeral: number
	videoId: string
	watchLink: string
	title: string
	description: string
	thumbs: TubbyThumbs
}

export interface GetPlaylistVideosOptions extends CommonRequestOptions {
	playlistId: string
	data?: any
	cannedVideos?: Video[]
	paginationLimit?: number
	onVideosReceived?: (videos: Video[]) => void
}

export interface GetUploadsOptions extends CommonRequestOptions {
	channelId: string
	cannedVideos?: Video[]
	paginationLimit?: number
	onVideosReceived?: (videos: Video[]) => void
}

export interface Searchable {
	index: number
	content: string
}
