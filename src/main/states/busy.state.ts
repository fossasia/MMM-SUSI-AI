import * as fs from "fs";
import {Subscription} from "rxjs/Subscription";

import {IStateMachineComponents} from "./susi-state-machine";
import {State} from "./base.state";
import {ChatAPI} from '../susi-api';
import * as Command from 'command-promise'

export class BusyState extends State {
    private rendererSubscription: Subscription;
    private chatAPI: ChatAPI;

    constructor(components: IStateMachineComponents) {
        super(components, "busy");
        this.chatAPI = new ChatAPI();
    }

    public onEnter(): void {
        this.components.rendererSend("busy", {});
        let readStream = fs.createReadStream(`${process.env.CWD}/temp/for-recognition.wav`);

        // This is my API key
        // TODO: Add API key parameter to config
        let subscriptionKey = '9b727d5ac2294d30b7664912a20b50c8';

        this.components.recognitionService.recognizeBing(subscriptionKey, readStream).then((text) => {
            console.log("You said: " + text);
            this.chatAPI.askSusi(text).then((answer: any) => {
                const expression = answer.answers[0].actions[0].expression;
                console.log(expression);
                Command(`flite -voice ${process.env.CWD}/resources/cmu_us_slt.flitevox -t "${expression}" -o ${process.env.CWD}/temp/output.wav`)
                    .then(() => {
                            this.components.rendererSend("speak", {});
                            debugger;
                        }
                    ).catch((error: Error) => {
                    return console.log(error);
                });
            })
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
