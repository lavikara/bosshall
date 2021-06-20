import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {CloudService} from '../../../../../app/providers/cloud/cloud.provider';
import {Location} from '@angular/common';
import {Recorder} from '../../../../../app/providers/recorder/Recorder';
import {SideStreamUi} from '../../../../../app/providers/cloud/stream/side-stream-ui';


@Component({
    selector: 'app-cloud-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss']
})

export class CloudEventComponent implements OnInit, AfterViewInit, OnDestroy {
    get toggleMore(): boolean {
        return this.cloudService.mobileMore;
    }

    set toggleMore(value: boolean) {
        this.cloudService.mobileMore = value;
    }
    constructor(
        private cloudService: CloudService,
        private activatedRoute: ActivatedRoute,
        private location: Location
    ) {}

    @ViewChild('personalVideo', {static: false})
    public personalVideo: ElementRef;


    /**
     * @param status
     */
    private static toggleFloatingVideo(status: boolean) {
        const enableFloatingVideo = document.querySelector('.js-completed-video');
        if (enableFloatingVideo) {
            if (status) {
                enableFloatingVideo.classList.add('hidden');
            } else {
                enableFloatingVideo.classList.remove('hidden');
            }
        }
    }

    ngOnInit(): void {

    }

    mediaPlaying(): boolean {
        return !!(this.cloudService.mainStream && this.cloudService.mainStream.id);
    }

    ngAfterViewInit(): void {
        try {
            const spreadId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
            if (!spreadId || spreadId < 1) {
                return this.location.back();
            }
            this.cloudService.setup(spreadId);
        } catch (e) {
            this.location.back();
        }

        this.cloudService.sideStreamUI = new SideStreamUi();
      //  CloudEventComponent.toggleFloatingVideo(false);
    }

    get cloudId() {
        return this.cloudService.spreadId();
    }

    ngOnDestroy() {
       // CloudEventComponent.toggleFloatingVideo(true);
    }

    public disconnect() {
        this.cloudService.disconnect();
    }

    public connect() {
        this.cloudService.connect();
    }


    get canBroadcast() {
        return this.cloudService.canBroadcast();
    }

    get canBroadcastVideo(): boolean {
        return this.cloudService.myCapabilities.canVideo;
    }

    get broadcasting() {
        return this.cloudService.streamBroadcasting;
    }

    public toggleAudio() {
        this.cloudService.toggleAudio();
    }

    public toggleVideo() {
        return this.cloudService.toggleVideo();
    }

    get canBroadcastAudio(): boolean {
        return this.cloudService.myCapabilities.canAudio;
    }
}
