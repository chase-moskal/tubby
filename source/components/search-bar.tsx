
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {observable, computed, action} from "mobx"

const escapeRegularExpression = (s: string) =>
	s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

export interface Searchable {
	index: number
	content: string
}

/**
 * Search bar store
 * - facilitates user text entry
 * - performs searches of the searchables'
 */
export class SearchBarStore {

	@observable textInput: string = ""

	@observable searchables: Searchable[]

	@observable placeholder: string = "search videos"

	@computed get searchTerms(): string[] {
		return this.textInput.split(/\s+/).filter(term => !!term)
	}

	@computed get searchResults() {
		const terms = [...this.searchTerms]
		const searchables = [...this.searchables]
		const textInput = "" + this.textInput
		return searchables.filter(searchable => {
			for (const term of terms) {
				const regex = new RegExp(escapeRegularExpression(term), "igm")
				if (!regex.test(searchable.content)) return false
			}
			return true
		})
	}

	@action setTextInput(input: string): void {
		this.textInput = input
	}

	@action setSearchables(searchables: Searchable[]): void {
		this.searchables = [...searchables]
	}
}

@observer
export default class SearchBar extends Component<{store: SearchBarStore}, any> {

	private updateTextInput = event => {
		const {store} = this.props
		const inputElement: HTMLInputElement = event.currentTarget
		store.setTextInput(inputElement.value)
	}

	render() {
		const {store} = this.props
		return (
			<div className="search-bar">
				<input
					type="text"
					placeholder={store.placeholder}
					onChange={this.updateTextInput}
					onKeyUp={this.updateTextInput}
					/>
			</div>
		)
	}
}
