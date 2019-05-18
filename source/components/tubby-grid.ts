
import {Component, html, prop} from "../toolbox/component.js"

const _style = Symbol("style")

export class TubbyGrid extends Component {

	private [_style] = html`
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		</style>
	`

	render() {
		return html`
			${this[_style]}
			<div></div>
		`
	}
}
