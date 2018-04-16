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
const {axx, maxx, raxx, waxx, caxx} = require("axx")

commander
	.option("-d, --debug", "create a debuggable bundle")
	.option("-w, --sassWatch", "sass compile-on-save watcher mode")
	.parse(process.argv)

const buildOptions = {
	debug: commander.debug,
	sassWatch: commander.sassWatch,
	paths: {
		nb: "$(npm bin)/",
		scriptSource: "source/tubby.global.tsx",
		scriptBundle: "dist/tubby.global.bundle.js",
		styleSource: "source/tubby.scss",
		styleOutput: "dist/tubby.css",
		polyfills: [
			"node_modules/array.find/dist/array-find-polyfill.min.js",
			"node_modules/es6-promise/dist/es6-promise.auto.min.js",
			"node_modules/whatwg-fetch/fetch.js"
		]
	},
	cannedVideoOptions: {
		target: "dist/canned-videos.json",
		apiKey: "AIzaSyDeHpB9W14feQs8myoWgFAZOCrDeKMLRwE", // "Tubby Demo Key"
		playlistId: "UUL_f53ZEJxp8TtlOkHwMV9Q" // 'uploads' playlist (all videos)
	}
}

async function build({debug, paths, sassWatch, cannedVideoOptions}) {
	const {nb, scriptSource, scriptBundle, styleSource, styleOutput, polyfills} = paths
	process.env.FORCE_COLOR = true

	if (sassWatch)
		await (axx(`${nb}node-sass --watch --source-map true ${styleSource} ${styleOutput}`, caxx(), {combineStderr: true}).result)

	await axx(`rm -rf dist && mkdir dist`)
	await Promise.all([
		axx(`${nb}tsc`).result,
		axx(`${nb}node-sass --source-map true ${styleSource} ${styleOutput}`).result
	])

	async function buildDebug() {
		await (axx(
			`${nb}browserify ${scriptSource} --debug -p [ tsify ]`,
			waxx(scriptBundle)
		).result)
		console.log("✔ done debug build")
	}

	async function buildProduction() {
		await (axx(
			`${nb}browserify ${scriptSource} -p [ tsify ] -g [ envify --NODE_ENV production ] -g uglifyify`,
			waxx(`${scriptBundle}.temp`)
		).result)
		await (axx(
			`cat ${[
				...polyfills,
				`${scriptBundle}.temp`
			].join(" ")}`,
			axx(`${nb}uglifyjs --compress --mangle`, waxx(scriptBundle))
		).result)
		console.log("✔ done production build")
	}

	await Promise.all([
		require("./download-canned-videos")(cannedVideoOptions),
		debug ? buildDebug() : buildProduction()
	])
}

build(buildOptions)
