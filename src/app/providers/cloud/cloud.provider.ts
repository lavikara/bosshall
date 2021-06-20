import {Injectable} from '@angular/core';
import {ConnectionSocketProvider} from '../socket/connection.socket.provider';
import {AuthProvider} from '../auth.provider';
import {EmojiService} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {EmojiAnimationService} from '../emoji-animation.service';
import {ParticipantEnum} from '../../configuration/audience.enum';
import {LikeModel} from '../../../model/LikeModel';
import {Subject, Subscription} from 'rxjs';
import {ToolsProvider} from '../tools.provider';
import {Participants} from '../../../model/Participants';
import {SpreadModel} from '../../../model/SpreadModel';
import {StreamService} from './stream.service';
import {ApiModel} from '../../../model/ApiModel';
import {SpreadService} from '../spread/spread.service';
import {NotificationProvider} from '../notification.provider';
import {Location} from '@angular/common';
import {MessageService} from './message/message.service';
import {NotificationService} from '../user/notification.service';
import {StreamEvent, StreamManager} from 'openvidu-browser';
import {Router} from '@angular/router';
import {PresentationPlayer} from './presentation/PresentationPlayer';
import {ApiProvider} from '../api.service';
import {Recorder} from '../recorder/Recorder';
import {SideSideProvider} from './stream/side-side.provider';
import {SideStreamUi} from './stream/side-stream-ui';
import {MusicService} from '../music/MusicService';

@Injectable()
export class CloudService extends StreamService {
    private chiefHost: Participants = {} as any;
    private messages: Array<Object> = [];
    private subscriptions: Array<Subject<any>> = [];
    private eventHandler$: Subject<any>;
    private _showScreen;
    private _spreadDetails: SpreadModel = {} as any;
    private isMainStreamConnected = false;
    private presentationPlayer: PresentationPlayer;
    public recordInstance: Recorder;
    private callSubscription$: Subscription;
    public sideStreamUI: SideStreamUi;
    public presentationSlide = false;
    public participantSlide = false;
    public isCloudPage = false;
    public mobileMore = false;
    public musicInstance: MusicService;

    /**
     * @param socketConnection
     * @param authorizationProvider
     * @param emojiProvider
     * @param router
     * @param emojiAnimationService
     * @param spreadService
     * @param notificationProvider
     * @param location
     * @param messageService
     * @param apiProvider
     * @param notificationService
     */
    constructor(
        private socketConnection: ConnectionSocketProvider,
        private authorizationProvider: AuthProvider,
        private emojiProvider: EmojiService,
        private router: Router,
        private emojiAnimationService: EmojiAnimationService,
        private spreadService: SpreadService,
        private notificationProvider: NotificationProvider,
        private location: Location,
        private messageService: MessageService,
        private apiProvider: ApiProvider,
        private notificationService: NotificationService
    ) {
        super();
        this.eventHandler$ = new Subject<any>();

        this.router.events.subscribe((data: any) => {
            this.isCloudPage = data && data.url && data.url.startsWith('/bl/cloud');
            this.mobileMore = false;
            this.presentationSlide = false;
            this.participantSlide = false;
        });
    }

    /**
     * @param spreadId
     */
    public setupSocket(spreadId) {
        return this.spreadService.fetchSpread(spreadId).subscribe({
            next: (r: ApiModel) => {
                this._spreadDetails = r.data;
                this.recordInstance = new Recorder(this.apiProvider, this.spreadDetails.name);
                this.musicInstance = new MusicService(this.apiProvider,
                    this.socketConnection,
                    this.authorizationProvider.user.id,
                    this._spreadDetails.id
                    );

                this.sendForParticipants();

            },
            error: (e: any) => {
                this.notificationProvider.confirmSwal.options = {
                    title: 'Access',
                    text: e.statusText,
                    confirmButtonText: 'Close',
                    showConfirmButton: true,
                    type: 'warning',
                    showCancelButton: false
                };
                this.notificationProvider.confirmSwal.show();

                const subscription: Subscription = this.notificationProvider.confirmSwal.confirm.subscribe(() => {
                    this.location.back();
                    subscription.unsubscribe();
                });
            }
        });
    }

    /**
     * @param blob
     */
    public uploadStaticFile(blob: Blob) {
        return this.recordInstance.uploadStaticFile(blob);
    }

    /**
     * @param to
     */
    async sendCall(to: number) {
        this.socketConnection.send('Spread', 'Call', {
            to: to
        });
    }

    /**
     * @param vid
     */
    public recordingInitialization(vid: HTMLVideoElement) {
        if (this.chiefHost.id !== this.authorizationProvider.user.id) {
            return;
        }

        const littleRecording: HTMLMediaElement = document.querySelector('.little-recording');
        const videoContainer: HTMLVideoElement = document.querySelector('.js-completed-video');

        vid.addEventListener('loadeddata', (event) => {
           // videoContainer.muted = true;
            const streamTracks = (vid as any).captureStream();

            if (videoContainer) {
                videoContainer.srcObject = streamTracks;
                videoContainer.addEventListener(
                    'loadeddata',
                    (event) => {
                    this.recordInstance.setup(
                        videoContainer,
                        (videoContainer as any).captureStream().getAudioTracks()
                    );
                });
                videoContainer.play().catch(r => console.error(r));
            }
            vid.play().catch(e => console.error(e));
            this.recordInstance.draw(littleRecording as HTMLElement, {append: false});
        });

        this.recordInstance.spreadId = this.spreadDetails.id;
        this.recordInstance.uploadRecorded = (blob: Blob, spreadId) => {
            this.uploadStaticFile(blob).then( (filePath: string) => {
                this.uploadStreamFile(filePath);
            });
        };

        const musicPlayerEl: HTMLElement = document.querySelector('.little-music-player');
        this.musicInstance.draw(musicPlayerEl, {append: false});
        if (this._spreadDetails.backgroundSound) {
            this.musicInstance.setBackgroundSound(this._spreadDetails.backgroundSound);
        }
    }

    /**
     * @param filePath
     */
    private uploadStreamFile(filePath: string) {
        this.apiProvider.url = `/spread/${this.spreadDetails.id}/upload`;
        this.apiProvider.requestType = 'post';
        this.apiProvider.shouldAuthenticate = true;
        const subscription: Subscription = this.apiProvider.getUrl({filePath})
            .subscribe((uploaded: string) => {
                this.notificationService.notifierMessage(
                    'success',
                    'Recording is uploaded successful'
                );

            }).add(() => {
                subscription.unsubscribe();
            });
    }

    /**
     * @param event
     */
    protected streamCreated(event: StreamEvent) {
        super.streamCreated(event);
        this.router.navigate(['/bl/cloud/1/broadcast']);
    }

    /**
     * Setup, call from outside of the class to start this event
     */
    public setup(spreadId: number) {
        if (!this.spreadDetails.id) {
            this.messageService.handleMessageReceived(spreadId, this.capabilities);
            this.presentationPlayer = new PresentationPlayer(
                this.socketConnection,
                this.authorizationProvider,
                this.apiProvider,
                this.spreadDetails.id
            );

            this.presentationPlayer.init();
            this.handleEventReceived();
            this.socketConnection.setObservable('Spread', this.eventHandler$);
            this.socketConnection.connect();
            this.setupSocket(spreadId);
            this._onlineParticipant[this.authorizationProvider.user.id] = true;
            ToolsProvider.setupEmojiContainer();
            const cloudSubject = new Subject();
            this.callSubscription$ = cloudSubject.subscribe((res: any) => {
                if (!res.data || !res.data.content) {
                    return;
                }
                const event = res.data.content;
                switch (res.data.name) {
                    case 'receive':
                        this.sideConnection(event);
                        break;
                    case 'initiate':
                        this.sideConnection(event);
                        break;
                    case 'ready':
                        this.connectSideConnection(event);
                        break;
                }
            });
            this.socketConnection.setObservable('Call', cloudSubject);
        }
    }

    /**
     * @param data
     */
    public connectSideConnection(data) {
        this.socketConnection.send('Spread', 'Call', {
            session: data.session
        });
    }

    /**
     * @param streams
     */
    private addMoreToPersonalVideoScreen(streams: StreamManager[]) {
        for (let i = 0; i < streams.length; i++) {
            this.sideStreamUI.addStream(streams[i]);
        }
    }

    /**
     * @param data
     */
    public sideConnection(data) {
        const sideSideConnection = new SideSideProvider(data.token, true);
        sideSideConnection.onStreamCreated = (event) => {
            this.addMoreToPersonalVideoScreen(sideSideConnection.subscribers);
        };

        sideSideConnection.onStreamDestroyed = (event) => {
            this.addMoreToPersonalVideoScreen(sideSideConnection.subscribers);
        };

        sideSideConnection.onPublisherPublished = () => {
            this.addMoreToPersonalVideoScreen(sideSideConnection.subscribers);
        };

        sideSideConnection.setup();
    }

    /**
     * Send for participants
     */
    private sendForParticipants() {
        if (!this._spreadDetails.id) {
            throw new Error('A connection must be made before sending for participants');
        }
        this.socketConnection.send('Spread', 'Spread_participants', {
            id: this._spreadDetails.id
        });
    }

    private loadConfiguration(option) {
        this.capabilities.audioSource = option.canAudio;
        this.capabilities.videoSource = option.canVideo;
    }

    /**
     * @return void
     * @param event
     */
    private connectionReceived(event): void {
        if (!event.session || !event.token) {
            return;
        }
        this.role = event.capabilities.role;
        this._myCapabilities = event.capabilities.capabilities;
        this.token = event.token;
        this.loadConfiguration(event.capabilities.capabilities);

        this.init();
        this.isMainStreamConnected = true;
    }

    /**
     * Update like to the UI
     * @param event
     */
    private updateLikeToElement(event): void {
        const styles = this.emojiProvider.emojiSpriteStyles(
            event.icon,
            'apple'
        );
        const el = document.createElement('div');
        Object.assign(el.style, styles);
        this.emojiAnimationService.animate(el.outerHTML);

        if (
            this._spreadDetails &&
            this._spreadDetails.likeMeta
        ) {
            this._spreadDetails = LikeModel.addLike(
                this._spreadDetails,
                event
            );
        }
    }

    /**
     * @param event
     */
    private receivedMessage(event) {
        this.messages.push(event);
    }

    /**
     * handle message received on spread
     */
    private handleEventReceived() {
        const spreadSubject = new Subject<any>();
        spreadSubject.subscribe((res) => {
            if (!res.data || !res.data.content) {
                return;
            }
            const event = res.data.content;
            switch (res.data.name) {
                case 'stream':
                    this.connectionReceived(event);
                    break;
                case 'Spread_participants':
                    this.receivedParticipants(event);
                    break;
                case 'Create_comment':
                    this.receivedMessage(event);
                    break;
                case 'ready':
                    this.streamIsReady(event);
                    break;
                case 'disconnect':
                    this.disconnectParticipant(event);
                    break;
                case 'participant_connect':
                    this.participantConnect(event);
                    break;
                case 'permissions':
                    this.setPermissions(event);
                    break;
            }
        });
        this.eventHandler$ = spreadSubject;
        this.subscriptions.push(this.eventHandler$);
    }

    /**
     * @param event
     */
    private setPermissions(event) {
        console.log('event capabilities ', event);
        if (event && event.role) {
            this._myCapabilities = event.capabilities;
        }
    }

    /**
     * @param event
     */
    private participantConnect(event) {
        if (event && event.spread && event.spread === this.spreadDetails.id) {
            this.spreadService.startStream(this.spreadDetails.id, this.sessionId);
        }
    }

    /**
     * @param event
     */
    private streamIsReady(event) {
        if ( event.user && event.user === this.authorizationProvider.user.id) {
            return;
        }
        if (!this.isMainStreamConnected) {
            this._onlineParticipant[this.authorizationProvider.user.id] = true;
            this.spreadService.startStream(this.spreadDetails.id, this.sessionId);
            this.notificationService.notifierMessage('info', 'Connecting to stream. Please wait');
            this.isMainStreamConnected = true;
        }
    }

    /**
     * @param event
     */
    private disconnectParticipant(event) {
        if (event.spreadId  === this.spreadDetails.id) {
            if (event.permission === ParticipantEnum.CHIEF_HOST) {
              this.disconnect();
            }

            this.removeParticipant(event);
        }
    }

    /**
     * @param event
     */
    private receivedParticipants(event) {
        if (event.spreadId == this.spreadDetails.id) {
            if (event.permission === ParticipantEnum.CHIEF_HOST) {
                this.chiefHost = event;
            }
            if (event.id === this.authorizationProvider.user.id) {
                return null;
            }
            this.setParticipant(event);
        }
    }

    /**
     * Clear all subscriptions
     */
    private unsubscribeAll() {
        this.notificationProvider.confirmSwal.options = {
            title: 'Leave Session',
            text: 'This will disconnect your existing session',
            type: 'warning',
            cancelButtonText: 'cancel',
            confirmButtonText: 'Continue',
            showCancelButton: true
        };
        this.notificationProvider.confirmSwal.show().then(r => {
            if (r && r.value) {
                this.subscriptions.forEach((subscription) => {
                    subscription.unsubscribe();
                });
                this.redirect(false);
                this.leaveSession();
            }
        });

    }



    /**
     * Disconnect connection
     */
    public disconnect() {
        /**
         * todo
         */
        this.unsubscribeAll();
    }

    /**
     * Get the text of the participant
     * @param participant
     */
    participantText(participant): string {
        if (participant === ParticipantEnum.CHIEF_HOST) {
            return 'Chief Host';
        } else if (participant === ParticipantEnum.GUEST) {
            return 'Guest';
        } else {
            return 'Audience';
        }
    }

    /**
     * Verify if i have the permission to broadcast
     */
    public canBroadcast() {

        return this.chiefHost && this.chiefHost.id &&
            this.chiefHost.id === this.authorizationProvider.user.id;
    }

    get isChiefHost() {
        return this.chiefHost && this.chiefHost.id &&
            this.chiefHost.id === this.authorizationProvider.user.id;
    }

    get showScreen() {
        return this._showScreen;
    }

    public screenIsVisible() {
        this._showScreen = true;
    }

    public screenNotVisible() {
        this._showScreen = false;
    }

    public spreadId() {
        return this._spreadDetails.id;
    }

    get spreadDetails(): SpreadModel {
        return this._spreadDetails;
    }

    public connect() {
        this.notificationProvider.confirmSwal.options = {
            title: 'Start Broadcasting',
            text: 'Do you really want to go online?',
            confirmButtonText: 'Broadcast',
            type: 'question',
            cancelButtonText: 'cancel',
            showCancelButton: true
        };
        this.notificationProvider.confirmSwal.show().then(r => {
            if (r && r.value === true) {
                this.spreadService.startStream(this.spreadDetails.id, this.sessionId);
            }
        });
    }

    protected notification(type: string, text: string) {
        this.notificationService.notifierMessage(type, text);
    }

    protected redirect(route) {
        if (route === false) {
            return this.router.navigate(['/bl/brand']).then( () => {
                this._spreadDetails = {} as any;
                this.notification('info', 'Session has been disconnected by the presenter');

            });
        }
        this.router.navigate(['/bl/cloud/' + this._spreadDetails.id + '/' + route]);
    }

    /**
     * Get chief host
     */
    get chiefBroadcaster(): Participants {
        return this.chiefHost;
    }
}
