import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SpreadService} from '../../../../../app/providers/spread/spread.service';
import {SpreadModel} from '../../../../../model/SpreadModel';
import {LikeModel} from '../../../../../model/LikeModel';
import {Subject, Subscription} from 'rxjs';
import {ToolsProvider} from '../../../../../app/providers/tools.provider';
import {FileBlobModel} from '../../../../../model/FileBlobModel';
import {ConnectionSocketProvider} from '../../../../../app/providers/socket/connection.socket.provider';
import {SpreadStatusEnum} from '../../../../../app/configuration/Spread.config';
import {AuthProvider} from '../../../../../app/providers/auth.provider';
import {ParticipantEnum} from '../../../../../app/configuration/audience.enum';
import {NotificationProvider} from '../../../../../app/providers/notification.provider';
import {Router} from '@angular/router';
import {EmojiBackgroundFn} from '../../../../../app/providers/emoji-backgroundFn';

@Component({
    selector: 'app-brand-page-component',
    templateUrl: './brandPage.component.html'
})
export class BrandPageComponent implements OnInit, AfterViewInit {
    private index = 0;
    private subscriptions: Subscription[] = [];
    private _reloadSignal: {player: number, reset: number} = {} as any;
    public descriptionToggle = false;
    constructor(private spreadService: SpreadService,
                private authProvider: AuthProvider,
                private notificationProvider: NotificationProvider,
                private router: Router,
                public emojiBackgroundFn: EmojiBackgroundFn,
                private connectionSocket: ConnectionSocketProvider) {
    }


    get player(): SpreadModel {
        if (this.spreadService.spreadHandler.data && this.spreadService.spreadHandler.data.length) {
            return this.spreadService.spreadHandler.data[this.index] || [];
        }
        return {} as any;
    }

    set player(value: SpreadModel) {
        if (this.spreadService.spreadHandler.data && this.spreadService.spreadHandler.data[this.index]) {
            this.spreadService.spreadHandler.data[this.index] = value;
        }
    }
    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        const likeSubject = new Subject<any>();
        this.connectionSocket.setObservable('Spread', likeSubject);
       const likeSub = likeSubject.subscribe((r) => {
            if (r.data && r.data.name === 'Like_spread') {
                const event = r.data.content;
                this.player = LikeModel.addLike(this.player, event);

            }
        });
        this.subscriptions.push(likeSub);


        setTimeout(() => {
            ToolsProvider.setupEmojiContainer();
        }, 10000);
    }

    public flagContent() {
        const subscription: Subscription = this.spreadService.reportAbuse(this.player.id).add(r => {
            this.player.spreadFlag = !this.player.spreadFlag;
            subscription.unsubscribe();
        });
    }


    public addEmoji(commentId, emoji) {
        const emojiModel = new LikeModel(emoji.emoji);

        this.spreadService.createLike(commentId, emojiModel);
/*        const sub = .add(() => {
            sub.unsubscribe();
        });*/
    }

    public mediaChanged(event) {
        for (let i = 0; i < this.spreadService.spreadHandler.data.length; i++) {
            if ( this.spreadService.spreadHandler.data[i].id === event.item.id) {
                this.index = i;
            }
        }
    }


    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    public transferMedia(event) {
        this.spreadService.spreadHandler.data = event;
    }

    public onPause(event) {

    }

    public onPlay(event) {

    }

    public onEnd(event) {

    }


    get spreadStatus() {
        if (this.player.status <= SpreadStatusEnum.BROADCASTING) {
            return 'ACTIVE';
        } else {
            return 'END';
        }
    }


    get reloadSignal(): { player: number; reset: number } {
        return this._reloadSignal;
    }

    set reloadSignal(value: { player: number; reset: number }) {
        this.spreadService.spreadHandler.data = [];
        this._reloadSignal = value;
    }


    get joinStatus() {
        /*else if (this.player.AudienceType && this.player.AudienceType.length && this.player.status === SpreadStatusEnum.BROADCASTING) {
            return 'JOIN SPREAD';
        } else if(this.player.AudienceType && this.player.AudienceType.length && this.player.status === SpreadStatusEnum.ACTIVE) {
           return 'PENDING';
       }*/
       if (this.player.AudienceType === ParticipantEnum.CHIEF_HOST) {
            return 'BROADCAST';
        } else {
            return 'ACCESS BROADCAST';
        }
    }
    public onKey(event) {

    }


    public downloadSpread() {
        const subscription: Subscription = this.spreadService.downloadRecording(this.player.id).add(() => {
            subscription.unsubscribe();
        });
    }

    public join() {
        if (SpreadStatusEnum.BROADCASTING === this.player.status &&
            (this.player.AudienceType === ParticipantEnum.GUEST || this.player.AudienceType === ParticipantEnum.AUDIENCE)) {
            this.notificationProvider.confirmSwal.options = {
                title: 'Join Spread?',
                type: 'question',
                text: 'A spread you subscribed to ' + this.player.name + ' is currently airing. Would you like to join?',
                confirmButtonText: 'Join',
                cancelButtonText: 'No. Thanks',
                showCancelButton: true,
                showConfirmButton: true
            };

            this.notificationProvider.confirmSwal.show();
            const sub = this.notificationProvider.confirmSwal.confirm.subscribe(e => {
                if (e) {
                    this.router.navigate(['/bl/cloud/' + this.player.id]);
                }
            }).add(() => {
                sub.unsubscribe();
                this.notificationProvider.confirmSwal.nativeSwal.close();
            });
            return;
        }
        this.spreadService.requestAccessAutomatic(this.player.id, {}, (this.player.AudienceType === ParticipantEnum.CHIEF_HOST)).add(() => {
            if (this.spreadService.requestReload) {
                this._reloadSignal = {
                    player: this.player.id,
                    reset: Math.random()
                };
            }
        });
    }
}
