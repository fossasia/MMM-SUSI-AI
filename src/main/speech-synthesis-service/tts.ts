/**
 * Created by betterclever on 7/9/17.
 */

export abstract class TTS {
    public abstract synthesizeSpeech(text: string): Promise<boolean>;
}
