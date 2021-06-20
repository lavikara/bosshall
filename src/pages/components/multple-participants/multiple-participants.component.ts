import {Component, Input} from "@angular/core";
import {StreamManager} from 'openvidu-browser';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';


@Component({
    selector: 'app-multiple-participants',
    templateUrl: './multiple-participants.component.html',
    styleUrls: ['./multiple-participants.component.scss']
})


export class MultipleParticipantsIncludeComponent {
    private _blueButton;

    constructor(protected cloudService: CloudService) {
    }

    get mainFeed() {
        return this.cloudService.mainStream;
    }

    get subscribers(): StreamManager[] {
        return this.cloudService.subscribers;
    }

    public updateMainStreamManager(subscriber: StreamManager) {
        this.cloudService.updateMainStream(subscriber);
    }
    get blueButton() {
        return this._blueButton;
    }

    @Input()
    set blueButton(value) {
        this._blueButton = value;
    }
}
