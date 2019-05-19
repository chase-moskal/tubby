import { LitElement, html, css, property, svg } from "lit-element";
export { LitElement, html, css, property, svg };
export class Component extends LitElement {
}
export function prop(type = undefined, reflect = false) {
    return property({ type, reflect });
}
//# sourceMappingURL=component.js.map