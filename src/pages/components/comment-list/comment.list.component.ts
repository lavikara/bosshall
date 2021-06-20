import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommentModel} from '../../../model/CommentModel';
import {SpreadComment} from '../../../app/providers/spread/spread.comment';
import {FormGroup} from '@angular/forms';
import {LikeModel} from '../../../model/LikeModel';
import { Subject, Subscription} from 'rxjs';
import {FileBlobModel} from '../../../model/FileBlobModel';

import {ToolsProvider} from '../../../app/providers/tools.provider';
import {ConnectionSocketProvider} from '../../../app/providers/socket/connection.socket.provider';
import {QueueService} from '../../../app/providers/queue.service';
import {EmojiBackgroundFn} from '../../../app/providers/emoji-backgroundFn';

@Component({
    selector: 'app-inc-comment-list-component',
    templateUrl: './comment.list.component.html'
})


export class CommentListIncludeComponent implements OnInit, AfterViewInit {
    constructor(private commentService: SpreadComment,
                private queueService: QueueService,
                public emojiBackgroundFn: EmojiBackgroundFn,
                private socketConnection: ConnectionSocketProvider) {

    }

    get hovered() {
        return this._hovered;
    }

    get id(): number {
        return this._id;
    }

    @Input()
    set id(value: number) {
        this._id = value;
        if (this.reply) {
            return;
        }
        this._commentInstance = this.commentService.listComments(this._id);
        this._commentInstance.set(0);
        this._commentInstance.request().add(r => {
            this.initEmoji();

        });

    }

    get reply(): number {
        return this._reply;
    }

    @Input()
    set reply(value: number) {
        this._reply = value;
    }


    get commentInstance(): any {
        return this._commentInstance;
    }



    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    get replyOpen(): boolean {
        return this._replyOpen;
    }



    get replies(): Array<CommentModel> {
        return this._replies || [];
    }

    @Input()
    set replies(value: Array<CommentModel>) {
        this._replies = value;
    }

    get endCommentPosition(): number {
        if (this.reply) {
            return 1000;
        } else {
            return this._endCommentPosition;
        }
    }

    get comments(): Array<CommentModel> {
        if (this._commentInstance && this._commentInstance.data && !this.reply) {
            return this._commentInstance.data;
        } else if (this.reply) {
            return this.replies;
        }
    }
    @ViewChild('emojiContainer', {static: false})
    emojiContainer: ElementRef;
    @ViewChild('emoji', {static: false})
    emoji: ElementRef;
    private commentForm: FormGroup;
    private sub: Subscription[] = [];
    private _hovered: boolean;

    private _id: number;

    private _reply: number;
    private _commentInstance: any;
    private timeout = null;

    private _replyOpen: any = {} as any;
    private _replies: Array<CommentModel> = [];

    private _endCommentPosition = 5;



    public showHeadShot(value) {

        clearTimeout(this.timeout);
        if (value) {
            this._hovered = value;
        }

        this.timeout = setTimeout(() => {
            this._hovered = value;
            this.timeout = null;
        }, 600);
    }

    ngOnInit() {

    }

    public openReply(commentId: number) {
        this._replyOpen[commentId] = !this._replyOpen[commentId];
    }

    public addEmoji(commentId, emoji) {
        const emojiModel = new LikeModel(emoji.emoji);
        this.commentService.createLike(commentId, emojiModel);
    }

    private initEmoji() {
        setTimeout(() => {
            ToolsProvider.setupEmojiContainer();
        }, 1000);
    }

    addComments(event: any) {
        if (event.reply == 0 && !event.isSpread) {
            this._commentInstance.data.unshift(event);
        } else if (event.reply === this._reply && event.reply !== 0) {
            this._replies.unshift(event);
        }
        this.initEmoji();
    }

    /**
     * On View load
     */
    ngAfterViewInit(): void {
        const commentSubject = new Subject<any>();
        this.socketConnection.setObservable('Spread', commentSubject);

        const commentSubscription = commentSubject.subscribe((r) => {
            if (r.data && r.data.name === 'Create_comment') {
                const event = r.data.content;
                console.log(event);

                if (event.spread == this.id) {
                    let added = false;
                    this._replies.forEach((reply) => {
                        if (reply.id == event.id) {
                            added = true;
                        }
                    });

                    if (!added) {
                        this.addComments(event);
                    }
                }
            } else if ( r.data && r.data.name === 'Like_comment') {
                const event = r.data.content;
                if (event.spread === this.id) {
                    this.comments.map(r => {
                        if (r.id == event.id) {
                            r = LikeModel.addLike(r, event);
                        }
                        return r;
                    });
                }
            }
        });
        this.sub.push(commentSubscription);
    }

    /**
     * request to fetch new pages
     * @param event
     */
    public pageChanged(event) {
        this._endCommentPosition = event;
    }

    /**
     * @param i
     * @param commentId
     */
    public showReply(i: number, commentId: number) {
        if (this._commentInstance.data[i].replies && this._commentInstance.data[i].replies.length) {
            return;
        }
        const replies = this.commentService.listComments(this._id);
        replies.set(commentId);
        const subscription: Subscription = replies.request().add(() => {

            subscription.unsubscribe();
            if (!this._commentInstance.data[i].replies) {
                this._commentInstance.data[i].replies = [];
                this._commentInstance.data[i].replies = replies.data;
            } else {
                this._commentInstance.data[i].replies.concat(replies.data);
            }
        });
    }

    public onKey(event) {
    }
}
