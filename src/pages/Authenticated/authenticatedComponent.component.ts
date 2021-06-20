import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../app/providers/user/user.provider';
import {CloudService} from '../../app/providers/cloud/cloud.provider';

@Component({
    selector: 'app-authenticated-component',
    template: `<router-outlet></router-outlet>
    <video cdkDrag  [routerLink]="'/bl/cloud/' + cloudId + '/broadcast'"
           [muted]="isMine ? 'muted' : false" class="js-completed-video"
           [class.hide-class]="isCloudPage"></video>`
})


export class AuthenticatedComponent implements AfterViewInit {

    @ViewChild('myMusic', {static: false})
    myMusic: ElementRef;
    @ViewChild('changeAudio', {static: false})
    changeAudio: ElementRef;
    constructor(private userService: UserService, private cloudService: CloudService) {
    }

    get cloudId(): number {
        return this.cloudService.spreadId();
    }

    get isMine(): boolean {
        if (this.cloudService.mainStream &&
            this.cloudService.mainStream.stream &&
            this.cloudService.publisher.stream
        ) {
            return this.cloudService.mainStream.stream.streamId == this.cloudService.publisher.stream.streamId;

        }
    }

    ngAfterViewInit(): void {

    }

    get isCloudPage(): boolean {
        if (!this.cloudService.mainStream ||
            !this.cloudService.mainStream.stream ||
            !this.cloudService.mainStream.stream.streamId) {
            return true;
        }
        return (this.cloudService.isCloudPage);
    }
}
