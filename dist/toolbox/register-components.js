function dashify(camel) {
    return camel.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}
export function registerComponents(components) {
    for (const name of Object.keys(components))
        customElements.define(dashify(name), components[name]);
}
//# sourceMappingURL=register-components.js.map