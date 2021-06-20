import {Component} from '@angular/core';
import {MessageService} from '../../../app/providers/cloud/message/message.service';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';

@Component({
    selector: 'app-single-list-attendance-component',
    templateUrl: './single-list-attendance.component.html',
    styleUrls: ['./single-list-attendance.component.scss']
})

export class SingleListAttendanceIncludeComponent {

    constructor(private messageService: MessageService, private cloudService: CloudService) {

    }

    /**
     * set to all user which is zero
     */
    public selectAllUser() {
        this.cloudService.participantSlide = !this.cloudService.participantSlide;
        this.messageService.setCurrentUser(0, this.cloudService.myCapabilities);
    }

    /**
     * Return current user
     */
    get selectedAllUser(): boolean {
        this.cloudService.participantSlide = !this.cloudService.participantSlide;
        return this.messageService.currentUser === 0;
    }


}
