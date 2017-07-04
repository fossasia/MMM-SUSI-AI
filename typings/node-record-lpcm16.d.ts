/**
 * Created by betterclever on 6/28/17.
 */

declare module "node-record-lpcm16" {
    import { Readable } from "stream";

    export function start(params: {
        sampleRate?: number,
        compress?: boolean,
        threshold?: number,
        thresholdStart?: any,
        thresholdEnd?: any,
        silence?: number,
        verbose?: boolean,
        recordProgram?: string
    }): Mic;

    export function stop(): any;
    export class Mic extends Readable {
    }
}
