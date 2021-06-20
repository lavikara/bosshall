import {Injectable, ViewChild} from '@angular/core';
import {PaginationModel} from '../../model/PaginationModel';
import {ApiProvider} from './api.service';
import {SwalComponent} from '@toverux/ngx-sweetalert2';

@Injectable({
    providedIn: 'root'
})


export class NotificationProvider {
    @ViewChild('confirmSwal', {static: false}) public confirmSwal: SwalComponent;
    @ViewChild('inputSwal', {static: false}) public inputSwal: SwalComponent;

    constructor(private apiProvider: ApiProvider) {

    }


    public listNotification(justOne: boolean, page: number) {
        const pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page ? page : 1;
        const notification = {
            data: [],
            pagination: pageModel,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = 'notification';
                return this.apiProvider.getUrl({}).subscribe({
                    next: (r) => {
                        if (justOne) {
                            notification.data = r.data;
                        } else {
                            notification.data = notification.data.concat(r.data);
                        }
                    },
                    error: (e) => {

                    }
                });
            }
        };
        return notification;
    }


    public readNotification(ids) {
        this.apiProvider.requestType = 'put';
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = 'notification';
        return this.apiProvider.getUrl({notification: ids}).subscribe({
            next: (r: ApiProvider) => {

            },
            error: (e) => {

            }
        });
    }


}
