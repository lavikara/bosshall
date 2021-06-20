import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComplexRequestModel} from '../../../model/ComplexRequestModel';

@Component({
    selector: 'app-inc-load-more-component',
    templateUrl: './load-more.component.html'
})

export class LoadMoreIncludeComponent implements OnInit {
    @Output()
    public onPageChange: EventEmitter<any> = new EventEmitter();
    private _expand = 5;

    constructor() {

    }

    private _page = 1;

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
        if(value.pagination) {
            this._page = value.pagination.next;
        }
    }

    get showPrevious() {
        return this._complexRequest && this._complexRequest.data && this._page > 1;
    }

    private _loading: boolean;

    get loading(): boolean {
        return this._loading;
    }

    get showLoading(): boolean {
        return this.complexRequest.data && this.complexRequest.data.length * this._page < this.complexRequest.pagination.total;
    }

    ngOnInit() {
        this.emitPage();
    }

    public loadMore(isPrevious) {
        if(isPrevious) {
            this._page = (this._complexRequest.pagination.next - 2) >=1? (this._complexRequest.pagination.next - 2): 1;
            this._loadMore();
            return;
        }
        if (this.complexRequest.data && this.complexRequest.data.length < this.complexRequest.pagination.total) {
            if(this._page ===1) {
                this._page+=1;
            }
            this._loadMore()
        }
    }

    private _loadMore() {
        this._loading = true;
        this.complexRequest.request(this.page).add(r => {
            this._page = this._complexRequest.pagination.next;
            this._loading = false;
            this._expand = this._complexRequest.data.length;
            this.emitPage();
        });
    }

    private emitPage() {
        this.onPageChange.emit(this._expand);
    }
}
