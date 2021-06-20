import {Component, OnInit} from '@angular/core';
import {BrandService} from '../../../app/providers/brand/brand.service';
import {FileBlobModel} from '../../../model/FileBlobModel';

@Component({
    selector: 'app-home-activities-component',
    templateUrl: './home-activities.component.html'
})
export class HomeActivityIncludeComponent implements OnInit {
    constructor(private brandService: BrandService) {

    }

    get brandActivitiesList() {
        return this.brandService.brandActivities.data || [];
    }

    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    ngOnInit(): void {

    }
}
