
import {Component} from "./component.js"

function dashify(camel: string): string {
	return camel.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase()
}

export interface Components {
	[name: string]: typeof Component
}

export function registerComponents(components: Components) {
	for (const name of Object.keys(components))
		customElements.define(dashify(name), components[name])
}
