import { Video, ThumbSize } from "../interfaces.js";
import { Component } from "../toolbox/component.js";
export declare class TubbyVideo extends Component {
    video: Video;
    ["max-description-length"]: number;
    ["thumb-size"]: ThumbSize;
    static readonly styles: import("lit-element").CSSResult;
    render(): import("lit-html").TemplateResult;
}
