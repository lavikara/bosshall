import {PresentationTransformParent} from './PresentInterraction/PresentationTransformParent';
import {ConnectionSocketProvider} from '../../socket/connection.socket.provider';
import {PresentationGuide} from './presentation';
import {AuthProvider} from '../../auth.provider';
import {ApiProvider} from '../../api.service';
import {Subject} from 'rxjs';
import {PresentationEvent} from './PresentInterraction/PresentationEvent';

export class PresentationPlayer extends PresentationTransformParent {
    constructor(
        socketConnection: ConnectionSocketProvider,
        authProvider: AuthProvider,
        apiProvider: ApiProvider,
        spreadId
    ) {
        super(
            socketConnection,
            authProvider,
            apiProvider,
            false,
            spreadId,
            false
        );
    }

    protected presentationItems: PresentationGuide[];

    public init() {
        const observerPresentation = new Subject<any>();
        observerPresentation.subscribe((res: any) => {
            if (!res.data || !res.data.content) {
                return;
            }
            const event = res.data.content;

            // tslint:disable-next-line:triple-equals
            if (event.sender == this.authProvider.user.id) {
                return;
            }

            switch (res.data.name) {
                case PresentationEvent.VOLUME:
                    this.applyVolume(event.volume);
                    break;
                case PresentationEvent.STOP:
                    this.stopPlaying();
                    break;
                case PresentationEvent.PAUSE:
                    this.pausePlaying();
                    break;
                case PresentationEvent.FILE:
                    this.setFile(event);
                    break;
                case PresentationEvent.SEEK:
                    this.setSeek(event);
                    break;
                case PresentationEvent.PLAY:
                    this.playingElement.play();
                    break;

            }
        });
        this.socketConnection.setObservable(PresentationEvent.PARENT, observerPresentation);
        this.buildParentElement();
    }

    protected setFile(fileInterface: FileInterface) {
        this.setup();
        this.presentationEl.innerHTML = '';
        this.presentationEl.appendChild(this.attachElement({
            id: 0,
            name: '',
            media: fileInterface.path,
            duration: fileInterface.duration,
            spread: fileInterface.spread,
            order: 0,
            container: 0
        }, fileInterface.fileType));
        if (this.playingElement) {
            this.playingElement.play();
        }
    }

    private pausePlaying() {
        if (this.isVideoOrAudio()) {
            this.playingElement.pause();
        }
    }


    protected startCycling(index: number) {}

    /**
     * Verify if video or audio
     */
    private isVideoOrAudio(): boolean {
        return this.playingElement && (
            this.playingElement.tagName === 'VIDEO' ||
        this.playingElement.tagName === 'AUDIO'
        );
    }

    /**
     * Apply volume
     * @param volume
     */
    private applyVolume(volume) {
        if (this.isVideoOrAudio()) {
            this.playingElement.volume = volume;
        }
    }

    /**
     * Stop Playing
     */
    private stopPlaying() {
        if (this.isVideoOrAudio()) {
            this.playingElement.pause();
            this.playingElement.load();
        }
        this.endPresentation();
    }

    protected setSeek(currentTime: FileInterface) {
        if (this.isVideoOrAudio()) {
            this.playingElement.currentTime = currentTime.duration;

        }
    }

    protected onSeek(event: any) {

    }

    protected onStop() {
    }

    protected onVolumeChange(event: any) {
    }

    protected sendPresentationFiles(presentationGuide: PresentationGuide, tag: 'video' | 'image' | 'audio') {
    }

}

