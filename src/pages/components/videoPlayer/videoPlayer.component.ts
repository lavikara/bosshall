import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SpreadModel} from '../../../model/SpreadModel';
import {Router} from '@angular/router';
import {SpreadService} from '../../../app/providers/spread/spread.service';
import {AuthProvider} from '../../../app/providers/auth.provider';
import {UserModel} from '../../../model/UserModel';
import {FileBlobModel} from '../../../model/FileBlobModel';
import {SpreadStatusEnum} from '../../../app/configuration/Spread.config';

@Component({
    selector: 'app-inc-video-player',
    templateUrl: './videoPlayer.component.html'
})


export class VideoPlayerComponent implements OnInit {
    public cover_image: string;
    @Output() onPlay: EventEmitter<any> = new EventEmitter();
    @Output() onPause: EventEmitter<any> = new EventEmitter();
    @Output() onEnd: EventEmitter<any> = new EventEmitter();
    @ViewChild('videoElement', {static: false}) videoElement: ElementRef;
    @ViewChild('audioElement', {static: false}) audioElement: ElementRef;

    constructor(private router: Router, private spreadService: SpreadService, private authProvider: AuthProvider) {
    }


    get user(): UserModel {
        return this.authProvider.user;
    }
    private _loading: boolean;

    get loading(): boolean {
        return this._loading;
    }


    get loadingImg(): string {
        return FileBlobModel.loading();
    }


    private _playing: boolean;

    get playing(): boolean {
        return this._playing;
    }

    private _type: string;

    get type(): string {
        return this._type;
    }

    @Input()
    set type(value: string) {
        this._type = value;
    }

    private _overlay: boolean;

    get overlay(): boolean {
        return this._overlay;
    }

    private _flash: boolean;

    get flash(): boolean {
        return this._flash;
    }

    private _data: SpreadModel = {} as any;

    get data(): SpreadModel {
        return this._data;
    }

    @Input()
    set data(value: SpreadModel) {
        this._data = value;
    }

    ngOnInit() {
        this.mediaEvents();
    }

    public play() {
        if (!this.data || !this.data.id) {
            return;
        }
        if (this._type === 'video' && this.videoElement.nativeElement) {
            if (!this._playing) {
                this.videoElement.nativeElement.play();
                return;
            }
            this.videoElement.nativeElement.pause();
        } else if (this._type === 'audio' && this.audioElement.nativeElement) {
            if (!this._playing) {
                this.audioElement.nativeElement.play();
                return;
            }
            this.audioElement.nativeElement.pause();
        }


    }

    private mediaEvents() {
        this.initVideoEvents();
        this.initAudioEvent();
    }

    private initAudioEvent() {
        if (this.audioElement && this.audioElement.nativeElement) {
            this.audioElement.nativeElement.onplay = (event) => {
                this.onPlay.emit(event);
                this._playing = true;
            };

            this.audioElement.nativeElement.onended = (event) => {
                this.onEnd.emit(event);
                this._playing = false;
            };
            this.audioElement.nativeElement.onpause = (event) => {
                this.onPause.emit(event);
                this._playing = false;
            };

            this.audioElement.nativeElement.addEventListener('loadedmetadata', () => {
                this._loading = false;
            });
        }
    }

    private initVideoEvents() {
        if (this.videoElement && this.videoElement.nativeElement) {
            this.videoElement.nativeElement.onplay = (event) => {
                this.onPlay.emit(event);
                this._playing = true;
                this.turnOffOverlay();
            };

            this.videoElement.nativeElement.onended = (event) => {
                this.onEnd.emit(event);
                this._playing = false;
                this.addOverlay();
            };
            this.videoElement.nativeElement.onpause = (event) => {
                this.onPause.emit(event);
                this._playing = false;
                this.addOverlay();
            };

            this.videoElement.nativeElement.addEventListener('loadedmetadata', () => {
                this._loading = false;
                this.addOverlay();
            });
        }

    }

    private cleanUp() {
        this._loading = true;
        if (this.videoElement && this.videoElement.nativeElement) {
            this.videoElement.nativeElement.stop();
        }
    }


    get joinStatus() {
        if (this.data.SpreadCreator && this.user.id == this.data.SpreadCreator.id) {
            return 'BROADCAST';
        } else {
            return 'SIGN UP';
        }
    }
    private turnOffOverlay() {
        setTimeout(() => {
            this._overlay = true;
        }, 200);
    }

    get spreadStatus() {
        if (this.data.status <= SpreadStatusEnum.BROADCASTING) {
            return 'ACTIVE';
        } else {
            return 'END';
        }
    }

    private addOverlay() {
        setTimeout(() => {
            this._overlay = false;
        }, 200);
    }


    get status(): boolean {
        return this.data.status === SpreadStatusEnum.ACTIVE;
    }
}
