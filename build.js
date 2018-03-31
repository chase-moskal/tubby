#!/usr/bin/env node

/*

BUILD SCRIPT CLI

	node build
		produce a production build

	node build --debug
		produce a debug build

	node build --sassWatch
		engage a sass compile-on-save watch mode session

*/

const commander = require("commander")
const {rm, cat, mkdir, exec} = require("shelljs")

commander
	.option("-d, --debug", "create a debuggable bundle")
	.option("-w, --sassWatch", "sass compile-on-save watcher mode")
	.parse(process.argv)

const buildOptions = {
	debug: commander.debug,
	sassWatch: commander.sassWatch,
	paths: {
		scriptSource: "source/tubby.global.tsx",
		scriptBundle: "dist/tubby.global.bundle.js",
		styleSource: "source/tubby.scss",
		styleOutput: "dist/tubby.css"
	},
	cannedVideoOptions: {
		target: "dist/canned-videos.json",
		apiKey: "AIzaSyDeHpB9W14feQs8myoWgFAZOCrDeKMLRwE", // "Tubby Demo Key"
		playlistId: "UUL_f53ZEJxp8TtlOkHwMV9Q" // 'uploads' playlist (all videos)
	}
}

/**
 * Build routine
 */
async function build({debug, paths, sassWatch, cannedVideoOptions}) {
	const {scriptSource, scriptBundle, styleSource, styleOutput} = paths
	const nb = "$(npm bin)/"
	process.env.FORCE_COLOR = true
	const s = {silent: true, env: process.env}

	if (sassWatch) {
		exec(
			nb + `node-sass --watch --source-map true ${styleSource} ${styleOutput}`,
			{env: process.env}
		)
		return 0
	}

	// cleanup
	rm("-rf", "dist")
	mkdir("dist")

	// run typescript compiler
	exec(nb + "tsc", s)

	// run sass compiler
	exec(nb + `node-sass --source-map true ${styleSource} ${styleOutput}`, s)

	// download the canned videos
	require("./download-canned-videos")(cannedVideoOptions)

	/**
	 * Debug build is easier to debug
	 */
	function debugBuild() {

		// create browserify bundle
		exec(nb + [
			"browserify " + scriptSource,
			"--debug",
			"-p [ tsify ]",
			"-g uglifyify"
		].join(" "), s).to(scriptBundle)

		console.log("✔ done debug build")
	}

	/**
	 * Production build includes polyfills and is minified
	 */
	function productionBuild() {

		// create browserify bundle
		exec(nb + [
			"browserify " + scriptSource,
			"-p [ tsify ]",
			"-g [ envify --NODE_ENV production ]",
			"-g uglifyify"
		].join(" "), s).to(scriptBundle)

		// final production bundle includes polyfills and is minified
		cat(
			"node_modules/array.find/dist/array-find-polyfill.min.js",
			"node_modules/es6-promise/dist/es6-promise.auto.min.js",
			"node_modules/whatwg-fetch/fetch.js",
			scriptBundle
		).exec(nb + "uglifyjs --compress --mangle", s)
			.to(scriptBundle)

		console.log("✔ done production build")
	}

	if (debug) debugBuild()
	else productionBuild()
}

build(buildOptions)
