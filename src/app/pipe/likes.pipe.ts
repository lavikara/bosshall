import {Pipe, PipeTransform} from '@angular/core';
import {LikeModel} from '../../model/LikeModel';
import {EmojiService} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {LikeDisplayModel} from '../../model/likeDisplayModel';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'likes'
})
export class LikesPipe implements PipeTransform {
    constructor(private emoji: EmojiService, private domSanitizer: DomSanitizer) {
    }

    transform(value: any): Array<LikeDisplayModel> {
        return this.spritify(LikeModel.impression(LikeModel.json(value)).slice(0, 4));

    }

    private spritify(emojify: Array<LikeModel>) {
        return emojify.map(r => this.emoji.emojiSpriteStyles(r.icon, 'apple', 20, 20));
    }

}
