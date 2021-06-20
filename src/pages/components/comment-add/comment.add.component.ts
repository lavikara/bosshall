import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {QueueService} from '../../../app/providers/queue.service';
import {SpreadComment} from '../../../app/providers/spread/spread.comment';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthProvider} from '../../../app/providers/auth.provider';
import {UserModel} from '../../../model/UserModel';
import {UserService} from '../../../app/providers/user/user.provider';
import {LikeModel} from "../../../model/LikeModel";
import {EmojiService} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {FileBlobModel} from "../../../model/FileBlobModel";
import {EmojiBackgroundFn} from '../../../app/providers/emoji-backgroundFn';

@Component({
    selector: 'app-inc-comment-add-component',
    templateUrl: './comment.add.component.html'
})

export class CommentAddIncludeComponent implements OnInit {

    @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
    @ViewChild('editor', {static: false}) editor: ElementRef;
    @Output()
    public onKeyPress: EventEmitter<any> = new EventEmitter();
    private oldContent: string;
    private type: string;
    private canSubmit: boolean;

    constructor(private queueProvider: QueueService, private commentService: SpreadComment,
                private userService: UserService,
                public emojiBackgroundFn: EmojiBackgroundFn,
                private emojiService: EmojiService,
                private authProvider: AuthProvider) {
    }

    private _content: string;

    get content(): string {
        return this._content;
    }

    @Input()
    set content(value: string) {
        this._content = value;
    }



    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    private _spreadId: number;

    @Input()
    set spreadId(value: number) {
        this._spreadId = value;
    }

    private _commentId: number;

    @Input()
    set commentId(value: number) {
        this._commentId = value;
    }

    private _uploading: boolean;

    get uploading(): boolean {
        return this._uploading;
    }

    private _hovered: boolean;

    get hovered(): boolean {
        return this._hovered;
    }

    get user(): UserModel {
        return this.authProvider.user;
    }

    ngOnInit() {
        setTimeout(() => {
            this.fileUpload.nativeElement.addEventListener('change', (event) => {
                this.appendFile(event);
            });


            this.editor.nativeElement.addEventListener('keypress', (event) => {
                if (event.key.toLowerCase() === 'enter' && !event.shiftKey) {
                    this.sendComment()
/*                    const subscription = this.commentService.createComment(this._spreadId).add(r => {
                        subscription.unsubscribe();
                    });*/
                }
            });
        });


        window.getSelection().removeAllRanges();

    }

    public sendComment() {
        this.commentService.commentForm = new FormGroup({
            comment: new FormControl(this.editor.nativeElement.innerHTML),
            reply: new FormControl(this._commentId)
        });
        this.editor.nativeElement.innerHTML = '';
        this.commentService.createComment(this._spreadId);
    }


    public addEmoji(event) {

        const emojiModel = new LikeModel(event.emoji);
        const styles = this.emojiService.emojiSpriteStyles(event.emoji.sheet, 'apple'); // pass emoji sheet
        const el = document.createElement('div');
        Object.assign(el.style, styles); // apply styles to new element
        this.editor.nativeElement.appendChild(el);
    }

    public openFile(type) {
        this.type = type;
        this.fileUpload.nativeElement.accept = type + '/*';
        this.fileUpload.nativeElement.click();
    }

    private uploadAppend(blob: Blob, complete: (path) => void) {
        this._uploading = true;
        this.userService.uploadProfilePicture(blob).then(r => {
            if (r.data && r.data.path) {
                complete(r.data.path);
                this._uploading = false;
            }
        });
    }

    private appendFile(event) {
        if (event && event.target.files) {
            for (const i in event.target.files) {
                try {
                    if (this.type === 'image') {
                        this.uploadAppend(event.target.files[i], (path) => {
                            this.editor.nativeElement.innerHTML += '<img src="' + path + '"/>';
                        });

                    } else if (this.type === 'audio') {
                        this.uploadAppend(event.target.files[i], (path) => {
                            this.editor.nativeElement.innerHTML += '<audio src="' + path + '" controls></audio>';
                        });
                    }
                } catch (e) {

                }
            }
        }
    }
}
