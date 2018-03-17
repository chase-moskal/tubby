
import {h, render} from "preact"

import * as tubby from "./tubby"
import VideoGrid, {VideoGridStore} from "./components/video-grid"

window["preact"] = {h, render}
window["tubby"] = tubby
window["tubby"]["components"] = {VideoGrid, VideoGridStore}
