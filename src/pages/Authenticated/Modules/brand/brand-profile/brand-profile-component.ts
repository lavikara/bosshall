import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BrandService} from '../../../../../app/providers/brand/brand.service';
import {BrandModel} from '../../../../../model/BrandModel';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthProvider} from '../../../../../app/providers/auth.provider';
import {Location} from '@angular/common';
import {UserModel} from '../../../../../model/UserModel';
import {FileBlobModel} from '../../../../../model/FileBlobModel';

@Component({
    selector: 'app-brand-profile-component',
    templateUrl: './brand-profile-component.html'
})
export class BrandProfileComponent implements OnInit, AfterViewInit {

    constructor(private brandService: BrandService,
                private location: Location,
                private authProvider: AuthProvider,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    private _brandDetails: any = {} as any;

    get brandDetails(): BrandModel {
        return this._brandDetails.data;
    }

    ngAfterViewInit(): void {
        const subscription = this._brandDetails.request().add(() => {
            this.brandService.story.setValue(this._brandDetails.data.story);
            subscription.unsubscribe();
        });
    }

    get user(): UserModel {
        return this.authProvider.user;
    }

    ngOnInit(): void {
        const brandId = this.activatedRoute.snapshot.paramMap.get('id') || this.authProvider.user.brandSelected;

        if (!brandId) {
            this.location.back();
        } else {
            this._brandDetails = this.brandService.getBrand(brandId as number);
        }
    }

    get operationStatus(): string {


        try {
            const currentTimeDate = new Date();
            const [workStartDay, workEndDay] = this.brandDetails.workingDays.split('-');
            const workStartHour = this.convertTime(this.brandDetails.workStart);
            const workEndHour = this.convertTime(this.brandDetails.workEnd);
            const startCurrentTimeDate = new Date();
            const endCurrentTimeDate = new Date();
            startCurrentTimeDate.setHours(workStartHour);
            endCurrentTimeDate.setHours(workEndHour);

            if (
                parseInt(workStartDay, 10) > currentTimeDate.getDay() &&
                parseInt(workEndDay, 10) < currentTimeDate.getDate()
            ) {
                return 'Currently Open';
            } else if (
                (
                    parseInt(workStartDay, 10) === currentTimeDate.getDay() || parseInt(workEndDay, 10) === currentTimeDate.getDay()
                ) &&
                (
                    // tslint:disable-next-line:max-line-length
                    (currentTimeDate.getHours() > startCurrentTimeDate.getHours() && currentTimeDate.getHours() < endCurrentTimeDate.getHours())
                )
            ) {
                return 'Currently Open';
            }
        } catch (e) {

        }
        return 'Currently Closed';
    }



    private convertTime(time): number {
        if (time.toLowerCase().indexOf('am') > -1) {
            return parseInt(time.toLowerCase().replace(/\s/g, '').replace('am', ''));
        } else if (time.toLowerCase().indexOf('pm') > -1) {
            return parseInt(time.toLowerCase().replace(/\s/g, '').replace('pm', '')) + 12;
        }
    }


    public editBrand() {
        this.router.navigate(['/bl/brand/edit/' + this.brandDetails.id], {
            queryParams: {brand: JSON.stringify(this.brandDetails)}, skipLocationChange: true
        });
    }

    get loadingImg(): string {
        return FileBlobModel.loading();
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

    get operationString() {
        switch (this.brandDetails.workingDays) {
            case '1-5':
                return 'Monday - Friday';
            case '1-6':
                return 'Monday - Saturday';
            case '1-0':
                return 'Monday - Sunday';
            case '0-5':
                return 'Sunday - Friday';
            case '0-6':
                return 'Sunday - Saturday';
            case '6-0':
                return 'Saturday - Sunday';
            case '6-6':
                return 'Saturdays';
            case '0-0':
                return 'Sundays';
            default:
                return 'Monday - Friday';
        }
    }


}
