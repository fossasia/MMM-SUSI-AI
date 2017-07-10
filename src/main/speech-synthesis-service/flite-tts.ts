import * as Command from "command-promise";
import { TTS } from "./tts";
/**
 * Created by betterclever on 7/9/17.
 */

export class FliteTTS extends TTS {

    public synthesizeSpeech(text: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            Command(`flite -voice ${process.env.CWD}/resources/cmu_us_slt.flitevox -t "${text}" -o ${process.env.CWD}/temp/output.wav`)
                .then(() => {
                    resolve(true);
                })
                .catch((error: Error) => {
                    console.log(error);
                    resolve(false);
                });
        });

    }
}
