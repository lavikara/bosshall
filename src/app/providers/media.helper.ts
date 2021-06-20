import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class MediaHelper {
    constructor() {

    }

    public dataUrl2Blob(dataUrl: string, callback: (blob: Blob) => any) {
        const req = new XMLHttpRequest;

        req.open('GET', dataUrl);
        req.responseType = 'blob';

        req.onload = function fileLoaded(e) {
            callback(this.response);
        };

        req.send();
    }
}
