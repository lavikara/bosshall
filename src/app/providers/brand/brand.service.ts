import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BrandModel} from '../../../model/BrandModel';
import {ApiProvider} from '../api.service';
import {PaginationModel} from '../../../model/PaginationModel';
import {ApiModel} from '../../../model/ApiModel';
import {Subject, Subscription} from 'rxjs';
import {NotificationProvider} from '../notification.provider';
import {NotificationService} from '../user/notification.service';
import {map} from 'rxjs/operators';
import {AuthProvider} from '../auth.provider';
import {RequestInterface} from '../RequestInterface';

@Injectable({
    providedIn: 'root'
})
export class BrandService {

    public $myBrandReady: Subject<number[]> = new Subject<number[]>();
    private _pendingInvitation: any = {} as any;
    public allBrands: RequestInterface;
    public selectedBrands: RequestInterface;
    public brandActivities: RequestInterface;

    constructor(
        private authProvider: AuthProvider,
        private notificationService: NotificationService,
        private apiProvider: ApiProvider,
        private notificationProvider: NotificationProvider
    ) {
    }

    private _story: FormControl = new FormControl('');

    get story(): FormControl {
        return this._story;
    }

    set story(value: FormControl) {
        this._story = value;
    }

    private _brandForm: FormGroup;

    set brandForm(value: FormGroup) {
        this._brandForm = value;
    }


    public setup() {
        AuthProvider.$onUserReceived.subscribe(() => {
            this.selectedBrands = this.getSelectedBrands(1, true);
            this.allBrands = this.getBrands(true, 1, '');
            this.brandActivities = this.getBrandActivities(1, true);
            const allBrandSubscription = this.allBrands.request();
            const activitiesSubscription = this.brandActivities.request();


            activitiesSubscription.add(() => {
                activitiesSubscription.unsubscribe();
            });

            allBrandSubscription.add(() => {
                allBrandSubscription.unsubscribe();

                const selectedBrandSubscription = this.selectedBrands.request();
                selectedBrandSubscription.add(() => {
                    this.allBrands.select(this.selectedBrands.data);
                    selectedBrandSubscription.unsubscribe();
                });
            });
        });
    }

    /**
     * Subscription needs to be unsubscribe from caller
     * @param justOne
     * @param page
     * @param searchStr
     */
    private getBrands(justOne: boolean, page: number, searchStr?: string, ) {
        let pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page;

        const brands = {
            data: [],
            pagination: pageModel,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = `brand?page=${pageModel.next ? pageModel.next : 1}&search=${searchStr || ''}`;
                return this.apiProvider.getUrl({}, true).subscribe((r: any) => {
                    if (justOne) {
                        brands.clear();
                        brands.data = r.data;
                    } else {
                        brands.data = brands.data.concat(r.data);
                        pageModel.putPagination(r.pagination);

                    }
                });
            },
            clear: () => {
                brands.data = [];
                pageModel = new PaginationModel();
            },
            select: (myBrands: Array<BrandModel>) => {
                for (let j = 0; j < brands.data.length; j++) {
                    for (let i = 0; i < myBrands.length; i++) {
                        if (myBrands[i].id === brands.data[j].id) {
                            brands.data[j].selected = true;
                        }
                    }
                }
            }
        };

        return brands;
    }

    public getBrand(id: number) {
        let data: BrandModel = {} as any;

        const details = {
            pagination: null,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = `brand/${id}`;

                return this.apiProvider.getUrl({}).subscribe((r: any) => {
                    if (r && r.data) {
                        details.data = r.data;
                    }
                });
            },
            data: {},
            clear: () => {
                data = {} as any;
            }
        };

        return details;
    }

    public searchBrand(search: string) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'get';
        this.apiProvider.url = `brand?search=${search}`;
        return this.apiProvider.getUrl({}).pipe(map(r => r.data));
    }

    /**
     * create a brand
     */
    public createBrand() {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'post';
        this.apiProvider.url = 'brand';
        return this.apiProvider.getUrl(this._brandForm.value);
    }

    public updateBrand(brandId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'put';
        this.apiProvider.url = 'brand/' + brandId;
        return this.apiProvider.getUrl(this._brandForm.value).subscribe({
            next: (r) => {
                this.notificationProvider.confirmSwal.options = {
                    title: 'Good Job',
                    text: r.statusText,
                    showConfirmButton: true,
                    showCancelButton: false,
                    cancelButtonText: 'Continue',
                    type: 'success'
                };

                this.notificationProvider.confirmSwal.show();

                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {

                    subscription.unsubscribe();
                });
            },
            error: (e) => {
                this.notificationProvider.confirmSwal.options = {
                    title: 'Failed',
                    text: e.statusText,
                    showConfirmButton: true,
                    showCancelButton: false,
                    cancelButtonText: 'Close',
                    type: 'error'
                };

                this.notificationProvider.confirmSwal.show();

                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {

                    subscription.unsubscribe();
                });

            }
        });
    }

    public followBrand(brandId: number, pauseNotify?: boolean) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'put';
        this.apiProvider.url = `brand/${brandId}/follow`;
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                if (!pauseNotify) {
                    this.notificationService.notifierMessage('success', r.statusText);
                }
            },
            error: (error: any) => {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }

    public unFollowBrand(brandId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'put';
        this.apiProvider.url = `brand/${brandId}/unfollow`;
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (error: any) => {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }
    public toggleFollow(brandId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'put';
        this.apiProvider.url = `brand/${brandId}/follow/toggle`;
        return this.apiProvider.getUrl({}).subscribe({
            next: (r: ApiModel) => {
                if (this.$myBrandReady) {
                    const spreadSelectedSubscription = this.selectedBrands.request();
                    spreadSelectedSubscription.add(() => {
                        spreadSelectedSubscription.unsubscribe();
                    });
                }
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (error: any) => {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }

    public brandActivity(brandId: number, page: number, justOne: boolean) {
        let pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page;
        let data: Array<BrandModel> = [];

        return {
            pagination: pageModel,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = `brand/${brandId}/activity?page=${pageModel.next}`;
                return this.apiProvider.getUrl({}).subscribe((r: any) => {
                    if (justOne) {
                        data = r.data;
                    } else {
                        data.push(r.data);
                        pageModel.putPagination(r.pagination);

                    }
                });
            },
            data: data,
            clear: () => {
                data = [];
                pageModel = new PaginationModel();
            }
        };
    }

    private getBrandActivities(page: number, justOne: boolean) {
        let pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page;

        const activities = {
            pagination: pageModel,
            data: [],
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = `brand/me/activities?page=${pageModel.next}`;
                return this.apiProvider.getUrl({}).subscribe((r: any) => {
                    if (justOne) {
                        activities.data = r.data;
                    } else {
                        activities.data.push(r.data);
                        pageModel.putPagination(r.pagination);

                    }
                });
            },
            clear: () => {
                activities.data = [];
                pageModel = new PaginationModel();
            }
        };


        return activities;
    }

    private getSelectedBrands(page: number, justOne: boolean) {
        let pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page;

        const selectedBrand = {
            data: [],
            pagination: pageModel,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = `brand/me/selected?page=${pageModel.next ? pageModel.next : 1}`;
                return this.apiProvider.getUrl({}, true).subscribe((r: any) => {

                    if (justOne) {
                        selectedBrand.data = r.data;
                    } else {
                        selectedBrand.data.push(r.data);
                        pageModel.putPagination(r.pagination);
                    }
                    if (this.$myBrandReady) {
                        // tslint:disable-next-line:no-shadowed-variable
                        this.$myBrandReady.next(selectedBrand.data.slice().map(r => r.id));
                    }
                });
            },
            clear: () => {
                selectedBrand.data = [];
                pageModel = new PaginationModel();
                if (this.$myBrandReady) {
                    this.$myBrandReady.next([]);
                }
            },
        };

        return selectedBrand;
    }

    public getCreatedBrand(page: number, justOne: boolean) {
        let pageModel: PaginationModel = new PaginationModel();
        pageModel.next = page;

        const selectedBrand = {
            data: [],
            pagination: pageModel,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.requestType = 'get';
                this.apiProvider.url = `brand/me/created?page=${pageModel.next}`;
                return this.apiProvider.getUrl({}).subscribe((r: any) => {

                    if (justOne) {
                        selectedBrand.data = r.data;
                    } else {
                        selectedBrand.data.push(r.data);
                        pageModel.putPagination(r.pagination);

                    }
                    if (this.$myBrandReady) {
                        // tslint:disable-next-line:no-shadowed-variable
                        this.$myBrandReady.next(selectedBrand.data.slice().map(r => r.id));
                    }
                });
            },
            clear: () => {
                selectedBrand.data = [];
                pageModel = new PaginationModel();
            },
        };

        return selectedBrand;
    }


    public fetchInvitations() {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/brand/me/pending';
        this.apiProvider.requestType = 'get';
        this.apiProvider.getUrl({}).subscribe({
            next: (r) => {
                this._pendingInvitation = r.data;
            },
            error: (e) => {
                // this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }

    public acceptInvitations(id) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/brand/me/pending/accept/' + id;
        this.apiProvider.requestType = 'put';
        this.apiProvider.getUrl({}).subscribe({
            next: (r) => {
                this._pendingInvitation = r.data;
                this.fetchInvitations();
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (e) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }
    public declineInvitations(id) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/brand/me/pending/decline/' + id;
        this.apiProvider.requestType = 'put';
        this.apiProvider.getUrl({}).subscribe({
            next: (r) => {
                this._pendingInvitation = r.data;
                this.notificationService.notifierMessage('success', r.statusText);
                this.fetchInvitations();
            },
            error: (e) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }

    /**
     * Remove brand Executives
     */
    public removeBrandExecutive(executiveId: number, brandId: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `/brand/me/${brandId}/executive/${executiveId}`;
        this.apiProvider.requestType = 'delete';
        return this.apiProvider.getUrl({}).subscribe({
            next: (r) => {
                this.notificationService.notifierMessage('success', r.statusText);
            },
            error: (e) => {
                this.notificationService.notifierMessage('error', e.statusText);
            }
        });
    }

    get pendingInvitation(): any {
        return this._pendingInvitation;
    }
}
