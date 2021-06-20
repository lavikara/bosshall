import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'likeCount'
})
export class LikeCountPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        try {
            return JSON.parse(value).length;
        } catch (e) {
            return 0;
        }
    }

}
