import { Injectable, NgZone} from '@angular/core';
import {Subject} from 'rxjs';
import {Message} from './message';
import {LocalStorageService} from 'ngx-store';
import {ConnectionSocketProvider} from '../../socket/connection.socket.provider';
import {ApiProvider} from '../../api.service';
import {AuthProvider} from '../../auth.provider';
import {Participants} from '../../../../model/Participants';
import {CloudCapabilities} from '../stream.service';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private _spreadMessage: Message[] = [];
    private userMessage: Message[] = [];
    private selectedUser = 0;
    private spreadId = 0;
    private selectedName: string;
    public replyId = {} as Message;

    /**
     * @param localStorageService
     * @param apiProvider
     * @param ngZone
     * @param socketConnection
     * @param authProvider
     */
    constructor(
        private localStorageService: LocalStorageService,
        private apiProvider: ApiProvider,
        private ngZone: NgZone,
        private socketConnection: ConnectionSocketProvider,
        private authProvider: AuthProvider) {
    }

    private scrollDown() {
        const terminal = document.querySelector('.message-container-lists');
        if (terminal) {
            terminal.scrollTo(0, terminal.scrollHeight);

        }
    }

    /**
     * @param spreadId
     * @param capabilities
     */
    public handleMessageReceived(spreadId: number, capabilities: CloudCapabilities) {
        this.spreadId = spreadId;
        const spreadSubject = new Subject<any>();
        spreadSubject.subscribe((res) => {
            if (!res.data || !res.data.content) {
                return;
            }
            const event = res.data.content;
            switch (res.data.name) {
                case 'Message':
                    this.messageReceived(event);
                    break;
            }
            this.reloadMessages(spreadId, capabilities);
            this.scrollDown();
        });

        this.socketConnection.setObservable('Spread', spreadSubject);

    }

    /**
     * @param spreadId
     * @param capabilities
     */
    private reloadMessages(spreadId: number, capabilities: CloudCapabilities) {
        if (this.selectedUser && this.selectedUser > 0) {
            this.userMessage = Message.getUserMessages(
                this.socketConnection,
                this.localStorageService,
                this.apiProvider,
                this.authProvider,
                spreadId,
                this.selectedUser,
                capabilities);
        } else {
            this._spreadMessage = Message.getSpreadMessages(
                this.socketConnection,
                this.localStorageService,
                this.apiProvider,
                this.authProvider,
                spreadId,
                capabilities);
        }
    }

    public newMessage(to: number, text: string, type: 'Message' | 'Request' | 'call', capabilities: CloudCapabilities): Message {
        setTimeout(() => {
            this.replyId = {} as Message;
        }, 1000);
        const msg = new Message(
            this.socketConnection,
            this.localStorageService,
            this.apiProvider,
            this.authProvider,
            0,
            to,
            text,
            (new Date()).toDateString(),
            this.spreadId,
            type,
            this.replyId && this.replyId.id ? this.replyId.id : 0
        );
        return msg.setCapability(capabilities);
    }
    /**
     * @param user
     * @param capabilities
     */
    public setCurrentUser(user: Participants|number, capabilities: CloudCapabilities) {
        if (typeof user === 'object') {
            this.selectedUser = user.id;
            this.selectedName = user.firstname;
        } else {
            this.selectedUser = user;
        }
        this.reloadMessages(this.spreadId, capabilities);
        setTimeout(() => {
            this.scrollDown();
        }, 1000);
    }

    /**
     * @param event
     */
    public messageReceived(event) {
        Message.setMessage(this.localStorageService, event);
    }

    /**
     * @return Message[]
     */
    get spreadMessage(): Message[] {
        return this._spreadMessage;
    }

    /**
     * @return Message[]
     */
    get userMessages(): Message[] {
        return this.userMessage;
    }

    /**
     * @return number
     */
    get currentUser(): number {
        return this.selectedUser;
    }

    get chatName(): string {
        return this.selectedName;
    }
}
