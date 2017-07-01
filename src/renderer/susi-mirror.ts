export class SusiMirror {

    constructor(
        private mainDiv: HTMLElement,
        canvas: HTMLCanvasElement,
        config: Config,
        private mainSend: (event: NotificationType, payload: object) => void) {
    }

    public receivedNotification<T>(type: NotificationType, payload: T): void {
        console.log(type);
        switch (type) {
            case "idle":
                this.idle();
                break;
            case "listening":
                this.listening();
                break;
            case "busy":
                break;
            case "speak":
                this.speaking();
                break;
        }
    }

    public listening(): void {
        this.mainDiv.classList.add("wrapper-active");
        document.body.classList.add("down-size");
    }

    public idle(): void {
        this.mainDiv.classList.remove("wrapper-active");
        document.body.classList.remove("down-size");
    }

    public speaking(): void {
        const sound = new Audio("/output.wav");
        sound.play();
        sound.addEventListener("ended", () => {
            this.mainSend("finishedSpeaking", {});
        });
    }
}
