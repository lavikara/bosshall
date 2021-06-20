import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AuthProvider} from '../../../app/providers/auth.provider';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';


@Component({
    selector: 'app-screen-action-include-component',
    templateUrl: './screen-actions.component.html',
    styleUrls: ['./screen-actions.component.scss']
})

export class ScreenActionsIncludeComponent {
    private _mic = false;
    private _videocam = false;
    private _chat = false;
    private _isTalking = 0;

    @Output()
    public screenAction: EventEmitter<{
        mic: boolean,
        videocam: boolean,
        chat: boolean
    }> = new EventEmitter<{mic: boolean, videocam: boolean, chat: boolean}>();

    constructor(protected cloudService: CloudService, private authProvider: AuthProvider) {
    }
    public setAction(type) {
        if (type === 'mic') {
            this._mic = !this._mic;
        } else if (type === 'videocam') {
            this._videocam = !this._videocam;
        } else if (type === 'chat') {
            this._chat = !this._chat;
        }
        this.triggerAction();
    }

    @Input()
    set isTalking(value: number) {
        this._isTalking = value;
    }

    private triggerAction() {
        this.screenAction.emit({
            mic: this._mic,
            videocam: this._videocam,
            chat: this._chat
        });
    }

    get streamInfo() {
        return this.cloudService.getInfoFromStream(this.cloudService.mainStream);
    }

    get mainFeed() {
        return this.cloudService.mainStream;
    }

    isMe() {
        return this.streamInfo.id === this.authProvider.user.id;
    }

}
