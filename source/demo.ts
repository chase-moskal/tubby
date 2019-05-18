
import "./register-all.js"
import {TubbyYoutubeExplorer} from "./components/tubby-youtube-explorer.js"

const explorer: TubbyYoutubeExplorer = document.querySelector("tubby-youtube-explorer")
explorer.onError = error => console.warn(error)
explorer.onLoad = () => console.log("loaded!", explorer.videos.length)

window["explorer"] = explorer
