import { Component } from "./component.js";
export interface Components {
    [name: string]: typeof Component;
}
export declare function registerComponents(components: Components): void;
