import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SanitizePipe} from './sanitize.pipe';
import {SanitizeStylePipe} from './sanitize-style.pipe';
import {DoubleSearchFilterPipe} from './doube-search-filter.pipe';
import {LikesPipe} from './likes.pipe';
import {DislikePipe} from './dislike.pipe';
import {FavoritePipe} from './favorite.pipe';
import {EmojiPipe} from './emoji.pipe';
import {AudiencePipe} from './audience.pipe';
import {LikeCountPipe} from './like-count.pipe';
import {SanitizeHTMLPipe} from './sanitize-html.pipe';
import { KNumberPipe } from './k-number.pipe';
import {ObjectArrayPipe} from './objectArray';
import { ParticipantAudiencePipe } from './participant-audience.pipe';
import {ActiveVideoAudio} from './ActiveVideoAudio';
import {URLStrREplacerPipe} from './urlstr-replacer.pipe';


@NgModule({
    declarations: [
        ActiveVideoAudio, SanitizePipe, SanitizeStylePipe, DoubleSearchFilterPipe, LikesPipe, DislikePipe,
        FavoritePipe, EmojiPipe, AudiencePipe, LikeCountPipe, SanitizeHTMLPipe, KNumberPipe,
        ObjectArrayPipe, ParticipantAudiencePipe, URLStrREplacerPipe],
    imports: [
        CommonModule
    ],
    exports: [
        SanitizePipe, ActiveVideoAudio, SanitizeStylePipe, DoubleSearchFilterPipe,
        LikesPipe, DislikePipe, FavoritePipe, EmojiPipe, AudiencePipe, LikeCountPipe,
        SanitizeHTMLPipe, ParticipantAudiencePipe, KNumberPipe, ObjectArrayPipe, URLStrREplacerPipe]
})
export class PipeModule {
}
