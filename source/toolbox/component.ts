
import {LitElement, html, css, property} from "lit-element"

export {LitElement, html, css, property}

export class Component extends LitElement {}

export function prop(type: any = undefined, reflect: boolean = true) {
	return <any>property({type, reflect})
}
