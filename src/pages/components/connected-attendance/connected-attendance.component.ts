import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {QueueService} from '../../../app/providers/queue.service';
import {UserModel} from '../../../model/UserModel';
import {AuthProvider} from '../../../app/providers/auth.provider';
import {FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SpreadComment} from '../../../app/providers/spread/spread.comment';
import {LikeModel} from '../../../model/LikeModel';
import {SpreadService} from '../../../app/providers/spread/spread.service';
import {SpreadModel} from '../../../model/SpreadModel';
import {FileBlobModel} from "../../../model/FileBlobModel";
import {EmojiBackgroundFn} from '../../../app/providers/emoji-backgroundFn';

@Component({
    templateUrl: './connected-attendance.component.html',
    selector: 'app-include-connected-attendance-component'
})

export class ConnectedAttendanceIncludeComponent implements AfterViewInit, OnDestroy {
    public commentInput: FormControl = new FormControl('');
    @ViewChild('clientShareEl', {static: false})
    clientShareEl: ElementRef;
    private _spread: SpreadModel = {} as any;
    @Output()
    public onConnect: EventEmitter<any> = new EventEmitter<number>();
    @Output()
    public onShare: EventEmitter<number> = new EventEmitter<number>();
    @Output()
    public onComment: EventEmitter<string> = new EventEmitter<string>();
   private _isTalking: boolean;
   private anonymityToggle: boolean;
   @Output()
   public onBan: EventEmitter<number> = new EventEmitter<number>();

   private _isAdmin: boolean = false;
   @Output()
   public onDisconnect: EventEmitter<number> = new EventEmitter<number>();
   @Output()
   public onAnonymity: EventEmitter<{user: number, name: string, status: boolean}> = new EventEmitter<{user: number, name: string, status: boolean}>();

    @Output()
    public onAudienceRequest: EventEmitter<number> = new EventEmitter<number>();
    private subscription: Array<Subscription> = [];
    private _user: UserModel = {} as any;
    private _connected: boolean;
    private _anonymous: boolean = false;
    private _hovered: boolean;

    constructor(
        private queueService: QueueService,
        private spreadService: SpreadService,
        public emojiBackgroundFn: EmojiBackgroundFn,
        private spreadComment: SpreadComment,
        private authProvider: AuthProvider) {
    }


    get isTalking(): boolean {
        return this._isTalking;
    }

    @Input()
    set isTalking(value: boolean) {
        this._isTalking = value;
    }

    get hovered(): boolean {
        return this._hovered;
    }

    public addEmoji(commentId, emoji) {
        const emojiModel = new LikeModel(emoji.emoji);
       this.spreadService.createLike(this._spread.id, emojiModel)
    }



    get connected(): boolean {
        return this._connected;
    }

    @Input()
    set connected(value: boolean) {
        this._connected = value;
    }


    get user(): UserModel {
        return this._user;
    }

    @Input()
    set user(value: UserModel) {
        this._user = value;
    }

    get isMe(): boolean {
        return (this._user.id === this.authProvider.user.id);
    }

    @Input()
    set isAdmin(isAdmin: boolean) {
        this._isAdmin = isAdmin;
    }

    get isAdmin(): boolean {
        return this._isAdmin;
    }

    public request(type: string, one: boolean) {
        if (type === 'FILE') {
            if (one) {
                this.onShare.emit(this._user.id);
            } else {
                this.onShare.emit(0);
            }
        }else if(type === 'AUDIENCE') {
            if(one) {
                this.onAudienceRequest.emit(this._user.id);
            }else {
                this.onAudienceRequest.emit(0);
            }
        }else if(type === 'BAN') {
            const subscription: Subscription = this.spreadService.requestBan({user: this._user.id, spread: this._spread.id}).add(() => {
                subscription.unsubscribe()
                this.onBan.emit(this._user.id);
            })
        }


    }


    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    public toggleAnonymous(){
        this.anonymityToggle = !this.anonymityToggle;
        this.onAnonymity.emit({
            user: this.authProvider.user.id,
            name: (this.authProvider.user.firstname+' '+this.authProvider.user.lastname),
            status: this.anonymityToggle
        });
    }


    @Input()
    set anonymous(value: boolean) {
        this._anonymous = value;
    }

    get anonymous(): boolean {
        return this._user.anonymity || this._anonymous;
    }

    public disconnectOne() {
        this.onDisconnect.emit(this._user.id);
    }


    ngAfterViewInit(): void {
        /* todo
/*        this.pusherService.spreadChannel.bind('anonymity', (event) => {
            if(event.spread == this._spread.id && event.user === this._user.id) {
                this._anonymous = event._anonymous;
            }
        })*/
    }

    public connect() {
        this.onConnect.emit('');
    }

    public addComment() {
        if (this.commentInput.value.length) {
            this.onComment.emit(this.commentInput.value);
            setTimeout(() => {
                this.commentInput.reset();
            }, 1000);
        }

    }

    public showHeadShot(value) {
        if (value) {
            this._hovered = value;
        }
        this.queueService.delay(() => {
            this._hovered = value;
        }, 1200);
    }

    public follow(userId: number) {

    }


    ngOnDestroy(): void {
        // unsubscribe all subscription
        this.subscription.map(r => r.unsubscribe());
    }

    get spread(): SpreadModel {
        return this._spread;
    }

    @Input()
    set spread(value: SpreadModel) {
        this._spread = value;
    }
}
