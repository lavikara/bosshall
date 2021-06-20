import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'favorite'
})
export class FavoritePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        return null;
    }

}
