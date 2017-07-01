import * as fs from "fs";
import * as querystring from "querystring";
import * as uuid from "uuid";
import * as rp from "request-promise";
/**
 * Created by betterclever on 6/30/17.
 */

export interface BingRecognitionResult {
    RecognitionStatus: string,
    DisplayText: string,
    Offset: number,
    Duration: number
}

export class BingRecognizer {
    private BING_SPEECH_TOKEN_ENDPOINT = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken';
    private BING_SPEECH_ENDPOINT_STT = 'https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1';

    private subscriptionKey: string;

    private token: string;
    private tokenExpirationDate: number;

    constructor(subscriptionKey: string) {
        this.subscriptionKey = subscriptionKey;
    }

    private issueToken(): Promise<string> {
        if (this.token && this.tokenExpirationDate > Date.now()) {
            return Promise.resolve(this.token);
        }

        let options = {
            method: 'POST',
            uri: this.BING_SPEECH_TOKEN_ENDPOINT,
            headers: {
                'Ocp-Apim-Subscription-Key': this.subscriptionKey
            }
        };

        return new Promise((resolve, reject) => {

            rp(options)
                .then((token: string) => {
                    return resolve(token);
                })
                .catch(function (error) {
                    console.log(error);
                });

        });

    }


    recognizeAudioStream(input: fs.ReadStream): Promise<any> {

        return this.issueToken()
            .then((token: string) => {

                this.token = token;
                this.tokenExpirationDate = Date.now() + 9 * 60 * 1000;

                let params = {
                    'language': 'en-us',
                    'format': 'json',
                    'requestid': uuid.v4() // can be anything
                };

                let options = {
                    method: 'POST',
                    uri: this.BING_SPEECH_ENDPOINT_STT + '?' + querystring.stringify(params),
                    body: input,
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'audio/wav; codec="audio/pcm"; samplerate=8000'
                    }
                };

                return new Promise<string>((resolve, reject) => {
                    rp(options)
                        .then(response => {
                                console.log(response);
                                let recognitionResponse: BingRecognitionResult = JSON.parse(response);
                                return resolve(recognitionResponse.DisplayText);
                            }
                        )
                        .catch((error: Error) => {
                            console.log("An Error Occurred!");
                            return reject("I can't connect at the moment !!");
                        })
                });


            })
            .catch((error: Error) => {
                console.log("An Error Occurred!");
                console.log(error);
                throw new Error('Failed');
            })
    }
}