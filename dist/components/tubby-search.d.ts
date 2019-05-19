import { Component } from "../toolbox/component.js";
declare const _searchUpdate: unique symbol;
declare const _getSearchTerms: unique symbol;
export declare class TubbySearch extends Component {
    textInput: string;
    placeholder: string;
    private [_getSearchTerms];
    private [_searchUpdate];
    match(content: string): boolean;
    static readonly styles: import("lit-element").CSSResult;
    render(): import("lit-html").TemplateResult;
}
export {};
