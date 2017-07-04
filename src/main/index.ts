import {RecognitionService} from "./speech-detection-service";
import {SusiModels} from "./models";
import {RendererCommunicator} from "./renderer-communicator";
import {SusiStateMachine} from "./states/susi-state-machine";
import {ConfigService} from "./config-service";

export default class Main {
    private susiStateMachine: SusiStateMachine;
    private rendererCommunicator: RendererCommunicator;

    constructor(uncheckedConfig: UncheckedConfig, rendererSend: (event: string, payload: object) => void) {
        const config = this.checkConfig(uncheckedConfig);
        const configService = new ConfigService(config);

        this.rendererCommunicator = new RendererCommunicator();
        this.susiStateMachine = this.createStateMachine(configService, rendererSend);

    }

    public receivedNotification<T>(type: NotificationType, payload: T): void {
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

        return {
            hotword: uncheckedConfig.hotword
        };
    }
}

module.exports = Main;
