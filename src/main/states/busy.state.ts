import * as fs from "fs";
import {Subscription} from "rxjs/Subscription";
import {isUndefined} from "util";

import {TTSService} from "../speech-synthesis-service/tts-service";
import {ChatAPI} from "../susi-api";
import {State} from "./base.state";
import {IStateMachineComponents} from "./susi-state-machine";

export class BusyState extends State {
    private rendererSubscription: Subscription;
    private chatAPI: ChatAPI;
    private ttsService: TTSService;

    constructor(components: IStateMachineComponents) {
        super(components, "busy");
        this.chatAPI = new ChatAPI(undefined, undefined, undefined, components.configService);
        this.ttsService = new TTSService();
    }

    public onEnter(): void {
        this.components.rendererSend("busy", {});
        const readStream = fs.createReadStream(`${process.env.CWD}/temp/for-recognition.wav`);

        // This is my API key
        // TODO: Add API key parameter to config
        const subscriptionKey = "e83907d9521644a594d532a9f3ec307f";

        this.components.recognitionService.recognizeBing(subscriptionKey, readStream).then((text) => {
            console.log("You said: " + text);

            this.components.rendererSend("recognized", {text: text});

            if (text === "Connection Error!!") {
                this.ttsService.speakFlite("There is some error").then(() => {
                        this.components.rendererSend("speak", {susiResponse: null});
                    }
                );
            }
            this.chatAPI.askSusi(text).then((answer: any) => {
                let expression = answer.answers[0].actions[0].expression;
                if (isUndefined(expression)) {
                    expression = "";
                }
                const filteredText = this.removeLinks(expression);
                this.ttsService.speakBing(subscriptionKey, filteredText).then(() => {
                    this.components.rendererSend("speak", {susiResponse: answer});
                }).catch((error: Error) => {
                    this.components.rendererSend("error", null);
                });
            });
        }).catch((error) => {
            if (error === "Recognition Error") {
                const errorMessage = "Sorry! I couldn't recognize. Please try again";
                this.ttsService.speakBing(subscriptionKey, errorMessage).then((val) => {
                    console.log(val);
                    this.components.rendererSend("speak", {text: errorMessage});
                });
            } else {
                this.components.rendererSend("error", null);
            }
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
