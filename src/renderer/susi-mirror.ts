import {SusiVisualizer} from "./SusiVisualizer";
export class SusiMirror {

    private visualizer: SusiVisualizer;
    constructor(
        private mainDiv: HTMLElement,
        private canvas: HTMLCanvasElement,
        private config: Config,
        private mainSend: (event: NotificationType, payload: object) => void) {
    }

    public start(): void {
        this.visualizer = new SusiVisualizer(this.canvas);
        this.visualizer.start();
    }

    public receivedNotification(type: NotificationType, payload: any): void {

        this.visualizer.setMode(type);
        switch (type) {
            case "idle":
                this.idle();
                this.visualizer.setMode("idle", payload.text);
                break;
            case "listening":
                this.listening();
                this.visualizer.setMode("listening");
                break;
            case "busy":
                this.visualizer.setMode("busy");
                break;
            case "recognized":
                this.visualizer.setMode("recognized", payload.text);
                break;
            case "speak":
                this.speaking();
                this.visualizer.setMode("speak", payload.text);
                break;
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
}
