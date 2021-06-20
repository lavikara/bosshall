import {Component, OnInit} from '@angular/core';
import {CloudService} from '../../../../../../app/providers/cloud/cloud.provider';

@Component({
    selector: 'app-participant-component',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.scss']
})

export class ParticipantComponent implements OnInit {
    constructor(private cloudService: CloudService) {
    }

    ngOnInit(): void {
        this.cloudService.screenNotVisible();
    }


    /**
     * return the mobile slide value
     */
    get isMobileSlide(): boolean {
        return this.cloudService.participantSlide;
    }



}
