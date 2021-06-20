import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {BrandModel} from '../../../model/BrandModel';
import {BrandService} from '../../../app/providers/brand/brand.service';
import {FormControl} from '@angular/forms';
import {FileBlobModel} from '../../../model/FileBlobModel';
import {QueueService} from '../../../app/providers/queue.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-brand-include-component',
    templateUrl: './brand-container.component.html'
})

export class BrandContainerIncludeComponent implements OnInit, AfterViewInit, OnDestroy {
    public searchControl: FormControl = new FormControl('');

    @Output()
    private onBrandActivated: EventEmitter<any> = new EventEmitter<any>();
    private _hovered: any = {};
    private subscriptions: Array<Subscription> = [];
    constructor(
        private queueService: QueueService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private brandService: BrandService) {
    }

    get brands(): Array<BrandModel> {
        return this.brandService.allBrands.data;
    }

    ngOnInit(): void {
    }


    get hovered(): boolean {
        return this._hovered;
    }



    public showHeadShot(brandId: number, value) {
        if (value) {
           // this._hovered[brandId] = value;
        }
        this.queueService.delay(() => {
          //  this._hovered[brandId] = value;
        }, 1200);
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy() {
        this.subscriptions.map((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }


    public openBrand(item) {
        this.router.navigate(['/bl/brand/profile', {id: item.id}], {
            skipLocationChange: true
        });
    }

    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    public requestSelect(brand: BrandModel) {
        const followSubscription = this.brandService.toggleFollow(brand.id);
        followSubscription.add(() => {
            if (!this.changeDetectorRef['destroyed']) {
                this.onBrandActivated.emit(Math.random());
                this.changeDetectorRef.detectChanges();
            }
            followSubscription.unsubscribe();
        });
    }

    public openCompanyEvent() {
        this.router.navigate(['/bl/brand/event']);
    }
}
