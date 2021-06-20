import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dislike'
})
export class DislikePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        return null;
    }

}
