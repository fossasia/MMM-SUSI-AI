import {BingTTS} from "./bing-tts";
import {FliteTTS} from "./flite-tts";
/**
 * Created by betterclever on 7/8/17.
 */

export class TTSService {

    public speakBing(subscriptionKey: string, text: string): Promise<string> {
        return new Promise((resolve, reject) => {
                const bingTTS = new BingTTS(subscriptionKey);

                bingTTS.synthesizeSpeech(text)
                    .then((result: boolean) => {
                        if (result) {
                            resolve("true");
                        } else {
                            reject(new Error("TTS Unsuccessful"));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            }
        );
    }

    public speakFlite(text: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const fliteTTS = new FliteTTS();
            fliteTTS.synthesizeSpeech(text)
                .then((result: boolean) => {
                        if (result) {
                            resolve("true");
                        } else {
                            resolve("error");
                        }
                    }
                )
                .catch(() => {
                    resolve("error");
                });
        });
    }
}
