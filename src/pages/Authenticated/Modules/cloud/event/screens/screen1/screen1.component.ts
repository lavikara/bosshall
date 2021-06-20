import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-cloud-sub-screen1-component',
    templateUrl: './screen1.component.html',
    styleUrls: ['./screen1.component.scss']
})


export class CloudSubScreen1Component {
    @Output()
    private screenAction: EventEmitter<{
        mic: boolean,
        videocam: boolean,
        chat: boolean
    }> = new EventEmitter<{mic: boolean, videocam: boolean, chat: boolean}>();


    public updateAction(event) {
        this.screenAction.emit(event);
    }
}
