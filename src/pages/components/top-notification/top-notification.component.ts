import {Component, OnInit} from "@angular/core";
import {BrandService} from "../../../app/providers/brand/brand.service";

@Component( {
    selector: 'app-top-notification',
    template: `<div class="main-container mat-elevation-z2 border-radius" *ngIf="brandNotification && brandNotification.id"  fxLayout="row" fxLayoutAlign="flex-end center">
        <div class="inner-text-container font-size-12">
            You have a new pending invitation as {{brandNotification.position}} of <a *ngIf="brandNotification.Brand && brandNotification.Brand.name" [routerLink]="'/bl/brand/'">{{brandNotification.Brand.name}}</a>
        </div>
        <div class="button-action" fxLayout="row" fxLayoutAlign="flex-start">
            <button class="button primary-border primary small-text" type="button" (click)="acceptInvitation(brandNotification.id)">Accept</button>
            <button class="button danger-border danger small-text" type="button" (click)="declineInvitation(brandNotification.id)">Decline</button>
        </div>
    </div>`
})

export class TopNotificationComponent implements OnInit{
    constructor(private brandService: BrandService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.brandService.fetchInvitations();

        }, 9000)

    }

    public declineInvitation(id) {
        this.brandService.declineInvitations(id);

    }

    public acceptInvitation(id) {
        this.brandService.acceptInvitations(id);
    }

    get brandNotification() {
        return this.brandService.pendingInvitation;
    }
}
