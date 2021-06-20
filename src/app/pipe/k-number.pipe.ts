import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kNumber'
})
export class KNumberPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value >= 1000 && value < 1000000) {
      return Math.round(value / 1000) + 'k';
    } else if (value >= 1000000 && value < 1000000000) {
      return Math.round(value / 1000000) + 'm';
    } else {
      return value;
    }
  }

}
