import {Injectable} from '@angular/core';
const image = require('../../assets/img/emoji-image.png');
@Injectable()
export class EmojiBackgroundFn {

    public backgroundImageFn(set: string, sheetSize: number): string {
        return image;
    }
}
