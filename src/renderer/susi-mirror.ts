import {ResponseUI} from "./response-ui";
import {SusiVisualizer} from "./susi-visualizer";
export class SusiMirror {

    private visualizer: SusiVisualizer;
    private responseUI: ResponseUI;

    constructor(private mainDiv: HTMLDivElement,
                private canvas: HTMLCanvasElement,
                private userQueryTextNode: Text,
                private susiResponseDiv: HTMLDivElement,
                private config: Config,
                private mainSend: (event: NotificationType, payload: object) => void) {
        this.visualizer = new SusiVisualizer(this.canvas);
        this.responseUI = new ResponseUI(susiResponseDiv);
    }

    public start(): void {
        this.visualizer.start();
    }

    public receivedNotification(type: NotificationType, payload: any): void {

        this.visualizer.setMode(type);
        switch (type) {
            case "idle":
                this.idle();
                this.visualizer.setMode("idle");
                this.userQueryTextNode.nodeValue = "Ask me anything !!";
                this.responseUI.clear();
                break;
            case "listening":
                this.listening();
                this.visualizer.setMode("listening");
                this.userQueryTextNode.nodeValue = "Speak Now";
                break;
            case "busy":
                this.visualizer.setMode("busy");
                this.userQueryTextNode.nodeValue = "";
                break;
            case "recognized":
                this.visualizer.setMode("recognized");
                this.userQueryTextNode.nodeValue = payload.text;
                break;
            case "speak":
                this.speaking();
                this.visualizer.setMode("speak");
                this.responseUI.update(payload.susiResponse);
                break;
            case "error":
                this.responseUI.showError();
                this.speakError();
        }
    }

    public listening(): void {
        this.mainDiv.classList.add("wrapper-active");
    }

    public idle(): void {
        this.mainDiv.classList.remove("wrapper-active");
    }

    public speaking(): void {
        const sound = new Audio("/output.wav");
        sound.play();
        sound.addEventListener("ended", () => {
            this.mainSend("finishedSpeaking", {});
        });
    }

    private speakError(): void {
        const sound = new Audio("/problem.wav");
        sound.play();
        sound.addEventListener("ended", () => {
            this.mainSend("finishedSpeaking", {});
        });
    }
}
