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

    constructor(uncheckedConfig: UncheckedConfig, rendererSend: (event: string, payload: object) => void) {
        const config = this.checkConfig(uncheckedConfig);
        const configService = new ConfigService(config);

        this.rendererCommunicator = new RendererCommunicator();
        this.susiStateMachine = this.createStateMachine(configService, rendererSend);

        if (config.users !== "anonymous") {
            this.signInService = new SignInService(config.users[0]);
            this.signInService.observable.subscribe((token) => {
                configService.Config.accessToken = token;
                console.log(token);
            });
        }
    }

    public receivedNotification<T>(type: NotificationType, payload: T): void {
        console.log("---->  type: " + type, payload);
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

        if (uncheckedConfig.hotword === undefined) {
            throw new Error("hotword must be defined");
        }
        if (uncheckedConfig.users === undefined) {
            return {
                hotword: uncheckedConfig.hotword,
                users: "anonymous"
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
