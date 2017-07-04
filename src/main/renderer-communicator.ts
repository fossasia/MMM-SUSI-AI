/**
 * Created by betterclever on 6/29/17.
 */

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

export class RendererCommunicator {
    private subject: Subject<NotificationType>;

    constructor() {
        this.subject = new Subject<NotificationType>();
    }

    public sendNotification(type: NotificationType): void {
        this.subject.next(type);
    }

    public get Observable(): Observable<NotificationType> {
        return this.subject.asObservable();
    }
}
