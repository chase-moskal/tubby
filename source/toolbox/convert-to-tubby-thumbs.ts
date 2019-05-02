
import {YoutubeThumbnails, TubbyThumbs} from "../interfaces.js"

/**
 * Make youtube thumbnails more convenient to work with
 */
export const convertToTubbyThumbs = (thumbnails: YoutubeThumbnails): TubbyThumbs => {
	const small = thumbnails.default.url
	const medium = thumbnails.medium.url
	const large = thumbnails.high ? thumbnails.high.url : null
	const huge = thumbnails.standard ? thumbnails.standard.url : null
	const full = thumbnails.maxres ? thumbnails.maxres.url : null
	const biggest = full || huge || large || medium || small
	return {small, medium, large, huge, full, biggest}
}
