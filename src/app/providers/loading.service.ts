import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    constructor(private snackBar: MatSnackBar) {
    }

    private _isLoading: boolean;

    get isLoading(): boolean {
        return this._isLoading;
    }

    private _canOverlay: boolean;

    get canOverlay(): boolean {
        return this._canOverlay;
    }

    set canOverlay(value: boolean) {
        if (value) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        this._canOverlay = value;
    }

    private _text: string;

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    public stopLoading() {
        this._isLoading = false;
    }

    public startLoading(overlay: boolean) {
        this._isLoading = true;
    }
}
