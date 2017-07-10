import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Detector, Models } from "snowboy";
import * as Timer from "timer-machine";

const WAIT_TIME = 1000;
const MAX_TIME = 4000;

export class HotwordDetector extends Detector {
    private silenceTimer = new Timer();
    private maxTimeTimer = new Timer();
    private subject: Subject<DETECTOR>;

    constructor(models: Models) {
        super({
            resource: `${process.env.CWD}/resources/common.res`,
            models: models,
            audioGain: 2.0,
        });
        this.subject = new Subject<DETECTOR>();
        this.setUp();
    }

    private setUp(): void {
        this.on("silence", () => {
            if (this.silenceTimer.isStarted() === false) {
                this.silenceTimer.start();
            }

            if (this.silenceTimer.timeFromStart() > WAIT_TIME) {
                this.subject.next(DETECTOR.Silence);
            }
        });

        this.on("sound", () => {
            this.silenceTimer.stop();
            if (this.maxTimeTimer.timeFromStart() > MAX_TIME) {
                this.subject.next(DETECTOR.Silence);
            }
        });

        this.on("error", (error) => {
            console.error(error);
        });

        this.on("hotword", (index, hotword) => {
            console.log("hotword", index, hotword);
            if (this.maxTimeTimer.isStarted() === false) {
                this.maxTimeTimer.start();
            }
            this.subject.next(DETECTOR.Hotword);
        });
    }

    public get Observable(): Observable<DETECTOR> {
        return this.subject.asObservable();
    }
}
