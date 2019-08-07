
import {Component, html, css, svg, prop} from "../toolbox/component.js"

const _searchUpdate = Symbol("searchUpdate")
const _getSearchTerms = Symbol("getSearchTerms")

const escapeRegularExpression = (s: string) =>
	s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

export class TubbySearch extends Component {
	@prop(String, true) textInput: string = ""
	@prop(String) placeholder: string = "search"

	private [_getSearchTerms]() {
		return this.textInput.split(/\s+/).filter(term => !!term)
	}

	private [_searchUpdate] = () => {
		const input = this.shadowRoot.querySelector("input")
		this.textInput = input.value
		this.dispatchEvent(new CustomEvent("searchUpdate", {
			detail: {},
			bubbles: true,
			composed: true
		}))
	}

	match(content: string): boolean {
		const terms = this[_getSearchTerms]()
		for (const term of terms) {
			const regex = new RegExp(escapeRegularExpression(term), "igm")
			if (!regex.test(content)) return false
		}
		return true
	}

	static get styles() {return css`
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		.searchbar {
			position: relative;
		}

		.icon {
			z-index: 1;
			position: absolute;
			pointer-events: none;
			top: 0;
			right: 0;
			bottom: 0;
			width: 3em;
			height: 60%;
			margin: auto 0.5em;
			fill: var(--tubby-search-icon-color, rgba(0,0,0, 0.5));
		}

		input {
			display: block;
			font-size: 1.5em;
			margin: 0 auto;
			padding: 0.6em 1.2em;
			width: 100%;
			border: none;
			background: var(--tubby-search-bg, white);
			color: var(--tubby-search-color, darkslategrey);
		}

		input:focus {
			outline: var(--focus-outline, 2px solid #0ef);
			outline-offset: var(--tubby-search-focus-outline-offset, -3px);
		}
	`}

	render() {
		return html`
			<div class="searchbar">
				<input
					type="text"
					placeholder="${this.placeholder}"
					@change="${this[_searchUpdate]}"
					@keyup="${this[_searchUpdate]}"
					/>
				${svg`
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"/></svg>
				`}
			</div>
		`
	}
}
