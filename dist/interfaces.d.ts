export interface CommonRequestOptions {
    apiKey: string;
    apiEndpoint?: string;
    fetchParams?: RequestInit;
    fetch?: typeof fetch;
}
export declare type YoutubeResponse = any;
export interface RequestOptions extends CommonRequestOptions {
    resource: string;
    data: any;
}
export interface GetChannelUploadsPlaylistIdOptions extends CommonRequestOptions {
    channelId: string;
}
export interface YoutubeThumbnail {
    url: string;
    width: number;
    height: number;
}
export interface YoutubeThumbnails {
    default: YoutubeThumbnail;
    medium: YoutubeThumbnail;
    high: YoutubeThumbnail;
    standard?: YoutubeThumbnail;
    maxres?: YoutubeThumbnail;
}
export interface TubbyThumbs {
    small: string;
    medium: string;
    large: string;
    huge?: string;
    full?: string;
    biggest: string;
}
export declare type ThumbSize = "small" | "medium" | "large" | "biggest";
export interface Video {
    numeral: number;
    videoId: string;
    watchLink: string;
    title: string;
    description: string;
    thumbs: TubbyThumbs;
}
export interface GetPlaylistVideosOptions extends CommonRequestOptions {
    playlistId: string;
    data?: any;
    cannedVideos?: Video[];
    paginationLimit?: number;
    onVideosReceived?: (videos: Video[]) => void;
}
export interface GetUploadsOptions extends CommonRequestOptions {
    channelId: string;
    cannedVideos?: Video[];
    paginationLimit?: number;
    onVideosReceived?: (videos: Video[]) => void;
}
export interface Searchable {
    index: number;
    content: string;
}
