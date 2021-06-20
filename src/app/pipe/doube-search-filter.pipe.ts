import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'doubleSearchFilter',
    pure: false
})
export class DoubleSearchFilterPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let count = 0;
        let newArr = [];
        if (value && value.length && args) {
            for (const i in value) {
                if (value.hasOwnProperty(i) && count < 15) {
                    if (JSON.stringify(value[i]).toLowerCase().indexOf(args.toLowerCase()) > -1) {
                        newArr.push(value[i]);
                        count++;
                    }
                }
            }
        } else if (value) {
            newArr = value.slice(0, 15);

        }
        return newArr;
    }

}
