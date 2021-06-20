import {Pipe, PipeTransform} from '@angular/core';
import {StreamManager} from 'openvidu-browser';

@Pipe({
    name: 'AudioVideo',
    pure: false
})
export class ActiveVideoAudio implements PipeTransform {
    transform(value: StreamManager[], ...args: any[]): any {
        if (value && value.length) {
            return value.filter( (output) => output.stream.audioActive);
        } else {
            return [];
        }
    }

}
