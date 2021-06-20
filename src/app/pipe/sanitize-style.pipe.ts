import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeStyle'
})
export class SanitizeStylePipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {

    }

    transform(value: any, ...args): any {
        return this.domSanitizer.bypassSecurityTrustStyle(value);
    }
}
