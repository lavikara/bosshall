import {Injectable, NgZone} from '@angular/core';
import {ApiProvider} from '../api.service';
import {PaginationModel} from '../../../model/PaginationModel';
import {FormGroup} from '@angular/forms';
import {ApiModel} from '../../../model/ApiModel';
import {NotificationService} from '../user/notification.service';
import {BrandService} from '../brand/brand.service';
import {LikeModel} from '../../../model/LikeModel';
import {Router} from '@angular/router';
import {NotificationProvider} from '../notification.provider';
import {Subject, Subscription} from 'rxjs';
import {ConnectionSocketProvider} from '../socket/connection.socket.provider';
import {RequestInterface} from '../RequestInterface';

@Injectable({
    providedIn: 'root'
})


export class SpreadService {
    public spreadHandler: RequestInterface;
    private _requestReload = false;
    public $onSpreadReady: Subject<any[]> = new Subject();

    constructor(private apiProvider: ApiProvider,
                private ngZone: NgZone,
                private router: Router,
                private socketConnection: ConnectionSocketProvider,
                private notificationProvider: NotificationProvider,
                private notificationService: NotificationService,
                private brandService: BrandService) {

    }

    private _spreadForm: FormGroup;

    set spreadForm(value: FormGroup) {
        this._spreadForm = value;
    }

    /**
     * enable listeners
     */
    public listeners() {
        this.spreadHandler = this.getAllBroadcastBrand(true, 1, '');
        this.brandService.$myBrandReady.subscribe(r => {
            if (r && r.length) {
                this.spreadHandler.select(r);
                const spreadSubscription = this.spreadHandler.request();
                spreadSubscription.add(() => {
                    spreadSubscription.unsubscribe();
                    this.$onSpreadReady.next(this.spreadHandler.data);
                });
            }
        });
    }

    public createBroadcast() {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = 'spread';
        this.apiProvider.requestType = 'post';
        return this.apiProvider.getUrl(this._spreadForm.value).subscribe({
            next: (r: ApiModel) => {
                this.notificationService.notifierMessage('success', r.statusText);
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            },
            error: (error: any) => {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }



    public updateSpread(spreadId) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'put';
        this.apiProvider.url = 'spread/' + spreadId;
        return this.apiProvider.getUrl(this._spreadForm.value).subscribe({
            next: (r: ApiModel) => {
                this.notificationProvider.confirmSwal.options = {
                    title: 'Updated',
                    text: r.statusText,
                    confirmButtonText: 'Continue',
                    type: 'success'
                };
                this.notificationProvider.confirmSwal.show();
            },
            error: (e: any) => {

                this.notificationProvider.confirmSwal.options = {
                    title: 'Update error',
                    text: e.statusText,
                    confirmButtonText: 'Close',
                    type: 'error'
                };
                this.notificationProvider.confirmSwal.show();

            }
        });
    }

    public spreadComment(spreadId: number) {
        const pageModel: PaginationModel = new PaginationModel();
        pageModel.next = 1;
        return {
            pagination: pageModel,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = 'spread/' + spreadId + '/comment';
                this.apiProvider.getUrl({}).subscribe(r => {

                });
            }

        };
    }


    public userTalking(data: {spread: number, talking: boolean}) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = 'spread/' + data.spread + '/request/talking';
        this.apiProvider.requestType = 'post';
        return this.apiProvider.getUrl(data).subscribe({
            next: (r: ApiModel) => {

            },
            error: (e) => {

            }
        });
    }

    public requestAccessAutomatic(spreadId: number, user?: any, owner?: boolean, preventNavigation?: boolean ) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = 'spread/' + spreadId + '/invitation';
        this.apiProvider.requestType = 'put';
        return this.apiProvider.getUrl(user).subscribe({
            next: (r: ApiModel) => {

                if ((user && Object.keys(user) && Object.keys(user).length) || !owner) {
                    // this.notificationService.notifierMessage('success', r.statusText);
                    if (!preventNavigation) {
                        this.router.navigate(['/bl/cloud/' + spreadId]);
                    }

                    this._requestReload = false;
                } else {
                    this._requestReload = false;
                    if (!preventNavigation) {
                        this.router.navigate(['/bl/cloud/' + spreadId]);
                    }
                }
            },
            error: (e) => {
                this._requestReload = false;
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }

    public endBroadcast(spreadId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/spread/' + spreadId + '/publish/end';
        this.apiProvider.requestType = 'get';
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                this.notificationService.notifierMessage('success', r.statusText);

            },
            error: (e) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }


    public startRecording( spreadId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/spread/' + spreadId + '/recording/start';
        this.apiProvider.requestType = 'get';
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (e) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }

    public stopRecording( spreadId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/spread/' + spreadId + '/recording/stop';
        this.apiProvider.requestType = 'get';
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (e) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }


    public downloadRecording(spreadId: number)  {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/spread/' + spreadId + '/recording/download';
        this.apiProvider.requestType = 'get';
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                if (r && r.data && r.data.url) {
                    window.open(r.data.url, '_blank');
                }
            },
            error: (e) => {

            }
        });
    }


    public fetchSpreadInvitations(spreadId: number, page?: number) {
        const pageModel = new PaginationModel();
        const spreadInvitations = {
            pagination: pageModel,
            data: [],
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.url = 'spread/' + spreadId + '/invitation?page=' + (pageModel.next || 1);
                this.apiProvider.requestType = 'get';
                return this.apiProvider.getUrl({}).subscribe({
                    next: (r: ApiModel) => {
                        // tslint:disable-next-line:triple-equals
                        if (page == 1) {
                            spreadInvitations.data = r.data;
                        } else {
                            spreadInvitations.data.concat(r.data);
                        }
                    },
                    error: (e) => {

                    }
                });
            }
        };

        return spreadInvitations;

    }

    public createLike(spreadId: number, emojiModel: LikeModel) {

/*        this.apiProvider.url = 'spread/' + spreadId + '/like';
        this.apiProvider.requestType = 'put';
        this.apiProvider.shouldAuthenticate = true;
        return this.apiProvider.getUrl(emojiModel).subscribe({
            next: (a: ApiModel) => {

            },
            error: (e: any) => {

            }
        });*/

        const options: any = emojiModel;
        options.id = spreadId;
        this.socketConnection.send('Spread', 'Like_spread', options);
    }

    public startStream(spreadId, sessionId, to = 0) {
        this.socketConnection.send('Spread', 'Stream_ready', {
            to, spreadId
        });
    }




    get requestReload(): boolean {
        return this._requestReload;
    }

    public fetchSpread(spreadId: number) {
        this.apiProvider.url = 'spread/' + spreadId;
        this.apiProvider.requestType = 'get';
        this.apiProvider.shouldAuthenticate = true;
        return this.apiProvider.getUrl({});
    }

    public reportAbuse(spreadId: number) {
        this.apiProvider.url = 'spread/' + spreadId + '/abuse';
        this.apiProvider.requestType = 'get';
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


    public requestAnonymous(anonymousBody: any) {
        this.apiProvider.url = 'spread/anonymous';
        this.apiProvider.requestType = 'post';
        this.apiProvider.shouldAuthenticate = true;
        return this.apiProvider.getUrl(anonymousBody).subscribe({
            next: (r: ApiModel) => {
                if (!r || !r.statusText) {
                    return;
                }
                this.notificationProvider.confirmSwal.options = {
                    title: 'Incognito',
                    text: r.statusText,
                    confirmButtonText: 'Close',
                    showCancelButton: false,
                    showConfirmButton: true
                };

                this.notificationProvider.confirmSwal.show();
                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {
                    subscription.unsubscribe();
                });
            },
            error: (e: any) => {

                this.notificationProvider.confirmSwal.options = {
                    title: 'Incognito',
                    text: e.statusText,
                    confirmButtonText: 'Close',
                    showConfirmButton: true,
                    showCancelButton: false,
                    type: 'error'
                };
                this.notificationProvider.confirmSwal.show();
                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {
                    subscription.unsubscribe();
                });


        }
        });
    }


    public requestBan(banBody: any) {
        this.apiProvider.url = 'spread/ban';
        this.apiProvider.requestType = 'post';
        this.apiProvider.shouldAuthenticate = true;
        return this.apiProvider.getUrl(banBody).subscribe({
            next: (r: ApiModel) => {
                if (!r || !r.statusText) {
                    return;
                }
                this.notificationProvider.confirmSwal.options = {
                    title: 'Ban',
                    text: r.statusText,
                    confirmButtonText: 'Close',
                    showCancelButton: false,
                    showConfirmButton: true
                };

                this.notificationProvider.confirmSwal.show();
                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {
                    subscription.unsubscribe();
                });
            },
            error: (e: any) => {

                this.notificationProvider.confirmSwal.options = {
                    title: 'Ban',
                    text: e.statusText,
                    confirmButtonText: 'Close',
                    showConfirmButton: true,
                    showCancelButton: false,
                    type: 'error'
                };
                this.notificationProvider.confirmSwal.show();
                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {
                    subscription.unsubscribe();
                });


        }
        });
    }


    public deleteSpread(id: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'delete';
        this.apiProvider.url = `spread/${id}`;
        return this.apiProvider.getUrl({}).subscribe((r) => {
                if (!r || !r.statusText) {
                    return;
                }
                this.notificationProvider.confirmSwal.options = {
                    title: 'Deleted',
                    text: 'Spread deleted successfully',
                    type: 'success'
                };
            // tslint:disable-next-line:no-shadowed-variable
                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(r => {
                }).add(() => {
                    subscription.unsubscribe();
                });
            }, (e: any) => {
                if (e && e.statusText) {
                    this.notificationProvider.confirmSwal.options = {
                        title: 'Delete failed',
                        text: e.statusText,
                        type: 'error',
                        showConfirmButton: true,
                        confirmButtonText: 'Continue'
                    };

                    this.notificationProvider.confirmSwal.show();

                    const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe((r) => {
                        if (r) {
                            subscription.unsubscribe();
                        }
                    });
                }
        });
    }


    public getAllBroadcastBrand(justOne: boolean, page: number, searchStr: string) {
        let pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page;
        let ids = [];
        const broadcasts = {
            pagination: pageModel,
            // tslint:disable-next-line:no-shadowed-variable
            request: (page?: number) => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'post';
                const next = (page || broadcasts.pagination.next);
                this.apiProvider.url = `brand/me/broadcast?page=${next ? next : 1 }&search=${searchStr || ''}`;
                return this.apiProvider.getUrl({brands: ids.length ? ids : []}).subscribe((r: any) => {
                    if (justOne) {
                        broadcasts.data = r.data;
                    } else {
                        pageModel.putPagination(r.pagination);
                        broadcasts.data = broadcasts.data.concat(r.data);
                    }
                });
            },
            select: (id: Array<number>) => {ids = id; },
            get: () => ids,
            data: [],
            clear: () => {
                broadcasts.data = [];
                pageModel = new PaginationModel();
            },

        };

        return broadcasts;
    }


    public deleteInvitation(invitationId: number ) {
        this.apiProvider.requestType = 'delete';
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = 'spread/invitation/' + invitationId;
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                this.notificationProvider.confirmSwal.options = {
                    title: 'Invitation',
                    text: r.statusText,
                    confirmButtonText: 'Close',
                    showCancelButton: false,
                    showConfirmButton: true,
                    type: 'success'
                };

                this.notificationProvider.confirmSwal.show();
            },
            error: (e) => {
                this.notificationProvider.confirmSwal.options = {
                    title: 'Invitation',
                    text: e.statusText,
                    confirmButtonText: 'Close',
                    showCancelButton: false,
                    showConfirmButton: true,
                    type: 'error'
                };

                this.notificationProvider.confirmSwal.show();
            }
        });

    }

    public uploadFile(filePath: string, spreadId: number) {
        this.apiProvider.requestType = 'post';
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `spread/${spreadId}/upload`;

        const subscription = this.apiProvider.getUrl({filePath});
        subscription.subscribe(
            (r) => this.notificationService.notifierMessage('success', r.statusText),
            (error) => this.notificationService.notifierMessage('error', error.statusText));

        return subscription;
    }

}
