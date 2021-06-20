import {Component} from "@angular/core";
import {LoadingService} from "../../../app/providers/loading.service";

@Component({
    selector: 'app-loading-in-component',
    template: `
        <mat-progress-bar mode="indeterminate" class="top-loading" *ngIf="isLoading()"></mat-progress-bar>
        <div class="loading" [class.active]="canOverlay()">
            <div class="loading-overlay"></div>
            <div class="loading-content" fxLayout="column" fxLayoutAlign="center center">
                <mat-spinner></mat-spinner>
                <div class="loading-title" *ngIf="loadingText() && loadingText().length">{{loadingText()}}</div>
            </div>

        </div>
`
})


export class LoadingInclComponent {
    constructor(private loadingService: LoadingService) {

    }

    isLoading() {
        return this.loadingService.isLoading
    }

    canOverlay() {
        return this.loadingService.canOverlay;
    }

    loadingText() {
        return this.loadingService.text;
    }
}
