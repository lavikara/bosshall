import {Component, Input} from '@angular/core';
import {Message} from '../../../app/providers/cloud/message/message';
import {MessageService} from '../../../app/providers/cloud/message/message.service';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';
import {AuthProvider} from '../../../app/providers/auth.provider';

enum Sizes {
    small, medium, big
}


@Component({
    selector: 'app-replies-component-include',
    templateUrl: './replies.component.html',
    styleUrls: ['./replies.component.scss']
})

export class RepliesIncludeComponent {
    private _size: Sizes = Sizes.big;
    private _message: Message = {} as any;
    public imageSize = '37px';

    public constructor(private messageService: MessageService,
                       private cloudService: CloudService,
                       private authProvider: AuthProvider ) {
    }


    get message(): Message {
        return this._message;
    }


    @Input()
    set message(value: Message) {
        this._message = value;
    }

    public isSmall() {
        if (this._size === Sizes.small) {
            return true;
        }
    }

    public isBig() {
        return this._size === Sizes.big;
    }

    @Input()
    set size(value: Sizes) {
        this._size = value;
    }

    public enableReply() {
        this.messageService.replyId = this._message;
    }

    public toDate(date: string) {
        return new Date(date);
    }

    get canAcceptRequests(): boolean {
        return this.cloudService.myCapabilities.canManageRequest;
    }

    get me(): boolean {
        return this.authProvider.user.id === this.message.from;
    }

    public initCall() {
        if (this._message && this._message.to == 0) {
            this.cloudService.toggleFeed();
        }
        this.cloudService.sendCall(this._message.to);
    }

    get isChiefHost(): boolean {
        return this.cloudService.chiefBroadcaster.id === this.message.from;
    }

    get mainFeed(): boolean {
        return this.cloudService.mainStream &&
            this.cloudService.mainStream.stream != null;
    }

}
