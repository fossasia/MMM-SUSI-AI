import * as record from "node-record-lpcm16";
import {Subscription} from "rxjs/Subscription";

import {HotwordDetector} from "../detector";
import {State} from "./base.state";
import {IStateMachineComponents} from "./susi-state-machine";

export class IdleState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "idle");
    }

    public onEnter(): void {
        this.components.rendererSend("idle", {});
        this.components.detector = new HotwordDetector(this.components.models);
        this.components.mic = this.createMic();
        this.components.mic.pipe(this.components.detector as any);
        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case DETECTOR.Hotword:
                    this.transition(this.allowedStateTransitions.get("listening"));
                    break;
            }
        });
    }

    public onExit(): void {
        this.detectorSubscription.unsubscribe();
    }

    private createMic(): record.Mic {
        const mic = record.start({
            threshold: 0,
        });

        return mic;
    }
}
