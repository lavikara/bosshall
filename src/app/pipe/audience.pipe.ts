import {Pipe, PipeTransform} from '@angular/core';
import {ParticipantEnum} from '../configuration/audience.enum';

@Pipe({
    name: 'audience'
})
export class AudiencePipe implements PipeTransform {

    transform(value: any, audience: string): any {
        if (Array.isArray(value)) {
            return value.filter(r => r.SpreadInvitation.audienceType == ParticipantEnum[audience]);
        }
    }

}
