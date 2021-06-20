import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-filter-include-component',
    templateUrl: './filter-popup.component.html'
})
export class FilterPopupComponent {
    @Output()
    private onSelected: EventEmitter<number> = new EventEmitter();

    private _popupId: string;

    get popupId(): string {
        return this._popupId;
    }

    @Input()
    set popupId(value: string) {
        this._popupId = value;
    }

    private _popupList: Array<string> = [];

    get popupList(): Array<string> {
        return this._popupList;
    }

    @Input()
    set popupList(value: Array<string>) {
        this._popupList = value;
    }

    private _selected: number = -1;

    get selected(): number {
        return this._selected;
    }

    @Input()
    set selected(value: number) {
        this._selected = value;
    }

    private _title: string;

    get title(): string {
        return this._title;
    }

    @Input()
    set title(value: string) {
        this._title = value;
    }

    public select(event, id) {
        event.preventDefault();
        if (this._selected != id) {
            this._selected = id;
            this.onSelected.emit(this._selected);
        } else {
            this._selected = -1;
        }

    }
}
