import { Pipe, PipeTransform } from '@angular/core';
import {ParticipantEnum} from '../configuration/audience.enum';
import {AuthProvider} from '../providers/auth.provider';

@Pipe({
  name: 'participantAudience'
})
export class ParticipantAudiencePipe implements PipeTransform {
  constructor(private authProvider: AuthProvider) {

  }

  transform(value: any, audience: string): any {
    if (Array.isArray(value)) {
      return (value.filter(r => r.permission == ParticipantEnum[audience])).sort((a, b) => {
        if (a.id == this.authProvider.user.id || b.id == this.authProvider.user.id) {
          return 1;
        } else {
          return -1;
        }

      });
    }
  }

}
