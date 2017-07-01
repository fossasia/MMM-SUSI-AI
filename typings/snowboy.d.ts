/**
 * Created by betterclever on 6/28/17.
 */

declare module "snowboy" {
    import { Stream } from "stream";

    type State = "sound" | "silence" | "hotword" | "error";

    export class Detector extends Stream {
        constructor(params: any);

        on(event: State | symbol, callback: (index?: any, hotword?: any) => void): this;
    }

    export class Models {
        add(params: any): void;
    }
}
