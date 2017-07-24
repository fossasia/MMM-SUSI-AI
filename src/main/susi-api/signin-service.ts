import * as request from "request";
import {Observable} from "rxjs/Observable";
/**
 * Created by betterclever on 13/7/17.
 */

interface ISusiSignInResponse {
    accepted: boolean;
    valid_seconds: number;
    access_token: string;
    message: string;
    session: object;
}

export class SignInService {
    public observable: Observable<string>;
    private user: IUser;

    constructor(user: IUser) {
        this.user = user;
        this.observable = new Observable<string>((observer) => {
            this.obtainToken(this.user).then((token) => {
                observer.next(token);
            }).catch((err) => {
                throw new Error(err);
            });

            setInterval(() => {
                this.obtainToken(user).then((token) => {
                    observer.next(token);
                }).catch((err) => {
                    throw new Error(err);
                });
            }, 60480 * 1000);
        });
    }

    public async updateUser(user: IUser): Promise<string> {
        this.user = user;
        return await this.obtainToken(user);
    }

    private obtainToken(user: IUser): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get({
                uri: `http://api.susi.ai/aaa/login.json?type=access-token&login=${user.email}&password=${user.password}`,
                json: true
            }, (err, response, body: ISusiSignInResponse) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
                    reject(body);
                    return;
                }
                resolve(body.access_token);
            });
        });
    }
}
