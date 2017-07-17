import * as fs from "fs";
import {Subscription} from "rxjs/Subscription";

import {TTSService} from "../speech-synthesis-service/tts-service";
import {ChatAPI} from "../susi-api";
import {State} from "./base.state";
import {IStateMachineComponents} from "./susi-state-machine";

export class BusyState extends State {
    private rendererSubscription: Subscription;
    private chatAPI: ChatAPI;

    constructor(components: IStateMachineComponents) {
        super(components, "busy");
        this.chatAPI = new ChatAPI(undefined, undefined, undefined, components.configService);
    }

    public onEnter(): void {
        this.components.rendererSend("busy", {});
        const readStream = fs.createReadStream(`${process.env.CWD}/temp/for-recognition.wav`);

        // This is my API key
        // TODO: Add API key parameter to config
        const subscriptionKey = "bae76dc848f043a0b52a2c9c36fbaa33";

        this.components.recognitionService.recognizeBing(subscriptionKey, readStream).then((text) => {
            console.log("You said: " + text);

            this.components.rendererSend("recognized", {text: text});

            const ttsService = new TTSService();
            if (text === "Connection Error!!") {
                ttsService.speakFlite("There is some error").then(() => {
                        this.components.rendererSend("speak", {text: "There is some error!"});
                    }
                );
            }
            this.chatAPI.askSusi(text).then((answer: any) => {
                const expression = answer.answers[0].actions[0].expression;
                const filteredText = this.removeLinks(expression);
                ttsService.speakBing(subscriptionKey, filteredText).then((val) => {
                    console.log(val);
                    this.components.rendererSend("speak", {susiResponse: answer});
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

    private removeLinks(text: string): string {
        return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
    }
}
