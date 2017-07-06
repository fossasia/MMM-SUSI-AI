import * as Command from "command-promise";
import * as fs from "fs";
import { Subscription } from "rxjs/Subscription";

import { ChatAPI } from "../susi-api";
import { State } from "./base.state";
import { IStateMachineComponents } from "./susi-state-machine";

export class BusyState extends State {
    private rendererSubscription: Subscription;
    private chatAPI: ChatAPI;

    constructor(components: IStateMachineComponents) {
        super(components, "busy");
        this.chatAPI = new ChatAPI();
    }

    public onEnter(): void {
        this.components.rendererSend("busy", {});
        const readStream = fs.createReadStream(`${process.env.CWD}/temp/for-recognition.wav`);

        // This is my API key
        // TODO: Add API key parameter to config
        const subscriptionKey = "bae76dc848f043a0b52a2c9c36fbaa33";

        this.components.recognitionService.recognizeBing(subscriptionKey, readStream).then((text) => {
            console.log("You said: " + text);

            this.components.rendererSend("recognized", { text: text });

            if (text === "Connection Error!!") {
                Command(`flite -voice ${process.env.CWD}/resources/cmu_us_slt.flitevox -t "Connection Error Occurred!!" -o ${process.env.CWD}/temp/output.wav`)
                    .then(() => {
                        this.components.rendererSend("speak", { text: "Error" });
                    }
                    ).catch((error: Error) => {
                        return console.log(error);
                    });
            }

            this.chatAPI.askSusi(text).then((answer: any) => {
                const expression = answer.answers[0].actions[0].expression;
                console.log(expression);
                Command(`flite -voice ${process.env.CWD}/resources/cmu_us_slt.flitevox -t "${expression}" -o ${process.env.CWD}/temp/output.wav`)
                    .then(() => {
                        this.components.rendererSend("speak", { text: expression });
                    }
                    ).catch((error: Error) => {
                        return console.log(error);
                    });
            });
        }).catch((error) => {
            console.log("here is the error");
            console.log(error);
        });

        this.rendererSubscription = this.components.rendererCommunicator.Observable.subscribe((type) => {
            if (type === "finishedSpeaking") {
                this.transition(this.allowedStateTransitions.get("idle"));
            }
        });
    }

    public onExit(): void {
        this.rendererSubscription.unsubscribe();
    }
}
