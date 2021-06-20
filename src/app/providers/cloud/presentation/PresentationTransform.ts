import {PresentationTransformParent} from './PresentInterraction/PresentationTransformParent';
import {PresentationGuide} from './presentation';
import {Subscription} from 'rxjs';
import {ConnectionSocketProvider} from '../../socket/connection.socket.provider';
import {AuthProvider} from '../../auth.provider';
import {ApiProvider} from '../../api.service';
import {PresentationAction} from './PresentInterraction/PresentationAction';

export class PresentationTransform extends PresentationTransformParent {

    /**
     *
     * @param socketConnection
     * @param presentationItems
     * @param authProvider
     * @param apiProvider
     * @param presentationRecorder
     * @param autoStart
     * @param spreadId
     */
    constructor(
        socketConnection: ConnectionSocketProvider,
        authProvider: AuthProvider,
        presentationItems: PresentationGuide[],
        apiProvider: ApiProvider,
        private presentationRecorder: PresentationRecorder,
        autoStart = true,
        spreadId: number
    ) {
        super(
            socketConnection,
            authProvider,
            apiProvider,
            autoStart,
            spreadId,
        );
        this.presentationItems = presentationItems;
        this.setup();
    }

    /**
     * @type PresentationGuide[]
     */
    protected presentationItems: PresentationGuide[];
    protected endButton: HTMLButtonElement;
    protected countdownContainer: HTMLElement;

    public setup() {
        super.setup();

        this.endButton = document.createElement('button');
        this.endButton.classList.add('btn-presentation-close');
        this.presentationEl.parentNode.append(this.endButton);
        const materialIcons = document.createElement('span');
        materialIcons.classList.add('material-icons');
        materialIcons.innerText = 'close';
        this.endButton.appendChild(materialIcons);
        this.endButton.addEventListener('click', () => this.stop());
        this.createCountDownContainer();
        return this;
    }

    private createCountDownContainer() {
        this.countdownContainer = document.createElement('div');
        this.countdownContainer.classList.add('count-down-container');
        this.presentationEl.parentNode.append(this.countdownContainer);
    }

    private deletePresentationActionControllers() {
        const countDownTimerElement = document.querySelector('.count-down-container');
        const presentationCloseButton = document.querySelector('.btn-presentation-close');
        if (presentationCloseButton) {
            presentationCloseButton.parentNode.removeChild(presentationCloseButton);
        }

        if (countDownTimerElement) {
            countDownTimerElement.parentNode.removeChild(countDownTimerElement);
        }
    }

    public stop() {
        super.stop();
        this.deletePresentationActionControllers();
    }


    /**
     * @param index
     */
    protected startCycling(index: number) {
        if (
            this.presentationItems &&
            Array.isArray(this.presentationItems) &&
            this.presentationItems[index] &&
            this.presentationItems[index].id
        ) {
            this.presentationItems[index].spread = this.spreadId;
            const subscription: Subscription = this.fetchHead(this.presentationItems[index].media).subscribe((r) => {
                if (r && r.data && r.data.tag) {

                    const tag = PresentationTransformParent.getFromTag(r.data.tag);
                    this.presentationAction = new PresentationAction(
                        this.socketConnection,
                        {
                            path: this.presentationItems[index].media,
                            fileType: tag,
                            duration: this.presentationItems[index].duration,
                            volume: 1,
                            spread: this.spreadId,
                            sender: this.authProvider.user.id
                        }
                    );
                    this.presentationEl.innerHTML = '';
                    const presentationItem = this.attachElement(
                        this.presentationItems[index],
                        tag
                        );
                    this.presentationEl.appendChild(
                        presentationItem
                    );
                    const mediaElement: HTMLVideoElement|HTMLAudioElement|HTMLImageElement =
                        presentationItem.querySelector('.media-player');
                    // tslint:disable-next-line:triple-equals
                    if (tag == 'video' || tag == 'image') {
                        this.presentationRecorder.stopVideo();
                        this.presentationRecorder.drawPresentation(mediaElement);
                        // tslint:disable-next-line:triple-equals
                    } else if (tag == 'audio') {
                        const audioStream = (mediaElement as any).captureStream();
                        if (audioStream) {
                            this.presentationRecorder.addAudioTrack(audioStream.getAudioTracks());
                        }
                    }
                    this.onPresentationNext(index);
                    // tslint:disable-next-line:triple-equals
                    if (this.presentationItems[index].duration != 0) {
                        const countingInstance = this.startCountingDownTillChange(this.presentationItems[index].duration);
                        setTimeout(() => {
                            this.startCycling(index + 1);
                            countingInstance.cancel();
                        }, (this.presentationItems[index].duration * 1000));
                    }
                    subscription.unsubscribe();
                }
            });

        } else {
            this.endPresentation();
        }
    }

    /**
     * Print the timeout instance on the presentation item screen
     * @param durationToCount
     */
    private startCountingDownTillChange(durationToCount: number) {
        const startCountingIntervalInstance = setInterval(() => {
            durationToCount--;
            this.countdownContainer.innerText = durationToCount + '';
        }, 1000);
        return {
            cancel: () => {
                clearInterval(startCountingIntervalInstance);
            }
        };
    }

    /**
     * @param event
     */
    protected onVolumeChange(event: any) {
        if (event.target &&
            (event.target.volume || event.target.volume === 0)
        ) {
            if (event.target.muted) {
                return this.presentationAction.volumeChange(0);
            }
            this.presentationAction.volumeChange(event.target.volume);
        }
    }

    /**
     * On Stop
     */
    protected onStop() {
        if (this.presentationAction) {
            this.presentationAction.stop();
            this.deletePresentationActionControllers();
        }
    }

    /**
     * @param event
     */
    protected onSeek(event: any) {
        this.timeoutInstance = setTimeout(() => {
            if (event.target && event.target.currentTime) {
                this.presentationAction.seek(event.target.currentTime);
            }
            clearTimeout(this.timeoutInstance);
        }, 1000);
    }

    /**
     * @param presentationGuide
     * @param tag
     */
    protected sendPresentationFiles(presentationGuide: PresentationGuide, tag: 'video' | 'image' | 'audio') {
        this.presentationAction = new PresentationAction(
            this.socketConnection,
            {
                path: presentationGuide.media,
                spread: presentationGuide.spread,
                volume: 1,
                fileType: tag,
                duration: 0,
                sender: this.authProvider.user.id
            });
    }

}
