import {ValidatorHelper} from '../../../../../app/providers/input.provider/validator.input.provider';

import {ExecutiveModel} from '../../../../../model/ExecutiveModel';
import {PhilosopherModel} from '../../../../../model/PhilosopherModel';
import {SearchUserComponent} from '../../../../components/search-user/search-user.component';
import {FileBlobModel} from '../../../../../model/FileBlobModel';
import {UserService} from '../../../../../app/providers/user/user.provider';
import {BrandService} from '../../../../../app/providers/brand/brand.service';
import {EntitiesService} from '../../../../../app/providers/user/entities.service';
import {CountryModel} from '../../../../../model/CountryModel';
import {NotificationService} from '../../../../../app/providers/user/notification.service';
import {TimeZoneModel} from '../../../../../model/TimeZoneModel';
import {SpreadModel} from '../../../../../model/SpreadModel';
import {BrandModel} from '../../../../../model/BrandModel';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NotificationProvider} from '../../../../../app/providers/notification.provider';
import {Subscription} from 'rxjs';
import {NgxSmartModalService} from 'ngx-smart-modal';

@Component({
    selector: 'app-brand-profile-edit-component',
    templateUrl: './brand-profile-edit-component.html'
})

export class BrandProfileEditComponent implements OnInit, AfterViewInit {


    @ViewChild('uploadLogo', {static: false})
    uploadLogo: ElementRef;
    public executives: Array<ExecutiveModel> = [];
    public philosophers: Array<PhilosopherModel> = [];
    public spreads: Array<SpreadModel> = [];
    public brandEditForm: FormGroup = new FormGroup({
        address: new FormControl('', [Validators.required]),
        workStart: new FormControl('', [Validators.required]),
        workEnd: new FormControl('', [Validators.required]),
        country: new FormControl(0, [Validators.required, Validators.min(1)]),
        motto: new FormControl('', [Validators.required]),
        workingDays: new FormControl(0, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        story: new FormControl('', [Validators.required]),
        timezone: new FormControl(0, [Validators.required]),
        interests: new FormControl('', [Validators.required]),
        logo: new FormControl('', [Validators.required]),
        executives: new FormControl('', []),
        philosophers: new FormControl('', []),
        about: new FormControl('', [Validators.required]),
        websites: new FormControl('', [Validators.required])
    });
    private brandId = 0;
    private _shadowedBrandDetails: BrandModel = {} as any;
    private _websites: Array<string> = [];

    constructor(
        public ngxSmartModalService: NgxSmartModalService,
        private notificationProvider: NotificationProvider,
        public validatorHelper: ValidatorHelper, private matDialog: MatDialog,
        private userService: UserService, private brandService: BrandService,
        private entityService: EntitiesService, private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private router: Router, private route: ActivatedRoute) {
    }

    private _brandLogo: FileBlobModel = new FileBlobModel();

    get brandLogo(): FileBlobModel {
        return this._brandLogo;
    }

    private _canAddMore: boolean;

    get canAddMore(): boolean {
        return this._canAddMore;
    }

    set canAddMore(value: boolean) {
        this._canAddMore = value;
    }

    get countries(): Array<CountryModel> {
        return this.entityService.countries;
    }

    get timezones(): Array<TimeZoneModel> {
        return this.entityService.timezone;
    }

    ngAfterViewInit(): void {
        this.brandService.story.setValue('');
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this._canAddMore = (params['multiBrand'] == 'true');
        });
        try {
            this._shadowedBrandDetails = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('brand'));
        } catch (e) {

        }
        this.fetchSpread();
        this.brandService.story.valueChanges.subscribe(r => {
            this.brandEditForm.controls['story'].setValue(r);
        });
/*        this.brandId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
        this.fetchSpread();*/
    }

    public uploadImage($event, type) {
        if ($event.target.files && $event.target.files[0]) {
            this._brandLogo = new FileBlobModel($event.target.files[0]);
            this.userService.uploadProfilePicture(this._brandLogo.file).then(r => {
                if (r && r.data && r.data.path) {
                    this.brandEditForm.controls['logo'].setValue(r.data.path);
                }

            });
        }
    }

    public mediaChanged(event) {
        if (event.item && event.item.id) {
            // just making sure we are copying a fresh copy of this object
            // will be enabled on implementation
            /*     let currentPlayer=JSON.parse(JSON.stringify(this.player));
             this.player=event.item;
             this.players.splice(event.index,1);
             this.players.push(currentPlayer);*/
        }
    }

    public fetchSpread() {
        this.populateForm();

        this.brandEditForm.controls['philosophers'].setValue(this.philosophers);
        this.brandEditForm.controls['executives'].setValue(this.executives);
    }


    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    public receivedStory(event) {
        if (event && event.length) {
            this.brandEditForm.controls['story'].setValue(event);
        }
    }

    public searchUser() {
        const searchUserModal = this.matDialog.open(SearchUserComponent, {
            panelClass: 'search-user-modal',
            maxWidth: '500px'
        });

        const sub = searchUserModal.afterClosed().subscribe((r: ExecutiveModel) => {
            if ((r && r.id) || (r && r.email)) {
                this.executives.push(r);
                this.brandEditForm.controls['executives'].setValue(this.executives);
            }
        }).add(() => {
            sub.unsubscribe();
        });
    }

    public receivedInterest(event) {
        if (event && event.length) {
            this.brandEditForm.controls['interests'].setValue(event);

        }
    }

    public receivedWebsites(event) {
        if (event && event.length) {
            this.brandEditForm.controls['websites'].setValue(event);
        }
    }

    public addPhilosopher() {
        if (this.philosophers.length < 2) {
            this.philosophers.push({} as any);
        }
    }

    public storeExecutive(index, type, value) {
        this.executives[index][type] = value;
    }




    public showConfirmation() {
        if (!this.executives.length) {
            this.notificationService.message('Brand Executives are required', 'Close', () => {
            });
            return;
        }
        if (this.brandId) {
            this.notificationProvider.confirmSwal.options = {
                title: 'Update',
                text: 'Really want to update?',
                confirmButtonText: 'Continue',
                cancelButtonText: 'Cancel',
                showCancelButton: true,
                showConfirmButton: true,
                type: 'question'
            };
            const  confirmUpdate = this.notificationProvider.confirmSwal.confirm.subscribe((r) => {
                if (r) {
                    this.brandService.brandForm = this.brandEditForm;
                    const brandUpdateSubscription = this.brandService.updateBrand(this.brandId).add(() => {
                        brandUpdateSubscription.unsubscribe();
                        this.router.navigate(['/bl/brand']);
                    });
                }
                confirmUpdate.unsubscribe();
            });
        } else {
            this.brandEditForm.controls['philosophers'].setValue(this.philosophers);
            this.notificationProvider.confirmSwal.options = {
                title: 'Confirmation',
                text: 'This brand will be publicly available to users on bosshalls. Do you really want to continue?',
                confirmButtonText: 'Continue',
                cancelButtonText: 'Cancel',
                showCancelButton: true,
                showConfirmButton: true,
                type: 'question'
            };

            let subscription: Subscription;

            const confirmSubscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {
                confirmSubscription.unsubscribe();
                this.brandService.brandForm = this.brandEditForm;
               const createSubscription = this.brandService.createBrand().subscribe({
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

                        subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {
                            if (this._canAddMore) {
                                this.router.navigate(['/bl/brand/create']);
                                window.location.reload();

                            } else {
                                this.router.navigate(['/bl/brand']);
                                window.location.reload();
                            }

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

                        subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {

                            subscription.unsubscribe();
                        });

                    }
                }).add(() => {
                    createSubscription.unsubscribe();
                });
            });
        }


        setTimeout(() => {
            this.notificationProvider.confirmSwal.show();
        }, 400);
    }

    public setValue(name, value) {
        this.brandEditForm.controls[name].setValue(value);
    }

    private populateForm() {


        if (!this._shadowedBrandDetails || !this._shadowedBrandDetails.id) {
            return;
        }
        this.brandId = this._shadowedBrandDetails.id;
        this.brandEditForm.controls['address'].setValue(this._shadowedBrandDetails.address);
        this.brandEditForm.controls['workStart'].setValue(this._shadowedBrandDetails.workStart);
        this.brandEditForm.controls['workEnd'].setValue(this._shadowedBrandDetails.workEnd);
        this.brandEditForm.controls['motto'].setValue(this._shadowedBrandDetails.motto);
        this.brandEditForm.controls['workingDays'].setValue(this._shadowedBrandDetails.workingDays);
        this.brandEditForm.controls['name'].setValue(this._shadowedBrandDetails.name);
        this.brandEditForm.controls['story'].setValue(this._shadowedBrandDetails.story);
        this.brandEditForm.controls['timezone'].setValue(this._shadowedBrandDetails.timezone);
        this.brandEditForm.controls['interests'].setValue(this._shadowedBrandDetails.InterestTag);
        this.brandEditForm.controls['logo'].setValue(this._shadowedBrandDetails.logo);
        this._brandLogo.url = this._shadowedBrandDetails.logo;
        this.executives = this._shadowedBrandDetails.ExecutiveInvitations.map((r: any) => {
            if (r && r.User) {
                r.name = r.User.firstname + ' ' + r.User.lastname;
                r.id = r.User.id;
                r.picture = r.User.picture;
            }

            return r;
        });

        this._websites = this._shadowedBrandDetails.BrandWebsites.map(r => r.url);
        this.philosophers = this._shadowedBrandDetails.BrandPhilosophers;
/*        this.brandEditForm.controls['executives'].setValue(this._shadowedBrandDetails.ExecutiveInvitations);
        this.brandEditForm.controls['philosophers'].setValue(this._shadowedBrandDetails.BrandPhilosophers);*/
        this.brandEditForm.controls['about'].setValue(this._shadowedBrandDetails.about);
        this.brandEditForm.controls['websites'].setValue(this._shadowedBrandDetails.BrandWebsites.map(r => r.name));
        this.brandService.story.setValue(this._shadowedBrandDetails.story);
    }

    get shadowedBrandDetails(): BrandModel {
        return this._shadowedBrandDetails || {} as any;
    }

    get websites(): Array<string> {
        return this._websites;
    }

    /**
     * @param executive
     */
    public deleteExecutive(executive: any) {
        if (executive.brand && executive.brand > 0) {
            const subscription = this.brandService.removeBrandExecutive(
                executive.id,
                this.brandId
            );
            subscription.add((r: any) => {
                subscription.unsubscribe();
                this.removeExecutive(executive);
            });
            return;
        }
        this.removeExecutive(executive);
    }

    private removeExecutive(executive: ExecutiveModel) {
        for (let i = 0; i < this.executives.length; i++) {
            if (
                this.executives[i].id <= 0  &&
                this.executives[i].name === executive.name) {
                this.executives.splice(i, 1);
            } else if (this.executives[i].id === executive.id) {
                this.executives.splice(i, 1);
            }
        }
        const fetchBrandInformation = this.brandService.getBrand(this.brandId);
        const subscription: Subscription = fetchBrandInformation
            .request()
            .add(() => {
               this._shadowedBrandDetails = fetchBrandInformation.data as BrandModel;
            subscription.unsubscribe();
        });
    }

}
