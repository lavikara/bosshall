import {Injectable} from '@angular/core';
import {ApiProvider} from '../api.service';
import {ApiModel} from '../../../model/ApiModel';
import {KeyNameModel} from '../../../model/KeyNameModel';
import {AuthProvider} from '../auth.provider';
import {NotificationService} from './notification.service';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {UserModel} from '../../../model/UserModel';
import {map} from 'rxjs/operators';
import {PaginationModel} from '../../../model/PaginationModel';

@Injectable({
    providedIn: 'root'
})


export class UserService {

    constructor(private apiProvider: ApiProvider,
                private authProvider: AuthProvider,
                private notificationService: NotificationService) {

    }

    private _userInterests: Array<KeyNameModel> = [];

    get userInterests(): Array<KeyNameModel> {
        return this._userInterests;
    }

    private _userForm: FormGroup;

    set userForm(value: FormGroup) {
        this._userForm = value;
    }

    public getMyInterest() {
        this.apiProvider.url = 'profile/interest';
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'get';
        return this._entry((r) => {
            this._userInterests = r.data;

        });

    }

    public uploadProfilePicture(file: Blob): Promise<ApiModel> {
        this.apiProvider.requestType = 'post';
        this.apiProvider.url = 'static/file';
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.appendHeader('Content-Type', undefined);
        const formData = new FormData();
        formData.append('file', file);
        return new Promise((resolve, reject) => {
            const subscription = this.apiProvider.getUrl(formData).subscribe({
                next: (r: ApiModel) => {
                    resolve(r);
                },
                error: (error: any) => {
                    this.notificationService.message(error.statusText, 'Retry', () => {
                        this.uploadProfilePicture(file).then(r => {
                            resolve(r);
                            // tslint:disable-next-line:no-shadowed-variable
                        }).catch((error: any) => {
                            reject(error);
                        });
                    }, 0);
                }
            }).add(() => {
                subscription.unsubscribe();
            });

        });
    }

    public updateProfile(showNotif: boolean = true) {
        this.apiProvider.url = 'profile';
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'put';
        return new Promise((resolve, reject) => {
            this._entry((r) => {
                if (showNotif) {
                    this.notificationService.notifierMessage('success', r.statusText);
                }
                // tslint:disable-next-line:no-shadowed-variable
                this.authProvider.fetchUser().then((r) => {
                    resolve(r);
                }).catch((e) => {
                    this.notificationService.notifierMessage('error', e.statusText);
                    reject(e);
                });
            }, this._userForm.value).catch((error: any) => {
                this.notificationService.notifierMessage('error', error.statusText);
                reject(error);
            });
        });
    }

    public searchUser(searchQuery: string): Observable<UserModel[]> {
        this.apiProvider.url = 'profile/search?search=' + searchQuery;
        this.apiProvider.requestType = 'get';
        this.apiProvider.shouldAuthenticate = true;
        return this.apiProvider.getUrl({}).pipe(map(r => r.data));
    }

    public interestsBrand(justOne: boolean, page: number) {
        const pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page ? page : 1;
        const interests = {
            pagination: pageModel,
            data: [],
            request: (interest) => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.url = 'interests/' + interest + '/brand';
                this.apiProvider.requestType = 'get';
                return this.apiProvider.getUrl({}).subscribe({
                    next: (r) => {
                        if (justOne) {
                            interests.data = r.data.map(d => d.Brand);
                        } else {
                            interests.data = interests.data.concat(r.data.map(d => d.Brand));
                        }
                    },
                    error: (e) => {

                    }
                });
            }
        };
        return interests;
    }

    private _entry(done: (res: ApiModel) => any, body?: any) {
        return new Promise((resolve, reject) => {
            this.apiProvider.getUrl(body).subscribe({
                next: (r: ApiModel) => {
                    if (done) {
                        done(r);

                        resolve(r);
                    }
                },
                error: (error: any) => {

                    reject(error);
                }
            });
        });

    }
}
