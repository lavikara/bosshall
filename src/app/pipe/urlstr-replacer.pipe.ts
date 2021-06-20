import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'URLStrReplacer'
})
export class URLStrREplacerPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {

    if (value && value.length) {
      const pattern = new RegExp(
          // tslint:disable-next-line:max-line-length
          '(^(?!")|\\s)(www\.|https?:\\/\\/www\\.?|https?:\\/\\/)([-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
          'gi');
      value = value.replace(pattern, `<a href="http://$3" target="_blank">$3</a>`);
    }

    return value;
  }

}
