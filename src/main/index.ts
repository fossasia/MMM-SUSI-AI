import {isUndefined} from "util";
import {ConfigService} from "./config-service";
import {SusiModels} from "./models";
import {RendererCommunicator} from "./renderer-communicator";
import {RecognitionService} from "./speech-detection-service";
import {SusiStateMachine} from "./states/susi-state-machine";
import {SignInService} from "./susi-api/signin-service";

export default class Main {
    private susiStateMachine: SusiStateMachine;
    private rendererCommunicator: RendererCommunicator;
    private signInService: SignInService;
    private configService: ConfigService;
    private config: Config;

    constructor(uncheckedConfig: UncheckedConfig, rendererSend: (event: string, payload: object) => void) {
        this.config = this.checkConfig(uncheckedConfig);
        this.configService = new ConfigService(this.config);

        this.rendererCommunicator = new RendererCommunicator();
        this.susiStateMachine = this.createStateMachine(this.configService, rendererSend);
    }

    public receivedNotification(type: NotificationType, payload: any): void {
        if (type === "CURRENT_USER") {
            console.log("Current User", payload);
            if (payload === "None" || payload === "anonymous") {
                this.configService.Config.accessToken = null;
            } else {
                console.log(this.config.users);
                for (const user of this.config.users) {
                    if (user.face_recognition_username === payload) {
                        if (isUndefined(this.signInService)) {
                            this.signInService = new SignInService(user);
                        }

                        this.signInService.updateUser(user).then((token) => {
                            console.log("updating token for " + user);
                            this.configService.Config.accessToken = token;
                        });
                        return;
                    }
                }
                this.configService.Config.accessToken = null;
            }
        }
        this.rendererCommunicator.sendNotification(type);
    }

    private createStateMachine(configService: ConfigService, rendererSend: (event: NotificationType, payload: object) => void): SusiStateMachine {
        const models = new SusiModels(configService.Config.hotword);
        const recognitionService = new RecognitionService();

        return new SusiStateMachine({
            recognitionService: recognitionService,
            configService: configService,
            rendererSend: rendererSend,
            rendererCommunicator: this.rendererCommunicator,
            models: models,
        });
    }

    private checkConfig(uncheckedConfig: UncheckedConfig): Config {

        console.log(uncheckedConfig);
        if (uncheckedConfig.hotword === undefined) {
            throw new Error("hotword must be defined");
        }
        if (uncheckedConfig.users === undefined) {
            return {
                hotword: uncheckedConfig.hotword,
                users: []
            };
        } else {
            return {
                hotword: uncheckedConfig.hotword,
                users: uncheckedConfig.users
            };
        }
    }
}

module.exports = Main;
