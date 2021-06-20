import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) {}

    transform(value: any, ...args: any[]): any {
        if (value && value.startsWith('./')) {
            return value;
        }
        if (value && value.startsWith('blob')) {
           return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
        }
        if (value) {
            return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
        }

        return value;
    }

}
