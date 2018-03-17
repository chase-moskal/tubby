
import * as mobx from "mobx"
import * as preact from "preact"
import * as mobxPreact from "mobx-preact"

import * as tubby from "./tubby"
import VideoGrid, {VideoGridStore} from "./components/video-grid"

window["tubby"] = tubby

window["mobx"] = mobx
window["preact"] = preact
window["mobxPreact"] = mobxPreact

window["tubby"]["components"] = {
	VideoGrid,
	VideoGridStore
}
