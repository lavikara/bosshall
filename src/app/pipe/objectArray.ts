import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'object2Arr',
    pure: false
})

export class ObjectArrayPipe implements PipeTransform {
    transform(value: any, skip: number, alwaysTop: number): any {
        const arr = [];
        if (value) {
                Object.keys(value).forEach((e) => {
                    if (value[e].id !== skip) {
                        arr.push(value[e]);
                    }
                });

        }
        return arr;
    }
}
