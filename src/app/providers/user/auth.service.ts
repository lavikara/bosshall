import { Injectable } from '@angular/core';
import { ApiProvider } from '../api.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { ApiModel } from '../../../model/ApiModel';
import { Subject, Subscription } from 'rxjs/index';
import { AuthProvider } from '../auth.provider';
import { StartupService } from '../startup.service';
import { ConnectionSocketProvider } from '../socket/connection.socket.provider';
import { AuthSignInFormType } from 'src/pages/components/login/login.component';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private api: ApiProvider,
        private router: Router,
        private notificationService: NotificationService,
        private startupProvider: StartupService,
        private connectionSocketProvider: ConnectionSocketProvider,
        private authProvider: AuthProvider) {
        this.handleSystemMessage();
    }

    set formGroup(value: FormGroup) {
        this._formGroup = value;
    }

    private _formGroup: FormGroup;

    private handleSystemMessage() {
        const systemSubject = new Subject<any>();
        systemSubject.subscribe((res) => {
            if (!res.data || !res.data.name) {
                return;
            }
            this.notificationService.notifierMessage(res.data.name, res.data.content);
        });
        this.connectionSocketProvider.setObservable('System', systemSubject);
    }

    public login(type?: AuthSignInFormType) {
        this.api.shouldAuthenticate = false;
        this.api.requestType = 'post';
        this.api.url = type == AuthSignInFormType.SocialMedia ? 'auth/login/social-media' : 'auth/login';

        return this._entry((r) => {
            this.authProvider.token = r.data.token;
            this.authProvider.user = r.data.user;
            this.authProvider.recorded = r.data.profileUpdated;
            setTimeout(() => {
                // tslint:disable-next-line:no-shadowed-variable
                this.router.navigate(['/bl/brand']).then(r => {
                    this.startupProvider.afterAuthentication();
                });
            }, 1000);
        });
    }

    public register(type?: AuthSignInFormType): Promise<any> {
        if (!this._formGroup) {
            return;
        }
        this.api.shouldAuthenticate = false;
        this.api.requestType = 'post';
        this.api.url = type == AuthSignInFormType.SocialMedia ? 'auth/register/social-media'
            : 'auth/register';

        return this._entry(() => {
            this.router.navigate(['/rConfirmation']);
        });
    }

    public registerValidate() {
        if (!this._formGroup) {
            return;
        }
        this.api.shouldAuthenticate = false;
        this.api.requestType = 'post';
        this.api.url = 'auth/register/validate';
        return this._entry(() => {

        });
    }


    public resetPassword() {
        this.api.shouldAuthenticate = false;
        this.api.requestType = 'post';
        this.api.url = 'auth/validate';
        return this._entry(() => {
            this.router.navigate(['/fConfirmation']);
        });
    }


    public changePassword() {
        this.api.shouldAuthenticate = false;
        this.api.requestType = 'post';
        this.api.url = 'auth/password';
        return this._entry(() => {
            this.router.navigate(['/login']);
        });
    }

    private _entry(complete: (value?: any) => any) {
        return new Promise((resolve, reject) => {
            const subscription: Subscription = this.api.getUrl(this._formGroup.value).subscribe({
                next: (r: ApiModel) => {
                    this.notificationService.notifierMessage('success', r.statusText);

                    resolve(r);
                    if (complete) {
                        complete(r);
                    }
                },
                error: (error) => {
                    this.notificationService.notifierMessage('error', error.statusText);
                    reject(error);
                }
            }).add(r => {
                subscription.unsubscribe();
            });
        });
    }
}
