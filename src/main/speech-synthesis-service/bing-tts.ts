/**
 * Created by betterclever on 7/8/17.
 */
import * as fs from "fs";
import * as request from "request";
import * as rp from "request-promise";
import {TTS} from "./tts";
export class BingTTS extends TTS {

    private BING_SPEECH_TOKEN_ENDPOINT = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    private BING_SPEECH_ENDPOINT_TTS = "https://speech.platform.bing.com/synthesize";
    private AUDIO_OUTPUT_FORMAT = "riff-8khz-8bit-mono-mulaw";
    private subscriptionKey: string;

    private accessToken: string;

    constructor(subscriptionKey: string) {
        super();
        this.subscriptionKey = subscriptionKey;
    }

    public synthesizeSpeech(text: string): Promise<boolean> {
        return this.issueToken().then((token) => {
            this.accessToken = token;
            const voice = "Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)";

            const ssml = `<speak version='1.0' xml:lang='en-us'>
                            <voice name='${voice}' xml:lang='en-us' xml:gender='female'>${text}</voice>
                            </speak>`;

            const options = {
                method: "POST",
                uri: this.BING_SPEECH_ENDPOINT_TTS,
                body: ssml,
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                    "Content-Type": "application/ssml+xml",
                    "Content-Length": ssml.length,
                    "X-Microsoft-OutputFormat": this.AUDIO_OUTPUT_FORMAT,
                    "X-Search-AppId": "00000000000000000000000000000000",
                    "X-Search-ClientID": "00000000000000000000000000000000",
                    "User-Agent": "bingspeech-api-client"
                }
            };

            return new Promise<boolean>((resolve, reject) => {
                request.post(options)
                    .pipe(fs.createWriteStream(`${process.env.CWD}/temp/output.wav`))
                    .on("finish", () => {
                        resolve(true);
                    })
                    .on("error", (error) => {
                        reject(error);
                    });
            });
        });
    }

    private issueToken(): Promise<string> {

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
