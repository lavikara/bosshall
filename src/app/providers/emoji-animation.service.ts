import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EmojiAnimationService {
    constructor() {
    }

    private _emoji: Array<{
        xPos: number,
        yPos: number,
        element: string
    }> = [];


    get emoji(): Array<{ xPos: number; yPos: number; element: string }> {
        return this._emoji;
    }

    public animate(element: string) {
        this._emoji.push({
            xPos: 0,
            yPos: this.generateRange(135, 0),
            element: element
        });
    }

    private generateRange(max: number, min: number) {
        return Math.ceil(Math.random() * (max - min) + min);
    }

}
