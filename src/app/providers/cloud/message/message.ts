import {LocalStorageService} from 'ngx-store';
import {ConnectionSocketProvider} from '../../socket/connection.socket.provider';
import {Account} from './account';
import {ApiProvider} from '../../api.service';
import {AuthProvider} from '../../auth.provider';
import {CloudCapabilities} from '../stream.service';

/**
 * Message Class
 */
export class Message extends Account {

    /**
     * @param socketServer
     * @param localStorageService
     * @param apiProvider
     * @param authProvider
     * @param id
     * @param to
     * @param text
     * @param date
     * @param spread
     * @param type
     * @param reply
     */
    constructor(
        socketServer: ConnectionSocketProvider,
        localStorageService: LocalStorageService,
        apiProvider: ApiProvider,
        private authProvider: AuthProvider,
        id: number,
        to: number,
        text: string,
        date: string,
        spread: number,
        type: 'Message'|'Request' | 'call',
        reply: number) {
        super();
        this.to = to;
        this.from = authProvider.user.id;
        this.id = id;
        this.text = text;
        this.spread = spread;
        this.date = date;
        this.type = type;
        this.reply = reply;
        this.socketConnection = socketServer;
        this.localStorageService = localStorageService;
        this.apiProvider = apiProvider;
    }

    /**
     * Get all replies for this message
     */
    get replies(): Message[] {
        return this._replies;
    }

    private static messageKey = '_spread_messages';
    public id: number;
    public to: number;
    public from: number;
    public text: string;
    public date: string;
    public spread: number;
    public type: 'Message'|'Request' | 'call' = 'Message';
    public accepted = false;
    public reply: number;
    private _replies: Message[] = [];
    private socketConnection: ConnectionSocketProvider;
    protected localStorageService: LocalStorageService;
    protected apiProvider: ApiProvider;
    private static preventDuplicate = {} as any;
    private myCapabilities: CloudCapabilities = {} as any;

    public setCapability(capabilities: CloudCapabilities) {
        this.myCapabilities = capabilities;
        return this;
    }


    /**
     * @param localStorageService
     */
    private static getAllMessages(localStorageService: LocalStorageService): Message[] {
        return localStorageService.get(Message.messageKey) || [];
    }

    /**
     * @param socketConnection
     * @param localStorageService
     * @param apiProvider
     * @param authProvider
     * @param spread
     * @param capabilities
     */
    public static getSpreadMessages(
        socketConnection: ConnectionSocketProvider,
        localStorageService: LocalStorageService,
        apiProvider: ApiProvider,
        authProvider: AuthProvider,
        spread,
        capabilities: CloudCapabilities): Message[] {

        const messages = Message.getAllMessages(localStorageService) || [];

        const msgs = [];
        if (!messages || !messages.length) {
            return [];
        }

        Message.preventDuplicate = [];
        messages.forEach((message) => {
            if (message.to === 0 && message.spread === spread && !message.reply) {
                const msg =
                    Message.addMessage(
                    socketConnection,
                    localStorageService,
                    apiProvider,
                    authProvider,
                    message,
                    messages,
                    spread
                );
                if (msg) {
                    msg.setCapability(capabilities);
                    msgs.push(msg);
                }
            }
        });

        return msgs;
    }



    private static addMessage(socketConnection: ConnectionSocketProvider,
    localStorageService: LocalStorageService,
    apiProvider: ApiProvider,
    authProvider: AuthProvider,
    message, collection, spread) {
        if (!(Message.preventDuplicate && Message.preventDuplicate[message.id])) {
            const msg = (new Message(
                socketConnection,
                localStorageService,
                apiProvider,
                authProvider,
                message.id,
                message.to,
                message.text,
                message.date,
                message.spread,
                message.type,
                message.reply
            ));
            msg.accepted = message.accepted;
            msg.from = message.from;
            msg.getChatUser(message);
            msg.loadReplies(collection, message);
            Message.preventDuplicate[message.id] = true;
            return msg;
        }

    }

    /**
     * Ability to manage request
     */
    get canAccept(): boolean {
        return this.myCapabilities.canManageRequest;
    }

    /**
     * @param socketConnection
     * @param localStorageService
     * @param apiProvider
     * @param authProvider
     * @param spread
     * @param userId
     * @param capabilities
     */
    public static getUserMessages(
        socketConnection: ConnectionSocketProvider,
        localStorageService: LocalStorageService,
        apiProvider: ApiProvider,
        authProvider: AuthProvider,
        spread: number,
        userId: number,
        capabilities: CloudCapabilities) {
        const messages = Message.getAllMessages(localStorageService);
        const msgs = [];
        if (!messages || !messages.length) {
            return [];
        }

        Message.preventDuplicate = [];
        messages.forEach((message) => {
            if (message.spread === spread && (message.to === userId || message.from === userId) && !message.reply) {

                const msg = Message.addMessage(
                    socketConnection,
                    localStorageService,
                    apiProvider,
                    authProvider,
                    message,
                    messages,
                    spread
                );
                if (msg && msg.text) {
                    msg.setCapability(capabilities);
                }

                if (msg) {
                    msgs.push(
                        msg
                    );
                }

            }
        });
        Message.sortMessages(msgs);

        return msgs;
    }

    /**
     * @param messages
     */
    private static sortMessages(messages: Message[]) {
        messages.sort((a, b) => {
            return ((new Date(a.date)) > (new Date(b.date))) ? 1 : 0;
        });
    }

    /**
     * @param localStorageService
     * @param message
     */
    public static setMessage (
        localStorageService: LocalStorageService,
        message: Message
    ) {
        let updated = false;
        const messages = Message.getAllMessages(localStorageService);
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].id === message.id) {
                messages[i] = message;
                updated = true;
            }
        }
        if (!updated) {
            messages.push(message);
        }
        localStorageService.set(Message.messageKey, messages);
        return this;
    }

    /**
     * @param messages
     * @param msg
     */
    private loadReplies(messages: Message[], msg: Message) {
        this._replies = [];
        const addedReplies = {};
        messages.forEach((message) => {
            if (message.reply == msg.id) {
                if (!addedReplies[message.id]) {
                    const nReply = new Message(
                        this.socketConnection,
                        this.localStorageService,
                        this.apiProvider,
                        this.authProvider,
                        message.id,
                        message.to,
                        message.text,
                        message.date,
                        message.spread,
                        message.type,
                        message.reply
                    );
                    nReply.getChatUser(msg);
                    this._replies.push(nReply);
                    addedReplies[message.id] = true;
                }
            }
        });
        return this._replies;
    }

    /**
     * Send this to socket message
     */
    public send() {
        this.socketConnection.send('Spread', 'Spread_message', {
            to: this.to,
            text: this.text,
            spread: this.spread,
            type: this.type,
            accepted: this.accepted,
            reply: this.reply
        });
    }


    /**
     * Accept a request
     */
    public accept() {
        if (this.type === 'Message') {
            return;
        }
        this.socketConnection.send('Spread', 'Message_response', {
            id: this.id,
            type: this.type,
            spread: this.spread,
            accepted: true
        });
    }

    /**
     * Decline a request
     */
    public decline() {
        if (this.type === 'Message') {
            return;
        }
        this.socketConnection.send('Spread', 'Message_response', {
            id: this.id,
            type: this.type,
            spread: this.spread,
            accepted: false
        });
    }

    /**
     * Query an API for the user information
     * @param id
     */
    async queryUserId(id): Promise<{ id: number; name: string; picture: string }> {
        if (id && id > 0) {
            return new Promise((resolve, reject) => {
                this.apiProvider.url = '/profile/chat/' + id;
                this.apiProvider.requestType = 'get';
                this.apiProvider.getUrl({}).subscribe(r => {
                    if ( r.data && r.data.id) {
                        resolve(r.data);
                    }
                }, error => {
                    reject(error);
                });
            });
        }

    }
}
