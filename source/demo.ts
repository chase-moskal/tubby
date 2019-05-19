
import "./register-all.js"
import {TubbyYoutubeExplorer} from "./components/tubby-youtube-explorer.js"

const explorer: TubbyYoutubeExplorer = document.querySelector("tubby-youtube-explorer")
explorer.onError = error => console.warn(error)
explorer.onReady = () => console.log(`loaded ${explorer.videos.length} videos`)

window["explorer"] = explorer
