import * as fs from "fs";
import {BingRecognizer} from "./bing-recognizer";


export class RecognitionService {

    public recognizeBing(subscriptionKey:string, file: fs.ReadStream) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let client = new BingRecognizer(subscriptionKey);

            return client.recognizeAudioStream(file).then( (response: string) => {
                console.log(response);
                return resolve(response);
                }
            ).catch(error => {
                console.log(error);
                return reject(new Error(error));
            });
        })
    };


}