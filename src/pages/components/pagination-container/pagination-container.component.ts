import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ComplexRequestModel} from "../../../model/ComplexRequestModel";


@Component({
    selector: 'app-pagination-container',
    template: `<div class="broadcast-container mat-elevation-z1">
        <mat-paginator [length]="complexRequest.pagination.total"
                       [pageSizeOptions]="pageSizeOption()"
                       [pageSize]="20">
        </mat-paginator>
    </div>`
})

export class PaginationContainerComponent implements OnInit{
    @Output()
    public onPageChange: EventEmitter<any> = new EventEmitter();
    private _expand = 20;

    constructor() {

    }

    private _page = 1;

    pageSizeOption() {
        if(!this._complexRequest.pagination || !this._complexRequest.pagination.total){
            return [1];
        }
        return Array(
            Math.ceil(this._complexRequest.pagination.total/20)
        ).fill(1).map((r, index) => index+1);
    }

    get page(): number {
        return this._page;
    }

    @Input()
    set page(value: number) {
        this._page = value;
    }

    private _complexRequest: ComplexRequestModel = {} as any;

    get complexRequest(): ComplexRequestModel {
        return this._complexRequest;
    }

    @Input()
    set complexRequest(value: ComplexRequestModel) {
        this._complexRequest = value;
    }

    private _loading: boolean;

    get loading(): boolean {
        return this._loading;
    }

    get showLoading(): boolean {
        return this.complexRequest.data && this.complexRequest.data.length >= this.complexRequest.pagination.total;
    }

    ngOnInit() {
        this.emitPage();
    }

    public loadMore() {

        if (this.complexRequest.data && this.complexRequest.data.length < this.complexRequest.pagination.total) {
            this._loading = true;
            this.complexRequest.request().add(r => {
                this._page = this.complexRequest.pagination.next;
                this._loading = false;
                this._expand = this.complexRequest.data.length;
                this.emitPage();
            });
        }


    }

    private emitPage() {
        this.onPageChange.emit(this._expand);
    }
}