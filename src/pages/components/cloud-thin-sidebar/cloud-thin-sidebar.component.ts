import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';
import {AuthProvider} from '../../../app/providers/auth.provider';

@Component({
    selector: 'app-cloud-thin-sidebar-include-component',
    templateUrl: './cloud-thin-sidebar.component.html',
    styleUrls: ['./cloud-thin-sidebar.component.scss']
})

export class CloudThinSidebarIncludeComponent implements OnInit, AfterViewInit {
    public cloudConnected = false;
    private _selectedButton = 'participant';


    constructor(public cloudService: CloudService, private authProvider: AuthProvider) {
    }
    ngAfterViewInit(): void {

    }

    get userId(): number {
        return this.authProvider.user.id;
    }

    get cloudId() {
        return this.cloudService.spreadId();
    }

    ngOnInit(): void {

    }

    public selectButton(type) {
        this._selectedButton = type;
    }

    get canBroadcast() {
        return this.cloudService.canBroadcast();
    }

    public isType(type) {
        return this._selectedButton === type;
    }

    get mainFeed() {
        return this.cloudService.mainStream;
    }

    public connect() {
        this.cloudService.connect();
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

    public disconnect() {
        this.cloudService.disconnect();
    }

    get canManagePresentation(): boolean {
        return this.cloudService.myCapabilities.canAddPresentation;
    }

    get canBroadcastVideo(): boolean {
        return this.cloudService.myCapabilities.canVideo;
    }

    get canBroadcastAudio(): boolean {
        return this.cloudService.myCapabilities.canAudio;
    }
}
