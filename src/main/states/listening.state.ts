import * as fs from "fs";
import * as record from "node-record-lpcm16";
import { Subscription } from "rxjs/Subscription";

import { State } from "./base.state";
import { IStateMachineComponents } from "./susi-state-machine";

export class ListeningState extends State {
    private detectorSubscription: Subscription;

    constructor(components: IStateMachineComponents) {
        super(components, "listening");
    }

    public onEnter(): void {
        this.components.rendererSend("listening", {});
        const writeStream = fs.createWriteStream(`${process.env.CWD}/temp/for-recognition.wav`,
            { defaultEncoding: "binary" });

        writeStream.on("finish", () => {
            this.transition(this.allowedStateTransitions.get("busy"));
        });
        this.components.mic.pipe(writeStream);

        this.detectorSubscription = this.components.detector.Observable.subscribe((value) => {
            switch (value) {
                case DETECTOR.Silence:
                    record.stop();
                    break;
            }
        });
    }

    public onExit(): void {
        this.detectorSubscription.unsubscribe();
    }
}
