
import {LitElement, html, css, property, svg} from "lit-element"

export {LitElement, html, css, property, svg}

export class Component extends LitElement {}

export function prop(type: any = undefined, reflect: boolean = false) {
	return <any>property({type, reflect})
}
