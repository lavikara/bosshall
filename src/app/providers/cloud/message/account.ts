import {Message} from './message';
import {LocalStorageService} from 'ngx-store';

export abstract class Account {
    private _userId: number;
    private _screenName: string;
    private _screenPicture: string;
    protected abstract localStorageService: LocalStorageService;


    private storeKey = '_messageAccounts';

    public abstract queryUserId(id): Promise<{id: number, name: string, picture: string}>;

    public getChatUser(message: Message) {
        const chatAccounts = this.localStorageService.get(this.storeKey) || {};

        if (!chatAccounts[message.from]) {
            this.queryUserId(message.from).then( r => {
                if (r && r.id > 0) {
                    this._userId = r.id;
                    this._screenName = r. name;
                    this._screenPicture = r.picture;
                    chatAccounts[message.from] = {
                        userId: r.id,
                        screenName: r.name,
                        screenPicture: r.picture
                    };
                    this.updateAccounts(chatAccounts);
                }

            });
        } else {
            this._userId = chatAccounts[message.from].userId;
            this._screenName = chatAccounts[message.from].screenName;
            this._screenPicture = chatAccounts[message.from].screenPicture;
        }
    }

    private updateAccounts(chatAccounts: Account[]) {
        this.localStorageService.set(this.storeKey, chatAccounts);
    }


    get userId(): number {
        return this._userId;
    }

    get screenName(): string {
        return this._screenName;
    }

    get screenPicture(): string {
        return this._screenPicture;
    }
}
