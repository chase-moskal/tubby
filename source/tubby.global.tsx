
import * as mobx from "mobx"
import * as preact from "preact"
import * as mobxPreact from "mobx-preact"

import * as tubby from "./tubby"
import SearchBar, {SearchBarStore} from "./components/search-bar"
import VideoGrid, {VideoGridStore} from "./components/video-grid"
import InstantVideoSearch, {InstantVideoSearchStore} from "./components/instant-video-search"

window["tubby"] = tubby

window["mobx"] = mobx
window["preact"] = preact
window["mobxPreact"] = mobxPreact

window["tubby"]["components"] = {
	VideoGrid,
	VideoGridStore,
	SearchBar,
	SearchBarStore,
	InstantVideoSearch,
	InstantVideoSearchStore
}
