import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidatorHelper} from '../../../app/providers/input.provider/validator.input.provider';

@Component({
    selector: 'app-video-player-filter-component',
    templateUrl: './video-player-filter.component.html'
})

export class VideoPlayerFilterComponent {
    @Input()
    heading: Array<any> = [];
    @Input()
    canFilter = false;
    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('', [Validators.required]),
        start: new FormControl('', [Validators.required]),
        end: new FormControl('', [Validators.required])
    });

    constructor(public validatorHelper: ValidatorHelper) {
    }

    private _selected = 0;

    get selected(): number {
        return this._selected;
    }

    set selected(value: number) {
        this._selected = value;
    }

    private _date: Date = new Date();

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    private _settings = {
        bigBanner: true,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: false
    };

    get settings(): { bigBanner: boolean; timePicker: boolean; format: string; defaultOpen: boolean } {
        return this._settings;
    }

    set settings(value: { bigBanner: boolean; timePicker: boolean; format: string; defaultOpen: boolean }) {
        this._settings = value;
    }

    public setValue(type: string, value: string) {
        if (this.searchForm.controls[type] && value) {
            this.searchForm.controls[type].setValue(value);

        }
    }
}
