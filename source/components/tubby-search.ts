
import {Component, html, prop} from "../toolbox/component.js"

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

	render() {
		return html`
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
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
			</style>
			<div class="searchbar">
				<input
					type="text"
					placeholder="${this.placeholder}"
					@change="${this[_searchUpdate]}"
					@keyup="${this[_searchUpdate]}"
					/>
			</div>
		`
	}
}
