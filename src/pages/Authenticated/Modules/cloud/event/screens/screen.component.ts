import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CloudService} from '../../../../../../app/providers/cloud/cloud.provider';
import {MessageService} from '../../../../../../app/providers/cloud/message/message.service';
enum Sizes {
    small, medium, big
}

@Component({
    selector: 'app-cloud-screen-component',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, AfterViewInit {
    public participants = 2;
    private _commentSize = Sizes.small;
    private _slideOpen = false;

    constructor(private cloudService: CloudService, private messageService: MessageService) {
    }
    ngOnInit(): void {

    }


    get commentSize(): Sizes {
        return this._commentSize;
    }

    get slideOpen(): boolean {
        return this._slideOpen;
    }

    public receivedAction(event) {
        this._slideOpen = event.chat;
        if (event.chat) {
            this.messageService.setCurrentUser(0, this.cloudService.myCapabilities);
        }
    }

    get mainFeed() {
        return this.cloudService.mainStream;
    }

    ngAfterViewInit(): void {
    }
}
