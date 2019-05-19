import "./register-all.js";
const explorer = document.querySelector("tubby-youtube-explorer");
explorer.onError = error => console.warn(error);
explorer.onReady = () => console.log(`loaded ${explorer.videos.length} videos`);
window["explorer"] = explorer;
//# sourceMappingURL=demo.js.map