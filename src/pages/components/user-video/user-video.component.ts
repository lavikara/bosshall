import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {StreamManager} from 'openvidu-browser';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';

@Component({
    selector: 'user-video',
    template: `<div class="video-cover"></div><video class="user-video" #videoElement></video>`
})

export class UserVideoComponent implements AfterViewInit {
    constructor(private cloudProvider: CloudService) {}

    @ViewChild('videoElement', {static: false}) elementRef: ElementRef;
    private _streamManager: StreamManager;
    ngAfterViewInit(): void {
        if (this._streamManager && this._streamManager.stream) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
        }
    }

    @Input()
    set streamManager(value: StreamManager) {
        this._streamManager = value;
        if (!!this.elementRef && this._streamManager && this._streamManager.stream) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
            this.cloudProvider.recordingInitialization(this.elementRef.nativeElement);
        }
    }
}
