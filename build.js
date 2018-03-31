#!/usr/bin/env node

const commander = require("commander")
const {rm, cat, mkdir, exec, echo} = require("shelljs")
const nb = "$(npm bin)/"
const s = {silent: true}

commander
	.option("-d, --debug", "create a debuggable bundle")
	.parse(process.argv)

const {debug} = commander

// cleanup
rm("-rf", "dist")
mkdir("dist")

// run typescript compiler
exec(nb + "tsc", s)

// create browserify bundle
exec(
	debug
		? nb + "browserify source/tubby.global.tsx "
			+ "--debug "
			+ "-p [ tsify ] "
			+ "-g uglifyify"
		: nb + "browserify source/tubby.global.tsx "
			+ "-p [ tsify ] "
			+ "-g [ envify --NODE_ENV production ] "
			+ "-g uglifyify",
	s
).to("dist/tubby.global.bundle.unoptimized.js")

// final bundle
;(debug
	? cat("dist/tubby.global.bundle.unoptimized.js")
	: cat(
		"node_modules/array.find/dist/array-find-polyfill.min.js",
		"node_modules/es6-promise/dist/es6-promise.auto.min.js",
		"node_modules/whatwg-fetch/fetch.js",
		"dist/tubby.global.bundle.unoptimized.js"
	).exec(nb + "uglifyjs --compress --mangle", s)
).to("dist/tubby.global.bundle.js")

// output final log message
console.log(
	debug
		? "✔ done debug build"
		: "✔ done production build"
)
