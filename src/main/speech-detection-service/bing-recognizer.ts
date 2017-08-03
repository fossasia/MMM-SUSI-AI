import * as fs from "fs";
import * as querystring from "querystring";
import * as rp from "request-promise";
import * as uuid from "uuid";
/**
 * Created by betterclever on 6/30/17.
 */

export interface IBingRecognitionResult {
    RecognitionStatus: string;
    DisplayText: string;
    Offset: number;
    Duration: number;
}

export class BingRecognizer {
    private BING_SPEECH_TOKEN_ENDPOINT = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    private BING_SPEECH_ENDPOINT_STT = "https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1";

    private subscriptionKey: string;

    private token: string;

    constructor(subscriptionKey: string) {
        this.subscriptionKey = subscriptionKey;
    }

    public recognizeAudioStream(input: fs.ReadStream): Promise<string> {

        return this.issueToken()
            .then((token: string) => {

                this.token = token;
                const params = {
                    language: "en-us",
                    format: "json",
                    requestid: uuid.v4() // can be anything
                };

                const options = {
                    method: "POST",
                    uri: this.BING_SPEECH_ENDPOINT_STT + "?" + querystring.stringify(params),
                    body: input,
                    headers: {
                        "Authorization": `Bearer ${this.token}`,
                        "Content-Type": "audio/wav; codec=\"audio/pcm\"; samplerate=16000"
                    }
                };

                return new Promise<string>((resolve, reject) => {
                    rp(options)
                        .then((response) => {
                                const recognitionResponse: IBingRecognitionResult = JSON.parse(response);
                                if (recognitionResponse.RecognitionStatus === "InitialSilenceTimeout" ||
                                    recognitionResponse.RecognitionStatus === "NoMatch") {
                                    return reject("Recognition Error");
                                }
                                return resolve(recognitionResponse.DisplayText);
                            }
                        )
                        .catch((error: Error) => {
                            return reject(error);
                        });
                });
            });
    }

    private issueToken(): Promise<string> {
        // if (this.token && this.tokenExpirationDate > Date.now()) {
        //     return Promise.resolve(this.token);
        // }

        const options = {
            method: "POST",
            uri: this.BING_SPEECH_TOKEN_ENDPOINT,
            headers: {
                "Ocp-Apim-Subscription-Key": this.subscriptionKey
            }
        };

        return new Promise((resolve, reject) => {

            rp(options)
                .then((token: string) => {
                    return resolve(token);
                })
                .catch((error: Error) => {
                    return reject(error);
                });

        });

    }
}
