import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ngx-store';
import {UserModel} from '../../model/UserModel';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {appConfig} from '../app.config';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthProvider {

    constructor(private localStorageService: LocalStorageService,
                private http: HttpClient, private router: Router) {
    }

    get user(): UserModel {
        return this.localStorageService.get(this._userKey);
    }

    set user(value: UserModel) {
        this.localStorageService.set(this._userKey, value);
    }

    get userId(): number {
        return this.localStorageService.get(this._userIdKey) || 0;
    }

    set userId(value: number) {
        this.localStorageService.set(this._userIdKey, value);
    }

    get token(): string {
        return this.localStorageService.get(this._tokenKey) || '';
    }

    set token(value: string) {
        this.localStorageService.set(this._tokenKey, value);
    }

    get recorded(): boolean {
        return this.localStorageService.get(this._recordedKey);
    }

    set recorded(value: boolean) {
        this.localStorageService.set(this._recordedKey, value);
    }

    public static $onUserReceived: Subject<UserModel> = new Subject<UserModel>();
    private _userKey = 'userKey';

    private _userIdKey = 'userId';
    private _tokenKey = 'tokenKey';

    private _recordedKey = 'recordedKey';

    public requiredMet() {
        this._verified();
        return this.recorded;
    }

    public fetchUser(): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const subscription = this.http.get(appConfig.host + 'profile',
                {headers: new HttpHeaders({authorization: this.token})})
                .subscribe({
                    next: (r: any) => {
                        this.user = r.data;
                        this._verified();
                        resolve(true);
                        AuthProvider.$onUserReceived.next(r.data);
                    },
                    error: (error) => {
                        if (error.error && error.error.statusCode === 403 && this.user && this.user.id) {
                            this.signOut();
                        }
                        reject(false);
                    }
                }).add(() => {
                    subscription.unsubscribe();
                });
        });
    }

    public async verify(): Promise<boolean> {

        if (!this.token || this.token.length < 5) {
            return false;
        }

        return this.fetchUser();
    }

    public validToken() {
        return this.token && this.token.length > 10;
    }

    public signOut() {
        this.localStorageService.clear();
        this.router.navigate(['/']).then(r => {
            window.location.reload(true);
        });
    }

    private _verified() {
        if (this.user.headline &&
            this.user.firstname &&
            this.user.lastname &&
            this.user.interestCount &&
            this.user.interestCount > 0 &&
            this.user.country) {
            this.recorded = true;
        } else {
            this.recorded = false;
        }
    }
}
