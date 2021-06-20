import {Injectable} from '@angular/core';
import {ApiProvider} from '../api.service';
import {ApiModel} from '../../../model/ApiModel';
import {NotificationService} from '../user/notification.service';
import {FormGroup} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})


export class SpreadRequestProvider {
    private _spreadForm: FormGroup;
    constructor(private apiProvider: ApiProvider,
                private notificationService: NotificationService) {

    }

    createRequest(spreadId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'put';
        this.apiProvider.url = 'spread/' + spreadId + '/request';

        return this.apiProvider.getUrl(this._spreadForm.value).subscribe({
            next: (r: ApiModel) => {
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (e: any) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }


    public acceptRequest(spreadId: number) {
        this.apiProvider.requestType = 'get';
        this.apiProvider.url = '/spread/request/' + spreadId + '/accept';

        this.apiProvider.shouldAuthenticate = true;
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (e: any) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }


    get spreadForm(): FormGroup {
        return this._spreadForm;
    }

    set spreadForm(value: FormGroup) {
        this._spreadForm = value;
    }
}
